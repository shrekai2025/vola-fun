import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // TypeScript 规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off", // 关闭基础规则
      "@typescript-eslint/no-empty-object-type": "warn",

      // 未使用变量和导入检测
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // React 规则
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" }
      ],
      "react/self-closing-comp": "error",

      // Next.js 规则
      "@next/next/no-img-element": "warn",

      // 通用规则
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error", "debug", "group", "groupEnd"] }],
      "no-debugger": "error",
      "no-unused-vars": "off", // 由 unused-imports 规则处理
    },
  },
];

export default eslintConfig;
