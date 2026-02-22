import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import mailer from "@/lib/helpers/nodeMailer";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";

export async function POST(req) {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })
  let formData = await req.formData();

  let name = formData.get("name");
  let email = formData.get("email");
  let password = formData.get("password");
  let phone = formData.get("phone");
  let address = formData.get("address");
  //for image
  let file = formData.get("file");
  try {
    await dbConnect();
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return { message: "User not found" };
    }

    if (file?.size) {
      if (file?.size > 3 * 1024 * 1000) {
        return {
          success: false,
          message: `File too large, maximum 3 mb`,
        };
      }
      userExist.picture?.public_id &&
        (await deleteImageOnCloudinary(userExist.picture?.public_id));
      let { secure_url, public_id } = await uploadOnCloudinary(file, "profile");
      userExist.picture = { secure_url, public_id };
    }
    if (name) userExist.name = name;
    if (phone) userExist.phone = phone;
    if (address) userExist.address = address;
    if (password) userExist.password = await bcrypt.hash(password, 10);

    (await cookies()).delete("token");
    (await cookies()).delete("userInfo");
    await userExist.save();
    revalidatePath("/", "layout");
    // console.log(userExist);
    let credential = {
      email,
      subject: "Profile Update ",
      body: `<h2>Hi ${userExist?.name},</h2>
      <h3>Your profile has been Updated successfully.
      Thanks for staying with us`,
    };
    mailer(credential);

    return Response.json({
      success: true,
      message: `Profile Update successful, Please login again`,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
