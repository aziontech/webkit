import webkitPlugin from '@aziontech/webkit/eslint-plugin'
import a11y from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  // webkit rules — imports, tokens, tree-shaking, no-restyle, prefer-webkit-component,
  // defineModel, deprecation. Every rule is an error (nothing out of standard is a warning).
  ...webkitPlugin.configs.strict,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser }
    },
    // Static a11y floor for the composition layer — the lint half of the
    // webkit-accessibility-implementation skill (the runtime half is axe, via the
    // webkit-ui-verifier agent). Mirrors the design system's own config.
    plugins: { 'vuejs-accessibility': a11y },
    rules: {
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'error',
      'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
      'vuejs-accessibility/no-autofocus': 'error'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser }
  }
]
