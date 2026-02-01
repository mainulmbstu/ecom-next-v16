"use server";

import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getTokenData } from "@/lib/helpers/getTokenData";
import SSLCommerzPayment from "sslcommerz-lts";
import fetch from "node-fetch";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

//===========================================================
export const checkoutAction = async (formData) => {
  // let name = formData.get("name");
  let trxn_id = Date.now();
  let baseurl = process.env.BASE_URL;
  let userInfo = await getTokenData(await getCookieValue("token"));
  const data = {
    total_amount: 10,
    currency: "BDT",
    tran_id: trxn_id, // use unique tran_id for each api call
    success_url: `${baseurl}/products/payment/success?paymentID=${trxn_id}`,
    fail_url: `${baseurl}/products/payment/fail?paymentID=${trxn_id}`,
    cancel_url: `${baseurl}/products/payment/fail?paymentID=${trxn_id}`,
    ipn_url: `${baseurl}/ipn`,
    shipping_method: "Courier",
    product_name: "Multi",
    product_category: "Multi",
    product_profile: "general",
    cus_name: userInfo?.name,
    cus_email: userInfo?.email,
    cus_add1: userInfo?.address,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: userInfo?.phone,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  try {
    // sslcommerz
    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASS;
    const is_live = false; //true for live, false for sandbox
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    console.log(sslcz);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      // res.send({ url: GatewayPageURL });
      // return sslcz
      console.log("Redirecting to: ", GatewayPageURL);

      // let order = {
      //   products: cart,
      //   total,
      //   payment: {
      //     trxn_id,
      //     ssl_sessionkey: apiResponse.sessionkey,
      //   },
      //   user: userInfo?._id,
      // };
      // OrderModel.create(order);
    });
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
