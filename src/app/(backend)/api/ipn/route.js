// import { NextRequest, NextResponse } from "next/server";

import { handleIpn } from "@/app/(frontend)/cart/action-payment/sslcommerz/ipn";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { redirect } from "next/navigation";

// ─── Route config ─────────────────────────────────────────────────────────

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// ─── In-memory idempotency guard ──────────────────────────────────────────
// NOTE: resets on cold start — for multi-instance deployments back this
// with a Redis SET NX or a DB-level unique constraint on val_id instead.

const MAX_BODY_BYTES = 16 * 1024;
const PROCESSED_TTL_MS = 15 * 60 * 1000;
const processedValIds = new Map();

function clearExpiredProcessedValIds(now) {
  for (const [valId, expiresAt] of processedValIds.entries()) {
    if (expiresAt <= now) processedValIds.delete(valId);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function getClientIp(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  return req.headers.get("x-real-ip")?.trim() || null;
}

function isClientIpAllowed(req) {
  // const allowlistRaw = process.env.SSLCOMMERZ_IPN_ALLOWLIST.trim();
  const allowlistRaw = "103.26.139.87,103.26.139.81,103.26.139.148";
  if (!allowlistRaw) return true;

  const allowedIps = allowlistRaw
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

  const clientIp = getClientIp(req);
  return !!clientIp && allowedIps.includes(clientIp);
}

function badRequest(message, status = 400) {
  return Response.json({ ok: false, message }, { status });
}

function parsePayloadObject(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const result = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null) result[key] = String(value);
  }
  return result;
}

async function readIpnPayload(req) {
  const contentLength = req.headers.get("content-length");
  if (contentLength) {
    const length = Number(contentLength);
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) return null;
  }

  const contentType = req.headers.get("content-type")?.toLowerCase() || "";
  const raw = await req.text();
  if (!raw || raw.length > MAX_BODY_BYTES) return null;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw).entries());
  }

  if (contentType.includes("application/json")) {
    try {
      return parsePayloadObject(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  return null;
}

function hasRequiredFields(payload) {
  const required = [
    "status",
    "val_id",
    "tran_id",
    "amount",
    "currency",
    "verify_sign",
    "verify_key",
  ];
  return required.every((key) => payload[key]);
}

function compareMoney(a, b) {
  const n1 = Number(a);
  const n2 = Number(b);
  if (!Number.isFinite(n1) || !Number.isFinite(n2)) return false;
  return Math.abs(n1 - n2) < 0.00001;
}

// ─── DB operations ────────────────────────────────────────────────────────

async function onValidatedPayment(data, rawPayload) {
  // ── 1. Find order by tranId ──────────────────────────────────────────────

  try {
    let id = data.value_a;
    await dbConnect();
    await OrderModel.findByIdAndUpdate(
      id,
      {
        "payment.status":
          String(data.risk_level) === "1" ? "PROCESSING" : "PAID",
        "payment.ssl_trxn_details": { data, rawData: rawPayload },
      },
      {
        returnDocument: "after",
      },
    );
    // if (!order) {
    //   console.error(`[IPN] Order not found for tran_id: ${data.tran_id}`);
    //   return { ok: false, reason: "Order not found" };
    // }
    // // ── 2. Idempotency: already PAID → skip, not an error ───────────────────
    // if (order.status === "PAID") {
    //   console.warn(`[IPN] Order ${order.id} already PAID — skipping`);
    //   return { ok: true };
    // }
    // ── 3. Amount validation ─────────────────────────────────────────────────
    // const storedTotal = parseFloat(order.totalAmount.toString());
    // const paidAmount = parseFloat(data.amount);

    // let order = { id: data?.value_a };
    // const isRisky = String(data.risk_level) === "1";
    // const newOrderStatus = isRisky ? "PROCESSING" : "PAID";
    // const paymentStatusMap = {
    //   VALID: "VALID",
    //   VALIDATED: "VALIDATED",
    //   FAILED: "FAILED",
    //   CANCELLED: "CANCELLED",
    //   UNATTEMPTED: "UNATTEMPTED",
    //   EXPIRED: "EXPIRED",
    // };
    // const newPaymentStatus = paymentStatusMap[data.status] ?? "FAILED";
    // ── 5. Build payment upsert data ─────────────────────────────────────────
    // const paymentData = {
    //   orderId: order.id,
    //   status: newPaymentStatus,
    //   valId: data.val_id || null,
    //   bankTranId: data.bank_tran_id || null,
    //   tranDate: data.tran_date ? new Date(data.tran_date) : null,
    //   // Amounts
    //   amount: parseFloat(data.amount),
    //   storeAmount: data.store_amount ? parseFloat(data.store_amount) : null,
    //   currency: data.currency || null,
    //   currencyType: data.currency_type || null,
    //   currencyAmount: data.currency_amount
    //     ? parseFloat(data.currency_amount)
    //     : null,
    //   currencyRate: rawPayload.currency_rate
    //     ? parseFloat(rawPayload.currency_rate)
    //     : null,
    //   // Card / gateway
    //   cardType: data.card_type || null,
    //   cardNo: data.card_no || null, // already masked by SSL
    //   cardBrand: data.card_brand || null,
    //   cardIssuer: data.card_issuer || null,
    //   cardIssuerCountry: data.card_issuer_country || null,
    //   cardIssuerCountryCode: data.card_issuer_country_code || null,
    //   // EMI
    //   emiInstalment: data.emi_instalment
    //     ? parseInt(String(data.emi_instalment))
    //     : null,
    //   emiAmount: data.emi_amount ? parseFloat(String(data.emi_amount)) : null,
    //   emiDescription: rawPayload.emi_description || null,
    //   emiIssuer: rawPayload.emi_issuer || null,
    //   // Campaign discount
    //   discountAmount: data.discount_amount
    //     ? parseFloat(data.discount_amount)
    //     : null,
    //   discountPercentage: data.discount_percentage
    //     ? parseFloat(data.discount_percentage)
    //     : null,
    //   discountRemarks: data.discount_remarks || null,
    //   // Risk
    //   riskLevel:
    //     data.risk_level !== undefined ? parseInt(String(data.risk_level)) : null,
    //   riskTitle: data.risk_title || null,
    //   // Full raw payload for audit
    //   ipnPayload: rawPayload,
    //   validatedAt: new Date(),
    // };

    // if (isRisky) {
    //   console.warn(
    //     `[IPN] Risky payment — order ${order.id} held in PROCESSING. ` +
    //       `Risk: ${data.risk_title}`,
    //   );
    // } else {
    //   console.log(`[IPN] Order ${order.id} → PAID ✓  val_id: ${data.val_id}`);
    // }

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────

export async function POST(req) {
  const storeId = process.env.STORE_ID;
  const storePasswd = process.env.STORE_PASS;

  try {
    if (!storeId || !storePasswd) {
      return Response.json(
        { ok: false, message: "Missing SSLCommerz server configuration" },
        { status: 500 },
      );
    }

    if (!isClientIpAllowed(req)) {
      return badRequest("Unauthorized IP", 403);
    }

    const payload = await readIpnPayload(req);

    if (!payload || !hasRequiredFields(payload)) {
      return badRequest("Invalid IPN payload");
    }

    if (payload.store_id && payload.store_id !== storeId) {
      return badRequest("Invalid store_id");
    }

    // ── In-memory idempotency check ──────────────────────────────────────────

    const now = Date.now();
    clearExpiredProcessedValIds(now);

    if (processedValIds.has(payload.val_id)) {
      return Response.json(
        { ok: true, message: "Already processed" },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    // ── Signature check + SSLCommerz validation API ──────────────────────────

    const ipnResult = await handleIpn(payload, storeId, storePasswd, req);

    if (!ipnResult.valid || !ipnResult.data) {
      return badRequest(ipnResult.reason || "Validation failed");
    }

    // ── Cross-check IPN payload vs validated API response ───────────────────

    if (ipnResult.data.tran_id !== payload.tran_id) {
      return badRequest("Transaction mismatch");
    }

    if (!compareMoney(ipnResult.data.amount, payload.amount)) {
      return badRequest("Amount mismatch");
    }

    if (ipnResult.data.currency !== payload.currency) {
      return badRequest("Currency mismatch");
    }

    // Mark in-flight *before* async DB work so a parallel retry is rejected
    processedValIds.set(payload.val_id, now + PROCESSED_TTL_MS);

    // ── Write to database ────────────────────────────────────────────────────

    const dbResult = await onValidatedPayment(ipnResult.data, payload);
    if (!dbResult?.ok) {
      // Allow SSLCommerz to retry on genuine errors
      processedValIds.delete(payload.val_id);
      return badRequest(dbResult.reason ?? "DB update failed");
    }
    // console.log(ipnResult.data, 555555555, payload);
    // redirect(`/payment/fail?tran_id=${"result?.trxID" || ""}`);
    return Response.json(
      { ok: true, message: "IPN accepted" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}

// ─── GET handler ──────────────────────────────────────────────────────────

export async function GET() {
  return badRequest("Method not allowed!!", 405);
}
