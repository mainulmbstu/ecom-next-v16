import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { ProductModel } from "@/lib/models/productModel";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
const {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} = require("bkash-payment");

export async function GET(req, res) {
  let status = req.nextUrl.searchParams.get("status");
  let paymentID = req.nextUrl.searchParams.get("paymentID");
  const bkashConfig = {
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USER,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET,
  };

  try {
    await dbConnect();
    let result;
    let response = {
      statusCode: "4000",
      statusMessage: "Payment Failed",
    };
    if (status === "success")
      result = await executePayment(bkashConfig, paymentID);
    if (result?.transactionStatus === "Completed") {
      // payment success
      // insert result in your db
      let updated = await OrderModel.findOneAndUpdate(
        { "payment.payment_id": paymentID },
        {
          "payment.status": "PAID",
          "payment.trxn_id": result?.trxID,
          "payment.bkashNo": result?.customerMsisdn,
        },
        { returnDocument: "after" },
      );
      if (updated.isModified) {
        for (let v of updated.products) {
          let product = await ProductModel.findById(v._id);
          product.quantity = product.quantity - v.amount;
          await product.save();
        }
      }
    }
    if (result)
      response = {
        statusCode: result?.statusCode,
        statusMessage: result?.statusMessage,
      };
    // You may use here WebSocket, server-sent events, or other methods to notify your client
    if (response?.statusCode === "0000") {
      redirect(`/payment/success?tran_id=${result?.trxID}`);
    } else {
      await OrderModel.findOneAndDelete({
        "payment.payment_id": paymentID,
      });
      redirect(`/payment/fail?tran_id=${result?.trxID || ""}`);
    }
  } catch (error) {
    // if u use redirect in try block
    if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    if (error.message === "NEXT_REDIRECT") throw error;
    return Response.json({ message: await getErrorMessage(error) });
  } finally {
    revalidateTag("order-list", { expires: 0 });
  }
}
