import { getComponent, getPattern, searchComponents, searchPatterns } from '../mcp/queries.js'
import { PACKAGE_NAME } from './source.js'

const words = (s) =>
  String(s || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2)

export function searchExamples(catalog, query, limit = 8) {
  const terms = words(query)
  if (!terms.length) return []
  const hits = []
  for (const sub of catalog.subpaths) {
    if (catalog.getEntry(sub)?.kind !== 'component') continue
    for (const example of catalog.examples(sub)) {
      const name = words(example.name).join(' ')
      const text = `${sub.replace(/-/g, ' ')} ${name} ${words(example.summary).join(' ')}`
      let score = 0
      for (const t of terms) {
        if (sub.split('-').includes(t)) score += 10
        if (name.split(' ').includes(t)) score += 6
        else if (text.includes(t)) score += 2
      }
      if (score > 0) {
        hits.push({ component: sub, name: example.name, summary: example.summary || '', score })
      }
    }
  }
  return hits
    .sort((a, b) => b.score - a.score || a.component.localeCompare(b.component))
    .slice(0, limit)
}

export function runSearch(catalog, query) {
  const blocks = searchPatterns(catalog, query)
  const components = searchComponents(catalog, query)
  return {
    ok: true,
    query,
    version: catalog.version,
    blocks: (blocks.matches || []).map((m) => ({
      id: m.id,
      name: m.name,
      summary: m.summary,
      score: m.score,
      variants: m.variants
    })),
    components: (components.matches || []).map((c) => ({
      name: c.name,
      import: c.treeShakeableImport,
      category: c.category,
      score: c.score,
      ...(c.note ? { note: c.note } : {})
    })),
    examples: searchExamples(catalog, query)
  }
}

const clip = (s, n = 160) => {
  const text = String(s || '').replace(/\s+/g, ' ')
  return text.length > n ? `${text.slice(0, n - 1)}…` : text
}

export function formatSearch(result) {
  const out = [`webkit ${result.version} — "${result.query}"`, '']
  out.push(`Blocks (${result.blocks.length})`)
  for (const b of result.blocks) out.push(`  ${b.id}  ${clip(b.summary, 110)}`)
  if (!result.blocks.length) out.push('  none')
  out.push('', `Components (${result.components.length})`)
  for (const c of result.components) {
    out.push(`  ${c.name.padEnd(24)} ${c.import}${c.note ? `  (${clip(c.note, 80)})` : ''}`)
  }
  if (!result.components.length) out.push('  none')
  out.push('', `Examples (${result.examples.length})`)
  for (const e of result.examples) out.push(`  ${e.component} › ${e.name}`)
  if (!result.examples.length) out.push('  none')
  out.push('', `Next: npx ${PACKAGE_NAME} view <id>   ·   npx ${PACKAGE_NAME} add <block-id>`, '')
  return out.join('\n')
}

export function runView(catalog, id, { variant, example } = {}) {
  const key = String(id || '').trim()
  const looksLikeBlock = key.includes('/') || Boolean(variant)
  const component = looksLikeBlock ? null : getComponent(catalog, key)
  if (component?.found) {
    const examples = component.examples || []
    const chosen = example
      ? examples.find((e) => e.name.toLowerCase() === String(example).toLowerCase())
      : examples[0]
    if (example && !chosen) {
      return {
        ok: false,
        error: `${component.name} has no example "${example}". Examples: ${examples.map((e) => e.name).join(', ') || 'none'}.`
      }
    }
    const { examples: _all, ...rest } = component
    return {
      ok: true,
      kind: 'component',
      ...rest,
      examples: examples.map((e) => ({ name: e.name, summary: e.summary || '' })),
      example: chosen ? { name: chosen.name, sfc: chosen.sfc } : null
    }
  }
  const block = getPattern(catalog, key, variant ? { variant } : {})
  if (block.found) return { kind: 'block', ...block }
  if (component && !looksLikeBlock) {
    return {
      ok: false,
      error: `No component or block "${key}".`,
      suggestions: [...(component.suggestions || []), ...(block.suggestions || [])]
    }
  }
  return {
    ok: false,
    error: block.variants
      ? block.message
      : `No block "${key}". Find one with: npx ${PACKAGE_NAME} search <words>`,
    suggestions: block.suggestions || []
  }
}

export function formatView(result) {
  const out = []
  if (result.kind === 'block') {
    out.push(`${result.id} — ${result.name} (block, ${result.surface})`, '')
    if (result.note) out.push(`NOTE ${result.note}`, '')
    out.push(result.summary, '')
    out.push(`Variants: ${result.variants.map((v) => v.name).join(', ')}`)
    out.push(`Imports: ${result.imports.join(', ')}`)
    if (result.skills.length) out.push(`Skills: ${result.skills.join(', ')}`)
    out.push(
      '',
      `Copy it: npx ${PACKAGE_NAME} add ${result.id}${result.variant !== result.variants[0]?.name ? ` --variant ${result.variant}` : ''}`
    )
    if (result.guidelines) out.push('', '--- guidelines ---', result.guidelines.trim())
    out.push('', `--- ${result.variant}.vue ---`, result.sfc.trimEnd(), '')
    return out.join('\n')
  }
  out.push(
    `${result.name} — ${result.binding} (${result.kind}, ${result.category || 'uncategorised'})`
  )
  if (result.note) out.push(`NOTE ${result.note}`)
  out.push(`import ${result.binding} from '${result.treeShakeableImport}'`, '')
  if (result.purpose) out.push(result.purpose, '')
  if (result.setup) out.push(`Setup: ${result.setup}`, '')
  if (result.useWhen.length) out.push('Use when:', ...result.useWhen.map((u) => `  - ${u}`), '')
  if (result.avoidWhen.length)
    out.push('Avoid when:', ...result.avoidWhen.map((u) => `  - ${u}`), '')
  if (result.props.length) {
    out.push('Props:')
    for (const p of result.props) {
      out.push(`  ${p.name}: ${p.type}${p.default && p.default !== '—' ? ` = ${p.default}` : ''}`)
    }
    out.push('')
  }
  if (result.events.length) out.push(`Events: ${result.events.map((e) => e.name).join(', ')}`)
  if (result.slots.length) out.push(`Slots: ${result.slots.map((s) => s.name).join(', ')}`)
  if (result.subcomponents.length) out.push(`Parts: ${result.subcomponents.join(', ')}`)
  if (result.examples.length) {
    out.push(`Examples: ${result.examples.map((e) => e.name).join(', ')}`)
  }
  if (result.example) {
    out.push('', `--- example: ${result.example.name} ---`, result.example.sfc.trimEnd())
  }
  out.push('')
  return out.join('\n')
}
