import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

import { PACKAGE_NAME } from '../source.js'

export const MANIFEST = 'azion-ui.blocks.json'

export const toPosix = (p) => p.split(sep).join('/')

export const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)

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

export const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

export function findInManifest(projectDir, manifest, target) {
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
