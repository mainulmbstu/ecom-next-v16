"use server";

import { jwtVerify } from "jose";

let secretKey = new TextEncoder().encode(process.env.JWT_KEY);
export const getTokenData = async (token) => {
  try {
    if (!token) {
      return null;
    }
    let { payload } = await jwtVerify(token, secretKey);
    return payload?.userInfo;
  } catch (error) {
    console.log("getTokenData error", error.message);
    return null;
  }
};
