import { pascalCase } from './migrate-syntax.js'

export const BLOCK_MANIFEST = 'azion-ui.blocks.json'

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
