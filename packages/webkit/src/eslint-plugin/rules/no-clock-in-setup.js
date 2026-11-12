import { templateBodyVisitorFactory } from '../util.js'

const FUNCTION_TYPES = new Set([
  'FunctionExpression',
  'ArrowFunctionExpression',
  'FunctionDeclaration'
])

function isClockRead(node) {
  if (node.type === 'NewExpression') {
    return (
      node.callee.type === 'Identifier' &&
      node.callee.name === 'Date' &&
      node.arguments.length === 0
    )
  }
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'Date' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'now'
  )
}

function isComputedGetter(fn) {
  const call = fn.parent
  return (
    call?.type === 'CallExpression' &&
    call.arguments[0] === fn &&
    call.callee.type === 'Identifier' &&
    call.callee.name === 'computed'
  )
}

function readsDuringRender(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'VOnExpression') return false
    if (FUNCTION_TYPES.has(parent.type)) return isComputedGetter(parent)
  }
  return true
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow reading the wall clock (`Date.now()`, `new Date()` with no argument) while a component renders: at setup, in a `computed` getter or in the template. The server and the browser render different text, so hydration mismatches across a minute or day boundary and a copied example is not deterministic.'
    },
    schema: [],
    messages: {
      clock:
        '`{{call}}` reads the wall clock while the component renders, so the server and the browser can render different text (a hydration mismatch across a minute or day boundary). Count sample dates from a fixed reference (`const NOW = Date.UTC(2026, 10, 10, 12)`), give relative times that reference through `<WebkitProvider :now="NOW">`, and read the real clock only in `onMounted` or an event handler.'
    }
  },
  create(context) {
    function check(node) {
      if (!isClockRead(node) || !readsDuringRender(node)) return
      const call = node.type === 'NewExpression' ? 'new Date()' : 'Date.now()'
      context.report({ node, messageId: 'clock', data: { call } })
    }

    const visitor = { CallExpression: check, NewExpression: check }
    const factory = templateBodyVisitorFactory(context)
    return factory ? factory(visitor, visitor) : visitor
  }
}
