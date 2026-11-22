import { existsSync, readFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'

import { getBlock } from '../../catalog/queries.js'
import { PACKAGE_NAME } from '../source.js'
import { normalize, toPosix } from './manifest.js'

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

function movedVariant(catalog, key, hit, variant) {
  const moved = variant ? getBlock(catalog, key, { variant }) : hit
  if (moved.found && moved.variant && moved.variant !== catalog.blocks[hit.id]?.primary) {
    return moved.variant
  }
  return variant
}

function locateBlock(webkit, catalog, key, variant) {
  if (existsSync(join(webkit.root, 'blocks', key, 'block.json'))) {
    return { id: key, variant, note: null }
  }
  const hit = getBlock(catalog, key)
  if (!hit.found) {
    return {
      error: {
        ok: false,
        message: `No block "${key}" in ${PACKAGE_NAME}@${webkit.version}.`,
        suggestions: hit.suggestions || []
      }
    }
  }
  if (!hit.movedFrom) return { id: hit.id, variant, note: null }
  return { id: hit.id, variant: movedVariant(catalog, key, hit, variant), note: hit.note }
}

export function resolveBlock(webkit, catalog, id, { variant } = {}) {
  const located = locateBlock(webkit, catalog, String(id || '').trim(), variant)
  if (located.error) return located.error
  const { id: resolvedId, variant: wantedVariant, note } = located
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
