"use server";

import { getTokenData } from "@/lib/helpers/getTokenData";
import { initiatePayment } from "./sslcommerz";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

// ── 5. Call SSLCommerz session API ───────────────────────────────────────
export const sslInitiatePayment = async (total) => {
  let baseurl = process.env.BASE_URL;
  let { userInfo } = await getTokenData(await getCookieValue("token"));

  let sslResponse;
  let tranId = `trxn_${Date.now()}_${Math.floor(Math.random() * 8000) + 1000}`;

  let params = {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASS,

    total_amount: total,
    currency: "BDT",
    tran_id: tranId,

    success_url: `${baseurl}/payment/success?tran_id=${tranId}`,
    fail_url: `${baseurl}/payment/fail?tran_id=${tranId}`,
    cancel_url: `${baseurl}/payment/cancel?tran_id=${tranId}`,
    ipn_url: `${baseurl}/api/payment/ipn`,

    product_name: "jjjjj",
    product_category: "general",
    product_profile: "general",
    product_amount: "subtotal",
    vat: "taxAmount",
    shipping_method: "NO",

    cus_name: userInfo?.name,
    cus_email: "email" ?? `guest_${tranId}@noemail.com`,
    cus_add1: "address",
    cus_city: "city",
    cus_state: "state",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "phone",

    // Echoed back verbatim in IPN — use value_a to find the DB order
    value_a: "orderId",
    value_b: tranId,
    // cart,
    // cart: selectedCart.map((item) => ({
    //   product: item.name.slice(0, 255),
    //   quantity: String(item.amount),
    //   amount: item.price.toFixed(2),
    //   unit_price: item.price.toFixed(2),
    // })),
  };
  try {
    sslResponse = await initiatePayment(
      params,
      // "env",
      // "request",
    );
  } catch (sslError) {
    console.error("[sslInitiatePayment] SSLCommerz error:", sslError);

    // Don't leave the order as PENDING — mark it failed
    // await prisma.order.update({
    //   where: { id: orderId },
    //   data:  { status: 'FAILED' },
    // })

    // return {
    //   status:  'FAILED',
    //   message: 'Payment gateway unreachable. Please try again.',
    // }
  }
  // ── 6. Handle SSLCommerz rejection ──────────────────────────────────────

  if (sslResponse?.status !== "SUCCESS" || !sslResponse.GatewayPageURL) {
    // await prisma.order.update({
    //   where: { id: orderId },
    //   data:  { status: 'FAILED' },
    // })

    return {
      status: "FAILED",
      message:
        sslResponse?.failedreason ?? "Payment gateway rejected the request.",
    };
  }

  // ── 7. Persist the session key returned by SSLCommerz ───────────────────

  if (sslResponse?.sessionkey) {
    // await prisma.payment.updateMany({
    //   where: {
    //     orderId,
    //     status:     'INITIATED',
    //     sessionKey: null,
    //   },
    //   data: { sessionKey: sslResponse.sessionkey },
    // })
  }
  // ── 8. Advance order to PROCESSING ──────────────────────────────────────

  // await prisma.order.update({
  //   where: { id: orderId },
  //   data:  { status: 'PROCESSING' },
  // })

  // ── 9. Return gateway URL to the client ─────────────────────────────────

  return {
    status: "SUCCESS",
    GatewayPageURL: sslResponse.GatewayPageURL,
    orderId: "55555",
  };
};
