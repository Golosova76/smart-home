import tseslint from "typescript-eslint"; //нужно
import js from "@eslint/js"; //нужно

import prettier from 'eslint-plugin-prettier'; //нужно
import configPrettier from 'eslint-config-prettier'; //нужно
import ngrx from '@ngrx/eslint-plugin/v9'; //нужно

import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname, // чтобы корректно резолвились shareable-configs
});

// Плагины, чьи правила ты вызываешь напрямую в rules:
import unusedImports from 'eslint-plugin-unused-imports';
import noRelative from 'eslint-plugin-no-relative-import-paths';

import unicorn from 'eslint-plugin-unicorn';

import angularEslintTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...ngrx.configs.all.map(c => ({ ...c, files: ['**/*.ts'] })),

  // Плагины с flat-конфигами: без spread!
  unicorn.configs['flat/recommended'],

  //general rules
  {
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    ignores: [".angular/", "dist/", "node_modules/", "coverage/", "eslint.config.js", "netlify/functions/proxy.js"],
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        alias: {
          extensions: [".ts", ".js", ".json"],
          map: [["@", "./src"]],
        },
      },
    },
  },
  // Пресеты из «legacy»-мира через FlatCompat
  // (соответствуют пакетам и версиям из package.json)
  ...compat.extends(
    'plugin:@angular-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ),

  // TypeScript (Angular) files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    linterOptions: {
      noInlineConfig: true, // запрет eslint-disable (точечные отключения)
    },

    // Подключаем только те плагины, у которых правила вызываем явно
    plugins: {
      'unused-imports': unusedImports,
      'no-relative-import-paths': noRelative,
      'prettier': prettier,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit", overrides: { constructors: "off" } },
      ],
      "@typescript-eslint/member-ordering": [
        'error',
        {
          default: {
            memberTypes: [
              // порядок групп, не зависящий от модификаторов
              'field',
              'constructor',
              'method',
            ],
            order: 'as-written', // сохраняет порядок, как в коде
          },
        },
      ],
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1, -1, 100],
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          enforceConst: true
        }
      ],

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
      "unicorn/no-null": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/number-literal-case": "off",
      "unicorn/numeric-separators-style": "off",
      // "unicorn/prevent-abbreviations": "off", отключает строгий контроль за сокращением в названиях

      "import/no-unresolved": "error",
      "unused-imports/no-unused-imports": "warn",

      'prettier/prettier': 'error',
    },
  },

  // HTML-template Angular
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularEslintTemplate,
    },
    rules: {
      ...angularEslintTemplate.configs.recommended.rules,
      // опционально: набор по доступности (a11y)
      ...(angularEslintTemplate.configs.accessibility?.rules ?? {}),
      "@angular-eslint/template/prefer-self-closing-tags": "off",
      "@angular-eslint/template/elements-content": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "import/namespace": "off",
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",
      "@angular-eslint/template/attributes-order": [
        "warn",
        {
          order: [
            "STRUCTURAL_DIRECTIVE", // *ngIf, *ngFor
            "TEMPLATE_REFERENCE", // #inputRef
            "INPUT_BINDING", // [prop], [attr.x], [style.x], [@anim]
            "TWO_WAY_BINDING", // [(ngModel)]
            "OUTPUT_BINDING", // (click), (change)
            "ATTRIBUTE_BINDING", // обычные атрибуты: id, required и т.п.
          ],
        },
      ],
    },
  },

  configPrettier,
];

