#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'vue/compiler-sfc'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = resolve(PKG, '../..')
const SRC = join(PKG, 'src/components')
const PREFIX = '@aziontech/webkit/'

export const SCANNED = [
  'packages/webkit/blocks',
  'packages/webkit/examples',
  'packages/webkit/src',
  'skills',
  'rules',
  'adapters'
]

export const VALUE_DEPRECATIONS = [
  { component: 'content/badge/badge.vue', prop: 'severity', value: 'default', use: 'neutral' },
  { component: 'feedback/skeleton/skeleton.vue', prop: 'kind', value: 'shape', use: 'rectangle' }
]

export const DOCUMENTED_DEPRECATIONS = [
  { file: 'packages/webkit/examples/select/multiple.vue', message: 'prop multiple' },
  {
    file: 'packages/webkit/src/components/content/console-mockup/widgets/edge-dns-dnssec-fragment.vue',
    message: 'prop focused'
  }
]

export const SAME_NAME_ATTRIBUTES = [
  { component: 'inputs/checkbox/checkbox.vue', prop: 'tabindex' }
]

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage', 'test', '__tests__'])
const TEST_FILE = /\.(test|spec)\.[cm]?[jt]sx?$/
const IDENT = /^[A-Za-z_$][\w$]*$/

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
const pascal = (s) => camel(s).replace(/^[a-z]/, (c) => c.toUpperCase())

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, test, out)
    else if (test(name)) out.push(p)
  }
  return out
}

function blockRange(source, marker) {
  const ranges = []
  let from = 0
  for (;;) {
    const at = source.indexOf(marker, from)
    if (at < 0) return ranges
    const open = source.indexOf('{', at)
    let depth = 0
    let end = open
    for (; end < source.length; end++) {
      if (source[end] === '{') depth++
      else if (source[end] === '}' && --depth === 0) break
    }
    ranges.push([open, end])
    from = end
  }
}

const DEPRECATED_DOC = /\/\*\*(?:(?!\*\/)[\s\S])*?@deprecated(?:(?!\*\/)[\s\S])*?\*\/\s*/g

export function deprecationsOfSource(source) {
  const out = {
    component: false,
    props: new Set(),
    models: new Set(),
    slots: new Set(),
    events: new Set(),
    members: new Set(),
    types: new Set()
  }
  const emits = blockRange(source, 'defineEmits<')
  const slots = blockRange(source, 'defineSlots<')
  const inside = (ranges, i) => ranges.some(([a, b]) => i > a && i < b)
  for (const m of source.matchAll(DEPRECATED_DOC)) {
    const at = m.index + m[0].length
    const rest = source.slice(at, at + 200)
    let hit
    if (/^defineOptions\(/.test(rest)) out.component = true
    else if ((hit = rest.match(/^(?:const|let)\s+\w+\s*=\s*defineModel<[^>]*>\(\s*'([\w-]+)'/)))
      out.models.add(camel(hit[1]))
    else if ((hit = rest.match(/^export\s+(?:type|interface)\s+([A-Za-z_$][\w$]*)/)))
      out.types.add(hit[1])
    else if (inside(slots, at) && (hit = rest.match(/^'?([\w-]+)'?\??\s*\(/))) out.slots.add(hit[1])
    else if (inside(emits, at) && (hit = rest.match(/^'?([\w:-]+)'?\s*:/))) out.events.add(hit[1])
    else if ((hit = rest.match(/^([A-Za-z_$][\w$]*)\?\s*:/))) out.props.add(hit[1])
    else if ((hit = rest.match(/^([A-Z][\w$]*)\s*:\s*typeof\b/))) out.members.add(hit[1])
  }
  return out
}

function resolveFile(base) {
  for (const candidate of [
    base,
    `${base}.vue`,
    `${base}.ts`,
    `${base}.js`,
    join(base, 'index.ts'),
    join(base, 'index.js')
  ]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

let exportsCache = null
function exportsMap() {
  if (!exportsCache) {
    const pkg = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'))
    exportsCache = new Map()
    for (const [key, value] of Object.entries(pkg.exports || {})) {
      const target = typeof value === 'string' ? value : value?.import || value?.default
      if (typeof target === 'string' && key.startsWith('./'))
        exportsCache.set(key.slice(2), resolve(PKG, target))
    }
  }
  return exportsCache
}

export function resolveSpecifier(spec, fromFile) {
  if (spec.startsWith(PREFIX)) return exportsMap().get(spec.slice(PREFIX.length)) || null
  if (spec.startsWith('.')) return resolveFile(resolve(dirname(fromFile), spec))
  return null
}

export function importBindings(script) {
  const out = []
  const re = /import\s+(?!type\s)([\w$\s{},*]+?)\s+from\s+(['"])([^'"]+)\2/g
  for (const m of script.matchAll(re)) {
    const clause = m[1]
    const def = clause.match(/^\s*([A-Za-z_$][\w$]*)/)
    if (def) out.push({ local: def[1], imported: 'default', spec: m[3] })
    const braces = clause.match(/\{([\s\S]*?)\}/)
    if (braces) {
      for (const part of braces[1].split(',')) {
        const [imported, alias] = part
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)
        if (imported && IDENT.test(imported.trim()))
          out.push({ local: (alias || imported).trim(), imported: imported.trim(), spec: m[3] })
      }
    }
  }
  return out
}

function typeImports(script) {
  const out = []
  const re = /import\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+(['"])([^'"]+)\3/g
  for (const m of script.matchAll(re)) {
    for (const part of m[2].split(',')) {
      const name = part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim()
      if (name && IDENT.test(name)) out.push({ name, spec: m[4] })
    }
  }
  return out
}

const compoundCache = new Map()
function compoundMembers(indexFile) {
  if (compoundCache.has(indexFile)) return compoundCache.get(indexFile)
  const source = readFileSync(indexFile, 'utf8')
  const locals = new Map()
  for (const b of importBindings(source)) {
    const file = resolveSpecifier(b.spec, indexFile)
    if (file) locals.set(b.local, file)
  }
  const members = new Map()
  for (const m of source.matchAll(/(?:^|[\s,{.])([A-Z][\w$]*)\s*[:=]\s*([A-Z][\w$]*)\b/g)) {
    if (locals.has(m[2])) members.set(m[1], locals.get(m[2]))
  }
  const root = [...locals.entries()].find(([, f]) => f.endsWith('.vue'))
  const rootLocal = source.match(/export\s+default\s+(?:Object\.assign\(\s*)?([A-Za-z_$][\w$]*)/)
  let rootFile = rootLocal && locals.get(rootLocal[1])
  if (!rootFile) {
    const assigned = source.match(/const\s+\w+\s*=\s*([A-Za-z_$][\w$]*)\s+as\b/)
    rootFile = (assigned && locals.get(assigned[1])) || (root && root[1]) || null
  }
  const entry = { members, rootFile }
  compoundCache.set(indexFile, entry)
  return entry
}

const deprecationCache = new Map()
export function deprecationsOf(file) {
  if (!file) return null
  if (deprecationCache.has(file)) return deprecationCache.get(file)
  const found = deprecationsOfSource(readFileSync(file, 'utf8'))
  for (const value of VALUE_DEPRECATIONS) {
    if (file === join(SRC, value.component)) (found.values ||= []).push(value)
  }
  for (const { component, prop } of SAME_NAME_ATTRIBUTES) {
    if (file === join(SRC, component)) found.props.delete(prop)
  }
  deprecationCache.set(file, found)
  return found
}

export function bindingTable(script, fromFile) {
  const table = new Map()
  for (const b of importBindings(script)) {
    const file = resolveSpecifier(b.spec, fromFile)
    if (file) table.set(b.local, file)
  }
  return table
}

function conventionFile(binding) {
  return exportsMap().get(kebab(binding)) || null
}

export function componentOf(tag, table) {
  const parts = tag.includes('.') ? tag.split('.') : [/-/.test(tag) ? pascal(tag) : tag]
  const head = parts[0]
  if (!/^[A-Z]/.test(head)) return null
  let file = table.get(head) || conventionFile(head)
  if (!file) return null
  if (parts.length === 1) {
    if (/index\.[jt]s$/.test(file)) return { file: compoundMembers(file).rootFile, index: file }
    return { file }
  }
  if (!/index\.[jt]s$/.test(file)) return null
  const { members } = compoundMembers(file)
  return { file: members.get(parts[1]) || null, index: file, member: parts[1] }
}

const attrName = (prop) => {
  if (prop.type === 6) return { kind: 'attr', name: prop.name, value: prop.value?.content }
  if (prop.type !== 7) return null
  const arg = prop.arg && prop.arg.isStatic ? prop.arg.content : null
  if (prop.name === 'bind' && arg) return { kind: 'bind', name: arg }
  if (prop.name === 'model') return { kind: 'model', name: arg || 'modelValue' }
  if (prop.name === 'on' && arg) return { kind: 'on', name: arg }
  if (prop.name === 'slot') return { kind: 'slot', name: arg || 'default' }
  return null
}

function elementFindings(node, table, report) {
  const target = componentOf(node.tag, table)
  if (target) {
    const member = Boolean(
      target.member && deprecationsOf(target.index)?.members.has(target.member)
    )
    if (member) report(node, `<${node.tag}> is a deprecated compound member`)
    const deps = deprecationsOf(target.file)
    if (deps) {
      if (deps.component && !member) report(node, `<${node.tag}> is a deprecated component`)
      for (const prop of node.props) {
        const a = attrName(prop)
        if (!a || a.kind === 'slot') continue
        const name = camel(a.name)
        if (a.kind === 'on') {
          const update = name.startsWith('update:') ? camel(name.slice(7)) : null
          if (deps.events.has(a.name) || deps.events.has(name))
            report(prop, `<${node.tag}> event @${a.name} is deprecated`)
          else if (update && (deps.models.has(update) || deps.props.has(update)))
            report(prop, `<${node.tag}> @update:${a.name.slice(7)} is deprecated`)
          continue
        }
        if (deps.props.has(name) || deps.models.has(name))
          report(
            prop,
            `<${node.tag}> ${a.kind === 'model' ? 'v-model:' : 'prop '}${a.name} is deprecated`
          )
        for (const v of deps.values || []) {
          if (v.prop === name && a.kind === 'attr' && a.value === v.value)
            report(prop, `<${node.tag}> ${a.name}="${v.value}" is deprecated, use "${v.use}"`)
        }
      }
      for (const child of node.children || []) {
        if (child.type !== 1 || child.tag !== 'template') continue
        for (const prop of child.props) {
          const a = attrName(prop)
          if (a?.kind === 'slot' && deps.slots.has(a.name))
            report(prop, `<${node.tag}> slot #${a.name} is deprecated`)
        }
      }
    }
  }
  for (const child of node.children || [])
    if (child.type === 1) elementFindings(child, table, report)
}

export function scanTemplate(templateAst, table, offset = 0) {
  const findings = []
  const report = (node, message) => findings.push({ line: node.loc.start.line + offset, message })
  for (const child of templateAst.children || [])
    if (child.type === 1) elementFindings(child, table, report)
  return findings
}

function scanTypes(script, file, lineOf) {
  const findings = []
  for (const { name, spec } of typeImports(script)) {
    const target = resolveSpecifier(spec, file)
    if (!target || !target.endsWith('.vue')) continue
    if (deprecationsOf(target)?.types.has(name))
      findings.push({ line: lineOf(name), message: `type ${name} is deprecated` })
  }
  return findings
}

export function scanVue(source, file) {
  const { descriptor } = parse(source, { filename: file })
  const script = [descriptor.script?.content, descriptor.scriptSetup?.content]
    .filter(Boolean)
    .join('\n')
  const table = bindingTable(script, file)
  const findings = descriptor.template?.ast ? scanTemplate(descriptor.template.ast, table) : []
  const lineOf = (name) => source.slice(0, Math.max(0, source.indexOf(name))).split('\n').length
  return [...findings, ...scanTypes(script, file, lineOf)]
}

const FENCE = /^([ \t]*)```(vue|html|template)\s*\n([\s\S]*?)^[ \t]*```/gm
const NEGATION = /\b(never|not|instead of|wrong|don't|do not|deprecated|renamed|was)\b|❌|✗/i

export function scanMarkdown(source, file) {
  const findings = []
  for (const m of source.matchAll(FENCE)) {
    const body = m[3]
      .split('\n')
      .map((line) => (line.startsWith(m[1]) ? line.slice(m[1].length) : line))
      .join('\n')
    const startLine = source.slice(0, m.index).split('\n').length
    const hasTemplate = /<template[\s>]/.test(body)
    const sfc = hasTemplate ? body : `<template>\n${body}\n</template>`
    let descriptor
    try {
      ;({ descriptor } = parse(sfc, { filename: file }))
    } catch {
      continue
    }
    if (!descriptor.template?.ast) continue
    const script = [descriptor.script?.content, descriptor.scriptSetup?.content]
      .filter(Boolean)
      .join('\n')
    const table = bindingTable(script, file)
    const offset = startLine - (hasTemplate ? 0 : 1)
    findings.push(...scanTemplate(descriptor.template.ast, table, offset))
  }
  return [...findings, ...scanProse(source)]
}

const MEMBER_REF = /\b([A-Z][\w$]*)\.([A-Z][\w$]*)\b/g

export function scanProse(source) {
  const findings = []
  const lines = source.split('\n')
  let fenced = false
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) fenced = !fenced
    if (fenced || NEGATION.test(line)) return
    for (const m of line.matchAll(MEMBER_REF)) {
      const file = conventionFile(m[1])
      if (!file || !/index\.[jt]s$/.test(file)) continue
      if (deprecationsOf(file)?.members.has(m[2]))
        findings.push({ line: i + 1, message: `${m[0]} is a deprecated compound member` })
    }
  })
  return findings
}

export function scanRepo(dirs = SCANNED) {
  const findings = []
  for (const dir of dirs) {
    const files = walk(
      join(REPO_ROOT, dir),
      (name) => (name.endsWith('.vue') || name.endsWith('.md')) && !TEST_FILE.test(name)
    )
    for (const file of files) {
      const source = readFileSync(file, 'utf8')
      const scan = file.endsWith('.md') ? scanMarkdown : scanVue
      const rel = relative(REPO_ROOT, file)
      for (const f of scan(source, file)) {
        const allowed = DOCUMENTED_DEPRECATIONS.some(
          (d) => d.file === rel && f.message.includes(d.message)
        )
        if (!allowed) findings.push({ file: rel, ...f })
      }
    }
  }
  return findings
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const findings = scanRepo()
  if (findings.length) {
    console.error(`Deprecated WebKit names used inside the repository (${findings.length}):`)
    for (const f of findings) console.error(`  ${f.file}:${f.line}  ${f.message}`)
    console.error(
      'Migrate each use to the replacement named in its @deprecated tag; blocks, examples and skills are what agents copy.'
    )
    process.exit(1)
  }
  console.log(
    'No deprecated WebKit names used in blocks, examples, src, skills, rules or adapters.'
  )
}
