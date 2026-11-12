import { templateBodyVisitorFactory } from '../util.js'

const CHROME = new Map([
  ['site-footer', 'SiteFooter'],
  ['site-nav', 'SiteNav']
])

const WEBKIT_PREFIX = '@aziontech/webkit/'

const FRAMING = [/^border(?:-[xytbse])?$/, /^border-(?:[xytbse]-)?\d+$/, /^p[xytbse]?-/]

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\./g, '-')
    .toLowerCase()

function chromeOf(source) {
  if (typeof source !== 'string' || !source.startsWith(WEBKIT_PREFIX)) return null
  return CHROME.get(source.slice(WEBKIT_PREFIX.length)) ?? null
}

function framingUtilities(classString) {
  return String(classString || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.slice(token.lastIndexOf(':') + 1).replace(/!/g, ''))
    .filter((utility) => FRAMING.some((re) => re.test(utility)))
}

function staticClass(element) {
  for (const attr of element?.startTag?.attributes ?? []) {
    if (!attr.directive && attr.key?.name === 'class') return attr.value?.value ?? ''
  }
  return null
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow a bordered or padded wrapper around SiteFooter or SiteNav: they draw their own rules and frame, so the wrapper doubles a rule or pulls the frame off the page column.'
    },
    schema: [],
    messages: {
      wrapped:
        "'<{{tag}}>' draws its own rules and frame; its wrapper's {{classes}} doubles a rule or moves the frame. Render it as a direct child of the page shell, or drop the border and padding from the wrapper."
    }
  },
  create(context) {
    const bindings = new Map()

    const scriptVisitor = {
      ImportDeclaration(node) {
        const name = chromeOf(node.source.value)
        if (!name) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (def) bindings.set(def.local.name, name)
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    function chromeTag(element) {
      const raw = element.rawName ?? ''
      if (bindings.has(raw)) return raw
      for (const local of bindings.keys()) {
        if (kebab(local) === raw) return local
      }
      return null
    }

    const templateVisitor = {
      VElement(node) {
        if (!bindings.size) return
        const tag = chromeTag(node)
        if (!tag) return
        const parent = node.parent
        if (!parent || parent.type !== 'VElement' || parent.rawName === 'template') return
        const framing = framingUtilities(staticClass(parent))
        if (framing.length === 0) return
        context.report({
          node: node.startTag,
          messageId: 'wrapped',
          data: { tag, classes: framing.map((c) => `\`${c}\``).join(', ') }
        })
      }
    }

    return factory(templateVisitor, scriptVisitor)
  }
}
