import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mailer from "@/lib/helpers/nodeMailer";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import { revalidateTag } from "next/cache";

export async function POST(req) {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })
  let formData = await req.formData();

  let id = formData.get("id");
  let name = formData.get("name");
  let email = formData.get("email");
  let phone = formData.get("phone");
  let address = formData.get("address");
  let password = formData.get("password");
  //for image
  let file = formData.get("file");
  try {
    if (!id) {
      let expireHour = 1;
      // in hour
      if (!name || !email || !password || !phone) {
        throw new Error("All fields are required");
      }
      await dbConnect();
      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        if (new Date() > userExist?.verifyTokenExpire) {
          await UserModel.findOneAndDelete({ email });
          userExist.picture?.public_id &&
            (await deleteImageOnCloudinary(userExist.picture?.public_id));
        } else {
          throw new Error("User already exist");
        }
      }
      const phoneExist = await UserModel.findOne({ phone });
      if (phoneExist) {
        throw new Error("phone number already exist");
      }
      let url = "";
      if (file?.size) {
        if (file?.size > 3 * 1024 * 1000) {
          return {
            success: false,
            message: `File too large, maximum 3 mb`,
          };
        }
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "ecomNext",
        );
        url = { secure_url, public_id };
      }
      let hashedPass = await bcrypt.hash(password, 10);
      let allUser = await UserModel.find({}).estimatedDocumentCount();
      const newUser = await UserModel.create({
        name,
        email,
        phone,
        address,
        password: hashedPass,
        role: allUser ? "user" : "admin",
        verifyTokenExpire: Date.now() + expireHour * 3600000,
        picture: url && url,
      });
      let verifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
      let credential = {
        email,
        subject: "Registration verification",
        body: `<h2>Hi ${name},</h2>
    <h3>You have been registered successfully in ${process.env.BASE_URL} . Your ID is ${newUser._id}. </h3>
    <p>Click <a href="${process.env.BASE_URL}/user/verify-email?verifyToken=${verifyToken}">Here</a> to verify your email or copy and paste the link below to your browser <p>Link validity: ${expireHour} hour</p> ${process.env.BASE_URL}/user/verify-email?verifyToken=${verifyToken}
    </p>

    Thanks for staying with us`,
      };
      await mailer(credential);
      // console.log(verifyToken);

      return Response.json({
        success: true,
        message: `Registration successful, a verification link has been sent to ${email}, please verify email to access your account `,
      });
    } else {
      await dbConnect();
      const userExist = await UserModel.findOne({ email });
      if (!userExist) {
        throw new Error("User not found");
      }

      if (file?.size) {
        if (file?.size > 3 * 1024 * 1000) {
          throw new Error("File too large, maximum 3 mb");
        }
        userExist.picture?.public_id &&
          (await deleteImageOnCloudinary(userExist.picture?.public_id));
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "ecomNext",
        );
        userExist.picture = { secure_url, public_id };
      }
      if (name) userExist.name = name;
      if (phone) userExist.phone = phone;
      if (address) userExist.address = address;
      if (password) userExist.password = await bcrypt.hash(password, 10);

      (await cookies()).delete("token");
      (await cookies()).delete("userInfo");
      await userExist.save();
      // console.log(userExist);
      let credential = {
        email,
        subject: "Profile Update ",
        body: `<h2>Hi ${userExist?.name},</h2>
        <h3>Your profile  in ${process.env.BASE_URL} has been Updated successfully.</h3>
        Thanks for staying with us`,
      };
      await mailer(credential);

      return Response.json({
        success: true,
        message: `Profile Update successful, Please login again`,
      });
    }
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  } finally {
    revalidateTag("user-list", { expires: 0 });
  }
}
