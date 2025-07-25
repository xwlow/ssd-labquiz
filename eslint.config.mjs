import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginSecurity from "eslint-plugin-security";
import securityNode from "eslint-plugin-security-node";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // JS/JSX
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  // TS/TSX
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      security: pluginSecurity,
      securityNode: securityNode,
      noUnsanitized: noUnsanitized,
      "@typescript-eslint": pluginTs
    },
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json"
      }
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginTs.configs.recommended.rules,
      "security/detect-eval-with-expression": "error",
    }
  }
];