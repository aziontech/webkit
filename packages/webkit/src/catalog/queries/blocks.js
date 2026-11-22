import {
  blockCard,
  expandQuery,
  FRAGMENT_NOTE,
  isExactBlock,
  scoreBlock
} from '../lib/block-search.js'
import { marketingPageIntent } from '../lib/marketing-page.js'
import { NOT_AVAILABLE, surfaceOf } from '../lib/results.js'
import { normalize, sameVariant, screenIntentOf } from '../lib/text.js'

const BLOCK_SECTIONS = ['sfc', 'guidelines']

const HOW_TO_USE_WITH_GUIDELINES =
  'Read `guidelines` first: when to use this screen and when not, what each building block is ' +
  "for, do and don't, the copy rules and the accessibility rules. Then copy this SFC as the " +
  'starting point of the screen and change only the content (copy, data, handlers, routes), ' +
  'following the guidelines. A block with `files` takes its data through typed props and emits ' +
  'its actions: copy each file next to the SFC (`webkit add` does it and fixes the imports), ' +
  'pass your records, `loading` and `error` as props, and handle the events; a variant imports ' +
  'the primary SFC and only passes it other props. Keep the components, their order, the props ' +
  'and the classes: they are the reviewed Azion layout. Pass `variant` to get another state of ' +
  'the same screen. Follow the listed skills.'

const HOW_TO_USE =
  'Copy this SFC as the starting point of the screen and change only the content (copy, data, ' +
  'handlers, routes). Keep the components, their order, the props and the classes: they are ' +
  'the reviewed Azion layout. Pass `variant` to get another state of the same screen. Follow ' +
  'the listed skills.'

function hidesFragments(fragments, nq) {
  if (fragments === false) return true
  return fragments !== true && screenIntentOf(nq)
}

function pageBoostFor(page) {
  return (id, p) =>
    page && (p.surface ?? 'app') === 'site' ? 120 + (id.startsWith('shell/') ? 40 : 0) : 0
}

export function searchBlocks(catalog, query, { surface, fragments } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const wantedSurface = surfaceOf(surface)
  const raw = String(query || '').trim()
  const nq = normalize(raw)
  const hideFragments = hidesFragments(fragments, nq)
  const entries = Object.entries(catalog.blocks || {})
    .filter(([, p]) => !wantedSurface || (p.surface ?? 'app') === wantedSurface)
    .filter(([id, p]) => !hideFragments || p.kind !== 'fragment' || isExactBlock(id, p, nq))
  const head = {
    ok: true,
    available: true,
    query: raw,
    ...(wantedSurface ? { surface: wantedSurface } : {})
  }
  if (!raw) {
    return { ...head, count: entries.length, matches: entries.map(([id, p]) => blockCard(id, p)) }
  }
  const expanded = expandQuery(raw)
  const pageBoost = pageBoostFor(marketingPageIntent(raw, wantedSurface))
  const matches = entries
    .map(([id, p]) => ({ id, p, score: scoreBlock(id, p, expanded) + pageBoost(id, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 5)
    .map((r) => blockCard(r.id, r.p, r.score))
  return {
    ...head,
    count: matches.length,
    matches,
    hint: matches.length
      ? 'Call get_block with the best id, read its guidelines, copy its SFC and change only the content (copy, data, handlers). Keep the components, their order and the classes.'
      : 'No block matches. Build from components: suggest_component, then get_component.'
  }
}

function movedVariant(aliases, from, variant) {
  if (!variant) return null
  return Object.keys(aliases).find((old) => {
    const [base, state] = old.split('#')
    return base === from && state && sameVariant(state, variant)
  })
}

function movedBlock(catalog, key, variant) {
  const aliases = catalog.blockAliases || {}
  const n = normalize(key)
  const from = aliases[key]
    ? key
    : Object.keys(aliases).find(
        (old) => !old.includes('#') && normalize(old.split('/').pop()) === n
      )
  if (!from) return null
  const variantAlias = movedVariant(aliases, from, variant)
  const renamed = variantAlias ? aliases[variantAlias] : null
  const [id, state] = (renamed || aliases[from]).split('#')
  return { from, id, variant: renamed ? state : variant || state || null }
}

function movedNote(moved, p) {
  const state = moved.variant && moved.variant !== p.primary ? `, state "${moved.variant}"` : ''
  return `Block "${moved.from}" was renamed in WebKit v6: it is now "${moved.id}"${state}. Use the new id.`
}

function blockIdOf(blocks, key) {
  if (blocks[key]) return key
  const n = normalize(key)
  return (
    Object.keys(blocks).find((pid) => normalize(pid.split('/').pop()) === n) ||
    Object.keys(blocks).find((pid) => normalize(blocks[pid].name) === n) ||
    null
  )
}

function resolveBlock(catalog, key, variant) {
  const blocks = catalog.blocks || {}
  const resolved = blockIdOf(blocks, key)
  if (resolved) return { resolved, variant, moved: null }
  const moved = movedBlock(catalog, key, variant)
  if (moved && blocks[moved.id])
    return { resolved: moved.id, variant: moved.variant || undefined, moved }
  return { resolved: null, variant, moved }
}

function missingBlock(catalog, key) {
  const search = searchBlocks(catalog, key)
  return {
    ok: false,
    available: true,
    found: false,
    id: key,
    suggestions: (search.matches || []).slice(0, 3).map((m) => m.id),
    message: `No block "${key}". Use search_blocks to find one by intent.`
  }
}

function blockBasics(p) {
  return {
    name: p.name,
    summary: p.summary,
    intents: p.intents || [],
    ...(p.steps ? { steps: p.steps } : {}),
    components: p.components || [],
    imports: p.imports || [],
    skills: p.skills || [],
    source: p.source,
    surface: p.surface ?? 'app',
    ...(p.kind === 'fragment' ? { kind: 'fragment', fragmentNote: FRAGMENT_NOTE } : {})
  }
}

function sourceFields(p, chosen, wanted) {
  if (!wanted.includes('sfc')) return {}
  return { sfc: chosen ? chosen.sfc : p.sfc, ...(p.files ? { files: p.files } : {}) }
}

function omittedFields(omitted) {
  if (!omitted.length) return {}
  return {
    omitted,
    omittedNote: `Call get_block again with sections ${JSON.stringify(omitted)} for the rest.`
  }
}

function blockContent(p, chosen, wanted) {
  const omitted = BLOCK_SECTIONS.filter((k) => !wanted.includes(k))
  return {
    variant: chosen ? chosen.name : p.primary,
    ...sourceFields(p, chosen, wanted),
    variants: [
      { name: p.primary, summary: 'primary' },
      ...(p.variants || []).map((v) => ({ name: v.name, summary: v.summary }))
    ],
    ...(p.guidelines && wanted.includes('guidelines') ? { guidelines: p.guidelines } : {}),
    ...omittedFields(omitted),
    howToUse: p.guidelines ? HOW_TO_USE_WITH_GUIDELINES : HOW_TO_USE
  }
}

function chosenVariant(p, variant) {
  if (!variant || sameVariant(variant, p.primary)) return { chosen: null, missing: false }
  const chosen = (p.variants || []).find((v) => sameVariant(v.name, variant)) ?? null
  return { chosen, missing: !chosen }
}

export function getBlock(catalog, id, { variant, sections } = {}) {
  const wanted = Array.isArray(sections) && sections.length ? sections : BLOCK_SECTIONS
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(id || '').trim()
  const target = resolveBlock(catalog, key, variant)
  if (!target.resolved) return missingBlock(catalog, key)
  const p = catalog.block(target.resolved)
  const { chosen, missing } = chosenVariant(p, target.variant)
  if (missing) {
    return {
      ok: false,
      available: true,
      found: false,
      id: target.resolved,
      variants: [p.primary, ...(p.variants || []).map((v) => v.name)],
      message: `Block "${target.resolved}" has no variant "${target.variant}".`
    }
  }
  const moved = target.moved
  return {
    ok: true,
    available: true,
    found: true,
    id: target.resolved,
    ...blockBasics(p),
    ...(moved ? { movedFrom: moved.from, note: movedNote(moved, p) } : {}),
    ...blockContent(p, chosen, wanted)
  }
}
