import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// DESIGN.md: colours only through theme tokens, so no raw hex inside class names,
// and no `dark:` variants (the app has one dark theme, set in globals.css).
const RAW = String.raw`/(^|\s)[a-z-]+-\[#|(^|\s)dark:/`;
const RAW_MSG = "Use theme tokens from globals.css (DESIGN.md), not raw hex or dark: variants.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error",
        { selector: `Literal[value=${RAW}]`, message: RAW_MSG },
        { selector: `TemplateElement[value.raw=${RAW}]`, message: RAW_MSG },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".claude/**", "docs/**"]),
]);

export default eslintConfig;
