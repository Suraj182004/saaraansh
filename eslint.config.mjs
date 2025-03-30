import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig={
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "prettier"
      // "plugin:tailwindcss/recommended" - removed due to Tailwind v4 incompatibility
    ],
    plugins: ["prettier"], // removed "tailwindcss" due to Tailwind v4 incompatibility
    rules: {
      "prettier/prettier": "error",
      "react/no-escape-entities": "off",
      // Removed tailwindcss rules due to Tailwind v4 incompatibility
      // "tailwindcss/classnames-order": "warn",
      // "tailwindcss/no-custom-classname": "warn",
    },
  })
}

export default eslintConfig;
