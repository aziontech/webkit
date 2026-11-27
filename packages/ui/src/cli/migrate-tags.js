import {
  acknowledged,
  MIGRATE_OK,
  renameAttributes,
  renameChildSlots
} from './migrate-attributes.js'
import { escapeRe, kebab, PREFIX, scanTag } from './migrate-syntax.js'

function removedPropWarnings(attrs, rules, { subpath, binding }) {
  const warnings = []
  for (const [prop, spec] of Object.entries(rules)) {
    if (typeof spec === 'string' || !spec.removed) continue
    const used = [...new Set([prop, kebab(prop)])].some((form) =>
      new RegExp(`\\s(?::|v-bind:)?${escapeRe(form)}(?=[\\s=/>]|$)`).test(attrs)
    )
    if (used) {
      warnings.push(
        `${PREFIX}${subpath}: <${binding}> prop ${prop} was removed in v6: ${spec.removed}`
      )
    }
  }
  return warnings
}

function manualValueWarning(rules, { subpath, binding }, prop, expr, kind) {
  const { values } = rules[prop]
  const old = Object.keys(values).filter((v) => values[v] !== v)
  const tag = `${PREFIX}${subpath}: <${binding}> :${kebab(prop)}="${expr}"`
  return kind === 'opaque'
    ? `${tag} is bound to a value migrate cannot read: make sure it never yields ` +
        `${old.map((v) => `'${v}' (now '${values[v]}')`).join(', ')}, then put <!-- ${MIGRATE_OK} ` +
        `--> on the line above the tag`
    : `${tag} is a bound expression; map its ${old.join(', ')} values by hand (or, when only a comparison keeps an old value, put <!-- ${MIGRATE_OK} --> on the line above the tag)`
}

function childSlotEdits(source, end, rules) {
  const slots = Object.entries(rules)
    .filter(([key, to]) => key.startsWith('#') && typeof to === 'string')
    .map(([key, to]) => [key.slice(1), to])
  if (!slots.length || source[end - 1] === '/') return []
  return renameChildSlots(source, end + 1, slots)
}

function tagEdits(source, tag, warnings) {
  const { index, start, end, rules } = tag
  const edits = childSlotEdits(source, end, rules)
  const attrs = source.slice(start, end)
  warnings.push(...removedPropWarnings(attrs, rules, tag))
  const reviewed = acknowledged(source, index)
  const renamed = renameAttributes(attrs, rules, (prop, expr, kind) => {
    if (kind === 'current' || reviewed) return
    warnings.push(manualValueWarning(rules, tag, prop, expr, kind))
  })
  if (renamed !== attrs) edits.push([start, end, renamed])
  return edits
}

function applyEdits(source, edits) {
  edits.sort((a, b) => a[0] - b[0])
  let result = ''
  let cursor = 0
  for (const [start, end, text] of edits) {
    if (start < cursor) continue
    result += source.slice(cursor, start) + text
    cursor = end
  }
  return result + source.slice(cursor)
}

function bindingEdits(source, binding, base, props, warnings) {
  const tagRe = new RegExp(
    `<(${escapeRe(binding)}(?:\\.([A-Z][\\w$]*))?|${escapeRe(kebab(binding))})(?=[\\s/>])`,
    'g'
  )
  const edits = []
  let cursor = 0
  for (const m of source.matchAll(tagRe)) {
    const part = m[2] && m[2] !== 'Root' ? m[2] : null
    const subpath = part ? `${base}-${kebab(part)}` : base
    const rules = props[subpath]
    const start = m.index + m[0].length
    if (!rules || start < cursor) continue
    const end = scanTag(source, start)
    if (end < 0) continue
    edits.push(
      ...tagEdits(source, { index: m.index, start, end, rules, subpath, binding }, warnings)
    )
    cursor = end
  }
  return edits
}

export function migrateTags(source, bindings, props, { changes, warnings }) {
  let out = source
  for (const [binding, base] of bindings) {
    const edits = bindingEdits(out, binding, base, props, warnings)
    if (!edits.length) continue
    out = applyEdits(out, edits)
    changes.push(`<${binding}> props, slots and events`)
  }
  return out
}
