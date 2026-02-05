"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (formData) => {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })

  let email = formData.get("email");
  let password = formData.get("password");
  if (!email || !password) {
    return { message: "Please enter all required fields" };
  }
  try {
    await dbConnect();
    console.log(44444444444);
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { message: "User does not exist" };
    }
    if (!user.isVerified) {
      return { message: "Email is not verified" };
    }
    let passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return { message: "Wrong credentials" };
    }
    const userInfo = await UserModel.findOne({ email }, { password: 0 });
    let token = jwt.sign({ userInfo }, process.env.JWT_KEY);
    // let token = jwt.sign(
    //   { id: user?._id, email: user?.email, role: user?.role },
    //   process.env.JWT_KEY
    // );
    (await cookies()).set("token", token, {
      // httpOnly: true,
      maxAge: 3600 * 24,
    }); // expiry time in second
    // (await cookies()).set("userInfo", JSON.stringify(userInfo), {
    //   // httpOnly: true,
    //   maxAge: 3600 * 24,
    // }); // expiry time in second

    // redirect("/cart");
    return {
      success: true,
      message: `Login successful `,
      token,
    };
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
