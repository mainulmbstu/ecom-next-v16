"use server";

import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { BASE_URLS } from "./config";
import { rateLimit } from "./rate-limit";

// ──────────────────────────────────────────────────────────────────────────────

// export async function queryTransactionBySession(params, request) {
//   if (request && (await rateLimit(request))) {
//     throw new Error("Too many requests. Please wait and try again.");
//   }

//   const url = new URL(BASE_URLS.validator);
//   url.searchParams.set("sessionkey", params.sessionkey);
//   url.searchParams.set("store_id", params.store_id);
//   url.searchParams.set("store_passwd", params.store_passwd);
//   url.searchParams.set("v", "1");
//   url.searchParams.set("format", "json");

//   const res = await fetch(url.toString());

//   if (!res.ok) {
//     throw new Error(`SSLCommerz session query failed: HTTP ${res.status}`);
//   }

//   return res.json();
// }
//================================================
export async function SSLQueryTransactionByTranId(editItem) {
  const request = new Request(process.env.BASE_URL);
  let value = editItem && JSON.parse(editItem);
  let tran_id = value?.payment?.trxn_id;
  let store_id = value?.payment?.ssl_trxn_details?.rawData?.store_id;
  let store_passwd = process.env.STORE_PASS;
  try {
    if (request && (await rateLimit(request))) {
      throw new Error("Too many requests. Please wait and try again.");
    }
    const url = new URL(BASE_URLS.validator);
    url.searchParams.set("tran_id", tran_id);
    url.searchParams.set("store_id", store_id);
    url.searchParams.set("store_passwd", store_passwd);
    url.searchParams.set("v", "1");
    url.searchParams.set("format", "json");

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`SSLCommerz tran_id query failed: HTTP ${res.status}`);
    }
    let data = await res.json();
    // return data?.element?.at(0);
    return { success: true, result: data?.element?.at(0) };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
//==============================================
export async function extractSuccessfulTransaction(response) {
  if (response.APIConnect !== "DONE") return null;
  return (
    response.element?.find(
      (t) => t.status === "VALID" || t.status === "VALIDATED",
    ) ?? null
  );
}
