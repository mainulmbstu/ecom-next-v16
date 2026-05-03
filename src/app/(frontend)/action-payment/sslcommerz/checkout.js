import { initiatePayment } from "./payments";
import { rateLimit } from "./rate-limit";

// ──────────────────────────────────────────────────────────────────────────────

export function getEasyCheckoutScriptUrl(env) {
  const rand = Math.random().toString(36).substring(7);
  return env === "sandbox"
    ? `https://sandbox.sslcommerz.com/embed.min.js?${rand}`
    : `https://seamless-epay.sslcommerz.com/embed.min.js?${rand}`;
}

export async function getGatewayUrl(request, params, env) {
  if (request && (await rateLimit(request))) {
    throw new Error("Too many requests. Please wait and try again.");
  }

  const response = await initiatePayment(params, env, request);

  if (response.status !== "SUCCESS" || !response.GatewayPageURL) {
    throw new Error(
      `Failed to create SSLCommerz session: ${response.failedreason ?? "Unknown error"}`,
    );
  }

  return response.GatewayPageURL;
}

export async function getEasyCheckoutResponse(params, env, request) {
  try {
    if (request && (await rateLimit(request))) {
      return {
        status: "fail",
        data: null,
        message: "Too many requests. Please wait and try again.",
      };
    }

    const response = await initiatePayment(params, env, request);

    if (response.GatewayPageURL) {
      return {
        status: "success",
        data: response.GatewayPageURL,
        logo: response.storeLogo,
      };
    }

    return { status: "fail", data: null, message: "JSON Data parsing error!" };
  } catch (err) {
    return {
      status: "fail",
      data: null,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
