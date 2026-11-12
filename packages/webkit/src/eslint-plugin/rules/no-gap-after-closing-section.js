import { templateBodyVisitorFactory } from '../util.js'

const WEBKIT_PREFIX = '@aziontech/webkit/'

const CLOSING = new Set([
  'closing-call-to-action',
  'closing-call-to-action-newsletter',
  'closing-call-to-action-agents',
  'closing-call-to-action-templates'
])

const CLOSE_PARTS = new Map([
  ['section-gap', 'gap'],
  ['frame-box', 'frame'],
  ['texture-material', 'texture']
])

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\./g, '-')
    .toLowerCase()

function subpathOf(source) {
  if (typeof source !== 'string' || !source.startsWith(WEBKIT_PREFIX)) return null
  return source.slice(WEBKIT_PREFIX.length)
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow a SectionGap or a closing FrameBox right after a closing section (ClosingCallToAction and its variants): the section draws the hatched closing frame itself, so a trailing one doubles it.'
    },
    schema: [],
    messages: {
      doubled:
        "'<{{section}}>' already draws the hatched closing frame; the '<{{next}}>' after it doubles the close. Drop it and let the section sit right above SiteFooter."
    }
  },
  create(context) {
    const closing = new Map()
    const parts = new Map()

    const scriptVisitor = {
      ImportDeclaration(node) {
        const subpath = subpathOf(node.source.value)
        if (!subpath) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (!def) return
        if (CLOSING.has(subpath)) closing.set(def.local.name, def.local.name)
        if (CLOSE_PARTS.has(subpath)) parts.set(def.local.name, CLOSE_PARTS.get(subpath))
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    function lookup(map, element) {
      const raw = element?.rawName ?? ''
      if (map.has(raw)) return raw
      for (const local of map.keys()) {
        if (kebab(local) === raw) return local
      }
      return null
    }

    function nextElement(node) {
      const siblings = node.parent?.children ?? []
      const index = siblings.indexOf(node)
      for (let i = index + 1; i < siblings.length; i += 1) {
        const sibling = siblings[i]
        if (sibling.type === 'VElement') return sibling
        if (sibling.type === 'VText' && sibling.value.trim() !== '') return null
      }
      return null
    }

    function closesThePage(element) {
      const local = lookup(parts, element)
      if (!local) return false
      const kind = parts.get(local)
      if (kind === 'gap') return true
      if (kind !== 'frame') return false
      return (element.children ?? []).some(
        (child) => child.type === 'VElement' && parts.get(lookup(parts, child)) === 'texture'
      )
    }

    const templateVisitor = {
      VElement(node) {
        if (!closing.size || !parts.size) return
        const section = lookup(closing, node)
        if (!section) return
        const next = nextElement(node)
        if (!next || !closesThePage(next)) return
        context.report({
          node: next.startTag,
          messageId: 'doubled',
          data: { section, next: lookup(parts, next) }
        })
      }
    }

    return factory(templateVisitor, scriptVisitor)
  }
}
