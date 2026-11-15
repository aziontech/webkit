import { COMPONENT_CATEGORIES } from '../../../../.claude/hooks/lib/component-categories.mjs'

const PROSE_KEYS = ['purpose', 'useWhen', 'avoidWhen', 'bestPractices']
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/
const PATH = /^[a-z][a-z0-9-]*(\/[a-z0-9-]+)+$/
const ATTRIBUTE = /^(data|aria|v)-/
const BLOCK_ROOTS = [
  'account',
  'ai',
  'auth',
  'create',
  'dashboard',
  'detail',
  'edit',
  'settings',
  'state',
  'view',
  'shell',
  'top-bar'
]

export function retiredReferenceNames(migration, blockAliases = {}) {
  return new Set([
    ...Object.keys(migration?.components || {}),
    ...Object.keys(migration?.removed || {}),
    ...Object.values(migration?.legacy?.paths || {}),
    ...Object.keys(blockAliases).map((id) => id.split('#')[0])
  ])
}

function relatedName(text) {
  const s = String(text).trim()
  if (s.startsWith('`')) return s.slice(1).split('`')[0]
  const head = s.split('`')[0].trim()
  return s.includes('`') && KEBAB.test(head) ? head : null
}

function backticked(text) {
  return [...String(text).matchAll(/`([^`\n]+)`/g)].map((m) => m[1].trim())
}

export function staleReferences(catalog, { retired = new Set(), details = (_, e) => e } = {}) {
  const known = new Set([
    ...Object.keys(catalog.imports || {}),
    ...Object.keys(catalog.aliases || {}),
    ...Object.keys(catalog.blocks || {}),
    ...Object.keys(catalog.blocks || {}).map((id) => id.split('/').pop())
  ])
  const roots = new Set([...COMPONENT_CATEGORIES, ...BLOCK_ROOTS])
  const problems = []
  const report = (name, field, ref, why) => problems.push({ name, field, ref, why })

  for (const [name, entry] of Object.entries(catalog.imports || {})) {
    if (!['component', 'subcomponent'].includes(entry.kind)) continue
    const e = details(name, entry)
    const check = (field, ref) => {
      if (known.has(ref) || ATTRIBUTE.test(ref)) return
      if (PATH.test(ref) && roots.has(ref.split('/')[0])) {
        report(name, field, ref, 'is a folder path, not an import or a block id')
      } else if (ref.includes('-') && KEBAB.test(ref) && retired.has(ref)) {
        report(name, field, ref, 'was renamed or removed in v6')
      } else if (KEBAB.test(ref) && ref.endsWith('-block')) {
        report(name, field, ref, 'names a block that does not exist')
      }
    }
    for (const field of PROSE_KEYS) {
      const value = e[field]
      for (const text of Array.isArray(value) ? value : value ? [value] : []) {
        for (const ref of backticked(text)) check(field, ref)
      }
    }
    for (const item of e.related || []) {
      const text = typeof item === 'string' ? item : JSON.stringify(item)
      const lead = relatedName(text)
      if (lead && !known.has(lead)) {
        report(name, 'related', lead, 'is not an export, a catalog alias or a block id')
      }
      for (const ref of backticked(text.startsWith('`') ? text : `\`${text}`).slice(1)) {
        check('related', ref)
      }
    }
  }
  return problems
}

export function formatStaleReferences(problems) {
  return problems.map((p) => `${p.name} (${p.field}): \`${p.ref}\` ${p.why}`)
}
