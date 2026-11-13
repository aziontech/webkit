import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PREFIX = '@aziontech/webkit/'
const CLI_DIR = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(CLI_DIR, 'migrations')
const PACKAGE_JSON = join(CLI_DIR, '..', '..', 'package.json')
const SUBPATH_LITERAL = /(['"`])@aziontech\/webkit\/([^'"`\s]+)\1/g
const SOURCE_EXT = /\.(vue|ts|tsx|js|jsx|mjs|cjs)$/
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.nuxt', '.output', 'coverage'])

export const SUPPORTED_VERSIONS = [6]

const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {})

function exportList() {
  const pkg = readJson(PACKAGE_JSON)
  if (!pkg.exports) return null
  return new Set(Object.keys(pkg.exports).map((key) => key.replace(/^\.\/?/, '')))
}

export function loadMigration(version) {
  const base = readJson(join(MIGRATIONS_DIR, `v${version}.json`))
  return {
    components: base.components || {},
    removed: base.removed || {},
    types: base.types || {},
    legacy: base.legacy || null,
    exports: exportList(),
    props: readJson(join(MIGRATIONS_DIR, `v${version}-props.json`))
  }
}

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function matchComponent(subpath, components) {
  for (const [from, rule] of Object.entries(components)) {
    if (subpath === from) return { from, rule }
  }
  for (const [from, rule] of Object.entries(components)) {
    const extendsFrom = rule.to.startsWith(`${from}-`)
    const alreadyNew = extendsFrom && (subpath === rule.to || subpath.startsWith(`${rule.to}-`))
    if (subpath.startsWith(`${from}-`) && !alreadyNew) return { from, rule }
  }
  return null
}

export function renameSubpath(subpath, components) {
  const match = matchComponent(subpath, components)
  return match ? match.rule.to + subpath.slice(match.from.length) : subpath
}

function renameBinding(name, rule) {
  if (name === rule.from) return rule.binding
  const extendsFrom = rule.binding.startsWith(rule.from) && rule.binding !== rule.from
  const alreadyNew =
    extendsFrom &&
    (name === rule.binding ||
      (name.startsWith(rule.binding) && /^[A-Z]/.test(name.slice(rule.binding.length))))
  const isChild = name.startsWith(rule.from) && /^[A-Z]/.test(name.slice(rule.from.length))
  return isChild && !alreadyNew ? rule.binding + name.slice(rule.from.length) : name
}

const stripType = (text) => text.replace(/^\s*type\s+(?=[\w${])/, '')

function webkitImports(source) {
  const out = []
  const re = /import\s+([\w$\s{},*]+?)\s+from\s+(['"])@aziontech\/webkit\/([^'"]+)\2/g
  for (const m of source.matchAll(re)) {
    const clause = stripType(m[1])
    const names = []
    const named = []
    const def = clause.match(/^\s*([A-Za-z_$][\w$]*)/)
    if (def) names.push(def[1])
    const braces = clause.match(/\{([\s\S]*?)\}/)
    if (braces) {
      for (const part of braces[1].split(',')) {
        const [imported, alias] = stripType(part.trim()).split(/\s+as\s+/)
        if (!imported) continue
        const local = (alias || imported).trim()
        names.push(local)
        named.push({ imported: imported.trim(), local })
      }
    }
    out.push({ subpath: m[3], names, named, statement: m[0] })
  }
  return out
}

function commentRanges(source) {
  const ranges = []
  const re = /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|(?:^|(?<=[\s;{}(),]))\/\/[^\n]*/gm
  for (const m of source.matchAll(re)) ranges.push([m.index, m.index + m[0].length])
  return ranges
}

function replaceOutsideComments(source, re, replace) {
  const ranges = commentRanges(source)
  const inComment = (i) => ranges.some(([start, end]) => i >= start && i < end)
  return source.replace(re, (...args) => {
    const offset = args.find((a) => typeof a === 'number')
    return inComment(offset) ? args[0] : replace(...args)
  })
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
    if (rule.removed) continue
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

function legacyFor(migration, fromMajor) {
  const { legacy } = migration
  if (!legacy || fromMajor == null || fromMajor > legacy.major) return null
  return legacy
}

function isExport(subpath, exports) {
  if (!exports) return true
  return exports.has(subpath) || exports.has(subpath.replace(/\.(vue|js|ts|css)$/, ''))
}

function resolveSubpath(subpath, migration, legacy, fromMajor) {
  const { components, removed, exports } = migration
  if (legacy && legacy.manual[subpath]) {
    return {
      next: subpath,
      manual: true,
      warning: `${PREFIX}${subpath} is a v${fromMajor} component with a different API in v6: ${legacy.manual[subpath]}`
    }
  }
  const base = (legacy && legacy.paths[subpath]) || subpath
  const match = matchComponent(base, components)
  const next = match ? match.rule.to + base.slice(match.from.length) : base
  if (removed[base]) {
    return { next, base, match, warning: `${PREFIX}${base} was removed in v6: ${removed[base]}` }
  }
  if (!isExport(next, exports)) {
    return {
      next,
      base,
      match,
      manual: true,
      warning: `${PREFIX}${next} is not an export of v6: find its replacement in the catalog (MIGRATION-v6.md)`
    }
  }
  return { next, base, match }
}

export function legacyMarkers(migration) {
  const { legacy, exports, components, removed } = migration
  if (!legacy) return new Set()
  const known = new Set([...(exports || []), ...Object.keys(components), ...Object.keys(removed)])
  return new Set(
    [...Object.keys(legacy.paths), ...Object.keys(legacy.manual)].filter((key) => !known.has(key))
  )
}

export function referencedSubpaths(source) {
  return new Set([...source.matchAll(SUBPATH_LITERAL)].map((m) => m[2]))
}

export function migrateSource(source, migration, { fromMajor = null } = {}) {
  const { props, types } = migration
  const changes = []
  const warnings = []
  const subpaths = referencedSubpaths(source)
  if (!subpaths.size) return { source, changes, warnings }

  const legacy = legacyFor(migration, fromMajor)
  const plan = new Map()
  for (const subpath of subpaths) {
    const resolved = resolveSubpath(subpath, migration, legacy, fromMajor)
    plan.set(subpath, resolved)
    if (resolved.warning) warnings.push(resolved.warning)
  }

  let out = source.replace(SUBPATH_LITERAL, (all, quote, subpath) => {
    const { next, manual } = plan.get(subpath)
    if (manual || next === subpath) return all
    changes.push(`${PREFIX}${subpath} → ${PREFIX}${next}`)
    return `${quote}${PREFIX}${next}${quote}`
  })

  const bindingToSubpath = new Map()
  const identifierRenames = new Map()
  const typeRenames = []
  for (const imp of webkitImports(source)) {
    const resolved = plan.get(imp.subpath)
    if (resolved.manual) continue
    const { next, match } = resolved
    if (match && next !== imp.subpath) {
      for (const name of imp.names) {
        const renamed = renameBinding(name, match.rule)
        if (renamed !== name) identifierRenames.set(name, renamed)
      }
    }
    for (const { imported, local } of imp.named) {
      const to = types[imported]
      if (!to || identifierRenames.has(local)) continue
      if (local === imported) identifierRenames.set(imported, to)
      else typeRenames.push([imported, to])
    }
    for (const name of imp.names) {
      bindingToSubpath.set(identifierRenames.get(name) || name, next)
    }
  }

  for (const [from, to] of typeRenames) {
    out = out.replace(
      new RegExp(`(\\{[^}]*?)(?<![\\w$])${escapeRe(from)}(?=\\s+as\\s)`, 'g'),
      (all, head) => `${head}${to}`
    )
    changes.push(`${from} → ${to}`)
  }

  for (const [from, to] of identifierRenames) {
    out = replaceOutsideComments(
      out,
      new RegExp(`(?<![\\w$.-])${escapeRe(from)}(?![\\w$])`, 'g'),
      () => to
    )
    out = replaceOutsideComments(
      out,
      new RegExp(`(</?)${escapeRe(kebab(from))}(?=[\\s/>])`, 'g'),
      (all, open) => `${open}${kebab(to)}`
    )
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
      for (const [prop, spec] of Object.entries(rules)) {
        if (typeof spec === 'string' || !spec.removed) continue
        const used = [...new Set([prop, kebab(prop)])].some((form) =>
          new RegExp(`\\s(?::|v-bind:)?${escapeRe(form)}(?=[\\s=/>]|$)`).test(attrs)
        )
        if (used)
          warnings.push(
            `${PREFIX}${subpath}: <${binding}> prop ${prop} was removed in v6: ${spec.removed}`
          )
      }
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

export function declaredMajor(projectDir) {
  const pkg = readJson(join(projectDir, 'package.json'))
  const range = {
    ...pkg.peerDependencies,
    ...pkg.devDependencies,
    ...pkg.dependencies
  }['@aziontech/webkit']
  const m = typeof range === 'string' && range.match(/(\d+)(?:\.[\dx*]+)*/)
  return m ? { range, major: Number(m[1]) } : null
}

export function planMigrate(projectDir, { version = 6, dryRun = false, fromMajor = null } = {}) {
  if (!SUPPORTED_VERSIONS.includes(version)) {
    throw new Error(
      `No migration to v${version}. Supported: ${SUPPORTED_VERSIONS.map((v) => `v${v}`).join(', ')}`
    )
  }
  const migration = loadMigration(version)
  const files = sourceFiles(projectDir).map((file) => ({
    file,
    before: readFileSync(file, 'utf8')
  }))
  const results = []

  let from = fromMajor
  const declared = declaredMajor(projectDir)
  if (from == null && declared && declared.major < version) from = declared.major
  if (from == null && migration.legacy) {
    const markers = legacyMarkers(migration)
    const marker = files
      .flatMap(({ before }) => [...referencedSubpaths(before)])
      .find((subpath) => markers.has(subpath))
    if (marker) {
      from = migration.legacy.major
      results.push({
        file: 'package.json',
        changes: [],
        warnings: [
          `${PREFIX}${marker} exists only in v${from}: treating the project as v${from} (pass --from to override)`
        ]
      })
    }
  }
  if (from != null && from < version - 1) {
    results.push({
      file: 'package.json',
      changes: [],
      warnings: [
        `the project is on @aziontech/webkit v${from}${declared ? ` (${declared.range})` : ''}; migrate v${version} rewrites v${version - 1} code, so every v${from} component whose API changed is listed as MANUAL`
      ]
    })
  }

  for (const { file, before } of files) {
    const { source, changes, warnings } = migrateSource(before, migration, { fromMajor: from })
    if (!changes.length && !warnings.length) continue
    if (source !== before && !dryRun) writeFileSync(file, source)
    results.push({ file: relative(projectDir, file), changes, warnings })
  }
  return results
}
