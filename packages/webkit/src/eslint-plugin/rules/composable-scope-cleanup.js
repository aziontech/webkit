import { calleeName, isComposableFile } from '../composable-file.js'

const ALWAYS = new Set(['addEventListener', 'setInterval', 'requestAnimationFrame'])
const OBSERVERS = new Set(['ResizeObserver', 'IntersectionObserver', 'MutationObserver'])

function storesResult(node) {
  let child = node
  let parent = node.parent
  while (parent && (parent.type === 'TSAsExpression' || parent.type === 'TSNonNullExpression')) {
    child = parent
    parent = parent.parent
  }
  if (!parent) return false
  if (parent.type === 'VariableDeclarator') return parent.init === child
  if (parent.type === 'AssignmentExpression') return parent.right === child
  return false
}

function startedResource(node) {
  if (node.type === 'NewExpression') {
    return node.callee.type === 'Identifier' && OBSERVERS.has(node.callee.name)
      ? `new ${node.callee.name}()`
      : null
  }
  const name = calleeName(node)
  if (!name) return null
  if (ALWAYS.has(name)) return `${name}()`
  if (name === 'setTimeout' && storesResult(node)) return 'setTimeout()'
  return null
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A composable that registers a listener, timer, animation frame or observer must tear it down in onScopeDispose (see the webkit-composables rule shipped by `npx @aziontech/webkit init`).'
    },
    schema: [],
    messages: {
      missingDispose:
        '`{{what}}` in a composable with no `onScopeDispose` in the file. Tear it down in `onScopeDispose` (it also fires in a detached `effectScope()`; `onUnmounted` alone does not), or use the VueUse primitive that owns its cleanup (`useEventListener`, `useIntervalFn`, `useRafFn`, `useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`). See .claude/rules/webkit-composables.md (shipped by `npx @aziontech/webkit init`).'
    }
  },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    if (!isComposableFile(filename)) return {}
    const sites = []
    let disposes = false

    const visit = (node) => {
      if (node.type === 'CallExpression' && calleeName(node) === 'onScopeDispose') disposes = true
      const what = startedResource(node)
      if (what) sites.push({ node, what })
    }

    return {
      CallExpression: visit,
      NewExpression: visit,
      'Program:exit'() {
        if (disposes) return
        for (const { node, what } of sites) {
          context.report({ node, messageId: 'missingDispose', data: { what } })
        }
      }
    }
  }
}
