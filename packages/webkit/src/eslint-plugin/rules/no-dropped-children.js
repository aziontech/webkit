import { loadCatalog } from '../catalog.js'
import { ctxCwd, templateBodyVisitorFactory } from '../util.js'

const WEBKIT_TAG_KINDS = new Set(['component', 'root', 'subcomponent'])
const TEXT_PROPS = ['label', 'title', 'text']

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function pascal(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function slotNames(entry) {
  if (Array.isArray(entry.slots)) return entry.slots.map((slot) => slot.name)
  if ('structure' in entry) return []
  return null
}

function slotDirective(element) {
  return (element.startTag?.attributes || []).find(
    (attr) => attr.directive && attr.key?.name?.name === 'slot'
  )
}

function slotDirectiveName(directive) {
  const arg = directive.key?.argument
  if (!arg) return 'default'
  return arg.type === 'VIdentifier' ? arg.name : null
}

function droppedChildren(element) {
  const own = slotDirective(element)
  if (own) return slotDirectiveName(own) === 'default' ? element.children : []
  return (element.children || []).filter((child) => {
    if (child.type === 'VText') return child.value.trim() !== ''
    if (child.type === 'VExpressionContainer') return true
    if (child.type !== 'VElement') return false
    if (child.rawName !== 'template') return true
    const directive = slotDirective(child)
    return !directive || slotDirectiveName(directive) === 'default'
  })
}

function escapeAttribute(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow content between the tags of a webkit component that has no default slot: Vue drops it without a warning, so the text never renders.'
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      droppedText:
        "'<{{tag}}>' has no default slot, so the content between its tags is dropped and never renders. Pass the text through its `{{prop}}` prop.",
      droppedMarkup:
        "'<{{tag}}>' has no default slot, so the content between its tags is dropped and never renders. Put it in a named slot ({{slots}}){{orProp}}.",
      dropped:
        "'<{{tag}}>' has no default slot and no named slots, so the content between its tags is dropped and never renders. Use its props instead.",
      useProp: 'Move the text into the `{{prop}}` prop'
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const prefix = catalog.prefix
    const bindings = new Map()

    const scriptVisitor = {
      ImportDeclaration(node) {
        const src = node.source.value
        if (typeof src !== 'string' || !src.startsWith(prefix)) return
        const sub = src.slice(prefix.length)
        const entry = catalog.getEntry(sub)
        if (!entry || !WEBKIT_TAG_KINDS.has(entry.kind)) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (def) bindings.set(def.local.name, sub)
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    function entryForTag(rawName) {
      const name = rawName.includes('-') && !rawName.includes('.') ? pascal(rawName) : rawName
      if (bindings.has(name)) return catalog.getEntry(bindings.get(name))
      const dot = name.indexOf('.')
      if (dot <= 0) return null
      const base = bindings.get(name.slice(0, dot))
      if (!base) return null
      return catalog.getEntry(`${base}-${kebab(name.slice(dot + 1))}`)
    }

    const templateVisitor = {
      VElement(node) {
        if (!node.rawName) return
        const entry = entryForTag(node.rawName)
        if (!entry) return
        const slots = slotNames(entry)
        if (!slots || slots.includes('default')) return
        const dropped = droppedChildren(node)
        if (!dropped.length) return

        const propNames = new Set((entry.props || []).map((p) => p.name))
        const prop = TEXT_PROPS.find((name) => propNames.has(name))
        const textOnly = dropped.every(
          (child) => child.type === 'VText' || child.type === 'VExpressionContainer'
        )
        const onlyText =
          dropped.length === 1 &&
          dropped[0].type === 'VText' &&
          node.children.every((child) => child.type === 'VText')
        const messageId =
          prop && (textOnly || !slots.length)
            ? 'droppedText'
            : slots.length
              ? 'droppedMarkup'
              : 'dropped'
        const data = {
          tag: node.rawName,
          prop,
          slots: slots.map((name) => `#${name}`).join(', '),
          orProp: prop ? `, or pass text through its \`${prop}\` prop` : ''
        }
        const hasProp = (node.startTag.attributes || []).some((attr) =>
          attr.directive
            ? attr.key?.name?.name === 'bind' && attr.key.argument?.name === prop
            : attr.key?.name === prop
        )
        const suggest =
          prop && onlyText && !hasProp
            ? [
                {
                  messageId: 'useProp',
                  data: { prop },
                  fix(fixer) {
                    const source = context.sourceCode.text
                    const open = source.slice(node.startTag.range[0], node.startTag.range[1] - 1)
                    const text = escapeAttribute(dropped[0].value.trim().replace(/\s+/g, ' '))
                    return fixer.replaceTextRange(
                      node.range,
                      `${open.trimEnd()} ${prop}="${text}" />`
                    )
                  }
                }
              ]
            : []

        context.report({
          node: node.startTag,
          messageId,
          data,
          suggest
        })
      }
    }

    return factory(templateVisitor, scriptVisitor)
  }
}
