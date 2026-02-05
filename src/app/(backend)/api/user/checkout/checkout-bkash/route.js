import dbConnect from "@/lib/helpers/dbConnect";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { OrderModel } from "@/lib/models/OrderModel";
const {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} = require("bkash-payment");

export async function POST(req) {
  let data = await req.json();
  const { cart, total, callbackURL } = data;
  let userInfo = await getTokenData(await getCookieValue("token"));
  const bkashConfig = {
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USER,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET,
  };

  try {
    await dbConnect();
    let tempId = Date.now();
    let order = {
      products: cart,
      total,
      payment: {
        payment_id: tempId,
      },
      user: userInfo._id,
    };
    await OrderModel.create(order);
    let orderSaved = await OrderModel.findOne({ "payment.payment_id": tempId });

    const paymentDetails = {
      amount: total || 1, // your product price
      callbackURL: process.env.BASE_URL + callbackURL, // your callback route
      orderID: orderSaved?._id || "Order_101", // your orderID
      reference: orderSaved?.total || "1", // your reference
    };
    const result = await createPayment(bkashConfig, paymentDetails);
    // console.log(result);
    if (result) orderSaved.payment.payment_id = result?.paymentID;
    await orderSaved.save();
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
