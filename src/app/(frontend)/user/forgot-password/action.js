"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { cookies } from "next/headers";
import mailer from "@/lib/helpers/nodeMailer";

export const Action = async (formData) => {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })

  let email = formData.get("email");
  let password = formData.get("password");
  let inputOtp = formData.get("inputOtp");
  if (!email) {
    return { message: "Please enter all required fields" };
  }
  try {
    await dbConnect();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { message: "User does not exist" };
    }
    if (!inputOtp) {
      let genOTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      user.OTP = genOTP;
      user.OTPExpire = Date.now() + 3600000;
      await user.save();
      let credential = {
        email,
        subject: "OTP verification",
        body: `<h2>Hi ${user?.name},</h2>
      <h3>Your OTP for password reset is ${genOTP}, validity 1 hour </h3>

      Thanks for staying with us`,
      };
      mailer(credential);
      return {
        success: true,
        message: `An OTP has bees sent to ${email} `,
        genOTP,
      };
    } else {
      if (inputOtp != user?.OTP) {
        return { message: "OTP does not match" };
      }
      if (!password) {
        return { message: "Password is required" };
      }
      user.password = await bcrypt.hash(password, 10);
      user.OTP = undefined;
      user.OTPExpire = undefined;
      await user.save();
      return {
        success: "reset",
        message: `Password reset successful `,
      };
    }
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
