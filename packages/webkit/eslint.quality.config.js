import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

const UNBREAKABLE_LINE = [
  '^\\s*(d|points)="',
  '^\\s*["\'][^\\s"\']+ ?["\'](,| \\+)?$',
  '^\\s*[^\\s]+$'
].join('|')

export default [
  {
    ignores: [
      '**/*.test.*',
      'src/test/**',
      'src/assets/**',
      'src/svg/**',
      '**/*-data.ts',
      '**/map-chart-countries.ts',
      '**/*.d.ts',
      'types/**'
    ]
  },
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: typescriptParser, ecmaVersion: 'latest', sourceType: 'module' }
    },
    rules: {
      'max-len': [
        'error',
        { code: 200, ignoreUrls: true, ignoreRegExpLiterals: true, ignorePattern: UNBREAKABLE_LINE }
      ]
    }
  }
]
