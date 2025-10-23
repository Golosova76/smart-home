/** @type {import('stylelint').Config} */
export default {
  extends: [
    // Базовые правила CSS + SCSS (включает stylelint-scss)
    "stylelint-config-standard-scss",
    // Современный порядок CSS-свойств
    "stylelint-config-clean-order",
  ],
  rules: {
    "value-keyword-case": "lower",
    "scss/at-rule-conditional-no-parentheses": null,
    "no-descending-specificity": null,
    "no-duplicate-selectors": null,
    "selector-class-pattern": null,
    "no-empty-source": null,
    "max-nesting-depth": 3,
    "selector-max-id": 0,
    "color-function-notation": "modern",
    "declaration-block-no-duplicate-properties": true,
    "font-family-no-duplicate-names": true,
    "scss/dollar-variable-pattern": "^[_a-z][a-zA-Z0-9-]*$",
    "scss/selector-no-redundant-nesting-selector": true,
  },
  ignoreFiles: [
    "dist/**/*",
    "node_modules/**/*",
    ".angular/**/*",
    "coverage/**/*",
    "lcov-report/**/*", // HTML-отчёты покрытия
  ],
};
