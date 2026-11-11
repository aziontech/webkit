import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'

import { getPattern } from '../mcp/queries.js'
import { PACKAGE_NAME } from './source.js'
import { unifiedDiff } from './text-diff.js'

export const MANIFEST = 'webkit.blocks.json'

const ROUTER_CANDIDATES = [
  'src/router/index.ts',
  'src/router/index.js',
  'src/router/routes.ts',
  'src/router/routes.js',
  'src/router.ts',
  'src/router.js'
]
const VITE_CONFIGS = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs']
const TS_CONFIGS = ['tsconfig.app.json', 'tsconfig.json', 'jsconfig.json']
const WEBKIT_SUBPATH = /['"`]@aziontech\/webkit\/([^'"`\s]+)['"`]/g
const BARE_IMPORT = /(?:\bfrom\s+|\bimport\s*\(\s*|^\s*import\s+)['"]([^./'"][^'"]*)['"]/gm

const toPosix = (p) => p.split(sep).join('/')
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)

export function checksum(text) {
  return `sha256:${createHash('sha256').update(String(text)).digest('hex')}`
}

export function readManifest(projectDir) {
  const raw = read(join(projectDir, MANIFEST))
  if (!raw) return { package: PACKAGE_NAME, blocks: {} }
  const parsed = JSON.parse(raw)
  return { package: PACKAGE_NAME, ...parsed, blocks: parsed.blocks || {} }
}

export function writeManifest(projectDir, manifest) {
  const blocks = Object.fromEntries(
    Object.keys(manifest.blocks)
      .sort()
      .map((id) => [id, manifest.blocks[id]])
  )
  writeFileSync(
    join(projectDir, MANIFEST),
    `${JSON.stringify({ ...manifest, package: PACKAGE_NAME, blocks }, null, 2)}\n`
  )
}

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

function findVariant(meta, wanted) {
  if (!wanted) return null
  const n = normalize(wanted)
  if (n === normalize(meta.primary?.name) || n === 'primary') return null
  return (
    (meta.variants || []).find(
      (v) => normalize(v.name) === n || normalize(basename(v.file, '.vue')) === n
    ) || undefined
  )
}

export function resolveBlock(webkit, catalog, id, { variant } = {}) {
  const key = String(id || '').trim()
  let resolvedId = existsSync(join(webkit.root, 'blocks', key, 'block.json')) ? key : null
  let wantedVariant = variant
  let note = null
  if (!resolvedId) {
    const hit = getPattern(catalog, key)
    if (!hit.found) {
      return {
        ok: false,
        message: `No block "${key}" in ${PACKAGE_NAME}@${webkit.version}.`,
        suggestions: hit.suggestions || []
      }
    }
    resolvedId = hit.id
    if (hit.movedFrom) {
      note = hit.note
      const moved = variant ? getPattern(catalog, key, { variant }) : hit
      if (moved.found && moved.variant && moved.variant !== catalog.patterns[hit.id]?.primary) {
        wantedVariant = moved.variant
      }
    }
  }
  const dir = join(webkit.root, 'blocks', resolvedId)
  const metaPath = join(dir, 'block.json')
  if (!existsSync(metaPath)) {
    return {
      ok: false,
      message: `Block "${resolvedId}" is in the catalog but ${PACKAGE_NAME}@${webkit.version} ships no ${toPosix(relative(webkit.root, metaPath))}.`,
      suggestions: []
    }
  }
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
  const chosen = findVariant(meta, wantedVariant)
  if (chosen === undefined) {
    return {
      ok: false,
      message: `Block "${resolvedId}" has no variant "${wantedVariant}". Variants: ${[meta.primary.name, ...(meta.variants || []).map((v) => v.name)].join(', ')}.`,
      suggestions: []
    }
  }
  return { ok: true, id: resolvedId, dir, meta, variant: chosen, note }
}

function firstExisting(projectDir, candidates) {
  return candidates.find((c) => existsSync(join(projectDir, c))) || null
}

function vueImportDirs(projectDir, routerRel) {
  const src = read(join(projectDir, routerRel)) || ''
  const routerDir = dirname(join(projectDir, routerRel))
  const counts = new Map()
  for (const m of src.matchAll(/['"]((?:@\/|\.{1,2}\/)[^'"]+\.vue)['"]/g)) {
    const spec = m[1]
    const abs = spec.startsWith('@/')
      ? join(projectDir, 'src', spec.slice(2))
      : resolve(routerDir, spec)
    const rel = toPosix(relative(projectDir, abs)).split('/')
    if (rel[0] === '..' || rel.length < 2) continue
    const dir =
      rel[0] === 'src' && rel.length > 2 ? rel.slice(0, 2).join('/') : rel.slice(0, -1).join('/')
    counts.set(dir, (counts.get(dir) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([dir]) => dir)
}

export function detectViewsDir(projectDir) {
  const router = firstExisting(projectDir, ROUTER_CANDIDATES)
  if (router) {
    const [top] = vueImportDirs(projectDir, router)
    if (top) return { dir: top, reason: `the views ${router} imports` }
  }
  for (const dir of ['src/views', 'src/pages']) {
    if (existsSync(join(projectDir, dir))) return { dir, reason: `${dir} exists` }
  }
  return { dir: 'src/views', reason: 'default' }
}

function hasAtAlias(projectDir) {
  for (const file of VITE_CONFIGS) {
    const src = read(join(projectDir, file))
    if (src && /['"]@['"]\s*:/.test(src)) return true
    if (src && /find:\s*['"]@['"]/.test(src)) return true
  }
  for (const file of TS_CONFIGS) {
    const src = read(join(projectDir, file))
    if (src && /"@\/\*"\s*:/.test(src)) return true
  }
  return false
}

function kebab(s) {
  return String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

export function suggestRoute(projectDir, { id, name, file }) {
  const router = firstExisting(projectDir, ROUTER_CANDIDATES)
  const abs = join(projectDir, file)
  let spec
  const underSrc = toPosix(relative(join(projectDir, 'src'), abs))
  if (hasAtAlias(projectDir) && !underSrc.startsWith('..')) spec = `@/${underSrc}`
  else {
    const from = router ? dirname(join(projectDir, router)) : join(projectDir, 'src')
    spec = toPosix(relative(from, abs))
    if (!spec.startsWith('.')) spec = `./${spec}`
  }
  const slug = id.split('/').pop() || kebab(name)
  return {
    router,
    entry: `{ path: '/${slug}', name: '${slug}', component: () => import('${spec}') }`
  }
}

function packageInstalled(projectDir, spec) {
  const parts = spec.split('/')
  const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
  let dir = resolve(projectDir)
  for (;;) {
    if (existsSync(join(dir, 'node_modules', name, 'package.json'))) return { name, ok: true }
    const parent = dirname(dir)
    if (parent === dir) return { name, ok: false }
    dir = parent
  }
}

export function checkImports(projectDir, webkit, sources) {
  const webkitSubpaths = new Set()
  const foreign = new Set()
  for (const src of sources) {
    for (const m of src.matchAll(WEBKIT_SUBPATH)) webkitSubpaths.add(m[1])
    for (const m of src.matchAll(BARE_IMPORT)) {
      if (m[1] !== PACKAGE_NAME && !m[1].startsWith(`${PACKAGE_NAME}/`)) foreign.add(m[1])
    }
  }
  const webkitImports = [...webkitSubpaths].sort().map((sub) => ({
    spec: `${PACKAGE_NAME}/${sub}`,
    ok: webkit.exports.has(sub)
  }))
  const packages = new Map()
  for (const spec of foreign) {
    const hit = packageInstalled(projectDir, spec)
    if (!packages.has(hit.name)) packages.set(hit.name, hit)
  }
  return {
    webkit: webkitImports,
    missing: webkitImports.filter((i) => !i.ok).map((i) => i.spec),
    packages: [...packages.values()].sort((a, b) => a.name.localeCompare(b.name))
  }
}

function stripHeading(markdown) {
  return markdown.replace(/^\s*#[^#\n][^\n]*\n+/, '')
}

function targetPaths(projectDir, block, dest) {
  const name = block.meta.name
  let dir
  let primaryName = `${name}.vue`
  let viewsReason = null
  if (dest && dest.endsWith('.vue')) {
    dir = dirname(dest)
    primaryName = basename(dest)
  } else if (dest) {
    dir = dest
  } else {
    const detected = detectViewsDir(projectDir)
    dir = detected.dir
    viewsReason = detected.reason
  }
  const relDir =
    toPosix(isAbsolute(dir) ? relative(projectDir, dir) : dir).replace(/\/$/, '') || '.'
  const stem = basename(primaryName, '.vue')
  const at = (file) => (relDir === '.' ? file : `${relDir}/${file}`)
  return {
    viewsReason,
    primary: at(primaryName),
    variant: block.variant ? at(`${stem}${block.variant.name}.vue`) : null,
    guidelines: at(`${stem}.guidelines.md`)
  }
}

export function planAdd(projectDir, webkit, catalog, id, opts = {}) {
  const block = resolveBlock(webkit, catalog, id, { variant: opts.variant })
  if (!block.ok) return { ok: false, errors: [block.message], suggestions: block.suggestions }

  const paths = targetPaths(projectDir, block, opts.dest)
  const pieces = [
    { path: paths.primary, file: block.meta.primary.file, variant: block.meta.primary.name },
    ...(block.variant
      ? [{ path: paths.variant, file: block.variant.file, variant: block.variant.name }]
      : [])
  ]
  const files = pieces.map((piece) => {
    const content = readFileSync(join(block.dir, piece.file), 'utf8')
    return {
      path: piece.path,
      source: toPosix(relative(webkit.root, join(block.dir, piece.file))),
      variant: piece.variant,
      content,
      checksum: checksum(content),
      exists: existsSync(join(projectDir, piece.path))
    }
  })

  let guidelines = null
  if (opts.withGuidelines) {
    const raw = read(join(block.dir, 'guidelines.md'))
    if (raw) {
      guidelines = {
        path: paths.guidelines,
        content: stripHeading(raw),
        exists: existsSync(join(projectDir, paths.guidelines))
      }
    }
  }

  const imports = checkImports(
    projectDir,
    webkit,
    files.map((f) => f.content)
  )
  const errors = []
  const warnings = []
  if (block.note) warnings.push(block.note)
  if (!webkit.installed) {
    warnings.push(
      `${PACKAGE_NAME} is not installed in this project: the block was taken from ${PACKAGE_NAME}@${webkit.version} (the CLI). Install it before building.`
    )
  } else if (!webkit.fromInstalled) {
    warnings.push(
      `the installed ${PACKAGE_NAME}@${webkit.installedVersion} ships no blocks/: the block was taken from ${PACKAGE_NAME}@${webkit.version} (the CLI).`
    )
  }
  for (const spec of imports.missing) {
    errors.push(
      `${spec} is not exported by the installed ${PACKAGE_NAME}${webkit.installedVersion ? `@${webkit.installedVersion}` : ''}: upgrade it to ${webkit.version} or later.`
    )
  }
  if (webkit.installed) {
    for (const pkg of imports.packages.filter((p) => !p.ok)) {
      warnings.push(
        `the block imports ${pkg.name}, which is not installed: add it to your dependencies.`
      )
    }
  }
  const clashes = [...files, ...(guidelines ? [guidelines] : [])].filter((f) => f.exists)
  if (clashes.length && !opts.force) {
    errors.push(
      `${clashes.map((f) => f.path).join(', ')} already exist${clashes.length === 1 ? 's' : ''}: pass --force to overwrite, or --dest to put the block elsewhere.`
    )
  }

  return {
    ok: errors.length === 0,
    id: block.id,
    name: block.meta.name,
    version: webkit.version,
    viewsReason: paths.viewsReason,
    files,
    guidelines,
    imports,
    route: suggestRoute(projectDir, { id: block.id, name: block.meta.name, file: paths.primary }),
    errors,
    warnings
  }
}

export function applyAdd(projectDir, plan) {
  const written = []
  for (const f of [...plan.files, ...(plan.guidelines ? [plan.guidelines] : [])]) {
    const abs = join(projectDir, f.path)
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, f.content)
    written.push(f.path)
  }
  const manifest = readManifest(projectDir)
  const previous = manifest.blocks[plan.id]?.files || []
  const fresh = plan.files.map(({ path, source, variant, checksum: sum }) => ({
    path,
    source,
    variant,
    checksum: sum
  }))
  const kept = previous.filter((f) => !fresh.some((n) => n.path === f.path))
  manifest.blocks[plan.id] = {
    version: plan.version,
    files: [...kept, ...fresh].sort((a, b) => a.path.localeCompare(b.path))
  }
  writeManifest(projectDir, manifest)
  written.push(MANIFEST)
  return written
}

function findInManifest(projectDir, manifest, target) {
  const key = String(target || '').trim()
  if (manifest.blocks[key]) return { id: key, files: manifest.blocks[key].files }
  const asPath = toPosix(relative(projectDir, resolve(projectDir, key)))
  for (const [id, entry] of Object.entries(manifest.blocks)) {
    const file = entry.files.find((f) => f.path === asPath)
    if (file) return { id, files: [file] }
  }
  const n = normalize(key)
  const byName = Object.keys(manifest.blocks).filter(
    (id) => normalize(id.split('/').pop()) === n || normalize(id) === n
  )
  if (byName.length === 1) return { id: byName[0], files: manifest.blocks[byName[0]].files }
  return null
}

export function inspectFile(projectDir, webkit, file) {
  const canonicalPath = join(webkit.root, file.source)
  const canonical = read(canonicalPath)
  const local = read(join(projectDir, file.path))
  const base = { path: file.path, source: file.source, variant: file.variant }
  if (local == null) return { ...base, status: 'missing' }
  if (canonical == null) return { ...base, status: 'removed-upstream' }
  const canonicalSum = checksum(canonical)
  const localSum = checksum(local)
  return {
    ...base,
    status: canonicalSum === localSum ? 'identical' : 'modified',
    editedLocally: localSum !== file.checksum,
    upstreamChanged: canonicalSum !== file.checksum,
    canonical,
    local
  }
}

export function planDiff(projectDir, webkit, target) {
  const manifest = readManifest(projectDir)
  const hit = findInManifest(projectDir, manifest, target)
  if (!hit) {
    const known = Object.keys(manifest.blocks)
    return {
      ok: false,
      error: `"${target}" is not recorded in ${MANIFEST}${known.length ? ` (recorded: ${known.join(', ')})` : ''}. Copy blocks with \`npx ${PACKAGE_NAME} add <block>\` so they can be diffed.`
    }
  }
  const recordedVersion = manifest.blocks[hit.id]?.version || null
  const files = hit.files.map((file) => {
    const { canonical, local, ...rest } = inspectFile(projectDir, webkit, file)
    if (rest.status !== 'modified') return { ...rest, patch: '' }
    return {
      ...rest,
      patch: unifiedDiff(canonical, local, {
        oldLabel: `${PACKAGE_NAME}@${webkit.version}/${file.source}`,
        newLabel: file.path
      })
    }
  })
  return { ok: true, id: hit.id, recordedVersion, version: webkit.version, files }
}

export function blockDrift(projectDir, webkit) {
  if (!existsSync(join(projectDir, MANIFEST))) return []
  let manifest
  try {
    manifest = readManifest(projectDir)
  } catch (err) {
    return [{ severity: 'error', file: MANIFEST, message: `unreadable: ${err.message}` }]
  }
  const findings = []
  for (const [id, entry] of Object.entries(manifest.blocks)) {
    for (const file of entry.files || []) {
      const info = inspectFile(projectDir, webkit, file)
      if (info.status === 'missing') {
        findings.push({
          severity: 'warn',
          file: file.path,
          message: `block ${id} (${file.variant}) is recorded in ${MANIFEST} but the file is gone: remove the entry or copy it again with \`add ${id} --force\`.`
        })
      } else if (info.status === 'removed-upstream') {
        findings.push({
          severity: 'warn',
          file: file.path,
          message: `block ${id} no longer ships ${file.source} in ${PACKAGE_NAME}@${webkit.version}: look it up with \`npx ${PACKAGE_NAME} search ${id.split('/').pop()}\`.`
        })
      } else if (info.upstreamChanged) {
        findings.push({
          severity: 'warn',
          file: file.path,
          message: `the canonical ${id} (${file.variant}) changed since it was copied from ${entry.version || 'an older version'} to ${webkit.version}: review with \`npx ${PACKAGE_NAME} diff ${file.path}\`.`
        })
      }
    }
  }
  return findings
}
