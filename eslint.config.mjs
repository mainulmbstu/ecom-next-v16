import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  { rules: { ...js.configs.recommended.rules } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
// import { defineConfig, globalIgnores } from "eslint/config";
// import nextVitals from "eslint-config-next/core-web-vitals";

// const eslintConfig = defineConfig([
//   ...nextVitals,

//   // Override default ignores of eslint-config-next.
//   globalIgnores([
//     // Default ignores of eslint-config-next:
//     ".next/**",
//     "out/**",
//     "build/**",
//     "next-env.d.ts",
//   ]),
// ]);

// export default eslintConfig;

//==========================================
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
// import js from "@eslint/js";
// import isDev from "isdev";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = isDev
//   ? [
//       ...compat.config({
//         extends: ["next", "prettier"],
//         // extends: ["next/core-web-vitals", "prettier"],
//         rules: {
//           ...js.configs.recommended.rules,
//           // "react/no-unescaped-entities": "off",
//           // "@typescript-eslint/no-unused-vars": "off",
//           // "@next/next/no-page-custom-font": "off",
//         },
//       }),
//     ]
//   : [
//       ...compat.config({
//         extends: ["next", "prettier"],
//       }),
//     ];

// export default eslintConfig;
