"use server";

import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import mailer from "@/lib/helpers/nodeMailer";
import { UserModel } from "@/lib/models/userModel";
import { updateTag } from "next/cache";

export const Action = async (formData) => {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })

  const email = formData.get("email");
  const password = formData.get("password");
  const inputOtp = formData.get("inputOtp");
  if (!email) {
    throw new Error("Please enter all required fields");
  }
  let expireTime = 1 / 6;
  try {
    await dbConnect();
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }
    if (!inputOtp) {
      const genOTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      user.OTP = genOTP;
      user.OTPExpire = Date.now() + expireTime * 3600000;
      await user.save();
      const credential = {
        email,
        subject: "OTP verification",
        body: `<h2>Hi ${user?.name},</h2>
      			<h3>Your OTP ${genOTP} is for password reset in ${process.env.BASE_URL} , validity ${expireTime * 60} minutes </h3>
      			Thanks for staying with us`,
      };
      await mailer(credential);
      return {
        success: true,
        message: `An OTP has bees sent to ${email} `,
        genOTP,
      };
    } else {
      if (Number(inputOtp) !== user?.OTP) {
        throw new Error("OTP does not match");
      }
      if (!password) {
        throw new Error("Password is required");
      }
      if (new Date() > user?.OTPExpire) {
        user.OTP = undefined;
        user.OTPExpire = undefined;
        await user.save();
        throw new Error("OTP has been expired");
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
  } finally {
    updateTag("user-list");
  }
};
