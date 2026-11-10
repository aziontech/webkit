import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PREFIX = '@aziontech/webkit/'
const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'migrations')
const SOURCE_EXT = /\.(vue|ts|tsx|js|jsx|mjs|cjs)$/
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.nuxt', '.output', 'coverage'])

export const SUPPORTED_VERSIONS = [6]

const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {})

export function loadMigration(version) {
  const base = readJson(join(MIGRATIONS_DIR, `v${version}.json`))
  return {
    components: base.components || {},
    removed: base.removed || {},
    props: readJson(join(MIGRATIONS_DIR, `v${version}-props.json`))
  }
}

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function renameSubpath(subpath, components) {
  for (const [from, rule] of Object.entries(components)) {
    if (subpath === from) return rule.to
  }
  for (const [from, rule] of Object.entries(components)) {
    const alreadyNew = subpath === rule.to || subpath.startsWith(`${rule.to}-`)
    if (subpath.startsWith(`${from}-`) && !alreadyNew) return rule.to + subpath.slice(from.length)
  }
  return subpath
}

function renameBinding(name, components) {
  for (const rule of Object.values(components)) {
    if (name === rule.from) return rule.binding
  }
  for (const rule of Object.values(components)) {
    const alreadyNew =
      name === rule.binding ||
      (name.startsWith(rule.binding) && /^[A-Z]/.test(name.slice(rule.binding.length)))
    const isChild = name.startsWith(rule.from) && /^[A-Z]/.test(name.slice(rule.from.length))
    if (isChild && !alreadyNew) return rule.binding + name.slice(rule.from.length)
  }
  return name
}

function webkitImports(source) {
  const out = []
  const re = /import\s+([\w$\s{},*]+?)\s+from\s+(['"])@aziontech\/webkit\/([^'"]+)\2/g
  for (const m of source.matchAll(re)) {
    const clause = m[1]
    const names = []
    const def = clause.match(/^\s*([A-Za-z_$][\w$]*)/)
    if (def) names.push(def[1])
    const named = clause.match(/\{([\s\S]*?)\}/)
    if (named) {
      for (const part of named[1].split(',')) {
        const local = part
          .trim()
          .split(/\s+as\s+/)
          .pop()
        if (local) names.push(local.trim())
      }
    }
    out.push({ subpath: m[3], names })
  }
  return out
}

function scanTag(source, start) {
  let quote = null
  let depth = 0
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1)
    } else if (ch === '>' && depth === 0) {
      return i
    }
  }
  return -1
}

function renameAttributes(attrs, rules) {
  let out = attrs
  for (const [oldProp, ruleSpec] of Object.entries(rules)) {
    const rule = typeof ruleSpec === 'string' ? { to: ruleSpec } : ruleSpec
    const forms = [...new Set([oldProp, kebab(oldProp)])]
    const toKebab = kebab(rule.to)
    const toModel = rule.to === 'modelValue'
    for (const form of forms) {
      const name = escapeRe(form)
      out = out.replace(
        new RegExp(`(\\s)v-model:${name}(?=[\\s=/>])`, 'g'),
        toModel ? '$1v-model' : `$1v-model:${toKebab}`
      )
      out = out.replace(
        new RegExp(`(\\s)(@|v-on:)update:${name}(?=[\\s=/>])`, 'g'),
        `$1$2update:${toKebab}`
      )
      const inverts = rule.values && rule.values.true === 'false' && rule.values.false === 'true'
      out = out.replace(
        new RegExp(`(\\s)(:|v-bind:)${name}(\\s*=\\s*)(["'])([^"']*)\\4`, 'g'),
        (all, sp, bind, eq, q, expr) =>
          inverts
            ? `${sp}${bind}${toKebab}${eq}${q}!(${expr})${q}`
            : `${sp}${bind}${toKebab}${eq}${q}${expr}${q}`
      )
      out = out.replace(
        new RegExp(`(\\s)${name}(\\s*=\\s*)(["'])([^"']*)\\3`, 'g'),
        (all, sp, eq, q, value) => {
          const mapped = rule.values && value in rule.values ? rule.values[value] : value
          if (rule.values && (mapped === 'true' || mapped === 'false')) {
            return `${sp}:${toKebab}${eq}${q}${mapped}${q}`
          }
          return `${sp}${toKebab}${eq}${q}${mapped}${q}`
        }
      )
      out = out.replace(new RegExp(`(\\s)${name}(?=[\\s/>]|$)`, 'g'), (all, sp) => {
        if (rule.values && 'true' in rule.values) return `${sp}:${toKebab}="${rule.values.true}"`
        return `${sp}${toKebab}`
      })
    }
  }
  return out
}

export function migrateSource(source, migration) {
  const { components, removed, props } = migration
  const changes = []
  const warnings = []
  const imports = webkitImports(source)
  if (!imports.length) return { source, changes, warnings }

  let out = source
  const bindingToSubpath = new Map()
  const identifierRenames = new Map()

  for (const imp of imports) {
    const next = renameSubpath(imp.subpath, components)
    if (removed[imp.subpath]) {
      warnings.push(`${PREFIX}${imp.subpath} was removed in v6: ${removed[imp.subpath]}`)
    }
    if (next !== imp.subpath) {
      const re = new RegExp(`(['"])${escapeRe(PREFIX + imp.subpath)}\\1`, 'g')
      out = out.replace(re, `$1${PREFIX}${next}$1`)
      changes.push(`${PREFIX}${imp.subpath} → ${PREFIX}${next}`)
      for (const name of imp.names) {
        const renamed = renameBinding(name, components)
        if (renamed !== name) identifierRenames.set(name, renamed)
      }
    }
    for (const name of imp.names) {
      bindingToSubpath.set(identifierRenames.get(name) || name, next)
    }
  }

  for (const [from, to] of identifierRenames) {
    out = out.replace(new RegExp(`(?<![\\w$.-])${escapeRe(from)}(?![\\w$])`, 'g'), to)
    out = out.replace(new RegExp(`(</?)${escapeRe(kebab(from))}(?=[\\s/>])`, 'g'), `$1${kebab(to)}`)
    changes.push(`${from} → ${to}`)
  }

  for (const [binding, subpath] of bindingToSubpath) {
    const rules = props[subpath]
    if (!rules) continue
    const tagRe = new RegExp(
      `<(${escapeRe(binding)}(?:\\.Root)?|${escapeRe(kebab(binding))})(?=[\\s/>])`,
      'g'
    )
    let result = ''
    let cursor = 0
    for (const m of out.matchAll(tagRe)) {
      const start = m.index + m[0].length
      if (start < cursor) continue
      const end = scanTag(out, start)
      if (end < 0) continue
      const attrs = out.slice(start, end)
      const renamed = renameAttributes(attrs, rules)
      result += out.slice(cursor, start) + renamed
      cursor = end
      if (renamed !== attrs) changes.push(`<${binding}> props: ${Object.keys(rules).join(', ')}`)
    }
    out = result + out.slice(cursor)
  }

  return { source: out, changes: [...new Set(changes)], warnings: [...new Set(warnings)] }
}

function sourceFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) sourceFiles(p, out)
    else if (SOURCE_EXT.test(name)) out.push(p)
  }
  return out
}

export function planMigrate(projectDir, { version = 6, dryRun = false } = {}) {
  if (!SUPPORTED_VERSIONS.includes(version)) {
    throw new Error(
      `No migration to v${version}. Supported: ${SUPPORTED_VERSIONS.map((v) => `v${v}`).join(', ')}`
    )
  }
  const migration = loadMigration(version)
  const results = []
  for (const file of sourceFiles(projectDir)) {
    const before = readFileSync(file, 'utf8')
    const { source, changes, warnings } = migrateSource(before, migration)
    if (!changes.length && !warnings.length) continue
    if (source !== before && !dryRun) writeFileSync(file, source)
    results.push({ file: relative(projectDir, file), changes, warnings })
  }
  return results
}
