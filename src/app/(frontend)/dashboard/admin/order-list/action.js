"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { ProductModel } from "@/lib/models/productModel";
import { revalidatePath, updateTag } from "next/cache";
const {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} = require("bkash-payment");
//===============================
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
export const bkashRefund = async (editItem) => {
  let value = editItem && JSON.parse(editItem);
  let paymentID = value?.payment?.payment_id;
  let trxID = value?.payment?.trxn_id;
  let amount = value?.total;
  const refundDetails = {
    paymentID,
    trxID,
    amount,
  };
  try {
    const result = await refundTransaction(bkashConfig, refundDetails);
    if (result?.statusCode === "0000") {
      await dbConnect();
      let updated = await OrderModel.findOneAndUpdate(
        { "payment.trxn_id": trxID },
        { "payment.status": "refunded" },
        { returnDocument: "after" },
      );

      if (updated.isModified) {
        for (let v of updated.products) {
          let product = await ProductModel.findById(v._id);
          product.quantity = product.quantity + v.amount;
          await product.save();
        }
      }

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
  } finally {
    updateTag("order-list");
    updateTag("product-list");
  }
};

//=========================================
export const deleteAction = async (id = "") => {
  try {
    await dbConnect();
    const itemExist = await OrderModel.findByIdAndDelete(id);
    // revalidatePath("/", "layout");
    updateTag("order-list");

    return {
      message: `${itemExist?._id} order has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
