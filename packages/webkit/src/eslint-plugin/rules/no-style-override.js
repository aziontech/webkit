// Discourages consumers from re-styling a webkit component: flags `class` / `:class` /
// `style` / `:style` set directly on a webkit component TAG in a template. The design
// system owns each component's appearance; a consumer override defeats the tokens and
// makes upgrades unpredictable. Consumers should compose inside slots (their OWN markup
// is never flagged) or use a component built to be personalized.
//
// Escape hatch (a component is a legitimate "style seam"):
//   - catalog entry.styleSeam === true  (opt-in via spec `style_seam: true`), or
//   - the rule's `options.allow` lists the binding name or the kebab subpath, or
//   - a per-call-site `// eslint-disable-next-line webkit/no-style-override`.
//
// Feasible with the existing infra: binding->tag mapping mirrors prefer-tree-shakeable-root;
// template attribute inspection mirrors no-hardcoded-color's defineTemplateBodyVisitor.
// Fail-open: no catalog -> no webkit bindings known -> no-op.

import { loadCatalog } from '../catalog.js'
import { ctxCwd, templateBodyVisitorFactory } from '../util.js'

const WEBKIT_TAG_KINDS = new Set(['component', 'root', 'subcomponent'])

/** Returns { attr: 'class'|'style', bound } when the attribute is class/style, else null. */
function styleAttr(attr) {
  if (!attr || attr.type !== 'VAttribute') return null
  if (!attr.directive) {
    const name = attr.key?.name
    return name === 'class' || name === 'style' ? { attr: name, bound: false } : null
  }
  // directive: v-bind:class / :class / :style
  if (attr.key?.name?.name !== 'bind') return null
  const arg = attr.key?.argument
  const argName = arg && arg.type === 'VIdentifier' ? arg.name : null
  return argName === 'class' || argName === 'style' ? { attr: argName, bound: true } : null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow overriding a webkit component’s styles via class/style on its tag; compose in slots or use a personalizable component.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          // Binding names (e.g. "CardBox") or kebab subpaths (e.g. "card-box") to exempt.
          allow: { type: 'array', items: { type: 'string' } },
          // When false, only class/:class is flagged (style/:style allowed). Default true.
          checkStyle: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      override:
        "Avoid setting {{written}} on the webkit component '<{{tag}}>' — it overrides design-system styles. Compose inside its slots, or use a component built to be personalized (style_seam)."
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const prefix = catalog.prefix

    const opts = context.options[0] || {}
    const allow = new Set(opts.allow || [])
    const checkStyle = opts.checkStyle !== false

    // binding name -> { sub } for webkit component/root/subcomponent default imports that
    // are NOT exempt (styleSeam / allow-listed).
    const bindings = new Map()

    const scriptVisitor = {
      ImportDeclaration(node) {
        const src = node.source.value
        if (typeof src !== 'string' || !src.startsWith(prefix)) return
        const sub = src.slice(prefix.length)
        const entry = catalog.getEntry(sub)
        if (!entry || !WEBKIT_TAG_KINDS.has(entry.kind)) return
        if (entry.styleSeam || allow.has(sub)) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (!def) return
        if (allow.has(def.local.name)) return
        bindings.set(def.local.name, { sub })
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    function bindingForTag(rawName) {
      if (bindings.has(rawName)) return rawName
      // dot-notation sub-component: <Table.Row> belongs to binding `Table`
      const dot = rawName.indexOf('.')
      if (dot > 0) {
        const base = rawName.slice(0, dot)
        if (bindings.has(base)) return base
      }
      return null
    }

    const templateVisitor = {
      VElement(node) {
        const rawName = node.rawName
        if (!rawName || !bindingForTag(rawName)) return
        for (const attr of node.startTag?.attributes || []) {
          const hit = styleAttr(attr)
          if (!hit) continue
          if (hit.attr === 'style' && !checkStyle) continue
          const written = hit.bound ? `:${hit.attr}` : hit.attr
          context.report({
            node: attr,
            messageId: 'override',
            data: { written, tag: rawName }
          })
        }
      }
    }

    return factory(templateVisitor, scriptVisitor)
  }
}
