import { existsSync, rmSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'

import { appSourceFiles, specifiersIn } from '../css-sources.js'
import { PACKAGE_NAME } from '../source.js'
import { findInManifest, MANIFEST, read, readManifest, toPosix, writeManifest } from './manifest.js'

function insideProject(projectDir, path) {
  const rel = relative(resolve(projectDir), resolve(projectDir, path))
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

function guidelinesOf(path) {
  return path.endsWith('.vue') ? `${path.slice(0, -'.vue'.length)}.guidelines.md` : null
}

function importersOf(projectDir, removed) {
  const gone = new Set(removed.map((path) => resolve(projectDir, path)))
  const out = []
  for (const file of appSourceFiles(projectDir)) {
    if (gone.has(file)) continue
    const text = read(file) ?? ''
    for (const spec of specifiersIn(text)) {
      if (!spec.startsWith('.')) continue
      const target = resolve(dirname(file), spec)
      const hit = [target, `${target}.vue`, `${target}.ts`].find((candidate) => gone.has(candidate))
      if (hit) out.push({ file: toPosix(relative(projectDir, file)), imports: spec })
    }
  }
  return out
}

export function planRemove(projectDir, target) {
  const manifest = readManifest(projectDir)
  const hit = findInManifest(projectDir, manifest, target)
  if (!hit) {
    const known = Object.keys(manifest.blocks)
    return {
      ok: false,
      error: `"${target}" is not recorded in ${MANIFEST}${known.length ? ` (recorded: ${known.join(', ')})` : ''}. Only blocks copied with \`npx ${PACKAGE_NAME} add <block>\` can be removed.`
    }
  }
  const whole = hit.files.length === (manifest.blocks[hit.id]?.files || []).length
  const recorded = hit.files.map((file) => file.path)
  const extras = whole
    ? manifest.blocks[hit.id].files
        .map((file) => guidelinesOf(file.path))
        .filter((path) => path && !recorded.includes(path))
    : []
  const paths = [...new Set([...recorded, ...extras])]
  const outside = paths.filter((path) => !insideProject(projectDir, path))
  const files = paths
    .filter((path) => insideProject(projectDir, path))
    .map((path) => ({ path, exists: existsSync(join(projectDir, path)) }))
    .filter((file) => file.exists || recorded.includes(file.path))
  return {
    ok: true,
    id: hit.id,
    whole,
    files,
    outside,
    importers: importersOf(
      projectDir,
      files.map((file) => file.path)
    )
  }
}

export function applyRemove(projectDir, plan) {
  const removed = []
  for (const file of plan.files) {
    if (!file.exists || !insideProject(projectDir, file.path)) continue
    rmSync(join(projectDir, file.path), { force: true })
    removed.push(file.path)
  }
  const manifest = readManifest(projectDir)
  const entry = manifest.blocks[plan.id]
  if (entry) {
    const gone = new Set(plan.files.map((file) => file.path))
    const left = entry.files.filter((file) => !gone.has(file.path))
    if (left.length) manifest.blocks[plan.id] = { ...entry, files: left }
    else delete manifest.blocks[plan.id]
    writeManifest(projectDir, manifest)
  }
  return removed
}
