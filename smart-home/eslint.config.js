//import angular from "angular-eslint";
import importPlugin from "eslint-plugin-import";
import eslintPluginNoRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import eslint from "@eslint/js";
import unicorn from "eslint-plugin-unicorn";
import typescriptEslint from "typescript-eslint";
import angularEslintTemplate from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";

export default [
  {
    languageOptions: {
      parser: typescriptEslint.parser,
    },
  },
  {
    ignores: [".angular", "dist", "node_modules", "eslint.config.js"],
  },

  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  perfectionist.configs["recommended-natural"],
  //...angular.configs.tsRecommended,
  unicorn.configs.recommended,

  // TypeScript (Angular) файлы
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "unused-imports": unusedImports,
      "no-relative-import-paths": eslintPluginNoRelativeImportPaths,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        alias: {
          extensions: [".ts", ".js", ".jsx", ".json"],
          map: [["@", "./src"]],
        },
      },
    },
    rules: {
      /*
      // Angular naming conventions
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
      */
      "unicorn/prefer-top-level-await": "off",
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/no-array-for-each": "warn",
      "import/no-unresolved": "error",
      "unused-imports/no-unused-imports": "warn",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-modules": "off",
      "perfectionist/sort-interfaces": "off",
      "perfectionist/sort-classes": [
        "error",
        {
          groups: [
            "index-signature",
            "static-property",
            "private-static-property",
            "protected-static-property",
            "public-readonly-property",
            "protected-readonly-property",
            "private-readonly-property",
            "decorated-property",
            "public-property",
            "protected-property",
            "private-property",
            "static-block",
            "constructor",
            "decorated-method",
            "public-method",
            "protected-method",
            "private-method",
            "unknown",
          ],
        },
      ],
      "perfectionist/sort-objects": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // HTML-шаблоны Angular
  //...angular.configs.templateRecommended,
  //...angular.configs.templateAccessibility,
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularEslintTemplate,
    },
    rules: {
      "@angular-eslint/template/prefer-self-closing-tags": "off",
      "@angular-eslint/template/elements-content": ["off"],
      "@typescript-eslint/ban-ts-comment": "off",
      "import/namespace": "off",
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",
    },
  },
];
