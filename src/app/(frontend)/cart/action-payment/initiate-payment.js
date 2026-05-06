"use server";

import { getTokenData } from "@/lib/helpers/getTokenData";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { initiatePayment } from "./sslcommerz/payments";
import { OrderModel } from "@/lib/models/OrderModel";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";

// ── 5. Call SSLCommerz session API ───────────────────────────────────────
export const sslInitiatePayment = async (selectedCart, total) => {
  let cart = JSON.parse(selectedCart);
  let baseurl = process.env.BASE_URL;
  const request = new Request(baseurl);
  let { userInfo } = await getTokenData(await getCookieValue("token"));

  let sslResponse;
  let tranId = `trxn_${Date.now()}_${Math.floor(Math.random() * 8000) + 1000}`;

  try {
    await dbConnect();
    let orderData = {
      products: cart,
      total,
      payment: {
        trxn_id: tranId,
      },
      user: userInfo._id,
    };
    let order = await OrderModel.create(orderData);
    if (!order) throw new Error("Failed to create order!! Please try again.");
    //============data
    let params = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASS,

      total_amount: total,
      currency: "BDT",
      tran_id: tranId,

      success_url: `${baseurl}/api/user/checkout/checkout-ssl/ipn/success`,
      fail_url: `${baseurl}/payment/fail?tran_id=${tranId}`,
      cancel_url: `${baseurl}/api/user/checkout/checkout-ssl/ipn/cancel`,
      // cancel_url: `${baseurl}/payment/cancel?tran_id=${tranId}`,
      ipn_url: `${baseurl}/api/user/checkout/checkout-ssl/ipn`,

      product_name: cart?.map((item) => item.name).toString(),
      product_category: "general",
      product_profile: "general",
      product_amount: "subtotal",
      vat: "taxAmount",
      shipping_method: "NO",
      num_of_item: cart.length,
      // weight_of_items: 0,
      // convenience_fee: 15.0,

      cus_name: userInfo?.name,
      cus_email: userInfo?.email ?? `guest_${tranId}@noemail.com`,
      cus_add1: userInfo?.address,
      cus_city: "city",
      cus_state: "state",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: userInfo?.phone,

      emi_option: 0, //1 for yes
      emi_max_inst_option: 3,

      // Echoed back verbatim in IPN — use value_a to find the DB order
      value_a: order?._id,
      value_b: tranId,
      // cart,
      // cart: cart.map((item) => ({
      //   product: item.name.slice(0, 255),
      //   quantity: String(item.amount),
      //   amount: item.price.toFixed(2),
      //   unit_price: item.price.toFixed(2),
      // })),
    };

    // console.log("01".repeat(5));
    sslResponse = await initiatePayment(params, request);

    // ── 6. Handle SSLCommerz rejection ──────────────────────────────────────

    if (sslResponse?.status !== "SUCCESS" || !sslResponse.GatewayPageURL) {
      throw new Error(
        sslResponse?.failedreason ||
          sslResponse?.message ||
          "Payment gateway rejected the request.",
      );
    }

    // ── 7. Persist the session key returned by SSLCommerz ───────────────────

    // if (sslResponse?.sessionkey) {
    //   console.log(sslResponse?.sessionkey);
    // }

    return {
      status: "SUCCESS",
      GatewayPageURL: sslResponse.GatewayPageURL,
      // orderId: "55555",
    };
  } catch (error) {
    console.error("[sslInitiatePayment] SSLCommerz error:", error);
    return { message: await getErrorMessage(error) };
  }
};
