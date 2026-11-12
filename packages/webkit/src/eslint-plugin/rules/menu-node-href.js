import { templateBodyVisitorFactory } from '../util.js'

const DESTINATION_ALIASES = new Set(['path', 'to', 'url', 'route'])

function keyName(property) {
  if (property.type !== 'Property' || property.computed) return null
  if (property.key.type === 'Identifier') return property.key.name
  if (property.key.type === 'Literal') return String(property.key.value)
  return null
}

function routeLike(node) {
  if (!node) return false
  if (node.type === 'Literal') return typeof node.value === 'string' && node.value.startsWith('/')
  if (node.type === 'TemplateLiteral') return (node.quasis[0]?.value.cooked ?? '').startsWith('/')
  return node.type === 'ObjectExpression'
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Flag a navigation node (an object with `id` and `label`, as a Menu `groups` tree holds) that names its destination `path`, `to`, `url` or `route` instead of `href`: Menu reads only `href`, so the row renders as a button with nowhere to go.'
    },
    schema: [],
    messages: {
      alias:
        "Menu reads a row's destination from `href` only; `{{key}}` is not read, so this row renders as a button with no link. Rename `{{key}}` to `href` (with Vue Router, put the route's path there and call `router.push(node.href)` in `@navigate`)."
    }
  },
  create(context) {
    function check(node) {
      const keys = new Map()
      for (const property of node.properties) {
        const key = keyName(property)
        if (key) keys.set(key, property)
      }
      if (!keys.has('id') || !keys.has('label') || keys.has('href')) return
      for (const key of DESTINATION_ALIASES) {
        const property = keys.get(key)
        if (property && routeLike(property.value)) {
          context.report({ node: property.key, messageId: 'alias', data: { key } })
          return
        }
      }
    }

    const scriptVisitor = { ObjectExpression: check }
    const factory = templateBodyVisitorFactory(context)
    return factory ? factory({ ObjectExpression: check }, scriptVisitor) : scriptVisitor
  }
}
