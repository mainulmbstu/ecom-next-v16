import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import dbConnect from "./dbConnect";

export const wait = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//===========================
export const loginMiddleware = async (token) => {
  if (!token) {
    return { msg: "Unauthorized, you are not logged in" };
  }
  let tokenData = jwt.verify(token, process.env.JWT_KEY);
  if (!tokenData) {
    return { msg: "Unauthorized, wrong token" };
  }
  await dbConnect();
  let userInfo = await UserModel.findById(tokenData.id, { password: 0 });
  // console.log(2222, userInfo);
  return userInfo;
};

// export const test = async (token) => {
//   let tokenData = jwt.verify(token, process.env.JWT_KEY);

//   let cookieStore = await cookies();
//   const cookie = await cookieStore.get("token");
//   let value = cookie?.value;
//   // console.log(3333333333333, cookieStore);
//   return tokenData;
// };
