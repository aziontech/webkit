#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'vue-eslint-parser'

const PKG = resolve(fileURLToPath(new URL('..', import.meta.url)))
const ROOT = resolve(PKG, '..', '..')
const DEFAULT_DIRS = ['blocks', 'examples']

const CAMEL_TO_KEBAB = new Map([
  ['ariaLabel', 'aria-label'],
  ['ariaLabelledby', 'aria-labelledby'],
  ['ariaDescribedby', 'aria-describedby']
])

const KEEP_CAMEL_ON = new Set(['ButtonGroup', 'button-group'])

const USAGE = `Usage: node scripts/kebab-aria-label.mjs [--write] [dir ...]

Rewrites camelCase accessible-name attributes in templates (ariaLabel=, :ariaLabel=,
v-bind:ariaLabel=, and the same for ariaLabelledby / ariaDescribedby) to the canonical kebab
form (aria-label=, :aria-label=). Vue maps the kebab attribute to the ariaLabel prop at runtime,
and IconButton's ariaLabel is optional in its types, so the kebab form type-checks in a fresh
create-vue app. ButtonGroup tags are left alone while its ariaLabel prop is still required.

Without --write it lists what it would change and exits 1 when anything would.
Default dirs (in packages/webkit): ${DEFAULT_DIRS.join(', ')}`

function* vueFiles(dir) {
  for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.vue') && !entry.parentPath.includes('node_modules'))
      yield join(entry.parentPath, entry.name)
  }
}

function* elements(node) {
  for (const child of node?.children ?? []) {
    if (child.type !== 'VElement') continue
    yield child
    yield* elements(child)
  }
}

function camelNameToken(attr) {
  if (!attr.directive) {
    const raw = attr.key?.rawName
    return CAMEL_TO_KEBAB.has(raw) ? { range: attr.key.range, raw } : null
  }
  if (attr.key?.name?.name !== 'bind') return null
  const argument = attr.key.argument
  if (argument?.type !== 'VIdentifier' || !CAMEL_TO_KEBAB.has(argument.rawName)) return null
  return { range: argument.range, raw: argument.rawName }
}

const blankScripts = (source) =>
  source.replace(
    /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g,
    (_, open, body, close) => open + body.replace(/[^\n]/g, ' ') + close
  )

export function rewrite(source) {
  const ast = parse(blankScripts(source), { sourceType: 'module', ecmaVersion: 2022 })
  const edits = []
  for (const element of elements(ast.templateBody)) {
    if (KEEP_CAMEL_ON.has(element.rawName)) continue
    for (const attr of element.startTag.attributes) {
      const token = camelNameToken(attr)
      if (!token) continue
      const [start, end] = token.range
      if (source.slice(start, end) !== token.raw) continue
      edits.push({ start, end, text: CAMEL_TO_KEBAB.get(token.raw), line: attr.loc.start.line })
    }
  }
  let output = source
  for (const edit of [...edits].sort((a, b) => b.start - a.start))
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end)
  return { output, edits }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const args = process.argv.slice(2)
  if (args.includes('--help')) {
    console.log(USAGE)
    process.exit(0)
  }
  const write = args.includes('--write')
  const dirs = args.filter((arg) => !arg.startsWith('--'))
  const targets = (dirs.length ? dirs.map((dir) => resolve(dir)) : DEFAULT_DIRS.map((dir) => join(PKG, dir)))
  let files = 0
  let total = 0
  for (const dir of targets) {
    for (const file of vueFiles(dir)) {
      const source = readFileSync(file, 'utf8')
      const { output, edits } = rewrite(source)
      if (!edits.length) continue
      files++
      total += edits.length
      const lines = edits.map((edit) => edit.line).join(', ')
      console.log(`${relative(ROOT, file)}: ${edits.length} (lines ${lines})`)
      if (write) writeFileSync(file, output)
    }
  }
  console.log(`${write ? 'rewrote' : 'would rewrite'} ${total} attribute(s) in ${files} file(s)`)
  if (!write && total > 0) process.exit(1)
}
