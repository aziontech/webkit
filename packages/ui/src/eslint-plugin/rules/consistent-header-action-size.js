import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const WEBKIT_PREFIX = '@aziontech/webkit/'

const HEADER_ENTRIES = new Set(['page-header'])

const CONTROL_ENTRIES = new Set(['button', 'icon-button', 'split-button'])

const DEFAULT_SIZE = 'large'

const HEADER_SIZE = 'medium'

function pascal(rawName) {
  const base = String(rawName || '').split('.')[0]
  if (!base.includes('-')) return base
  return base
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function isActionsSlot(node) {
  if (node.type !== 'VElement' || node.rawName !== 'template') return false
  return node.startTag.attributes.some(
    (attribute) =>
      attribute.directive &&
      attribute.key.name?.name === 'slot' &&
      attribute.key.argument?.name === 'actions'
  )
}

function sizeOf(node) {
  for (const attribute of node.startTag.attributes) {
    if (!attribute.directive && attribute.key.name === 'size') {
      return { value: attribute.value?.value ?? '', node: attribute }
    }
    if (
      attribute.directive &&
      attribute.key.name?.name === 'bind' &&
      attribute.key.argument?.name === 'size'
    ) {
      return null
    }
  }
  return { value: DEFAULT_SIZE, node: node.startTag }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Every Button, IconButton and SplitButton in the actions slot of a PageHeader is ' +
        'size="medium", so the actions sit at one height; the create action stands out by ' +
        'variant="primary", never by size.'
    },
    schema: [],
    messages: {
      size:
        '{{control}} in the PageHeader actions is size="{{size}}": every heading action is ' +
        'size="medium" (32px), so the row keeps one height. Set size="medium"; give the create ' +
        'action variant="primary" and the others variant="outline" (rule `webkit-page-layout`).'
    }
  },
  create(context) {
    const headerNames = new Set()
    const controlNames = new Set()

    const scriptVisitor = {
      ImportDeclaration(node) {
        const source = node.source.value
        if (typeof source !== 'string' || !source.startsWith(WEBKIT_PREFIX)) return
        const entry = source.slice(WEBKIT_PREFIX.length)
        const target = HEADER_ENTRIES.has(entry)
          ? headerNames
          : CONTROL_ENTRIES.has(entry)
            ? controlNames
            : null
        if (!target) return
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier') target.add(specifier.local.name)
        }
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    function visit(node) {
      for (const child of node.children ?? []) {
        if (child.type !== 'VElement') continue
        const name = pascal(child.rawName)
        if (controlNames.has(name)) {
          const size = sizeOf(child)
          if (size && size.value !== HEADER_SIZE) {
            context.report({
              node: size.node,
              messageId: 'size',
              data: { control: name, size: size.value }
            })
          }
        }
        visit(child)
      }
    }

    return factory(
      {
        VElement(node) {
          if (!headerNames.has(pascal(node.rawName))) return
          for (const child of node.children) if (isActionsSlot(child)) visit(child)
        }
      },
      scriptVisitor
    )
  }
}
