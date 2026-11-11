import { physicalDirectionClasses, toLogicalClassString } from '../direction-classes.js'
import { templateBodyVisitorFactory } from '../util.js'

const CLASS_HELPERS = new Set(['cn', 'clsx', 'classNames', 'cva', 'tv', 'twMerge', 'twJoin'])
const CLASS_ATTRS = new Set(['class', 'className', 'class:list'])
const SKIP_KEYS = new Set(['parent', 'loc', 'range', 'tokens', 'comments', 'variables'])

function collectStrings(node, out = []) {
  if (!node || typeof node !== 'object') return out
  if (node.type === 'Literal') {
    if (typeof node.value === 'string') out.push({ node, text: node.value })
    return out
  }
  if (node.type === 'TemplateElement') {
    out.push({ node, text: node.value?.raw ?? '' })
    return out
  }
  if (node.type === 'CallExpression' && !isClassHelper(node)) {
    return out
  }
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue
    const value = node[key]
    if (Array.isArray(value)) {
      for (const child of value)
        if (child && typeof child.type === 'string') collectStrings(child, out)
    } else if (value && typeof value.type === 'string') {
      collectStrings(value, out)
    }
  }
  return out
}

function calleeName(node) {
  const callee = node.callee
  if (!callee) return null
  if (callee.type === 'Identifier') return callee.name
  if (callee.type === 'MemberExpression' && callee.property?.type === 'Identifier') {
    return callee.property.name
  }
  return null
}

function isClassHelper(node) {
  return CLASS_HELPERS.has(calleeName(node))
}

export default {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Disallow physical direction utilities (ml-/mr-, pl-/pr-, left-/right-, text-left/right, border-l/r, rounded-l/r…) in class strings; use the logical ones so layouts mirror under dir="rtl". The left-1/2 -translate-x-1/2 centering pattern is allowed.'
    },
    schema: [],
    messages: {
      physical:
        'Physical direction utility {{found}} does not mirror under dir="rtl". Use the logical one: {{fixes}}.'
    }
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode()

    function check(node, text) {
      const hits = physicalDirectionClasses(text)
      if (!hits.length) return
      context.report({
        node,
        messageId: 'physical',
        data: {
          found: hits.map((h) => `"${h.cls}"`).join(', '),
          fixes: hits.map((h) => `${h.cls} → ${h.fix}`).join(', ')
        },
        fix(fixer) {
          const original = sourceCode.getText(node)
          const replaced = original.replace(text, toLogicalClassString(text))
          return replaced === original ? null : fixer.replaceText(node, replaced)
        }
      })
    }

    function checkExpression(expression) {
      for (const { node, text } of collectStrings(expression)) check(node, text)
    }

    const scriptVisitor = {
      CallExpression(node) {
        if (!isClassHelper(node)) return
        if (node.parent?.type === 'CallExpression' && isClassHelper(node.parent)) return
        for (const arg of node.arguments) checkExpression(arg)
      },
      JSXAttribute(node) {
        const name =
          node.name?.type === 'JSXNamespacedName'
            ? `${node.name.namespace.name}:${node.name.name.name}`
            : node.name?.name
        if (!CLASS_ATTRS.has(name) || !node.value) return
        checkExpression(node.value)
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    const templateVisitor = {
      VAttribute(node) {
        if (!node.directive) {
          if (node.key?.name === 'class' && node.value) check(node.value, node.value.value ?? '')
          return
        }
        if (node.key?.name?.name !== 'bind') return
        const arg = node.key.argument
        if (!arg || arg.type !== 'VIdentifier' || arg.name !== 'class') return
        if (node.value?.expression) checkExpression(node.value.expression)
      }
    }

    return factory(templateVisitor, scriptVisitor)
  }
}
