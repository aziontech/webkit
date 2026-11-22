import { existsSync, readdirSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

import typescriptParser from '@typescript-eslint/parser'
import { ESLint } from 'eslint'
import vueParser from 'vue-eslint-parser'

import qualityConfig from '../../eslint.quality.config.js'

export const LIMITS = {
  'component-file': 400,
  'script-setup': 200,
  module: 300,
  'function-lines': 60,
  complexity: 12,
  'line-length': 200,
  'block-page': 400,
  'block-variant': 120,
  props: 20,
  models: 5
}

export const RULES = Object.keys(LIMITS)

export const COUNTING =
  'A line counts when it holds code: blank lines and lines that hold only a comment (JS, TS or HTML) are skipped, ' +
  "as ESLint's skipBlankLines and skipComments do. A .vue file counts every block (tags included); its script " +
  'counts the lines between the opening and closing <script setup> tags (the plain <script> when there is no setup). ' +
  'Function length and complexity are ESLint core max-lines-per-function (skipBlankLines, skipComments, IIFEs) and ' +
  'complexity (classic) over every function in scripts, .ts and .js; template expressions are not functions. ' +
  'Line length is the max-len rule of eslint.quality.config.js, reused as is. Props count the members of the type ' +
  'or object given to defineProps (local interfaces, their extends and intersections resolved); models count ' +
  'defineModel calls.'

export const SCANNED = ['src', 'blocks', 'examples']

const SOURCE = /\.(vue|ts|js|mjs)$/
const SKIPPED = [
  /\.(test|spec)\.[^/]+$/,
  /\.figma\.ts$/,
  /\.d\.ts$/,
  /(^|\/)(test|__tests__|fixtures)\//
]
const DATA = [
  /^src\/locales\//,
  /^src\/assets\/.*\.ts$/,
  /-data\.ts$/,
  /\/map-chart-countries\.ts$/,
  /^blocks\/.*\/sample\.ts$/
]

export function kindOf(file) {
  if (file.endsWith('.vue')) {
    if (file.startsWith('blocks/'))
      return /\/variants\//.test(file) ? 'block-variant' : 'block-page'
    return 'component'
  }
  return DATA.some((re) => re.test(file)) ? 'data' : 'module'
}

export function areaOf(file) {
  const parts = file.split('/')
  if (parts[0] === 'src' && parts[1] === 'components') return `src/components/${parts[2]}`
  if (parts[0] === 'blocks') return `blocks/${parts[1]}`
  if (parts[0] === 'examples') return 'examples'
  return parts.length > 2 ? `src/${parts[1]}` : 'src'
}

export function collectFiles(pkgDir) {
  const files = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') walk(full)
        continue
      }
      const file = relative(pkgDir, full).split(sep).join('/')
      if (SOURCE.test(file) && !SKIPPED.some((re) => re.test(file))) files.push(file)
    }
  }
  for (const dir of SCANNED) if (existsSync(join(pkgDir, dir))) walk(join(pkgDir, dir))
  return files.sort()
}

export function codeLines(text, comments, start = 0, end = text.length) {
  const chars = text.slice(start, end).split('')
  for (const [from, to] of comments) {
    for (let i = Math.max(from, start); i < Math.min(to, end); i++) {
      if (chars[i - start] !== '\n') chars[i - start] = ' '
    }
  }
  return chars
    .join('')
    .split('\n')
    .filter((line) => /\S/.test(line)).length
}

const declarationsOf = (ast) =>
  ast.body.map((node) =>
    (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') &&
    node.declaration
      ? node.declaration
      : node
  )

export function countTypeMembers(type, ast, seen = new Set()) {
  if (!type) return null
  if (type.type === 'TSTypeLiteral') return type.members.length
  if (type.type === 'TSIntersectionType') {
    const counts = type.types.map((t) => countTypeMembers(t, ast, seen))
    return counts.includes(null) ? null : counts.reduce((a, b) => a + b, 0)
  }
  if (type.type !== 'TSTypeReference' || type.typeName.type !== 'Identifier') return null
  const name = type.typeName.name
  if (seen.has(name)) return 0
  seen.add(name)
  const declarations = declarationsOf(ast).filter((node) => node.id?.name === name)
  if (!declarations.length) return null
  let total = 0
  for (const node of declarations) {
    if (node.type === 'TSInterfaceDeclaration') {
      total += node.body.body.length
      for (const heritage of node.extends || []) {
        const inherited = countTypeMembers(
          { type: 'TSTypeReference', typeName: heritage.expression },
          ast,
          seen
        )
        if (inherited === null) return null
        total += inherited
      }
    } else if (node.type === 'TSTypeAliasDeclaration') {
      const aliased = countTypeMembers(node.typeAnnotation, ast, seen)
      if (aliased === null) return null
      total += aliased
    } else return null
  }
  return total
}

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return
  visit(node)
  for (const key of Object.keys(node)) {
    if (key === 'parent' || key === 'tokens' || key === 'comments') continue
    const value = node[key]
    if (Array.isArray(value)) value.forEach((child) => walk(child, visit))
    else if (value && typeof value === 'object') walk(value, visit)
  }
}

const isCall = (node, name) =>
  node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === name

export function countPropsAndModels(ast) {
  let props = 0
  let models = 0
  let unresolved = false
  walk(ast, (node) => {
    if (isCall(node, 'defineModel')) models += 1
    if (!isCall(node, 'defineProps')) return
    const typeArgument = (node.typeArguments || node.typeParameters)?.params?.[0]
    const [runtime] = node.arguments
    let count = null
    if (typeArgument) count = countTypeMembers(typeArgument, ast)
    else if (runtime?.type === 'ObjectExpression') count = runtime.properties.length
    else if (runtime?.type === 'ArrayExpression') count = runtime.elements.length
    if (count === null) unresolved = true
    else props += count
  })
  return { props, models, propsUnresolved: unresolved }
}

const scriptElementOf = (fragment) => {
  const scripts = (fragment?.children || []).filter(
    (node) => node.type === 'VElement' && node.name === 'script' && node.endTag
  )
  const isSetup = (node) =>
    node.startTag.attributes.some((a) => !a.directive && a.key.name === 'setup')
  return scripts.find(isSetup) || scripts[0] || null
}

const measureRule = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    return {
      'Program:exit'(program) {
        const source = context.sourceCode
        const fragment = source.parserServices?.getDocumentFragment?.()
        const comments = [
          ...source.getAllComments(),
          ...(fragment?.comments || []).filter((c) => c.type === 'HTMLComment')
        ].map((c) => c.range)
        const measures = { lines: codeLines(source.text, comments) }
        if (fragment) {
          const script = scriptElementOf(fragment)
          measures.scriptLines = script
            ? codeLines(source.text, comments, script.startTag.range[1], script.endTag.range[0])
            : 0
          Object.assign(measures, countPropsAndModels(program))
        }
        context.report({ loc: { line: 1, column: 0 }, message: JSON.stringify(measures) })
      }
    }
  }
}

const lineLengthConfig = qualityConfig.find((block) => block.rules?.['max-len'])

export function eslintConfig() {
  return [
    {
      files: ['**/*.{js,mjs,ts,vue}'],
      linterOptions: { reportUnusedDisableDirectives: 'off', noInlineConfig: true },
      languageOptions: {
        parser: vueParser,
        parserOptions: { parser: typescriptParser, ecmaVersion: 'latest', sourceType: 'module' }
      },
      plugins: { maintainability: { rules: { measure: measureRule } } },
      rules: {
        'maintainability/measure': 'error',
        'max-lines-per-function': [
          'error',
          { max: LIMITS['function-lines'], skipBlankLines: true, skipComments: true, IIFEs: true }
        ],
        complexity: ['error', { max: LIMITS.complexity }]
      }
    },
    {
      files: lineLengthConfig.files,
      ignores: lineLengthConfig.ignores,
      rules: lineLengthConfig.rules
    }
  ]
}

const FUNCTION_LINES = /^(.*) has too many lines \((\d+)\)/
const COMPLEXITY = /^(.*) has a complexity of (\d+)/
const LINE_LENGTH = /length of (\d+)/

function fileViolations(file, kind, measures) {
  const out = []
  const over = (rule, value) => {
    if (value > LIMITS[rule]) out.push({ rule, value, limit: LIMITS[rule], line: 1 })
  }
  if (kind === 'component') {
    over('component-file', measures.lines)
    over('script-setup', measures.scriptLines)
    if (file.startsWith('src/components/')) {
      over('props', measures.props)
      over('models', measures.models)
    }
  } else if (kind === 'block-page') over('block-page', measures.lines)
  else if (kind === 'block-variant') over('block-variant', measures.lines)
  else if (kind === 'module') over('module', measures.lines)
  return out
}

function messageViolation(message) {
  if (message.ruleId === 'max-lines-per-function') {
    const [, name, value] = message.message.match(FUNCTION_LINES) || []
    return {
      rule: 'function-lines',
      value: Number(value),
      limit: LIMITS['function-lines'],
      line: message.line,
      name
    }
  }
  if (message.ruleId === 'complexity') {
    const [, name, value] = message.message.match(COMPLEXITY) || []
    return {
      rule: 'complexity',
      value: Number(value),
      limit: LIMITS.complexity,
      line: message.line,
      name
    }
  }
  if (message.ruleId === 'max-len') {
    const [, value] = message.message.match(LINE_LENGTH) || []
    return {
      rule: 'line-length',
      value: Number(value),
      limit: LIMITS['line-length'],
      line: message.line
    }
  }
  return { rule: 'parse', value: 0, limit: 0, line: message.line, name: message.message }
}

export async function measure(pkgDir, files = collectFiles(pkgDir)) {
  const eslint = new ESLint({
    cwd: pkgDir,
    overrideConfigFile: true,
    overrideConfig: eslintConfig(),
    cache: false
  })
  const results = await eslint.lintFiles(files.map((f) => resolve(pkgDir, f)))
  return results
    .map((result) => {
      const file = relative(pkgDir, result.filePath).split(sep).join('/')
      const kind = kindOf(file)
      const measureMessage = result.messages.find((m) => m.ruleId === 'maintainability/measure')
      const measures = measureMessage ? JSON.parse(measureMessage.message) : { lines: 0 }
      const violations = [
        ...fileViolations(file, kind, measures),
        ...result.messages
          .filter((m) => m.ruleId !== 'maintainability/measure')
          .map(messageViolation)
      ]
      return { file, area: areaOf(file), kind, ...measures, violations }
    })
    .sort((a, b) => a.file.localeCompare(b.file))
}

export function summarize(files) {
  const areas = {}
  for (const entry of files) {
    const area = (areas[entry.area] ||= {
      files: 0,
      filesOver: 0,
      ...Object.fromEntries(RULES.map((r) => [r, 0]))
    })
    area.files += 1
    if (entry.violations.length) area.filesOver += 1
    const fileRules = new Set()
    for (const v of entry.violations) {
      if (v.rule === 'function-lines' || v.rule === 'complexity') area[v.rule] += 1
      else if (v.rule === 'line-length' || v.rule === 'parse') fileRules.add(v.rule)
      else area[v.rule] += 1
    }
    for (const rule of fileRules) area[rule] = (area[rule] || 0) + 1
  }
  return Object.fromEntries(Object.entries(areas).sort(([a], [b]) => a.localeCompare(b)))
}
