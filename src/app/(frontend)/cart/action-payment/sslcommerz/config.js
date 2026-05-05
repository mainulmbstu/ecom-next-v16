// ──────────────────────────────────────────────────────────────────────────────

export const BASE_URLS = {
  payment:
    process.env.SSLCOMMERZ_ENV === "live"
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
  validator:
    process.env.SSLCOMMERZ_ENV === "live"
      ? "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
      : "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php",
};
// export const BASE_URLS = {
//   sandbox: {
//     payment: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
//     validator:
//       "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php",
//   },
//   live: {
//     payment: "https://securepay.sslcommerz.com/gwprocess/v4/api.php",
//     validator:
//       "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php",
//   },
// };

export const VALIDATION_URL =
  process.env.SSLCOMMERZ_ENV === "live"
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
// export const VALIDATION_URL = {
//   sandbox:
//     "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
//   live: "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php",
// };
