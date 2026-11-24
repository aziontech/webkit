import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { applyRenames, collectRenames, renameMembers } from './migrate-bindings.js'
import { BLOCK_MANIFEST, migrateBlockManifest } from './migrate-blocks.js'
import { attachToCompound } from './migrate-compound.js'
import { migrateIcons } from './migrate-icons.js'
import { migrateLintRules, migrateTestIds, TEST_FILE } from './migrate-renames.js'
import { legacyFor, legacyMarkers, referencedSubpaths, resolveSubpath } from './migrate-subpaths.js'
import { PREFIX, readJson, SUBPATH_LITERAL } from './migrate-syntax.js'
import { migrateTags } from './migrate-tags.js'
import { migrateTokens } from './migrate-tokens.js'
import { declaredMajor, declaredRange } from './migrate-version.js'

const CLI_DIR = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(CLI_DIR, 'migrations')
const PACKAGE_JSON = join(CLI_DIR, '..', '..', 'package.json')
const SOURCE_EXT = /\.(vue|ts|tsx|js|jsx|mjs|cjs|css|scss|html)$/
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.nuxt', '.output', 'coverage'])

export const SUPPORTED_VERSIONS = [6]
export const REVIEW_WARNING = /migrate cannot read/

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

function textPasses(input, migration, { fromMajor, declaredMajor }) {
  const tokenPass = migrateTokens(input, migration.tokens)
  const lintPass = migrateLintRules(tokenPass.source, migration.lint)
  const iconPass = migrateIcons(lintPass.source, migration.icons, { fromMajor, declaredMajor })
  const attachPass = attachToCompound(iconPass.source, migration.attached)
  return {
    source: attachPass.source,
    changes: [
      ...tokenPass.changes,
      ...lintPass.changes,
      ...iconPass.changes,
      ...attachPass.changes
    ],
    warnings: [...tokenPass.warnings, ...iconPass.warnings]
  }
}

function subpathPlan(subpaths, migration, fromMajor, warnings) {
  const legacy = legacyFor(migration, fromMajor)
  const plan = new Map()
  for (const subpath of subpaths) {
    const resolved = resolveSubpath(subpath, migration, legacy, fromMajor)
    plan.set(subpath, resolved)
    if (resolved.warning) warnings.push(resolved.warning)
  }
  return plan
}

function rewriteSubpaths(source, plan, changes) {
  return source.replace(SUBPATH_LITERAL, (all, quote, subpath) => {
    const { next, manual } = plan.get(subpath)
    if (manual || next === subpath) return all
    changes.push(`${PREFIX}${subpath} → ${PREFIX}${next}`)
    return `${quote}${PREFIX}${next}${quote}`
  })
}

export function migrateSource(input, migration, { fromMajor = null, declaredMajor = null } = {}) {
  const { source, changes, warnings } = textPasses(input, migration, { fromMajor, declaredMajor })
  const subpaths = referencedSubpaths(source)
  if (!subpaths.size) return { source, changes, warnings }

  const plan = subpathPlan(subpaths, migration, fromMajor, warnings)
  const renames = collectRenames(source, plan, migration)
  const ctx = { changes, warnings }
  let out = rewriteSubpaths(source, plan, changes)
  out = applyRenames(out, renames, changes)
  out = renameMembers(out, renames.bindings, migration, ctx)
  out = migrateTags(out, renames.bindings, migration.props, ctx)
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

const note = (warning) => ({ file: 'package.json', changes: [], warnings: [warning] })

function legacyMarkerIn(files, migration) {
  const markers = legacyMarkers(migration)
  return files
    .flatMap(({ before }) => [...referencedSubpaths(before)])
    .find((subpath) => markers.has(subpath))
}

function oldMajorNote(from, declared, version) {
  return note(
    `the project is on @aziontech/webkit v${from}${declared ? ` (${declared.range})` : ''}; ` +
      `migrate v${version} rewrites v${version - 1} code, so every v${from} component whose API ` +
      `changed is listed as MANUAL`
  )
}

function detectFrom(projectDir, migration, files, { version, fromMajor }) {
  const notes = []
  const declared = declaredMajor(projectDir)
  let from = fromMajor
  if (from == null && declared && declared.major < version) from = declared.major
  const range = declaredRange(projectDir)
  if (from == null && !declared && range != null) {
    notes.push(
      note(
        `cannot tell which @aziontech/webkit version "${range}" is, and no installed copy was found: pass --from <major> (for example --from 5)`
      )
    )
  }
  const marker = from == null && migration.legacy ? legacyMarkerIn(files, migration) : null
  if (marker) {
    from = migration.legacy.major
    notes.push(
      note(
        `${PREFIX}${marker} exists only in v${from}: treating the project as v${from} (pass --from to override)`
      )
    )
  }
  if (from != null && from < version - 1) notes.push(oldMajorNote(from, declared, version))
  return { from, declared, notes }
}

function migrateFile(projectDir, { file, before }, migration, { from, declared, dryRun }) {
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
  if (!changes.length && !warnings.length) return null
  if (source !== before && !dryRun) writeFileSync(file, source)
  return { file: relative(projectDir, file), changes, warnings }
}

function migrateManifestFile(projectDir, migration, dryRun) {
  const manifestFile = join(projectDir, BLOCK_MANIFEST)
  if (!existsSync(manifestFile)) return null
  const before = readFileSync(manifestFile, 'utf8')
  const { manifest, changes, warnings } = migrateBlockManifest(JSON.parse(before), migration.blocks)
  if (!changes.length && !warnings.length) return null
  if (changes.length && !dryRun) {
    writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
  }
  return { file: BLOCK_MANIFEST, changes, warnings }
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
  const { from, declared, notes } = detectFrom(projectDir, migration, files, {
    version,
    fromMajor
  })
  const options = { from, declared, dryRun }
  const fileResults = files.map((entry) => migrateFile(projectDir, entry, migration, options))
  return [...notes, ...fileResults, migrateManifestFile(projectDir, migration, dryRun)].filter(
    Boolean
  )
}

export { migrateBlockManifest } from './migrate-blocks.js'
export { migrateIcons } from './migrate-icons.js'
export { migrateLintRules, migrateTestIds } from './migrate-renames.js'
export { legacyMarkers, renameSubpath } from './migrate-subpaths.js'
export { declaredMajor } from './migrate-version.js'
