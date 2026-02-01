"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { OrderModel } from "@/lib/models/OrderModel";
import { UserModel } from "@/lib/models/userModel";

//===========================================================
export const orderAction = async (keyword, page = 1, perPage) => {
  let skip = (page - 1) * perPage;
  // let limit = page * perPage;
  let userInfo = await getTokenData(await getCookieValue("token"));
  try {
    await dbConnect();
    const total = await OrderModel.find({
      user: userInfo?._id,
      status: { $regex: keyword, $options: "i" },
    });

    const orderList = await OrderModel.find({
      user: userInfo?._id,
      status: { $regex: keyword, $options: "i" },
    })
      .populate("user", { password: 0 }, UserModel)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    return { orderList, total: total?.length };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
