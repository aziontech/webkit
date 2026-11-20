import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrateTokens } from './migrate-tokens.js'

const PREFIX = '@aziontech/webkit/'
const CLI_DIR = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(CLI_DIR, 'migrations')
const PACKAGE_JSON = join(CLI_DIR, '..', '..', 'package.json')
const SUBPATH_LITERAL = /(['"`])@aziontech\/webkit\/([^'"`\s]+)\1/g
const SOURCE_EXT = /\.(vue|ts|tsx|js|jsx|mjs|cjs|css|scss|html)$/
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.nuxt', '.output', 'coverage'])

export const SUPPORTED_VERSIONS = [6]
export const REVIEW_WARNING = /migrate cannot read/

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
    named: base.named || {},
    members: base.members || {},
    attached: base.attached || {},
    legacy: base.legacy || null,
    exports: exportList(),
    props: readJson(join(MIGRATIONS_DIR, `v${version}-props.json`)),
    icons: readJson(join(MIGRATIONS_DIR, `v${version}-icons.json`)),
    tokens: readJson(join(MIGRATIONS_DIR, `v${version}-tokens.json`)),
    lint: readJson(join(MIGRATIONS_DIR, `v${version}-lint.json`)),
    blocks: readJson(join(MIGRATIONS_DIR, `v${version}-blocks.json`)),
    testids: readJson(join(MIGRATIONS_DIR, `v${version}-testids.json`))
  }
}

const TEST_FILE = /(\.(test|spec|cy|e2e)\.[cm]?[jt]sx?$)|(^|\/)(e2e|cypress|playwright|tests?)\//

export function migrateTestIds(source, testids = {}) {
  const keys = Object.keys(testids).sort((a, b) => b.length - a.length)
  if (!keys.length) return { source, changes: [] }
  const re = new RegExp(`(?<=['"\`])(${keys.map(escapeRe).join('|')})(?=['"\`]|__)`, 'g')
  const seen = new Set()
  const out = source.replace(re, (id) => {
    seen.add(`data-testid "${id}" → "${testids[id]}"`)
    return testids[id]
  })
  return { source: out, changes: [...seen] }
}

const ICON_PAIR = /(?<![\w-])pi(\s+)(pi-[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/g
const ICON_TOKEN = /(?<![\w-])pi-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g
const AZION_PAIR = /(?<![\w-])(ai-color|ai-cor|ai)(\s+|\.)(ai-[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/g
const AZION_TOKEN = /(?<![\w-])ai-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g
const COLOR_BASE = /(?<![\w-])(ai-color|ai-cor)(?![\w-])/g

const nextName = (name) => `az-${name.slice(3)}`

function migrateAzionIcons(source, icons, { fromMajor, declaredMajor }) {
  const { base = {}, azionicons = {}, color = {} } = icons
  const changes = []
  const warnings = []
  if (!source.includes('ai-')) return { source, changes, warnings }
  let out = source.replace(AZION_PAIR, (all, from, glue, name) => {
    const to = base[from]
    if (!to) return all
    if (from !== 'ai') {
      const next = color[name] || nextName(name)
      changes.push(`${from} ${name} → ${to} ${next}`)
      return `${to}${glue}${next}`
    }
    const rule = azionicons[name]
    let next = typeof rule === 'string' ? rule : nextName(name)
    if (rule && typeof rule === 'object') {
      if (fromMajor != null && fromMajor < rule.before) next = rule.to
      else if (declaredMajor == null || declaredMajor < rule.before) {
        warnings.push(
          `Azion icon ai ${name}: ${rule.note}; write ${to} ${rule.to} if it is the brand mark`
        )
      }
    }
    changes.push(`ai ${name} → ${to} ${next}`)
    return `${to}${glue}${next}`
  })
  out = out.replace(COLOR_BASE, (from) => {
    if (!base[from]) return from
    changes.push(`${from} → ${base[from]}`)
    return base[from]
  })
  for (const [name] of out.matchAll(AZION_TOKEN)) {
    const rule = name in azionicons ? azionicons[name] : color[name]
    if (typeof rule !== 'string') continue
    warnings.push(
      `Azion icon class ${name} outside an "ai ${name}" pair: rewrite it to ${rule} by hand`
    )
  }
  return { source: out, changes, warnings }
}

export function migrateIcons(source, icons = {}, { fromMajor = null, declaredMajor = null } = {}) {
  const azion = migrateAzionIcons(source, icons, { fromMajor, declaredMajor })
  const primeicons = icons.primeicons || {}
  const changes = [...azion.changes]
  const warnings = [...azion.warnings]
  const done = () => ({
    source: out,
    changes: [...new Set(changes)],
    warnings: [...new Set(warnings)]
  })
  let out = azion.source
  if (!out.includes('pi-')) return done()
  out = out.replace(ICON_PAIR, (all, space, name) => {
    const rule = primeicons[name]
    if (typeof rule !== 'string') return all
    changes.push(`pi ${name} → az ${rule}`)
    return `az${space}${rule}`
  })
  for (const [name] of out.matchAll(ICON_TOKEN)) {
    const rule = primeicons[name]
    if (!rule) continue
    warnings.push(
      typeof rule === 'string'
        ? `PrimeIcons class ${name} outside a "pi ${name}" pair: rewrite it to az ${rule} by hand`
        : `PrimeIcons class ${name} has no Azion icon: ${rule.removed}`
    )
  }
  return done()
}

const LINT_RULE = /(?<![\w@/.-])webkit\/[a-z][a-z0-9-]*(?![\w-])/g

export function migrateLintRules(source, lint = {}) {
  const changes = []
  if (!source.includes('webkit/')) return { source, changes }
  const out = source.replace(LINT_RULE, (id) => {
    const next = lint[id]
    if (typeof next !== 'string') return id
    changes.push(`${id} → ${next}`)
    return next
  })
  return { source: out, changes: [...new Set(changes)] }
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
  if (!rule.from || !rule.binding) return name
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

function renameEvent(attrs, from, to) {
  const name = escapeRe(from)
  return attrs.replace(
    new RegExp(`(\\s)(@|v-on:)${name}(?=[\\s=/>.]|$)`, 'g'),
    (all, sp, on) => `${sp}${on}${to}`
  )
}

function outsideQuotes(text, fn) {
  return text
    .split(/("[^"]*"|'[^']*')/)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join('')
}

function mapLiteral(expr, values) {
  const m = expr.trim().match(/^(['`])([a-z][a-z0-9-]*)\1$/)
  if (!m) return null
  const [, q, v] = m
  if (!Object.hasOwn(values, v) || /^(true|false)$/.test(values[v])) return expr
  return expr.replace(`${q}${v}${q}`, `${q}${values[v]}${q}`)
}

const STRING_LITERAL = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g

export function boundValueKind(expr, values) {
  const literals = [...expr.matchAll(STRING_LITERAL)]
  if (!literals.length) return 'opaque'
  const old = (v) => Object.hasOwn(values, v) && values[v] !== v && !/^(true|false)$/.test(v)
  const dynamic = literals.some(([, q, v]) => q === '`' && v.includes('${'))
  return dynamic || literals.some(([, , v]) => old(v)) ? 'old' : 'current'
}

const MIGRATE_OK = 'webkit-migrate-ok'

function acknowledged(source, index) {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1
  const previous = source.lastIndexOf('\n', lineStart - 2) + 1
  return source.slice(previous, index).includes(MIGRATE_OK)
}

function renameAttributes(attrs, rules, onManual = () => {}) {
  let out = attrs
  for (const [oldProp, ruleSpec] of Object.entries(rules)) {
    if (oldProp.startsWith('#')) continue
    if (oldProp.startsWith('@')) {
      if (typeof ruleSpec === 'string') out = renameEvent(out, oldProp.slice(1), ruleSpec)
      continue
    }
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
        new RegExp(`(\\s)(:|v-bind:)${name}(\\s*=\\s*)(?:(")([^"]*)"|(')([^']*)')`, 'g'),
        (all, sp, bind, eq, dq, dv, sq, sv) => {
          const q = dq || sq
          const expr = dq ? dv : sv
          if (inverts) return `${sp}${bind}${toKebab}${eq}${q}!(${expr})${q}`
          let next = expr
          if (rule.values) {
            const literal = mapLiteral(expr, rule.values)
            if (literal !== null) next = literal
            else onManual(oldProp, expr, boundValueKind(expr, rule.values))
          }
          return `${sp}${bind}${toKebab}${eq}${q}${next}${q}`
        }
      )
      out = out.replace(
        new RegExp(`(\\s)${name}(\\s*=\\s*)(?:(")([^"]*)"|(')([^']*)')`, 'g'),
        (all, sp, eq, dq, dv, sq, sv) => {
          const q = dq || sq
          const value = dq ? dv : sv
          if (rule.moves && Object.hasOwn(rule.moves, value))
            return `${sp}${kebab(rule.moves[value])}${eq}${q}${value}${q}`
          if (rule.expand && Object.hasOwn(rule.expand, value))
            return `${sp}${Object.entries(rule.expand[value])
              .map(([prop, next]) => `${kebab(prop)}${eq}${q}${next}${q}`)
              .join(' ')}`
          const mapped = rule.values && value in rule.values ? rule.values[value] : value
          if (rule.values && (mapped === 'true' || mapped === 'false')) {
            return `${sp}:${toKebab}${eq}${q}${mapped}${q}`
          }
          return `${sp}${toKebab}${eq}${q}${mapped}${q}`
        }
      )
      out = outsideQuotes(out, (part) =>
        part.replace(new RegExp(`(\\s)${name}(?=[\\s/>]|$)`, 'g'), (all, sp) => {
          if (rule.values && 'true' in rule.values) return `${sp}:${toKebab}="${rule.values.true}"`
          return `${sp}${toKebab}`
        })
      )
    }
  }
  return out
}

const VOID_ELEMENTS = new Set(
  'area base br col embed hr img input link meta param source track wbr'.split(' ')
)
const SLOT_NAME = (name) => new RegExp(`(\\s)(#|v-slot:)${escapeRe(name)}(?=[\\s=/>]|$)`, 'g')

function renameChildSlots(source, from, slots) {
  const edits = []
  let depth = 0
  let i = from
  while (i < source.length) {
    const lt = source.indexOf('<', i)
    if (lt < 0) break
    if (source.startsWith('<!--', lt)) {
      const close = source.indexOf('-->', lt)
      i = close < 0 ? source.length : close + 3
      continue
    }
    const closing = source[lt + 1] === '/'
    const m = source.slice(lt + (closing ? 2 : 1)).match(/^[A-Za-z][\w.:-]*/)
    if (!m) {
      i = lt + 1
      continue
    }
    if (closing) {
      if (depth === 0) break
      depth -= 1
      i = lt + 2 + m[0].length
      continue
    }
    const nameEnd = lt + 1 + m[0].length
    const end = scanTag(source, nameEnd)
    if (end < 0) break
    const selfClosing = source[end - 1] === '/'
    if (depth === 0 && m[0] === 'template') {
      let attrs = source.slice(nameEnd, end)
      const before = attrs
      for (const [oldSlot, newSlot] of slots) {
        attrs = attrs.replace(SLOT_NAME(oldSlot), (all, sp, sigil) => `${sp}${sigil}${newSlot}`)
      }
      if (attrs !== before) edits.push([nameEnd, end, attrs])
    }
    if (!selfClosing && !VOID_ELEMENTS.has(m[0].toLowerCase())) depth += 1
    i = end + 1
  }
  return edits
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
      warning: `${PREFIX}${next} is not an export of v6: find its replacement in the catalog (MIGRATION_V6.md)`
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

function addStandaloneImports(source, moved) {
  if (!moved.length) return source
  let out = source
  const imported = new Set(webkitImports(out).flatMap((imp) => imp.names))
  for (const binding of new Set(moved.map((m) => m.binding))) {
    const own = webkitImports(out).find((imp) => imp.names.includes(binding))
    if (!own) continue
    const lines = moved
      .filter((m) => m.binding === binding && !imported.has(m.local))
      .map((m) => m.subpath)
      .filter((subpath, i, all) => all.indexOf(subpath) === i)
      .sort()
      .map((subpath) => {
        imported.add(pascalCase(subpath))
        return `import ${pascalCase(subpath)} from '${PREFIX}${subpath}'`
      })
    const at = out.indexOf(own.statement)
    const lineStart = out.lastIndexOf('\n', at) + 1
    const indent = out.slice(lineStart, at).match(/^[ \t]*/)[0]
    const end = at + own.statement.length
    const newline = out.indexOf('\n', end)
    const lineEnd = newline < 0 ? out.length : newline
    const insert = lines.map((line) => `\n${indent}${line}`).join('')
    out = out.slice(0, lineEnd) + insert + out.slice(lineEnd)
    const rest = out.slice(0, lineStart) + out.slice(lineEnd)
    const name = escapeRe(binding)
    const code = rest
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(new RegExp(`(["'])(?!${name}\\1)[^"'\\n]*\\1`, 'g'), '""')
    const stillUsed =
      new RegExp(`(?<![\\w$.-])${name}(?![\\w$])`).test(code) ||
      new RegExp(`</?(${name}|${escapeRe(kebab(binding))})(?=[\\s/>.])`).test(rest)
    if (stillUsed) continue
    if (own.names.length === 1) {
      out = out.slice(0, lineStart) + out.slice(lineEnd + 1)
    } else {
      const statement = own.statement.replace(
        new RegExp(`^import\\s+${escapeRe(binding)}\\s*,\\s*`),
        'import '
      )
      out = out.slice(0, at) + statement + out.slice(end)
    }
  }
  return out
}

function lineOfStatement(source, statement) {
  const at = source.indexOf(statement)
  const start = source.lastIndexOf('\n', at) + 1
  const newline = source.indexOf('\n', at + statement.length)
  const end = newline < 0 ? source.length : newline + 1
  const alone =
    /^[ \t]*$/.test(source.slice(start, at)) &&
    /^;?[ \t]*\r?\n?$/.test(source.slice(at + statement.length, end))
  return { at, start, end, alone }
}

function insideEveryTime(source, childRe, parentRe) {
  const events = [
    ...[...source.matchAll(parentRe)].map((m) => ({ m, parent: true })),
    ...[...source.matchAll(childRe)].map((m) => ({ m, parent: false }))
  ].sort((a, b) => a.m.index - b.m.index)
  let depth = 0
  for (const { m, parent } of events) {
    const closing = m[1] === '/'
    if (!parent) {
      if (depth <= 0) return false
      continue
    }
    if (closing) depth -= 1
    else if (source[scanTag(source, m.index + m[0].length) - 1] !== '/') depth += 1
  }
  return true
}

export function attachToCompound(source, attached = {}) {
  let out = source
  const changes = []
  for (const [subpath, { root, member }] of Object.entries(attached)) {
    const imports = webkitImports(out)
    const own = imports.find((imp) => imp.subpath === subpath)
    if (!own || own.named.length || own.names.length !== 1) continue
    const local = own.names[0]
    const rootImport = imports.find(
      (imp) => imp.subpath === root && imp.names.length > imp.named.length
    )
    const parent = rootImport ? rootImport.names[0] : pascalCase(root)
    const tag = (name) =>
      new RegExp(`<(/?)(${escapeRe(name)}|${escapeRe(kebab(name))})(?=[\\s/>])`, 'g')
    const childRe = tag(local)
    const line = lineOfStatement(out, own.statement)
    if (!line.alone) continue
    const rest = (out.slice(0, line.start) + out.slice(line.end))
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(childRe, '')
    if (new RegExp(`(?<![\\w$.-])${escapeRe(local)}(?![\\w$])`).test(rest)) continue
    if (
      !rootImport &&
      new RegExp(`(?<![\\w$.-])${escapeRe(parent)}(?![\\w$])`).test(rest.replace(tag(parent), ''))
    )
      continue
    if (!insideEveryTime(out, childRe, tag(parent))) continue
    const importLine = out.slice(line.start, line.end)
    out =
      out.slice(0, line.start) +
      (rootImport
        ? ''
        : importLine.replace(own.statement, `import ${parent} from '${PREFIX}${root}'`)) +
      out.slice(line.end)
    out = out.replace(childRe, (all, slash) => `<${slash}${parent}.${member}`)
    changes.push(`<${local}> (${PREFIX}${subpath}) → <${parent}.${member}>`)
  }
  return { source: out, changes }
}

export function migrateSource(input, migration, { fromMajor = null, declaredMajor = null } = {}) {
  const { props, types } = migration
  const tokenPass = migrateTokens(input, migration.tokens)
  const lintPass = migrateLintRules(tokenPass.source, migration.lint)
  const iconPass = migrateIcons(lintPass.source, migration.icons, { fromMajor, declaredMajor })
  const attachPass = attachToCompound(iconPass.source, migration.attached)
  const source = attachPass.source
  const changes = [
    ...tokenPass.changes,
    ...lintPass.changes,
    ...iconPass.changes,
    ...attachPass.changes
  ]
  const warnings = [...tokenPass.warnings, ...iconPass.warnings]
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
      const to = types[imported] || (migration.named || {})[imported]
      if (!to || identifierRenames.has(local)) continue
      if (local === imported) identifierRenames.set(imported, to)
      else typeRenames.push([imported, to])
    }
    for (const name of imp.names) {
      bindingToSubpath.set(identifierRenames.get(name) || name, next)
    }
  }

  const alternation = (names) =>
    [...names]
      .sort((a, b) => b.length - a.length)
      .map(escapeRe)
      .join('|')

  if (typeRenames.length) {
    const aliased = new Map(typeRenames)
    out = out.replace(
      new RegExp(`(?<=\\{[^}]*?)(?<![\\w$])(${alternation(aliased.keys())})(?=\\s+as\\s)`, 'g'),
      (name) => aliased.get(name)
    )
    for (const [from, to] of typeRenames) changes.push(`${from} → ${to}`)
  }

  if (identifierRenames.size) {
    out = replaceOutsideComments(
      out,
      new RegExp(`(?<![\\w$.-])(${alternation(identifierRenames.keys())})(?![\\w$])`, 'g'),
      (name) => identifierRenames.get(name)
    )
  }

  for (const [from, to] of identifierRenames) {
    out = replaceOutsideComments(
      out,
      new RegExp(`(</?)${escapeRe(kebab(from))}(?=[\\s/>])`, 'g'),
      (all, open) => `${open}${kebab(to)}`
    )
    changes.push(`${from} → ${to}`)
  }

  const standaloneImports = []
  for (const [binding, base] of bindingToSubpath) {
    const renames = (migration.members || {})[base]
    if (!renames) continue
    for (const [from, to] of Object.entries(renames)) {
      const re = new RegExp(`(?<![\\w$.])${escapeRe(binding)}\\.${escapeRe(from)}(?![\\w$])`, 'g')
      if (!re.test(out)) continue
      if (typeof to === 'object' && to.standalone) {
        const local = pascalCase(to.standalone)
        out = replaceOutsideComments(out, re, () => local)
        standaloneImports.push({ binding, base, local, subpath: to.standalone })
        changes.push(`${binding}.${from} → ${local}`)
        continue
      }
      if (typeof to === 'object') {
        warnings.push(`<${binding}.${from}> was removed in v6: ${to.removed}`)
        continue
      }
      const next = to ? `${binding}.${to}` : binding
      out = replaceOutsideComments(out, re, () => next)
      changes.push(`${binding}.${from} → ${next}`)
    }
  }

  out = addStandaloneImports(out, standaloneImports)

  for (const [binding, base] of bindingToSubpath) {
    const tagRe = new RegExp(
      `<(${escapeRe(binding)}(?:\\.([A-Z][\\w$]*))?|${escapeRe(kebab(binding))})(?=[\\s/>])`,
      'g'
    )
    let result = ''
    let cursor = 0
    const slotEdits = []
    for (const m of out.matchAll(tagRe)) {
      const part = m[2] && m[2] !== 'Root' ? m[2] : null
      const subpath = part ? `${base}-${kebab(part)}` : base
      const rules = props[subpath]
      if (!rules) continue
      const start = m.index + m[0].length
      if (start < cursor) continue
      const end = scanTag(out, start)
      if (end < 0) continue
      const slots = Object.entries(rules)
        .filter(([key, to]) => key.startsWith('#') && typeof to === 'string')
        .map(([key, to]) => [key.slice(1), to])
      if (slots.length && out[end - 1] !== '/') {
        for (const edit of renameChildSlots(out, end + 1, slots)) slotEdits.push(edit)
      }
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
      const reviewed = acknowledged(out, m.index)
      const renamed = renameAttributes(attrs, rules, (prop, expr, kind) => {
        if (kind === 'current' || reviewed) return
        const { values } = rules[prop]
        const old = Object.keys(values).filter((v) => values[v] !== v)
        const tag = `${PREFIX}${subpath}: <${binding}> :${kebab(prop)}="${expr}"`
        warnings.push(
          kind === 'opaque'
            ? `${tag} is bound to a value migrate cannot read: make sure it never yields ${old.map((v) => `'${v}' (now '${values[v]}')`).join(', ')}, then put <!-- ${MIGRATE_OK} --> on the line above the tag`
            : `${tag} is a bound expression; map its ${old.join(', ')} values by hand (or, when only a comparison keeps an old value, put <!-- ${MIGRATE_OK} --> on the line above the tag)`
        )
      })
      if (renamed !== attrs) slotEdits.push([start, end, renamed])
      cursor = end
    }
    slotEdits.sort((a, b) => a[0] - b[0])
    cursor = 0
    for (const [start, end, text] of slotEdits) {
      if (start < cursor) continue
      result += out.slice(cursor, start) + text
      cursor = end
    }
    if (slotEdits.length) {
      out = result + out.slice(cursor)
      changes.push(`<${binding}> props, slots and events`)
    }
  }

  return { source: out, changes: [...new Set(changes)], warnings: [...new Set(warnings)] }
}

const BLOCK_MANIFEST = 'webkit.blocks.json'

const pascalCase = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())

const variantKey = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

function blockAlias(blocks, id, variant) {
  if (variant) {
    const key = Object.keys(blocks).find((old) => {
      const [base, state] = old.split('#')
      return base === id && state && variantKey(state) === variantKey(variant)
    })
    if (key) return blocks[key]
  }
  return blocks[id] ?? null
}

export function migrateBlockManifest(manifest, blocks = {}) {
  const changes = []
  const warnings = []
  const next = {}
  for (const [id, entry] of Object.entries(manifest.blocks || {})) {
    const moved = blocks[id]
    if (!moved) {
      next[id] = next[id] ? { ...entry, files: [...next[id].files, ...(entry.files || [])] } : entry
      continue
    }
    const [to, merged] = moved.split('#')
    if (merged) {
      warnings.push(`block ${id} is now ${moved}; copy it again with \`add ${to}\``)
      next[id] = entry
      continue
    }
    const oldBase = id.split('/').pop()
    const newBase = to.split('/').pop()
    const files = (entry.files || []).map((file) => {
      const rest = String(file.source || '').replace(`blocks/${id}/`, '')
      const target = blockAlias(blocks, id, file.variant)
      const state = target && target.startsWith(`${to}#`) ? target.split('#')[1] : null
      let source = rest
      let variant = file.variant
      if (rest === `${oldBase}.vue`) source = `${newBase}.vue`
      else if (state && rest.startsWith('variants/')) {
        source = `variants/${state}.vue`
        variant = pascalCase(state)
      }
      return { ...file, source: `blocks/${to}/${source}`, variant }
    })
    changes.push(`${BLOCK_MANIFEST}: ${id} → ${to}`)
    next[to] = { ...entry, files: [...(next[to]?.files || []), ...files] }
  }
  const sorted = Object.fromEntries(
    Object.keys(next)
      .sort()
      .map((key) => [key, next[key]])
  )
  return { manifest: { ...manifest, blocks: sorted }, changes, warnings }
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

const SEMVER_RANGE = /^(?:[\^~]|[<>]=?|=|v|\s)*(\d+)(?:\.(?:\d+|[x*]))*(?:-[\w.]+)?/
const TARBALL = /(?:^|[/\\])aziontech-webkit-(\d+)\.\d+\.\d+(?:-[\w.]+)?\.tgz$/

function rangeMajor(range) {
  const majors = range.split('||').map((part) => part.trim().match(SEMVER_RANGE))
  if (majors.some((m) => !m)) return null
  return Math.min(...majors.map((m) => Number(m[1])))
}

function installedVersion(projectDir) {
  let dir = projectDir
  for (;;) {
    const file = join(dir, 'node_modules', '@aziontech', 'webkit', 'package.json')
    if (existsSync(file)) {
      const { version } = readJson(file)
      if (typeof version === 'string') return version
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

export function declaredMajor(projectDir) {
  const range = declaredRange(projectDir)
  if (range == null) return null
  const spec = range.trim().replace(/^npm:@aziontech\/webkit@/, '')
  const tarball = spec.match(TARBALL)
  if (tarball) return { range, major: Number(tarball[1]), source: 'tarball' }
  if (!/^(file|link|workspace|portal|git|github|https?):|[/\\]/.test(spec) && spec) {
    const major = rangeMajor(spec)
    if (major != null) return { range, major, source: 'range' }
  }
  const installed = installedVersion(projectDir)
  const m = installed && installed.match(/^(\d+)\.\d+\.\d+/)
  if (m) return { range, major: Number(m[1]), source: 'installed', installed }
  const workspace = spec.match(/^workspace:(.+)$/)
  const major = workspace ? rangeMajor(workspace[1]) : null
  return major == null ? null : { range, major, source: 'range' }
}

export function declaredRange(projectDir) {
  const pkg = readJson(join(projectDir, 'package.json'))
  const range = {
    ...pkg.peerDependencies,
    ...pkg.devDependencies,
    ...pkg.dependencies
  }['@aziontech/webkit']
  return typeof range === 'string' ? range : null
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
  const range = declaredRange(projectDir)
  if (from == null && !declared && range != null) {
    results.push({
      file: 'package.json',
      changes: [],
      warnings: [
        `cannot tell which @aziontech/webkit version "${range}" is, and no installed copy was found: pass --from <major> (for example --from 5)`
      ]
    })
  }
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
    const migrated = migrateSource(before, migration, {
      fromMajor: from,
      declaredMajor: declared ? declared.major : null
    })
    let { source } = migrated
    const changes = [...migrated.changes]
    const { warnings } = migrated
    if (TEST_FILE.test(relative(projectDir, file).split('\\').join('/'))) {
      const ids = migrateTestIds(source, migration.testids)
      source = ids.source
      changes.push(...ids.changes)
    }
    if (!changes.length && !warnings.length) continue
    if (source !== before && !dryRun) writeFileSync(file, source)
    results.push({ file: relative(projectDir, file), changes, warnings })
  }
  const manifestFile = join(projectDir, BLOCK_MANIFEST)
  if (existsSync(manifestFile)) {
    const before = readFileSync(manifestFile, 'utf8')
    const { manifest, changes, warnings } = migrateBlockManifest(
      JSON.parse(before),
      migration.blocks
    )
    if (changes.length || warnings.length) {
      if (changes.length && !dryRun)
        writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
      results.push({ file: BLOCK_MANIFEST, changes, warnings })
    }
  }
  return results
}
