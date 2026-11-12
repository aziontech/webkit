import { templateBodyVisitorFactory } from '../util.js'

const NAMED = new Map([
  ['IconButton', 'IconButton'],
  ['icon-button', 'IconButton'],
  ['ButtonGroup', 'ButtonGroup'],
  ['button-group', 'ButtonGroup']
])

const NAME_ATTRS = new Set(['aria-label', 'arialabel', 'aria-labelledby', 'arialabelledby'])

const normalized = (name) => String(name ?? '').toLowerCase()

function nameSource(attr) {
  if (!attr.directive) {
    if (!NAME_ATTRS.has(normalized(attr.key?.name))) return null
    return (attr.value?.value ?? '').trim() ? 'named' : null
  }
  if (attr.key?.name?.name !== 'bind') return null
  const argument = attr.key.argument
  if (!argument) return 'spread'
  if (argument.type !== 'VIdentifier') return 'spread'
  return NAME_ATTRS.has(normalized(argument.rawName ?? argument.name)) ? 'named' : null
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'An IconButton or ButtonGroup must carry an accessible name: aria-label (static or bound) or aria-labelledby. The name is optional in the prop types so the kebab aria-label attribute type-checks in a consumer app; this rule is what keeps it required.'
    },
    schema: [],
    messages: {
      missing:
        '{{component}} has no accessible name. Write aria-label="…" naming the action (aria-label="Delete domain", not the glyph), or :aria-label when it changes, or aria-labelledby pointing at visible text.'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        const component = NAMED.get(node.rawName ?? '')
        if (!component) return
        const sources = (node.startTag?.attributes ?? []).map(nameSource)
        if (sources.includes('named') || sources.includes('spread')) return
        context.report({ node: node.startTag, messageId: 'missing', data: { component } })
      }
    })
  }
}
