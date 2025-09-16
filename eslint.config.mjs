import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**", // Ignore generated Prisma files
      "prisma/generated/**",
    ],
  },
  {
    rules: {
      // Allow unused vars for generated files and specific patterns
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      // Relax some rules for React hooks in complex components
      "react-hooks/exhaustive-deps": "warn",
      // Allow require imports for certain patterns (like Prisma client)
      "@typescript-eslint/no-require-imports": ["error", {
        "allow": ["@prisma/client"]
      }],
      // Allow explicit any in type definitions but warn
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];

export default eslintConfig;
