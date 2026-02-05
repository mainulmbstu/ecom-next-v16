"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { revalidatePath, updateTag } from "next/cache";
const {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} = require("bkash-payment");
export const StatusAction = async (value, id) => {
  try {
    await dbConnect();
    await OrderModel.findByIdAndUpdate({ _id: id }, { status: value });
    // revalidatePath("/dashboard/admin/order-list");

    updateTag("order-list");

    return {
      message: `Order has been successfully updated to ${value} `,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//=======================================
const bkashConfig = {
  base_url: process.env.BKASH_BASE_URL,
  username: process.env.BKASH_USER,
  password: process.env.BKASH_PASSWORD,
  app_key: process.env.BKASH_APP_KEY,
  app_secret: process.env.BKASH_APP_SECRET,
};
export const bkashQuery = async (payment_id) => {
  try {
    const result = await queryPayment(bkashConfig, payment_id);

    return {
      result,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//=====================================
export const bkashSearch = async (trxn_id) => {
  try {
    const result = await searchTransaction(bkashConfig, trxn_id);

    return {
      result,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//=====================================
export const bkashRefund = async (value) => {
  try {
    const { paymentID, trxID, amount } = value;
    const refundDetails = {
      paymentID,
      trxID,
      amount,
    };
    const result = await refundTransaction(bkashConfig, refundDetails);
    if (result?.statusCode === "0000") {
      await dbConnect();
      await OrderModel.findOneAndUpdate(
        { "payment.trxn_id": trxID },
        { "payment.refund": "refunded" },
        { new: true },
      );
      // revalidatePath("/dashboard/admin/order-list");
      updateTag("order-list");
      return {
        success: true,
        message: `BDT ${amount} has been refunded successfully`,
        result,
      };
    }

    return {
      success: false,
      message: `BDT ${amount} refund failed`,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
