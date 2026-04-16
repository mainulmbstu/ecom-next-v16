"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const loginAction = async (formData) => {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })

  let email = formData.get("email");
  let password = formData.get("password");
  let tokenExpire = 24 * 60 * 60;
  // in seconds
  try {
    if (!email || !password) {
      throw new Error("Please enter all required fields");
    }
    await dbConnect();
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }
    if (!user.isVerified) {
      throw new Error("Email is not verified");
    }
    let passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      throw new Error("Wrong credentials");
    }
    const userInfo = await UserModel.findOne({ email }, { password: 0 });
    let token = jwt.sign(
      { userInfo, loginExpireTime: Date.now() + tokenExpire * 1000 },
      process.env.JWT_KEY,
    );
    // let token = jwt.sign(
    //   { id: user?._id, email: user?.email, role: user?.role },
    //   process.env.JWT_KEY
    // );
    (await cookies()).set("token", token, {
      // httpOnly: true,
      maxAge: tokenExpire,
    }); // expiry time in second
    // (await cookies()).set("loginExpireTime", Date.now() + tokenExpire * 1000, {
    //   maxAge: tokenExpire,
    // });
    // expiry time in second
    // (await cookies()).set("userInfo", JSON.stringify(userInfo), {
    //   // httpOnly: true,
    //   maxAge: 3600 * 24,
    // }); // expiry time in second
    // revalidatePath("/", "layout");
    // redirect("/cart");
    return {
      success: true,
      message: `Login successful `,
      token,
      userInfo: JSON.stringify(userInfo),
    };
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
