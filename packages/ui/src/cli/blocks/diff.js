import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { PACKAGE_NAME } from '../source.js'
import { unifiedDiff } from '../text-diff.js'
import { rewriteImports } from './imports.js'
import { checksum, findInManifest, MANIFEST, read, readManifest } from './manifest.js'

function inspectFile(projectDir, ui, file) {
  const canonicalPath = join(ui.root, file.source)
  const shipped = read(canonicalPath)
  const canonical = shipped == null ? null : rewriteImports(shipped, file.imports)
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

export function planDiff(projectDir, ui, target) {
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
    const { canonical, local, ...rest } = inspectFile(projectDir, ui, file)
    if (rest.status !== 'modified') return { ...rest, patch: '' }
    return {
      ...rest,
      patch: unifiedDiff(canonical, local, {
        oldLabel: `${PACKAGE_NAME}@${ui.version}/${file.source}`,
        newLabel: file.path
      })
    }
  })
  return { ok: true, id: hit.id, recordedVersion, version: ui.version, files }
}

export function blockDrift(projectDir, ui) {
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
      const info = inspectFile(projectDir, ui, file)
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
          message: `block ${id} no longer ships ${file.source} in ${PACKAGE_NAME}@${ui.version}: look it up with \`npx ${PACKAGE_NAME} search ${id.split('/').pop()}\`.`
        })
      } else if (info.upstreamChanged) {
        findings.push({
          severity: 'warn',
          file: file.path,
          message: `${
            entry.version === ui.version
              ? `the canonical ${id} (${file.variant}) in the installed ${PACKAGE_NAME}@${ui.version} ` +
                `differs from the copy recorded at the same version (the package was rebuilt or the block ` +
                `source changed under it)`
              : `the canonical ${id} (${file.variant}) changed since it was copied from ${entry.version || 'an older version'} to ${ui.version}`
          }: review with \`npx ${PACKAGE_NAME} diff ${file.path}\`.`
        })
      }
    }
  }
  return findings
}
