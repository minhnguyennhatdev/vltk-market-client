import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
});

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "node_modules/**",
        "src/generated/**",
    ]),
    ...compat.config({
        extends: [
            "next",
            "next/core-web-vitals",
            "next/typescript",
            "plugin:prettier/recommended",
            "plugin:jsx-a11y/recommended",
        ],
        plugins: ["prettier", "jsx-a11y"],
        rules: {
            "prettier/prettier": [
                "error",
                {
                    trailingComma: "all",
                    semi: false,
                    tabWidth: 2,
                    singleQuote: true,
                    printWidth: 80,
                    endOfLine: "auto",
                    arrowParens: "always",
                    plugins: ["prettier-plugin-tailwindcss"],
                },
                {
                    usePrettierrc: false,
                },
            ],
            "react/react-in-jsx-scope": "off",
            "jsx-a11y/alt-text": "warn",
            "jsx-a11y/aria-props": "warn",
            "jsx-a11y/aria-proptypes": "warn",
            "jsx-a11y/aria-unsupported-elements": "warn",
            "jsx-a11y/role-has-required-aria-props": "warn",
            "jsx-a11y/role-supports-aria-props": "warn",
        },
    }),
]);

export default eslintConfig;
