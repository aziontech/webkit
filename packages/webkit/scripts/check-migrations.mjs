#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { renameSubpath } from '../src/cli/migrate.js'
import { resolveBase, showAtBase } from './lib/base-ref.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CATALOG = resolve(PKG, 'catalog.json')
const SNAPSHOT = resolve(PKG, 'scripts/api-snapshot.json')
const MIGRATIONS_DIR = resolve(PKG, 'src/cli/migrations')
const COMPONENT_KINDS = new Set(['component', 'root', 'subcomponent'])

export function literalValues(type) {
  if (typeof type !== 'string') return null
  const parts = type.split('|').map((part) => part.trim())
  if (!parts.length || !parts.every((part) => /^'[^']*'$/.test(part))) return null
  return parts.map((part) => part.slice(1, -1)).sort()
}

export function apiFromCatalog(catalog) {
  const imports = catalog.imports || {}
  const props = {}
  for (const [subpath, entry] of Object.entries(imports)) {
    if (!COMPONENT_KINDS.has(entry.kind) || !Array.isArray(entry.props)) continue
    props[subpath] = Object.fromEntries(
      entry.props
        .filter((prop) => prop && prop.name)
        .map((prop) => [prop.name, literalValues(prop.type)])
        .sort(([a], [b]) => a.localeCompare(b))
    )
  }
  return {
    exports: Object.keys(imports).sort(),
    patterns: Object.keys(catalog.patterns || {}).sort(),
    props
  }
}

export function loadMigrations(dir = MIGRATIONS_DIR) {
  const out = { components: {}, removed: {}, props: {}, blocks: {} }
  if (!existsSync(dir)) return out
  const read = (name) => JSON.parse(readFileSync(join(dir, name), 'utf8'))
  for (const name of readdirSync(dir).sort()) {
    if (/^v\d+\.json$/.test(name)) {
      const base = read(name)
      Object.assign(out.components, base.components)
      Object.assign(out.removed, base.removed)
    } else if (/^v\d+-props\.json$/.test(name)) {
      for (const [subpath, rules] of Object.entries(read(name))) {
        out.props[subpath] = { ...out.props[subpath], ...rules }
      }
    } else if (/^v\d+-blocks\.json$/.test(name)) {
      Object.assign(out.blocks, read(name))
    }
  }
  return out
}

export function renamedSubpath(subpath, components) {
  const next = renameSubpath(subpath, components)
  return next === subpath ? null : next
}

export const ruleOf = (spec) => (typeof spec === 'string' ? { to: spec } : spec)

export function diffApi(before, after, migrations) {
  const uncovered = []
  const afterExports = new Set(after.exports)
  const afterPatterns = new Set(after.patterns)

  for (const subpath of before.exports) {
    if (afterExports.has(subpath)) continue
    const renamed = renamedSubpath(subpath, migrations.components)
    if (renamed && afterExports.has(renamed)) continue
    if (migrations.removed[subpath]) continue
    uncovered.push(
      `export ${subpath} was removed or renamed (add it to v<N>.json components or removed)`
    )
  }

  for (const id of before.patterns) {
    if (afterPatterns.has(id)) continue
    const target = migrations.blocks[id]
    if (target && afterPatterns.has(String(target).split('#')[0])) continue
    uncovered.push(`pattern ${id} was removed or renamed (add it to v<N>-blocks.json)`)
  }

  for (const [subpath, props] of Object.entries(before.props)) {
    const target = after.props[subpath]
      ? subpath
      : renamedSubpath(subpath, migrations.components) || subpath
    const now = after.props[target]
    if (!now) continue
    const rules = { ...migrations.props[subpath], ...migrations.props[target] }
    for (const [prop, values] of Object.entries(props)) {
      const rule = rules[prop] ? ruleOf(rules[prop]) : null
      const to =
        prop in now ? prop : rule && (rule.to in now || rule.to === 'modelValue') ? rule.to : null
      if (!to) {
        uncovered.push(
          `${target}: prop ${prop} was removed or renamed (add it to v<N>-props.json["${target}"])`
        )
        continue
      }
      const allowed = now[to] || null
      if (!values || !allowed) continue
      for (const value of values) {
        if (allowed.includes(value)) continue
        const mapped = rule?.values?.[value]
        if (mapped !== undefined) continue
        uncovered.push(
          `${target}: ${prop}="${value}" is no longer allowed (add "values": { "${value}": … } to v<N>-props.json["${target}"].${prop})`
        )
      }
    }
  }

  const beforeExports = new Set(before.exports)
  const additions =
    after.exports.filter((s) => !beforeExports.has(s)).length +
    Object.entries(after.props).reduce(
      (n, [s, props]) =>
        n + Object.keys(props).filter((p) => !(p in (before.props[s] || {}))).length,
      0
    )
  return { uncovered, additions }
}

function readBaseApi(against) {
  if (process.argv.includes('--snapshot')) return null
  const base = resolveBase({ against })
  const raw = base ? showAtBase(base, 'packages/webkit/catalog.json') : null
  if (!raw) {
    if (against) throw new Error(`cannot read packages/webkit/catalog.json at ${against}`)
    return null
  }
  return {
    api: apiFromCatalog(JSON.parse(raw)),
    source: `${base.ref} (${base.commit.slice(0, 9)})`
  }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const args = process.argv.slice(2)
  const update = args.includes('--update')
  const refIndex = args.indexOf('--against')
  const against = refIndex >= 0 ? args[refIndex + 1] : null
  const after = apiFromCatalog(JSON.parse(readFileSync(CATALOG, 'utf8')))
  const base = update ? null : readBaseApi(against)
  const ref = base ? base.source : null
  if (!ref && !existsSync(SNAPSHOT)) {
    if (!update) {
      console.error('scripts/api-snapshot.json is missing: record it with --update.')
      process.exit(1)
    }
    writeFileSync(SNAPSHOT, `${JSON.stringify(after, null, 2)}\n`)
    console.log('Recorded the public API in scripts/api-snapshot.json.')
    process.exit(0)
  }
  const before = base ? base.api : JSON.parse(readFileSync(SNAPSHOT, 'utf8'))
  const { uncovered, additions } = diffApi(before, after, loadMigrations())
  const source = ref ? `the catalog.json of ${ref}` : 'scripts/api-snapshot.json'
  if (uncovered.length) {
    console.error(
      `Public API changed without a codemod entry (${uncovered.length}, against ${source}):`
    )
    for (const line of uncovered) console.error(`  - ${line}`)
    console.error(
      'Every removed or renamed export, pattern, prop or prop value needs an entry in src/cli/migrations/ so `migrate` rewrites consumer code; then run `node scripts/check-migrations.mjs --update`.'
    )
    process.exit(1)
  }
  if (update && !ref) {
    writeFileSync(SNAPSHOT, `${JSON.stringify(after, null, 2)}\n`)
    console.log(`Updated ${source} (${additions} addition(s) recorded).`)
  } else {
    console.log(
      `Public API covered by src/cli/migrations/ (against ${source}); ${additions} addition(s)${additions && !ref ? ', record them with --update' : ''}.`
    )
  }
}
