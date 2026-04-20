import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
// import typescript from '@typescript-eslint/eslint-plugin'
// import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      '**/*.d.ts.map'
    ]
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        // parser: typesgit criptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        // ES2022 globals
        Promise: 'readonly',
        Symbol: 'readonly',
        Reflect: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      vue,
      // '@typescript-eslint': typescript,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      'vuejs-accessibility': vuejsAccessibility
    },
    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // Vue-specific rules
      'vue/multi-word-component-names': 'off', // Allow flexibility in component naming
      'vue/no-v-html': 'error', // Security
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-vars': 'error',

      // Accessibility (Vue 3)
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'error',

      // TypeScript
      // '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // '@typescript-eslint/explicit-module-boundary-types': 'error',
      // '@typescript-eslint/no-explicit-any': 'error',

      // Import organization
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Clean code
      'no-console': 'error', // Prevent console.log in production code
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
