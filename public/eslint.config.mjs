import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend config dari Next.js dan TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Tambahkan override di akhir untuk custom rule
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "react/no-unescaped-entities": "off", // 🔥 Matikan warning untuk quote di JSX
    },
  },
];

export default eslintConfig;
