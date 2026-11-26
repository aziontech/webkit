import typescriptParser from '@typescript-eslint/parser'
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'

import webkit from './src/eslint-plugin/index.js'

const UNBREAKABLE_LINE = [
  '^\\s*(d|points)="',
  '^\\s*["\'][^\\s"\']+ ?["\'](,| \\+)?$',
  '^\\s*[^\\s]+$'
].join('|')

const isComponentTag = (node) => node?.type === 'VElement' && /^[A-Z]|\./.test(node.rawName)

const elementOf = (node) => {
  let current = node
  while (current && current.type !== 'VElement') current = current.parent
  return current
}

const SCOPE = {
  'media-has-caption': (element) => element?.rawName !== 'audio'
}

const onNativeElements = (rule, inScope = () => true) => ({
  ...rule,
  create(context) {
    const report = (descriptor) => {
      const element = elementOf(descriptor.node)
      if (isComponentTag(element) || !inScope(element)) return
      context.report(descriptor)
    }
    return rule.create(Object.create(context, { report: { value: report } }))
  }
})

const accessibility = {
  ...vuejsAccessibility,
  rules: Object.fromEntries(
    Object.entries(vuejsAccessibility.rules).map(([name, rule]) => [
      name,
      onNativeElements(rule, SCOPE[name])
    ])
  )
}

const ACCESSIBILITY_RULES = Object.fromEntries(
  Object.entries(vuejsAccessibility.rules)
    .filter(([, rule]) => !rule.meta.deprecated)
    .map(([name]) => [`vuejs-accessibility/${name}`, 'error'])
)

export default [
  {
    ignores: ['**/*.test.*', 'src/test/**', '**/*.d.ts', 'types/**']
  },
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    linterOptions: { reportUnusedDisableDirectives: 'off', noInlineConfig: true },
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: typescriptParser, ecmaVersion: 'latest', sourceType: 'module' }
    }
  },
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    ignores: ['src/assets/**', 'src/svg/**', '**/*-data.ts', '**/map-chart-countries.ts'],
    rules: {
      'max-len': [
        'error',
        { code: 200, ignoreUrls: true, ignoreRegExpLiterals: true, ignorePattern: UNBREAKABLE_LINE }
      ]
    }
  },
  {
    files: ['**/*.vue'],
    plugins: { 'vuejs-accessibility': accessibility },
    rules: {
      ...ACCESSIBILITY_RULES,
      'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
      'vuejs-accessibility/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }]
    }
  },
  {
    files: [
      'src/components/**/*.{js,ts,vue}',
      'blocks/**/*.{js,ts,vue}',
      'examples/**/*.{js,ts,vue}'
    ],
    plugins: { webkit },
    rules: {
      'webkit/no-unowned-element': ['error', { owners: true }],
      'webkit/prefer-hint': 'error'
    }
  }
]
