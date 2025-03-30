import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Create a simple export instead of using compat.config directly
export default [
  {
    ignores: ["node_modules/**", ".next/**", "dist/**"]
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "react/no-escape-entities": "off",
    },
  },
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "prettier"
    ],
  }),
];
