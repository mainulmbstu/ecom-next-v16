import { BASE_URLS } from "./config";
import { rateLimit } from "./rate-limit";

// ──────────────────────────────────────────────────────────────────────────────

export async function queryTransactionBySession(
  params,
  env = "sandbox",
  request,
) {
  if (request && (await rateLimit(request))) {
    throw new Error("Too many requests. Please wait and try again.");
  }

  const url = new URL(BASE_URLS[env].validator);
  url.searchParams.set("sessionkey", params.sessionkey);
  url.searchParams.set("store_id", params.store_id);
  url.searchParams.set("store_passwd", params.store_passwd);
  url.searchParams.set("v", "1");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`SSLCommerz session query failed: HTTP ${res.status}`);
  }

  return res.json();
}

export async function queryTransactionByTranId(
  params,
  env = "sandbox",
  request,
) {
  if (request && (await rateLimit(request))) {
    throw new Error("Too many requests. Please wait and try again.");
  }

  const url = new URL(BASE_URLS[env].validator);
  url.searchParams.set("tran_id", params.tran_id);
  url.searchParams.set("store_id", params.store_id);
  url.searchParams.set("store_passwd", params.store_passwd);
  url.searchParams.set("v", "1");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`SSLCommerz tran_id query failed: HTTP ${res.status}`);
  }

  return res.json();
}

export function extractSuccessfulTransaction(response) {
  if (response.APIConnect !== "DONE") return null;
  return (
    response.element?.find(
      (t) => t.status === "VALID" || t.status === "VALIDATED",
    ) ?? null
  );
}
