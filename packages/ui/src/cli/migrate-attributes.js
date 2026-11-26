import { escapeRe, kebab, scanTag } from './migrate-syntax.js'

function renameEvent(attrs, from, to) {
  const name = escapeRe(from)
  return attrs.replace(
    new RegExp(`(\\s)(@|v-on:)${name}(?=[\\s=/>.]|$)`, 'g'),
    (all, sp, on) => `${sp}${on}${to}`
  )
}

function outsideQuotes(text, fn) {
  return text
    .split(/("[^"]*"|'[^']*')/)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join('')
}

function mapLiteral(expr, values) {
  const m = expr.trim().match(/^(['`])([a-z][a-z0-9-]*)\1$/)
  if (!m) return null
  const [, q, v] = m
  if (!Object.hasOwn(values, v) || /^(true|false)$/.test(values[v])) return expr
  return expr.replace(`${q}${v}${q}`, `${q}${values[v]}${q}`)
}

const STRING_LITERAL = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g

function boundValueKind(expr, values) {
  const literals = [...expr.matchAll(STRING_LITERAL)]
  if (!literals.length) return 'opaque'
  const old = (v) => Object.hasOwn(values, v) && values[v] !== v && !/^(true|false)$/.test(v)
  const dynamic = literals.some(([, q, v]) => q === '`' && v.includes('${'))
  return dynamic || literals.some(([, , v]) => old(v)) ? 'old' : 'current'
}

export const MIGRATE_OK = 'webkit-migrate-ok'

export function acknowledged(source, index) {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1
  const previous = source.lastIndexOf('\n', lineStart - 2) + 1
  return source.slice(previous, index).includes(MIGRATE_OK)
}

function renameModelBindings(attrs, name, toKebab, toModel) {
  return attrs
    .replace(
      new RegExp(`(\\s)v-model:${name}(?=[\\s=/>])`, 'g'),
      toModel ? '$1v-model' : `$1v-model:${toKebab}`
    )
    .replace(new RegExp(`(\\s)(@|v-on:)update:${name}(?=[\\s=/>])`, 'g'), `$1$2update:${toKebab}`)
}

function boundValue(expr, rule, report) {
  if (!rule.values) return expr
  const literal = mapLiteral(expr, rule.values)
  if (literal !== null) return literal
  report(expr, boundValueKind(expr, rule.values))
  return expr
}

function renameBoundProp(attrs, name, rule, toKebab, report) {
  const inverts = rule.values && rule.values.true === 'false' && rule.values.false === 'true'
  return attrs.replace(
    new RegExp(`(\\s)(:|v-bind:)${name}(\\s*=\\s*)(?:(")([^"]*)"|(')([^']*)')`, 'g'),
    (all, sp, bind, eq, dq, dv, sq, sv) => {
      const q = dq || sq
      const expr = dq ? dv : sv
      if (inverts) return `${sp}${bind}${toKebab}${eq}${q}!(${expr})${q}`
      return `${sp}${bind}${toKebab}${eq}${q}${boundValue(expr, rule, report)}${q}`
    }
  )
}

function staticProp(rule, toKebab, { sp, eq, q, value }) {
  if (rule.moves && Object.hasOwn(rule.moves, value)) {
    return `${sp}${kebab(rule.moves[value])}${eq}${q}${value}${q}`
  }
  if (rule.expand && Object.hasOwn(rule.expand, value)) {
    return `${sp}${Object.entries(rule.expand[value])
      .map(([prop, next]) => `${kebab(prop)}${eq}${q}${next}${q}`)
      .join(' ')}`
  }
  const mapped = rule.values && value in rule.values ? rule.values[value] : value
  if (rule.values && (mapped === 'true' || mapped === 'false')) {
    return `${sp}:${toKebab}${eq}${q}${mapped}${q}`
  }
  return `${sp}${toKebab}${eq}${q}${mapped}${q}`
}

function renameStaticProp(attrs, name, rule, toKebab) {
  return attrs.replace(
    new RegExp(`(\\s)${name}(\\s*=\\s*)(?:(")([^"]*)"|(')([^']*)')`, 'g'),
    (all, sp, eq, dq, dv, sq, sv) =>
      staticProp(rule, toKebab, { sp, eq, q: dq || sq, value: dq ? dv : sv })
  )
}

function renameBareProp(attrs, name, rule, toKebab) {
  return outsideQuotes(attrs, (part) =>
    part.replace(new RegExp(`(\\s)${name}(?=[\\s/>]|$)`, 'g'), (all, sp) => {
      if (rule.values && 'true' in rule.values) return `${sp}:${toKebab}="${rule.values.true}"`
      return `${sp}${toKebab}`
    })
  )
}

function renameProp(attrs, oldProp, rule, onManual) {
  const toKebab = kebab(rule.to)
  const report = (expr, kind) => onManual(oldProp, expr, kind)
  let out = attrs
  for (const form of new Set([oldProp, kebab(oldProp)])) {
    const name = escapeRe(form)
    out = renameModelBindings(out, name, toKebab, rule.to === 'modelValue')
    out = renameBoundProp(out, name, rule, toKebab, report)
    out = renameStaticProp(out, name, rule, toKebab)
    out = renameBareProp(out, name, rule, toKebab)
  }
  return out
}

export function renameAttributes(attrs, rules, onManual = () => {}) {
  let out = attrs
  for (const [oldProp, ruleSpec] of Object.entries(rules)) {
    if (oldProp.startsWith('#')) continue
    if (oldProp.startsWith('@')) {
      if (typeof ruleSpec === 'string') out = renameEvent(out, oldProp.slice(1), ruleSpec)
      continue
    }
    const rule = typeof ruleSpec === 'string' ? { to: ruleSpec } : ruleSpec
    if (!rule.removed) out = renameProp(out, oldProp, rule, onManual)
  }
  return out
}

const VOID_ELEMENTS = new Set(
  'area base br col embed hr img input link meta param source track wbr'.split(' ')
)

const SLOT_NAME = (name) => new RegExp(`(\\s)(#|v-slot:)${escapeRe(name)}(?=[\\s=/>]|$)`, 'g')

function nextTag(source, from) {
  const lt = source.indexOf('<', from)
  if (lt < 0) return null
  if (source.startsWith('<!--', lt)) {
    const close = source.indexOf('-->', lt)
    return { skip: close < 0 ? source.length : close + 3 }
  }
  const closing = source[lt + 1] === '/'
  const m = source.slice(lt + (closing ? 2 : 1)).match(/^[A-Za-z][\w.:-]*/)
  if (!m) return { skip: lt + 1 }
  return { lt, closing, name: m[0] }
}

function slotEdit(source, nameEnd, end, slots) {
  const before = source.slice(nameEnd, end)
  let attrs = before
  for (const [oldSlot, newSlot] of slots) {
    attrs = attrs.replace(SLOT_NAME(oldSlot), (all, sp, sigil) => `${sp}${sigil}${newSlot}`)
  }
  return attrs === before ? null : [nameEnd, end, attrs]
}

const opensElement = (source, end, name) =>
  source[end - 1] !== '/' && !VOID_ELEMENTS.has(name.toLowerCase())

export function renameChildSlots(source, from, slots) {
  const edits = []
  let depth = 0
  let i = from
  while (i < source.length) {
    const tag = nextTag(source, i)
    if (!tag) break
    if (tag.skip !== undefined) {
      i = tag.skip
      continue
    }
    if (tag.closing) {
      if (depth === 0) break
      depth -= 1
      i = tag.lt + 2 + tag.name.length
      continue
    }
    const nameEnd = tag.lt + 1 + tag.name.length
    const end = scanTag(source, nameEnd)
    if (end < 0) break
    const edit =
      depth === 0 && tag.name === 'template' ? slotEdit(source, nameEnd, end, slots) : null
    if (edit) edits.push(edit)
    if (opensElement(source, end, tag.name)) depth += 1
    i = end + 1
  }
  return edits
}
