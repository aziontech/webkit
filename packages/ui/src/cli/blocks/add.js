import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, posix, relative } from 'node:path'

import { PACKAGE_NAME } from '../source.js'
import { checkImports, dependencyPieces, localImports, rewriteImports } from './imports.js'
import { checksum, MANIFEST, read, readManifest, toPosix, writeManifest } from './manifest.js'
import { resolveBlock } from './resolve.js'
import { suggestRoute, targetPaths } from './targets.js'

function stripHeading(markdown) {
  return markdown.replace(/^\s*#[^#\n][^\n]*\n+/, '')
}

function keepRules(projectDir, block, paths, opts) {
  const recorded = readManifest(projectDir).blocks[block.id]?.files || []
  const keepPrimary =
    Boolean(block.variant) &&
    !opts.force &&
    existsSync(join(projectDir, paths.primary)) &&
    recorded.some((f) => f.path === paths.primary)
  const keepExtra = (path) =>
    keepPrimary && existsSync(join(projectDir, path)) && recorded.some((f) => f.path === path)
  return { keepPrimary, keepExtra }
}

function blockTargets(block, paths) {
  return Object.fromEntries([
    [posix.normalize(block.meta.primary.file), paths.primary],
    ...paths.extras.map((extra) => [posix.normalize(extra.file), extra.path]),
    ...(block.variant ? [[posix.normalize(block.variant.file), paths.variant]] : [])
  ])
}

function blockPieces(block, paths, dependencies, { keepPrimary, keepExtra }) {
  return [
    ...(keepPrimary
      ? []
      : [{ path: paths.primary, file: block.meta.primary.file, variant: block.meta.primary.name }]),
    ...paths.extras
      .filter((extra) => !keepExtra(extra.path))
      .map((extra) => ({ path: extra.path, file: extra.file, variant: 'Data' })),
    ...dependencies.filter((piece) => !keepExtra(piece.path)),
    ...(block.variant
      ? [{ path: paths.variant, file: block.variant.file, variant: block.variant.name }]
      : [])
  ]
}

function pieceFile(projectDir, ui, block, targets, piece) {
  const original = readFileSync(join(block.dir, piece.file), 'utf8')
  const imports = localImports(original, posix.normalize(piece.file), targets, piece.path)
  const content = rewriteImports(original, imports)
  return {
    path: piece.path,
    source: toPosix(relative(ui.root, join(block.dir, piece.file))),
    variant: piece.variant,
    ...(Object.keys(imports).length ? { imports } : {}),
    content,
    checksum: checksum(content),
    exists: existsSync(join(projectDir, piece.path))
  }
}

function guidelinesFile(projectDir, block, paths, opts) {
  if (!opts.withGuidelines) return null
  const raw = read(join(block.dir, 'guidelines.md'))
  if (!raw) return null
  return {
    path: paths.guidelines,
    content: stripHeading(raw),
    exists: existsSync(join(projectDir, paths.guidelines))
  }
}

function sourceWarning(ui) {
  if (!ui.installed) {
    return `${PACKAGE_NAME} is not installed in this project: the block was taken from ${PACKAGE_NAME}@${ui.version} (the CLI). Install it before building.`
  }
  if (!ui.fromInstalled) {
    return `the installed ${PACKAGE_NAME}@${ui.installedVersion} ships no blocks/: the block was taken from ${PACKAGE_NAME}@${ui.version} (the CLI).`
  }
  return null
}

function addWarnings(block, paths, keepPrimary, ui, imports) {
  const warnings = []
  if (block.note) warnings.push(block.note)
  if (keepPrimary) {
    warnings.push(
      `${paths.primary} was added before and is kept as it is: only the ${block.variant.name} variant is copied.`
    )
  }
  const source = sourceWarning(ui)
  if (source) warnings.push(source)
  if (!ui.installed) return warnings
  for (const pkg of imports.packages.filter((p) => !p.ok)) {
    warnings.push(
      `the block imports ${pkg.name}, which is not installed: add it to your dependencies.`
    )
  }
  return warnings
}

function addErrors(ui, imports, clashes, opts) {
  const installed = ui.installedVersion ? `@${ui.installedVersion}` : ''
  const errors = imports.missing.map(
    (spec) =>
      `${spec} is not exported by the installed ${PACKAGE_NAME}${installed}: upgrade it to ${ui.version} or later.`
  )
  if (clashes.length && !opts.force) {
    errors.push(
      `${clashes.map((f) => f.path).join(', ')} already exist${clashes.length === 1 ? 's' : ''}: pass --force to overwrite, or --dest to put the block elsewhere.`
    )
  }
  return errors
}

export function planAdd(projectDir, ui, catalog, id, opts = {}) {
  const block = resolveBlock(ui, catalog, id, { variant: opts.variant })
  if (!block.ok) return { ok: false, errors: [block.message], suggestions: block.suggestions }

  const paths = targetPaths(projectDir, block, opts.dest)
  const keep = keepRules(projectDir, block, paths, opts)
  const targets = blockTargets(block, paths)
  const dependencies = dependencyPieces(block, paths, targets)
  const files = blockPieces(block, paths, dependencies, keep).map((piece) =>
    pieceFile(projectDir, ui, block, targets, piece)
  )
  const guidelines = guidelinesFile(projectDir, block, paths, opts)
  const imports = checkImports(
    projectDir,
    ui,
    files.map((f) => f.content)
  )
  const clashes = [...files, ...(guidelines ? [guidelines] : [])].filter((f) => f.exists)
  const errors = addErrors(ui, imports, clashes, opts)

  return {
    ok: errors.length === 0,
    id: block.id,
    name: block.meta.name,
    version: ui.version,
    viewsReason: paths.viewsReason,
    files,
    guidelines,
    imports,
    route: suggestRoute(projectDir, { id: block.id, name: block.meta.name, file: paths.primary }),
    errors,
    warnings: addWarnings(block, paths, keep.keepPrimary, ui, imports)
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
  const fresh = plan.files.map(({ path, source, variant, imports, checksum: sum }) => ({
    path,
    source,
    variant,
    ...(imports ? { imports } : {}),
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
