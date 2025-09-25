import js from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginN from "eslint-plugin-n";
import pluginPrettier from "eslint-plugin-prettier";
import pluginPromise from "eslint-plugin-promise";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/", "dist/", "coverage/", "tmp/"],
  },

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
        console: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      import: pluginImport,
      n: pluginN,
      promise: pluginPromise,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      ...pluginN.configs["flat/recommended"].rules,
      ...pluginPromise.configs.recommended.rules,

      "prettier/prettier": "error",

      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
      "no-useless-escape": "off",
      "n/no-process-exit": "off",
      "n/no-unpublished-import": "off",

      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      "import/resolver": { node: { extensions: [".js", ".mjs"] } },
    },
  },
];
