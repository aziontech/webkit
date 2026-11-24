import { loadCatalog } from '../lib/catalog.js'
import {
  isChartPaletteClass,
  isChartPaletteObject,
  isChartPaletteStyle
} from '../lib/chart-palette.js'
import { LAYOUT_CLASS_FAMILIES, nonLayoutClasses } from '../lib/layout-classes.js'
import { ctxCwd, templateBodyVisitorFactory } from '../lib/rule-utils.js'

const WEBKIT_TAG_KINDS = new Set(['component', 'root', 'subcomponent'])

const STYLE_ATTRS = new Set(['class', 'style'])

function staticStyleAttr(attr) {
  const name = attr.key?.name
  return STYLE_ATTRS.has(name) ? { attr: name, bound: false, value: attr.value?.value ?? '' } : null
}

function boundStyleAttr(attr) {
  if (attr.key?.name?.name !== 'bind') return null
  const arg = attr.key?.argument
  const argName = arg && arg.type === 'VIdentifier' ? arg.name : null
  return STYLE_ATTRS.has(argName)
    ? { attr: argName, bound: true, expression: attr.value?.expression ?? null }
    : null
}

function styleAttr(attr) {
  if (!attr || attr.type !== 'VAttribute') return null
  return attr.directive ? boundStyleAttr(attr) : staticStyleAttr(attr)
}

function paletteStyle(hit) {
  return hit.bound ? isChartPaletteObject(hit.expression) : isChartPaletteStyle(hit.value)
}

function styleFinding(hit, tag, allowed) {
  if (hit.attr === 'class' && !hit.bound) {
    const rejected = nonLayoutClasses(hit.value).filter((cls) => !isChartPaletteClass(cls))
    if (!rejected.length) return null
    return { messageId: 'overrideClasses', data: { classes: rejected.join(' '), tag, allowed } }
  }
  const written = hit.bound ? `:${hit.attr}` : hit.attr
  return { messageId: 'override', data: { written, tag, allowed } }
}

function checkAttributes(context, node, checkStyle) {
  const allowed = LAYOUT_CLASS_FAMILIES.join(', ')
  for (const attr of node.startTag?.attributes || []) {
    const hit = styleAttr(attr)
    if (!hit) continue
    if (hit.attr === 'style' && (!checkStyle || paletteStyle(hit))) continue
    const finding = styleFinding(hit, node.rawName, allowed)
    if (finding) context.report({ node: attr, ...finding })
  }
}

function bindingForTag(bindings, rawName) {
  if (bindings.has(rawName)) return rawName
  const dot = rawName.indexOf('.')
  if (dot > 0) {
    const base = rawName.slice(0, dot)
    if (bindings.has(base)) return base
  }
  return null
}

function importVisitor(catalog, allow, bindings) {
  return {
    ImportDeclaration(node) {
      const src = node.source.value
      if (typeof src !== 'string' || !src.startsWith(catalog.prefix)) return
      const sub = src.slice(catalog.prefix.length)
      const entry = catalog.getEntry(sub)
      if (!entry || !WEBKIT_TAG_KINDS.has(entry.kind)) return
      if (entry.styleSeam || allow.has(sub)) return
      const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
      if (!def) return
      if (allow.has(def.local.name)) return
      bindings.set(def.local.name, { sub })
    }
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow overriding a webkit component’s styles via class/style on its tag; compose in ' +
        'slots or use a personalizable component. A static class made only of layout utilities ' +
        '(how the box sits in its parent: w-full, h-full, min/max width and height, ' +
        'flex-1/auto/initial/none, grow, basis-*, shrink-0, self/justify-self/place-self, order, ' +
        'grid column and row placement, and logical margins), each optionally behind a ' +
        'breakpoint prefix (sm: to 2xl:), is allowed, and so is setting the chart palette ' +
        'variables (--chart-series-1..8, --chart-sequential-1..7, ' +
        '--chart-diverging-negative/neutral/positive) through a static style, an object-literal ' +
        ':style or [--chart-…:value] classes.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
          checkStyle: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      override:
        "Avoid setting {{written}} on the webkit component '<{{tag}}>' — it overrides " +
        'design-system styles. Compose inside its slots, or use a component built to be ' +
        'personalized (style_seam). Only a static class of layout utilities is allowed ' +
        '({{allowed}}), plus the chart palette variables --chart-series-1..8, ' +
        '--chart-sequential-1..7 and --chart-diverging-*.',
      overrideClasses:
        "Avoid the class(es) {{classes}} on the webkit component '<{{tag}}>' — they override " +
        'design-system styles. Only layout utilities are allowed on a webkit tag ({{allowed}}), ' +
        'plus [--chart-…:value] classes for the chart palette variables. Put the rest on a ' +
        'wrapper element or compose inside its slots.'
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const opts = context.options[0] || {}
    const allow = new Set(opts.allow || [])
    const checkStyle = opts.checkStyle !== false
    const bindings = new Map()
    const scriptVisitor = importVisitor(catalog, allow, bindings)
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor
    const templateVisitor = {
      VElement(node) {
        if (!node.rawName || !bindingForTag(bindings, node.rawName)) return
        checkAttributes(context, node, checkStyle)
      }
    }
    return factory(templateVisitor, scriptVisitor)
  }
}
