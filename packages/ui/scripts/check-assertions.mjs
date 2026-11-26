#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { babelParse, parse } from 'vue/compiler-sfc'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const PKG_DIR = resolve(SCRIPT_DIR, '..')

export const MAX_ASSERTIONS = 965

export const BANNED_ROOTS = ['src', 'blocks', 'examples']
export const COUNTED_ROOTS = ['src']

const SOURCE = /\.(vue|ts|tsx|mts|cts)$/
const SKIP_FILE = /\.(test|spec)\.[a-z]+$|\.d\.ts$|\.figma\.ts$/
const SKIP_DIR = new Set(['node_modules', 'test', '__tests__', 'fixtures', 'dist', 'types'])

export function listSources(dir) {
  const out = []
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIR.has(entry.name)) out.push(...listSources(path))
    } else if (SOURCE.test(entry.name) && !SKIP_FILE.test(entry.name)) out.push(path)
  }
  return out.sort()
}

const isConst = (type) =>
  type?.type === 'TSTypeReference' &&
  type.typeName?.type === 'Identifier' &&
  type.typeName.name === 'const'

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return
  visit(node)
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'extra' || key.endsWith('Comments')) continue
    const value = node[key]
    if (Array.isArray(value)) for (const child of value) walk(child, visit)
    else if (value && typeof value === 'object') walk(value, visit)
  }
}

export function unboundModelDefaults(ast) {
  const allowed = new Set()
  walk(ast, (node) => {
    if (node.type !== 'CallExpression' || node.callee?.name !== 'defineModel') return
    for (const arg of node.arguments)
      if (arg.type === 'ObjectExpression')
        for (const property of arg.properties) {
          const value = property.value
          if (
            property.key?.name === 'default' &&
            value?.type === 'TSAsExpression' &&
            value.typeAnnotation?.type === 'TSNeverKeyword' &&
            value.expression?.type === 'Identifier' &&
            value.expression.name === 'undefined'
          )
            allowed.add(value)
        }
  })
  return allowed
}

function assertionsIn(ast, lineOffset) {
  const found = []
  const inner = unboundModelDefaults(ast)
  walk(ast, (node) => {
    if (node.type !== 'TSAsExpression' && node.type !== 'TSTypeAssertion') return
    if (inner.has(node) || isConst(node.typeAnnotation)) return
    const line = (node.loc?.start.line ?? 1) + lineOffset
    const wrapped = node.expression
    let kind = 'assertion'
    if (node.typeAnnotation?.type === 'TSNeverKeyword') kind = 'as-never'
    else if (
      (wrapped?.type === 'TSAsExpression' || wrapped?.type === 'TSTypeAssertion') &&
      wrapped.typeAnnotation?.type === 'TSUnknownKeyword'
    ) {
      kind = 'as-unknown-as'
      inner.add(wrapped)
    }
    found.push({ kind, line })
  })
  return found
}

function parseScript(code, lineOffset, typescript = true) {
  const ast = babelParse(code, {
    sourceType: 'module',
    plugins: typescript ? ['typescript'] : [],
    errorRecovery: true
  })
  return assertionsIn(ast, lineOffset)
}

function parseExpression(code, lineOffset) {
  for (const source of [`(${code})`, code]) {
    try {
      return assertionsIn(
        babelParse(source, { sourceType: 'module', plugins: ['typescript'] }),
        lineOffset
      )
    } catch {
      continue
    }
  }
  return []
}

function templateExpressions(node, out) {
  if (!node) return out
  if (node.type === 5 && node.content?.content)
    out.push({ code: node.content.content, line: node.content.loc.start.line })
  for (const prop of node.props ?? []) {
    if (prop.type !== 7 || prop.name === 'for' || !prop.exp?.content) continue
    out.push({ code: prop.exp.content, line: prop.exp.loc.start.line })
  }
  for (const child of node.children ?? []) templateExpressions(child, out)
  return out
}

export function scanSource(text, file = 'file.ts') {
  if (!file.endsWith('.vue')) return parseScript(text, 0)
  const { descriptor } = parse(text, { filename: file })
  const found = []
  for (const block of [descriptor.script, descriptor.scriptSetup]) {
    if (!block) continue
    const typescript = /^tsx?$/.test(block.lang ?? '')
    found.push(...parseScript(block.content, block.loc.start.line - 1, typescript))
  }
  if (descriptor.template?.ast)
    for (const { code, line } of templateExpressions(descriptor.template.ast, []))
      found.push(...parseExpression(code, line - 1))
  return found
}

export function scan(pkgDir = PKG_DIR) {
  const banned = []
  let counted = 0
  const roots = new Set([...BANNED_ROOTS, ...COUNTED_ROOTS])
  for (const root of roots) {
    for (const file of listSources(join(pkgDir, root))) {
      const rel = relative(pkgDir, file)
      const found = scanSource(readFileSync(file, 'utf8'), file)
      if (BANNED_ROOTS.includes(root))
        for (const f of found)
          if (f.kind !== 'assertion')
            banned.push(`${rel}:${f.line} ${f.kind === 'as-never' ? 'as never' : 'as unknown as'}`)
      if (COUNTED_ROOTS.includes(root)) counted += found.length
    }
  }
  return { banned, counted }
}

export function verdict({ banned, counted }, max = MAX_ASSERTIONS) {
  const errors = []
  if (banned.length)
    errors.push(
      `${banned.length} assertion(s) that hide a type mismatch (as never, as unknown as); type the value instead:\n` +
        banned.map((b) => `  ${b}`).join('\n')
    )
  if (counted > max)
    errors.push(
      `${counted} type assertions in src, more than the ${max} allowed; type the new code instead of asserting it`
    )
  return { ok: errors.length === 0, errors, lower: counted < max }
}

function main() {
  const result = scan()
  const { ok, errors, lower } = verdict(result)
  if (!ok) {
    for (const e of errors) console.error(`✖ ${e}`)
    return 1
  }
  console.log(`✓ No as never or as unknown as; ${result.counted} type assertions in src.`)
  if (lower)
    console.log(
      `  The count fell below ${MAX_ASSERTIONS}: lower MAX_ASSERTIONS in scripts/check-assertions.mjs to ${result.counted}.`
    )
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exitCode = main()
