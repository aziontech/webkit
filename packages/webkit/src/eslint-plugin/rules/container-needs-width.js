import { templateBodyVisitorFactory } from '../util.js'

const CONTAINERS = new Map([
  ['card', 'Card'],
  ['stat-tile', 'StatTile'],
  ['chart-card', 'ChartCard']
])

const WEBKIT_PREFIX = '@aziontech/webkit/'

const SIZING = [
  /^w-(?!auto$|fit$|min$|max$)/,
  /^min-w-(?!0$|auto$|min$|max$|fit$)/,
  /^flex-(?:1|auto|\[.+\])$/,
  /^grow(?:-.+)?$/,
  /^basis-/,
  /^self-stretch$/,
  /^col-span-/
]

const CROSS_AXIS_SHRINK = /^items-(?:start|center|end|baseline)$/

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\./g, '-')
    .toLowerCase()

function containerOf(source) {
  if (typeof source !== 'string') return null
  if (source.startsWith(WEBKIT_PREFIX)) {
    return CONTAINERS.get(source.slice(WEBKIT_PREFIX.length)) ?? null
  }
  const file = source.match(/\/([a-z-]+)\.vue$/)
  return file ? (CONTAINERS.get(file[1]) ?? null) : null
}

function utilities(classString) {
  return String(classString || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const at = token.lastIndexOf(':')
      return { bare: at === -1, utility: token.slice(at + 1).replace(/!/g, '') }
    })
}

function staticClass(element) {
  const attrs = element?.startTag?.attributes ?? []
  let value = null
  let bound = false
  for (const attr of attrs) {
    if (!attr.directive && attr.key?.name === 'class') value = attr.value?.value ?? ''
    if (
      attr.directive &&
      attr.key?.name?.name === 'bind' &&
      attr.key?.argument?.type === 'VIdentifier' &&
      attr.key.argument.name === 'class'
    ) {
      bound = true
    }
  }
  return { value, bound }
}

function collapsesChildren(classString) {
  const tokens = utilities(classString)
    .filter((t) => t.bare)
    .map((t) => t.utility)
  const flex = tokens.includes('flex') || tokens.includes('inline-flex')
  if (!flex) return false
  const column = tokens.includes('flex-col') || tokens.includes('flex-col-reverse')
  if (!column) return true
  return tokens.some((t) => CROSS_AXIS_SHRINK.test(t))
}

function hasSizing(classString) {
  return utilities(classString).some(({ utility }) => SIZING.some((re) => re.test(utility)))
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when a Card, StatTile or ChartCard is a direct child of a flex parent without a width (w-full, flex-1, grow, basis-*): these components are containers with no intrinsic width and collapse as content-sized flex items.'
    },
    schema: [],
    messages: {
      collapses:
        '\'<{{tag}}>\' is a container: as a content-sized item of this flex parent it collapses to its content (or to zero). Give it a width: class="w-full" on it, or wrap it in an element with flex-1, grow or basis-*.'
    }
  },
  create(context) {
    const bindings = new Map()

    const scriptVisitor = {
      ImportDeclaration(node) {
        const name = containerOf(node.source.value)
        if (!name) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (def) bindings.set(def.local.name, name)
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    function containerTag(element) {
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
        const tag = containerTag(node)
        if (!tag) return
        const parent = node.parent
        if (!parent || parent.type !== 'VElement' || parent.rawName === 'template') return
        const parentClass = staticClass(parent)
        if (parentClass.value === null || !collapsesChildren(parentClass.value)) return
        const own = staticClass(node)
        if (own.bound || hasSizing(own.value)) return
        context.report({ node: node.startTag, messageId: 'collapses', data: { tag } })
      }
    }

    return factory(templateVisitor, scriptVisitor)
  }
}
