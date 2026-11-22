// Every ```vue and ```ts snippet in the shipped docs (READMEs, skills, rules, adapters, the
// package docs and the migration guide) is type-checked with vue-tsc as a file in a create-vue
// app that resolves @aziontech/webkit from this workspace, so a renamed prop, a removed export or a
// wrong import in a snippet fails here instead of in the app that copied it.
//
// What a snippet may leave out: the Vue API imports (ref, computed, ...) and the import of a
// WebKit component its template uses are added when missing. A template-only fragment has its
// free names (rows, form, ...) declared as any, so only the component API is checked; a snippet
// with a script is checked as written. Unused locals are allowed.
//
// What is skipped: a block under a counter-example heading (Wrong, Don't, Never, Anti-pattern),
// and a block marked `<!-- snippet: partial -->` in the comment or blank lines right above its
// fence (a line out of a larger file, the before half of a before/after pair). Keep them rare.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildDeclarations } from '../../scripts/build-js-dts.mjs'
import { exportTarget } from '../../scripts/lib/exports.mjs'
import { consumerTypeErrors } from '../copyable/consumer-app.mjs'

const PKG_DIR = fileURLToPath(new URL('../..', import.meta.url))
const REPO_ROOT = join(PKG_DIR, '..', '..')

export const PARTIAL_MARKER = '<!-- snippet: partial -->'
const LANGS = { vue: 'vue', ts: 'ts', typescript: 'ts' }

function markdownFiles(path) {
  if (!existsSync(path)) return []
  if (!statSync(path).isDirectory()) return path.endsWith('.md') ? [path] : []
  return readdirSync(path).flatMap((name) => markdownFiles(join(path, name)))
}

export const DOC_FILES = [
  'README.md',
  'packages/webkit/README.md',
  'packages/theme/README.md',
  'packages/icons/README.md',
  'packages/webkit/MIGRATION_V6.md',
  'packages/webkit/docs/GUIDELINES.md',
  'packages/webkit/docs/STYLEGUIDE.md',
  'packages/webkit/docs/toolkit',
  'skills',
  'rules',
  'adapters'
].flatMap((path) => markdownFiles(join(REPO_ROOT, path)))

function markedPartial(lines, fenceIndex) {
  for (let i = fenceIndex - 1; i >= 0 && /^\s*(<!--.*-->)?\s*$/.test(lines[i]); i--) {
    if (lines[i].trim() === PARTIAL_MARKER) return true
  }
  return false
}

const COUNTER_EXAMPLE_HEADING = /\b(wrong|don'?t|do not|never|incorrect|anti-?pattern)\b/i

export function snippets(text) {
  const out = []
  const lines = text.split('\n')
  let open = null
  let heading = ''
  lines.forEach((line, index) => {
    if (open === null && /^#{1,6}\s/.test(line)) heading = line
    const fence = line.match(/^(\s*)(```+|~~~+)\s*([\w-]*)/)
    if (!fence) {
      if (open) open.body.push(line)
      return
    }
    const [, indent, marker, info] = fence
    if (open === null) {
      open = {
        indent,
        marker,
        lang: LANGS[info.toLowerCase()],
        line: index + 1,
        marked: markedPartial(lines, index),
        partial: markedPartial(lines, index) || COUNTER_EXAMPLE_HEADING.test(heading),
        body: []
      }
    } else if (marker.startsWith(open.marker) && !info) {
      if (open.lang) {
        const code = open.body
          .map((row) => (row.startsWith(open.indent) ? row.slice(open.indent.length) : row))
          .join('\n')
        const { lang, line: start, marked, partial } = open
        out.push({ lang, line: start, end: index + 1, marked, partial, code })
      }
      open = null
    } else {
      open.body.push(line)
    }
  })
  return out
}

const VUE_VALUES = [
  'computed',
  'h',
  'inject',
  'nextTick',
  'onMounted',
  'onScopeDispose',
  'onUnmounted',
  'provide',
  'reactive',
  'readonly',
  'ref',
  'shallowRef',
  'toRef',
  'toValue',
  'useAttrs',
  'useId',
  'useSlots',
  'useTemplateRef',
  'watch',
  'watchEffect'
]
const VUE_TYPES = ['ComputedRef', 'InjectionKey', 'MaybeRefOrGetter', 'Ref']

const catalog = JSON.parse(readFileSync(join(PKG_DIR, 'catalog.json'), 'utf8'))
const pascal = (subpath) =>
  subpath
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
const WEBKIT_TAGS = new Map(
  Object.keys(catalog.imports).map((subpath) => [pascal(subpath), subpath])
)

const declares = (code, name) =>
  new RegExp(
    `(import[^;]*\\b${name}\\b[^;]*from|\\b(const|let|function|type|interface|class)\\s+${name}\\b)`
  ).test(code)

function missingImports(script, template) {
  const uses = (name) => new RegExp(`(?<![\\w.])${name}\\b`).test(script)
  const lines = []
  const values = VUE_VALUES.filter((name) => uses(name) && !declares(script, name))
  const types = VUE_TYPES.filter((name) => uses(name) && !declares(script, name))
  if (values.length) lines.push(`import { ${values.join(', ')} } from 'vue'`)
  if (types.length) lines.push(`import type { ${types.join(', ')} } from 'vue'`)
  const tags = new Set([...template.matchAll(/<([A-Z][A-Za-z]*)\b/g)].map((match) => match[1]))
  for (const tag of tags) {
    if (WEBKIT_TAGS.has(tag) && !declares(script, tag)) {
      lines.push(`import ${tag} from '@aziontech/webkit/${WEBKIT_TAGS.get(tag)}'`)
    }
  }
  return lines.join('\n')
}

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/

export function asFixture({ lang, code }) {
  if (lang === 'ts') {
    const prelude = missingImports(code, '')
    return { ext: 'ts', loose: false, source: `${prelude}\n${code}\nexport {}\n` }
  }
  const sfc = /^\s*<(script|template)\b/m.test(code) ? code : `<template>\n${code}\n</template>\n`
  const script = sfc.match(SCRIPT)
  const template = sfc.replace(SCRIPT, '')
  if (!script) {
    const prelude = missingImports('', template)
    return {
      ext: 'vue',
      loose: true,
      source: `<script setup lang="ts">\n${prelude}\n</script>\n${sfc}`
    }
  }
  if (!/lang="ts"/.test(script[1])) return { ext: 'vue', loose: false, source: sfc }
  const prelude = missingImports(script[2], template)
  return {
    ext: 'vue',
    loose: false,
    source: sfc.replace(
      SCRIPT,
      (_, attrs, body) => `<script${attrs}>\n${prelude}\n${body}</script>`
    )
  }
}

const all = DOC_FILES.flatMap((file) =>
  snippets(readFileSync(file, 'utf8')).map((snippet) => ({
    ...snippet,
    where: `${relative(REPO_ROOT, file)}:${snippet.line}`
  }))
)

test('the shipped docs carry Vue and TypeScript snippets to check', () => {
  assert.ok(all.length > 50, `expected snippets, found ${all.length}`)
})

test('partial snippets stay rare', () => {
  const partial = all.filter((snippet) => snippet.marked)
  assert.ok(
    partial.length <= Math.ceil(all.length * 0.25),
    `${partial.length} of ${all.length} snippets are marked partial`
  )
})

const require = createRequire(import.meta.url)
const VUE_ROUTER = dirname(require.resolve('vue-router/package.json'))
const ICONS_TYPES = join(REPO_ROOT, 'packages', 'icons', 'dist', 'index.d.ts')
const APP_ENV = []
const JS_ENTRY_PATHS = {}

// A JS entry (`@aziontech/webkit/vite-plugin`) gets its declarations at pack time, from its
// JSDoc; emit them for the entries the snippets import so the checkout resolves them typed.
function declareJsEntries(dir) {
  const exportsMap = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8')).exports
  const used = new Set(
    all.flatMap(({ code }) =>
      [...code.matchAll(/['"]@aziontech\/webkit\/([\w/-]+)['"]/g)].map((m) => m[1])
    )
  )
  const entries = [...used]
    .map((sub) => [sub, exportTarget(exportsMap[`./${sub}`] ?? '')])
    .filter(([, target]) => target.startsWith('./src/') && target.endsWith('.js'))
  if (!entries.length) return
  const { out } = buildDeclarations(entries.map(([, target]) => join(PKG_DIR, target)))
  const typesDir = join(dir, 'js-types')
  for (const [file, text] of out) {
    const dest = join(typesDir, relative(join(PKG_DIR, 'src'), file))
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, text)
  }
  for (const [sub, target] of entries) {
    JS_ENTRY_PATHS[`@aziontech/webkit/${sub}`] = [
      join(typesDir, relative('./src', target).replace(/\.js$/, '.d.ts'))
    ]
  }
}

const FREE_NAME = [
  /error TS(?:2304|2552): Cannot find name '(\w+)'/,
  /error TS(?:2339|2551): Property '(\w+)' does not exist on type '(?:\{ |ComponentPublicInstance<)/
]

const APP_IMPORT =
  /\bimport\s+(type\s+)?(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*['"]((?:\.\/|@\/)[^'"]+)['"]/g

function writeAppStubs(group, dir) {
  const stubs = new Map()
  for (const { fixture } of group) {
    for (const [, typeOnly, defaultName, named, specifier] of fixture.source.matchAll(APP_IMPORT)) {
      const path = join(dir, specifier.replace(/^@\//, 'app/').replace(/^\.\//, ''))
      const stub = stubs.get(path) ?? { default: false, values: new Set(), types: new Set() }
      if (defaultName) stub.default = true
      for (const part of (named ?? '')
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)) {
        const [, isType, name] = part.match(/^(type\s+)?(\w+)/)
        ;(typeOnly || isType ? stub.types : stub.values).add(name)
      }
      stubs.set(path, stub)
    }
  }
  for (const [path, stub] of stubs) {
    mkdirSync(dirname(path), { recursive: true })
    if (path.endsWith('.vue')) {
      writeFileSync(path, '<template><slot /></template>\n')
      continue
    }
    const lines = [
      ...[...stub.values].map((name) => `export const ${name}: any = undefined`),
      ...[...stub.types].map((name) => `export type ${name} = any`),
      ...(stub.default ? ['export default undefined as any'] : []),
      'export {}'
    ]
    writeFileSync(`${path}.ts`, `${lines.join('\n')}\n`)
  }
}

function runGroup(group, dir, prefix) {
  writeAppStubs(group, dir)
  const where = new Map()
  const files = group.map((entry, index) => {
    const name = `${prefix}-${index}.${entry.fixture.ext}`
    writeFileSync(join(dir, name), entry.fixture.source)
    where.set(name, entry)
    return join(dir, name)
  })
  const errors = consumerTypeErrors([...files, ...APP_ENV], {
    noUnusedLocals: false,
    noUnusedParameters: false,
    paths: { ...JS_ENTRY_PATHS, 'vue-router': [VUE_ROUTER], '@/*': [join(dir, 'app', '*')] }
  })
  return errors.map((line) => {
    const name = line.match(new RegExp(`${prefix}-\\d+\\.(?:vue|ts)`))?.[0]
    return { line, name, entry: where.get(name) }
  })
}

const declareFree = (source, names) =>
  source.replace(
    /<script setup lang="ts">\n/,
    (open) => `${open}${[...names].map((name) => `declare const ${name}: any`).join('\n')}\n`
  )

function typeErrors(group, dir, loose) {
  if (!group.length) return []
  const prefix = loose ? 'fragment' : 'snippet'
  const free = group.map(() => new Set())
  let current = group
  let results = runGroup(current, dir, prefix)
  for (let pass = 0; loose && pass < 3; pass++) {
    let added = 0
    for (const { line, entry } of results) {
      const name = FREE_NAME.map((pattern) => line.match(pattern)?.[1]).find(Boolean)
      const index = current.indexOf(entry)
      if (index < 0 || !name || free[index].has(name)) continue
      free[index].add(name)
      added++
    }
    if (!added) break
    current = group.map((entry, index) => ({
      ...entry,
      fixture: { ...entry.fixture, source: declareFree(entry.fixture.source, free[index]) }
    }))
    results = runGroup(current, dir, prefix)
  }
  return results.map(({ line, name, entry }) =>
    entry ? `${entry.snippet.where} ${line.slice(line.indexOf(name))}` : line
  )
}

test('every Vue and TypeScript snippet in the shipped docs type-checks in a consumer app', () => {
  const checked = all
    .filter((snippet) => !snippet.partial)
    .map((snippet) => ({ snippet, fixture: asFixture(snippet) }))
  const dir = mkdtempSync(join(PKG_DIR, 'test', 'docs', '.snippets-'))
  try {
    if (!existsSync(ICONS_TYPES)) {
      writeFileSync(join(dir, 'icons.d.ts'), "declare module '@aziontech/icons' {}\n")
      APP_ENV.push(join(dir, 'icons.d.ts'))
    }
    declareJsEntries(dir)
    const strictDir = join(dir, 'strict')
    const looseDir = join(dir, 'loose')
    mkdirSync(strictDir)
    mkdirSync(looseDir)
    const errors = [
      ...typeErrors(
        checked.filter(({ fixture }) => !fixture.loose),
        strictDir,
        false
      ),
      ...typeErrors(
        checked.filter(({ fixture }) => fixture.loose),
        looseDir,
        true
      )
    ]
    assert.deepEqual(
      errors,
      [],
      `${errors.length} type error(s) in doc snippets (fix the snippet, or mark a deliberately partial one with ${PARTIAL_MARKER}):\n${errors.join('\n')}`
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

const COUNTER_EXAMPLE_LINE = /❌|\b(never|wrong|flag|blocked|do not|don't|does not match)\b/i

test('every @aziontech/webkit import in the shipped docs is a real export', () => {
  const exportsMap = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8')).exports
  const missing = []
  for (const file of DOC_FILES) {
    const text = readFileSync(file, 'utf8')
    const partial = snippets(text).filter((snippet) => snippet.partial)
    text.split('\n').forEach((line, index) => {
      if (COUNTER_EXAMPLE_LINE.test(line)) return
      if (partial.some((snippet) => index + 1 > snippet.line && index + 1 < snippet.end)) return
      for (const [, subpath] of line.matchAll(
        /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]@aziontech\/webkit\/([\w./-]+)['"]/g
      )) {
        if (!(`./${subpath}` in exportsMap)) {
          missing.push(`${relative(REPO_ROOT, file)}:${index + 1} ${subpath}`)
        }
      }
    })
  }
  assert.deepEqual(missing, [], 'imports of paths that are not in package.json#exports')
})

test('every default import of a webkit path in the shipped docs is bound to its PascalCase name', () => {
  const wrong = []
  for (const file of DOC_FILES) {
    const text = readFileSync(file, 'utf8')
    const partial = snippets(text).filter((snippet) => snippet.partial)
    text.split('\n').forEach((line, index) => {
      if (COUNTER_EXAMPLE_LINE.test(line)) return
      if (partial.some((snippet) => index + 1 > snippet.line && index + 1 < snippet.end)) return
      for (const [, binding, subpath] of line.matchAll(
        /\bimport\s+([A-Z]\w*)\s*(?:,\s*\{[^}]*\}\s*)?from\s*['"]@aziontech\/webkit\/([\w-]+)['"]/g
      )) {
        if (binding !== pascal(subpath)) {
          wrong.push(`${relative(REPO_ROOT, file)}:${index + 1} ${binding} from ${subpath}`)
        }
      }
    })
  }
  assert.deepEqual(
    wrong,
    [],
    'bind the import as the PascalCase of its subpath (table-root -> TableRoot)'
  )
})
