import { existsSync } from 'node:fs'
import { join } from 'node:path'

import {
  BUILD_OUTPUT_DIRS,
  ESLINT_CONFIG_CANDIDATES,
  firstExisting,
  packageHasKey,
  packageHasStylelint,
  POSTCSS_CONFIG_CANDIDATES,
  PRETTIER_CONFIG_CANDIDATES,
  read,
  STYLELINT_CONFIG_CANDIDATES
} from './project-files.js'

const TOOL_CONFIG_FILES = '*.config.{js,cjs,mjs,ts,cts,mts}'

const LABEL_CONTROL_COMPONENTS = [
  'Checkbox',
  'Combobox',
  'Input',
  'MultiSelect',
  'NumberInput',
  'PasswordInput',
  'PhoneInput',
  'Select',
  'Slider',
  'Switch',
  'Textarea'
]

export function eslintFlatConfig(severityConfig) {
  const ignores = BUILD_OUTPUT_DIRS.map((dir) => `'**/${dir}/'`).join(', ')
  return `import webkitPlugin from '@aziontech/webkit/eslint-plugin'
import a11y from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  { ignores: [${ignores}] },
  ...webkitPlugin.configs.${severityConfig},
  {
    files: ['${TOOL_CONFIG_FILES}'],
    rules: { 'webkit/require-authoring-standards': 'off' }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser }
    },
    plugins: { 'vuejs-accessibility': a11y },
    rules: {
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'error',
      'vuejs-accessibility/label-has-for': [
        'error',
        {
          required: { some: ['nesting', 'id'] },
          controlComponents: [${LABEL_CONTROL_COMPONENTS.map((name) => `'${name}'`).join(', ')}]
        }
      ],
      'vuejs-accessibility/no-autofocus': 'error'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser }
  }
]
`
}

export function postcssConfig() {
  return `export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
`
}

const POSTCSS_SNIPPET_HEADER =
  'A PostCSS config already exists — not overwriting it. Add the Tailwind v4 plugin manually:'

const ESLINT_SNIPPET_HEADER =
  'An ESLint config already exists — not overwriting it. Merge the webkit preset manually:'

const STYLELINT_SNIPPET_HEADER =
  'A Stylelint config already exists — not overwriting it. Merge the webkit config manually:'

export const STYLELINT_CONTENT = `${JSON.stringify(
  {
    extends: ['@aziontech/webkit/stylelint-config'],
    overrides: [
      { files: ['**/*.vue'], customSyntax: 'postcss-html' },
      { files: ['**/*.scss'], customSyntax: 'postcss-scss' }
    ]
  },
  null,
  2
)}\n`

export const STYLELINT_IGNORE = `${BUILD_OUTPUT_DIRS.map((dir) => `${dir}/`).join('\n')}\n`

const STYLELINT_IGNORE_SNIPPET_HEADER =
  'A .stylelintignore already exists — not overwriting it. Make sure it ignores the build output, or the pre-commit hook and your editor lint compiled CSS:'

const PRETTIER_CONTENT = `${JSON.stringify(
  {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'none',
    singleAttributePerLine: true,
    vueIndentScriptAndStyle: true
  },
  null,
  2
)}\n`

const PRETTIER_SNIPPET_HEADER =
  'A Prettier config already exists, so none is written. The copied WebKit blocks are ' +
  'formatted with these options; use them, or expect the first format run to restyle every ' +
  'copied block (and `webkit diff` to report it):'

const writeOnce = (path, content) => ({ type: 'write', path, content, skipIfExists: true })
const snippet = (header, content) => ({ type: 'advise', message: `${header}\n${content}` })

export function postcssAction(projectDir, tailwindVite) {
  if (tailwindVite) {
    return {
      type: 'advise',
      message:
        'Tailwind already runs through @tailwindcss/vite, so no postcss.config.mjs is written (running both would process Tailwind twice).'
    }
  }
  if (firstExisting(projectDir, POSTCSS_CONFIG_CANDIDATES)) {
    return snippet(POSTCSS_SNIPPET_HEADER, postcssConfig())
  }
  return writeOnce('postcss.config.mjs', postcssConfig())
}

function eslintAction(projectDir, severity) {
  if (firstExisting(projectDir, ESLINT_CONFIG_CANDIDATES)) {
    return snippet(ESLINT_SNIPPET_HEADER, eslintFlatConfig(severity))
  }
  return writeOnce('eslint.config.mjs', eslintFlatConfig(severity))
}

function stylelintAction(projectDir) {
  const existing = firstExisting(projectDir, STYLELINT_CONFIG_CANDIDATES)
  if (existing || packageHasStylelint(projectDir)) {
    return snippet(STYLELINT_SNIPPET_HEADER, STYLELINT_CONTENT)
  }
  return writeOnce('.stylelintrc.json', STYLELINT_CONTENT)
}

function stylelintIgnoreActions(projectDir) {
  if (!existsSync(join(projectDir, '.stylelintignore'))) {
    return [writeOnce('.stylelintignore', STYLELINT_IGNORE)]
  }
  const current = read(join(projectDir, '.stylelintignore')) || ''
  if (/^\/?dist\/?$/m.test(current)) return []
  return [snippet(STYLELINT_IGNORE_SNIPPET_HEADER, STYLELINT_IGNORE)]
}

function prettierAction(projectDir) {
  const existing = firstExisting(projectDir, PRETTIER_CONFIG_CANDIDATES)
  if (existing || packageHasKey(projectDir, 'prettier')) {
    return snippet(PRETTIER_SNIPPET_HEADER, PRETTIER_CONTENT)
  }
  return writeOnce('.prettierrc.json', PRETTIER_CONTENT)
}

export function lintConfigActions(projectDir, severity) {
  return [
    eslintAction(projectDir, severity),
    stylelintAction(projectDir),
    ...stylelintIgnoreActions(projectDir),
    prettierAction(projectDir)
  ]
}
