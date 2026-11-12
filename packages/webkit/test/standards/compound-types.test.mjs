import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { exportTarget } from '../../scripts/lib/exports.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const pkg = JSON.parse(readFileSync(resolve(PKG, 'package.json'), 'utf8'))

const BRACES = /export\s+type\s*\{([^}]*)\}|export\s*\{([^}]*)\}/g

function listed(block) {
  return block
    .split(',')
    .map((s) => s.replace(/^\s*type\s+/, '').trim())
    .filter(Boolean)
    .map((s) =>
      s
        .split(/\s+as\s+/)
        .pop()
        .trim()
    )
}

export function exportedTypes(source) {
  const names = new Set()
  for (const m of source.matchAll(
    /^\s*export\s+(?:declare\s+)?(?:type|interface|enum)\s+([A-Za-z_$][\w$]*)/gm
  ))
    names.add(m[1])
  for (const m of source.matchAll(BRACES)) {
    if (m[1] !== undefined) for (const n of listed(m[1])) names.add(n)
  }
  return names
}

export function exportedNames(source) {
  const names = exportedTypes(source)
  for (const m of source.matchAll(BRACES)) {
    if (m[2] !== undefined) for (const n of listed(m[2])) names.add(n)
  }
  return names
}

function scripts(vue) {
  return [...vue.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n')
}

const SURFACE = [/\binterface\s+Props\b[^{]*/g, /\bdefine(?:Props|Emits|Slots|Model)\s*</g]

function balanced(source, from) {
  const open = source.indexOf('{', from)
  const angle = source.indexOf('(', from)
  if (open === -1 || (angle !== -1 && angle < open))
    return source.slice(from, angle === -1 ? from : angle)
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}' && --depth === 0) return source.slice(from, i + 1)
  }
  return source.slice(from)
}

export function publicSurface(script) {
  return SURFACE.flatMap((re) =>
    [...script.matchAll(re)].map((m) => balanced(script, m.index))
  ).join('\n')
}

export function localTypeImports(script) {
  const names = new Set()
  for (const m of script.matchAll(/import\s+(type\s+)?\{([^}]*)\}\s*from\s*'(\.[^']*)'/g)) {
    for (const part of m[2].split(',')) {
      const typeOnly = Boolean(m[1]) || /^\s*type\s+/.test(part)
      const name = part
        .replace(/^\s*type\s+/, '')
        .split(/\s+as\s+/)
        .pop()
        .trim()
      if (typeOnly && name) names.add(name)
    }
  }
  return names
}

export function surfaceTypes(script) {
  const surface = publicSurface(script)
  return [...localTypeImports(script)].filter((name) =>
    new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`).test(surface)
  )
}

function vueFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })
}

export function compounds(exportsMap) {
  const out = []
  for (const [key, entry] of Object.entries(exportsMap)) {
    const target = exportTarget(entry)
    if (!/^\.\/src\/components\/.+\/index\.ts$/.test(target)) continue
    const index = resolve(PKG, target)
    const root = exportsMap[`${key}-root`]
    if (root) {
      out.push({ key, index, root: resolve(PKG, exportTarget(root)) })
      continue
    }
    const source = existsSync(index) ? readFileSync(index, 'utf8') : ''
    const name = source.match(/^export\s+default\s+([A-Za-z_$][\w$]*)/m)?.[1]
    const from =
      name && source.match(new RegExp(`^import\\s+${name}\\s+from\\s+'(\\./[^']+\\.vue)'`, 'm'))
    if (from) out.push({ key, index, root: resolve(dirname(index), from[1]) })
  }
  return out
}

test('exportedTypes reads declarations and type-only lists, and skips value lists', () => {
  const names = exportedTypes(
    [
      'export interface TableColumn { id?: string }',
      "  export type SelectKind = 'a' | 'b'",
      "export type { SelectValue, Inner as Outer } from './injection-key'",
      "export { SelectOption } from './select-option.vue'"
    ].join('\n')
  )
  assert.deepEqual([...names].sort(), ['Outer', 'SelectKind', 'SelectValue', 'TableColumn'])
})

test('every type a compound root exports is re-exported by its compound index.ts', () => {
  const list = compounds(pkg.exports)
  assert.ok(list.some((c) => c.key === './table'))
  assert.ok(list.some((c) => c.key === './select'))
  const missing = []
  for (const { key, index, root } of list) {
    if (!existsSync(index) || !existsSync(root)) continue
    const fromRoot = exportedTypes(scripts(readFileSync(root, 'utf8')))
    const fromIndex = exportedNames(readFileSync(index, 'utf8'))
    for (const name of fromRoot) {
      if (name === 'Props') continue
      if (!fromIndex.has(name)) missing.push(`${key}: ${name} (exported by the root .vue)`)
    }
  }
  assert.deepEqual(missing, [])
})

test('surfaceTypes reads type imports a public declaration uses, and skips internal ones', () => {
  const script = [
    "import { selectContextKey, type SelectSize, type SelectContext } from './injection-key'",
    "import type { StepState } from './step'",
    'interface Props { size?: SelectSize }',
    "const emit = defineEmits<{ 'update:state': [value: StepState] }>()",
    'const ctx = inject(selectContextKey) as SelectContext'
  ].join('\n')
  assert.deepEqual(surfaceTypes(script).sort(), ['SelectSize', 'StepState'])
})

test('every type a compound part exports or types its props, events, slots or model with is re-exported by its index.ts', () => {
  const missing = []
  for (const { key, index, root } of compounds(pkg.exports)) {
    if (!existsSync(index) || !existsSync(root)) continue
    const fromIndex = exportedNames(readFileSync(index, 'utf8'))
    for (const file of vueFiles(dirname(root))) {
      const script = scripts(readFileSync(file, 'utf8'))
      const part = file.slice(dirname(root).length + 1)
      for (const name of exportedTypes(script)) {
        if (name !== 'Props' && !fromIndex.has(name))
          missing.push(`${key}: ${name} (exported by ${part})`)
      }
      for (const name of surfaceTypes(script)) {
        if (!fromIndex.has(name)) missing.push(`${key}: ${name} (types the API of ${part})`)
      }
    }
  }
  assert.deepEqual([...new Set(missing)], [])
})
