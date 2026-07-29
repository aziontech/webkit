import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', '**/*.d.ts.map']
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      'vuejs-accessibility': vuejsAccessibility
    },
    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // Vue-specific rules
      // https://eslint.vuejs.org/rules/no-dupe-v-else-if.html
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-tags-order': ['error', { order: ['script[setup]', 'template', 'style'] }],
      'vue/multi-word-component-names': 'off',
      'vue/no-arrow-functions-in-watch': 'error',
      'vue/no-async-in-computed-properties': 'error',
      'vue/no-child-content': 'error',
      'vue/no-dupe-keys': 'error',
      'vue/no-dupe-v-else-if': 'error',
      'vue/no-duplicate-attributes': [
        'error',
        {
          allowCoexistClass: true,
          allowCoexistStyle: true
        }
      ],
      'vue/no-export-in-script-setup': 'error',
      'vue/no-empty-component-block': 'error',
      'vue/no-irregular-whitespace': 'error',
      'vue/no-mutating-props': [
        'error',
        {
          shallowOnly: false
        }
      ],
      "vue/no-reserved-component-names": ['error', {
        "disallowVueBuiltInComponents": true,
        "disallowVue3BuiltInComponents": true,
        "htmlElementCaseSensitive": true,
      }],
      'vue/no-restricted-syntax': 'error',
      'vue/no-reserved-keys': [
        'error',
        {
          reserved: [],
          groups: []
        }
      ],
      'vue/no-reserved-props': [
        'error',
        {
          vueVersion: 3
        }
      ],
      'vue/no-unused-vars': 'error',
      'vue/v-if-else-key': 'error',
      'vue/no-ref-as-operand': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/template-curly-spacing': 'error',

      // Accessibility (Vue 3)
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'error',

      // TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],

      // Import organization
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Clean code
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error'
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    }
  }
]
