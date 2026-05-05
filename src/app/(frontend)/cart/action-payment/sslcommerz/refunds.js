"use server";

import { OrderModel } from "@/lib/models/OrderModel";
import { BASE_URLS } from "./config";
import { rateLimit } from "./rate-limit";
import { ProductModel } from "@/lib/models/productModel";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { updateTag } from "next/cache";

// ──────────────────────────────────────────────────────────────────────────────

export async function SSLInitiateRefund(editItem) {
  const request = new Request(process.env.BASE_URL);
  let value = editItem && JSON.parse(editItem);
  let bank_tran_id = value?.payment?.ssl_trxn_details?.data?.bank_tran_id;
  let store_id = value?.payment?.ssl_trxn_details?.rawData?.store_id;
  let store_passwd = process.env.STORE_PASS;
  let refund_amount = value?.total;
  let card_ref_id = value?.payment?.ssl_trxn_details?.data?.card_ref_id;
  try {
    if (request && (await rateLimit(request))) {
      throw new Error("Too many requests. Please wait and try again.");
    }
    if (value?.payment?.status === "refunded") {
      throw new Error("Refund already completed.");
    }
    const url = new URL(BASE_URLS.validator);
    url.searchParams.set("bank_tran_id", bank_tran_id);
    url.searchParams.set("store_id", store_id);
    url.searchParams.set("store_passwd", store_passwd);
    url.searchParams.set("refund_amount", String(refund_amount));
    url.searchParams.set("refund_remarks", "general");
    url.searchParams.set("refe_id", card_ref_id);
    url.searchParams.set("v", "1");
    url.searchParams.set("format", "json");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`SSLCommerz refund failed: HTTP ${res.status}`);
    }

    let data = await res.json();

    if (data?.status !== "success") {
      throw new Error(`SSLCommerz refund failed!!`);
    }

    let updated = await OrderModel.findByIdAndUpdate(
      value?._id,
      {
        "payment.status": "refunded",
        "payment.refund_ref_id": data?.refund_ref_id,
      },
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
      result: data,
      message: "Refund completed successfully",
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  } finally {
    updateTag("order-list");
    updateTag("product-list");
  }
}
//========================================================
export async function SSLQueryRefundStatus(editItem) {
  const request = new Request(process.env.BASE_URL);
  let value = editItem && JSON.parse(editItem);
  let refund_ref_id = value?.payment?.refund_ref_id;
  let store_id = value?.payment?.ssl_trxn_details?.rawData?.store_id;
  let store_passwd = process.env.STORE_PASS;

  try {
    if (request && (await rateLimit(request))) {
      throw new Error("Too many requests. Please wait and try again.");
    }

    const url = new URL(BASE_URLS.validator);
    url.searchParams.set("refund_ref_id", refund_ref_id);
    url.searchParams.set("store_id", store_id);
    url.searchParams.set("store_passwd", store_passwd);
    url.searchParams.set("format", "json");
    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(
        `SSLCommerz refund status query failed: HTTP ${res.status}`,
      );
    }

    let data = await res.json();
    return { success: true, result: data };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
