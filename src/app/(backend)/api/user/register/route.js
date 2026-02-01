import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailer from "@/lib/helpers/nodeMailer";
import { uploadOnCloudinary } from "@/lib/helpers/cloudinary";

export async function POST(req) {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })
  let formData = await req.formData();

  let name = formData.get("name");
  let email = formData.get("email");
  let phone = formData.get("phone");
  let address = formData.get("address");
  let password = formData.get("password");
  if (!name || !email || !password || !phone) {
    return Response.json({ message: "Please enter all required fields" });
  }
  //for image
  let file = formData.get("file");
  try {
    await dbConnect();
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return Response.json({ message: "User already exist" });
    }
    const phoneExist = await UserModel.findOne({ phone });
    if (phoneExist) {
      return Response.json({ message: "phone number already exist" });
    }
    let url = "";
    if (file?.size) {
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "blognextprofile",
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
      verifyTokenExpire: Date.now() + 3600000,
      picture: url && url,
    });
    let verifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
    let credential = {
      email,
      subject: "Registration verification",
      body: `<h2>Hi ${name},</h2>
      <h3>You have been registered successfully. Your ID is ${newUser._id}. </h3>
      <p>Click <a href="${process.env.BASE_URL}/user/verify-email?verifyToken=${verifyToken}">Here</a> to verify your email or copy and paste the link below to your browser <br> ${process.env.BASE_URL}/user/verify-email?verifyToken=${verifyToken}
      </p>
      <p>Link validity: 1 hour</p>
      Thanks for staying with us`,
    };
    mailer(credential);
    // console.log(verifyToken);

    return Response.json({
      success: true,
      message: `Registration successful, a verification link has been sent to ${email}, please verify email to access your account `,
    });
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
