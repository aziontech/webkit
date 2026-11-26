import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { listBundle } from './bundle.js'
import { escapeRe, readJson } from './migrate-syntax.js'

const CLI_DIR = dirname(fileURLToPath(import.meta.url))
const OWN_VERSION = readJson(join(CLI_DIR, '..', '..', 'package.json')).version || '6.0.0'
const OWN_MAJOR = OWN_VERSION.split('.')[0]
const OWN_RANGE = `^${OWN_MAJOR}.0.0`
const MCP_PACKAGE = `@aziontech/ui-mcp@^${OWN_MAJOR}`

export function loadPackageMap() {
  return readJson(join(CLI_DIR, 'migrations', 'v6-package.json'))
}

const sortedKeys = (map) => Object.keys(map || {}).sort((a, b) => b.length - a.length)

function replacer(map, pattern) {
  const keys = sortedKeys(map)
  if (!keys.length) return null
  return new RegExp(pattern(keys.map(escapeRe).join('|')), 'g')
}

export function migratePackageText(source, map = loadPackageMap()) {
  const changes = new Set()
  let out = source
  const swap = (re, table, label) => {
    if (!re) return
    out = out.replace(re, (old, ...rest) => {
      const groups = rest.at(-1)
      const key = groups && typeof groups === 'object' && groups.key ? groups.key : old
      const next = old.replace(key, table[key])
      changes.add(label(key, table[key]))
      return next
    })
  }
  swap(
    replacer(map.packages, (alt) => `(?<key>${alt})(?![\\w-])`),
    map.packages,
    (a, b) => `${a} → ${b}`
  )
  swap(
    replacer(map.lintPrefix, (alt) => `(?<![\\w@/.-])(?<key>${alt})(?=[a-z])`),
    map.lintPrefix,
    (a, b) => `lint rules ${a}* → ${b}*`
  )
  swap(
    replacer(map.lintRules, (alt) => `(?<key>${alt})(?![\\w-])`),
    map.lintRules,
    (a, b) => `${a} → ${b}`
  )
  swap(
    replacer(map.fileNames, (alt) => `(?<![\\w-])(?<key>${alt})(?![\\w-])`),
    map.fileNames,
    (a, b) => `${a} → ${b}`
  )
  swap(
    replacer(map.env, (alt) => `\\b(?<key>${alt})\\b`),
    map.env,
    (a, b) => `${a} → ${b}`
  )
  return { source: out, changes: [...changes] }
}

function migrateScripts(scripts, bins) {
  const changes = []
  const keys = sortedKeys(bins)
  if (!scripts || !keys.length) return changes
  const re = new RegExp(`(^|[\\s;&|(])(npx\\s+)?(${keys.map(escapeRe).join('|')})(?=\\s)`, 'g')
  for (const [name, command] of Object.entries(scripts)) {
    if (typeof command !== 'string') continue
    const next = command.replace(re, (_, lead, npx = '', bin) => `${lead}${npx}${bins[bin]}`)
    if (next !== command) {
      scripts[name] = next
      changes.push(`script "${name}": ${command} → ${next}`)
    }
  }
  return changes
}

function migratePackageJson(projectDir, map, dryRun) {
  const file = join(projectDir, 'package.json')
  if (!existsSync(file)) return null
  const before = readFileSync(file, 'utf8')
  const pkg = JSON.parse(before)
  const changes = []
  for (const field of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies'
  ]) {
    const deps = pkg[field]
    if (!deps) continue
    for (const [oldName, newName] of Object.entries(map.packages || {})) {
      if (!(oldName in deps)) continue
      const range = deps[oldName]
      const local = /^(file|link|workspace|portal|git|github|https?):|[/\\]/.test(range)
      const next = local ? range : OWN_RANGE
      const entries = Object.entries(deps).map(([k, v]) =>
        k === oldName ? [newName, next] : [k, v]
      )
      pkg[field] = Object.fromEntries(entries)
      changes.push(`${field}: ${oldName}@${range} → ${newName}@${next}`)
    }
  }
  changes.push(...migrateScripts(pkg.scripts, map.bins))
  if (!changes.length) return null
  if (!dryRun) writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
  return { file: 'package.json', changes, warnings: [] }
}

function renameServers(servers, map) {
  const changes = []
  for (const [oldName, newName] of Object.entries(map.mcpServer || {})) {
    if (!(oldName in servers)) continue
    const entry = servers[oldName]
    delete servers[oldName]
    if (!(newName in servers)) servers[newName] = entry
    changes.push(`MCP server "${oldName}" → "${newName}"`)
  }
  return changes
}

function runsOldPackage(entry, oldNames) {
  if (!Array.isArray(entry?.args)) return false
  return entry.args.some(
    (arg) => typeof arg === 'string' && oldNames.has(arg.replace(/@[^@/]+$/, ''))
  )
}

function repointServers(servers, map) {
  const changes = []
  const oldNames = new Set([...Object.keys(map.packages || {}), ...Object.keys(map.bins || {})])
  for (const entry of Object.values(servers)) {
    if (!runsOldPackage(entry, oldNames)) continue
    const args = ['-y', MCP_PACKAGE]
    changes.push(`MCP args ${entry.args.join(' ')} → ${args.join(' ')}`)
    entry.command = 'npx'
    entry.args = args
  }
  return changes
}

function readConfig(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function migrateMcpConfig(projectDir, rel, map, dryRun) {
  const file = join(projectDir, rel)
  const config = existsSync(file) ? readConfig(file) : null
  const servers = config?.mcpServers || config?.servers
  if (!servers || typeof servers !== 'object') return null
  const changes = [...renameServers(servers, map), ...repointServers(servers, map)]
  if (!changes.length) return null
  if (!dryRun) writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`)
  return { file: rel, changes, warnings: [] }
}

function moveFile(projectDir, from, to, dryRun) {
  const src = join(projectDir, from)
  const dest = join(projectDir, to)
  if (!existsSync(src)) return null
  if (existsSync(dest)) {
    return {
      file: from,
      changes: [],
      warnings: [`${to} already exists: merge ${from} into it by hand`]
    }
  }
  if (!dryRun) {
    mkdirSync(dirname(dest), { recursive: true })
    renameSync(src, dest)
  }
  return { file: from, changes: [`moved to ${to}`], warnings: [] }
}

function renamedBundleEntry(name, prefixes) {
  const prefix = sortedKeys(prefixes).find((p) => name.startsWith(p))
  return prefix ? `${prefixes[prefix]}${name.slice(prefix.length)}` : null
}

function shippedBundleNames() {
  try {
    return new Set(listBundle().map((rel) => rel.split('/').slice(0, 2).join('/')))
  } catch {
    return null
  }
}

function bundleMoves(projectDir, bundle) {
  const moves = []
  const retired = []
  const shipped = shippedBundleNames()
  for (const dir of bundle?.dirs || []) {
    const abs = join(projectDir, dir)
    if (!existsSync(abs)) continue
    for (const name of readdirSync(abs)) {
      const next = renamedBundleEntry(name, bundle.prefixes || {})
      if (!next) continue
      const key = `${dir.split('/').pop()}/${next}`
      if (shipped && !shipped.has(key)) retired.push(join(dir, name))
      else moves.push([join(dir, name), join(dir, next)])
    }
  }
  return { moves, retired }
}

function renameMarker(line, map) {
  const bundle = map.aiBundle || {}
  let out = line
  for (const [oldMarker, newMarker] of Object.entries(bundle.marker || {})) {
    out = out.replace(`<!-- ${oldMarker} `, `<!-- ${newMarker} `)
  }
  return out.replace(/source=(\S+)/, (all, source) => {
    const parts = source
      .split('/')
      .map((part) => renamedBundleEntry(part, bundle.prefixes || {}) ?? part)
    return `source=${parts.join('/')}`
  })
}

function rewriteBundleFile(projectDir, rel, map, dryRun) {
  const file = join(projectDir, rel)
  if (!existsSync(file)) return null
  const before = readFileSync(file, 'utf8')
  const [first, ...rest] = before.split('\n')
  const marker = renameMarker(first, map)
  if (marker === first) return null
  if (!dryRun) writeFileSync(file, [marker, ...rest].join('\n'))
  return {
    file: rel,
    changes: ['sync marker renamed; run `npx @aziontech/ui sync` to refresh it'],
    warnings: []
  }
}

function rewriteText(projectDir, rel, map, dryRun) {
  const file = join(projectDir, rel)
  if (!existsSync(file)) return null
  const before = readFileSync(file, 'utf8')
  const { source, changes } = migratePackageText(before, map)
  if (source === before) return null
  if (!dryRun) writeFileSync(file, source)
  return { file: rel, changes, warnings: [] }
}

function bundleTexts(projectDir, bundle) {
  const out = []
  for (const dir of bundle?.dirs || []) {
    const abs = join(projectDir, dir)
    if (!existsSync(abs)) continue
    for (const name of readdirSync(abs, { recursive: true })) {
      if (String(name).endsWith('.md')) out.push(join(dir, String(name)))
    }
  }
  return out
}

export function planPackageMigration(projectDir, { dryRun = false, map = loadPackageMap() } = {}) {
  const results = [migratePackageJson(projectDir, map, dryRun)]
  for (const rel of map.mcpConfigs || [])
    results.push(migrateMcpConfig(projectDir, rel, map, dryRun))
  for (const rel of map.docs || []) results.push(rewriteText(projectDir, rel, map, dryRun))
  for (const rel of bundleTexts(projectDir, map.aiBundle)) {
    results.push(rewriteBundleFile(projectDir, rel, map, dryRun))
  }
  const { moves, retired } = bundleMoves(projectDir, map.aiBundle)
  for (const [from, to] of [...Object.entries(map.files || {}), ...moves]) {
    results.push(moveFile(projectDir, from, to, dryRun))
  }
  for (const rel of retired) {
    results.push({
      file: rel,
      changes: [],
      warnings: [`${rel} is not in the 6.0 AI bundle: delete it`]
    })
  }
  if (moves.length) {
    results.push({
      file: '.claude',
      changes: [],
      warnings: [
        `${moves.length} AI file(s) moved to their azion-ui names: run \`npx @aziontech/ui sync --force\` to refresh them (it overwrites local edits to those files)`
      ]
    })
  }
  return results.filter(Boolean)
}
