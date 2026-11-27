import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const LINK = new Set(['Link', 'link'])

const isText = (child) =>
  (child.type === 'VText' && child.value.trim() !== '') || child.type === 'VExpressionContainer'

const isInline = (attr) => {
  if (!attr.directive) return attr.key?.name === 'inline'
  return (
    attr.key?.name?.name === 'bind' &&
    attr.key?.argument?.type === 'VIdentifier' &&
    attr.key.argument.name === 'inline'
  )
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'The Link component is a standalone navigation control (fixed height, hover surface, ' +
        'trailing icon). Inside a sentence it breaks the line box and misaligns what sits beside ' +
        'it (a checkbox, an icon); a link inside running text sets `inline`, which renders the ' +
        'text-link style.'
    },
    schema: [],
    messages: {
      inSentence:
        'Link inside a sentence. Set `inline` on it (it inherits the sentence size and keeps ' +
        'the underline); a Link without `inline` is for standalone navigation.'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        if (!LINK.has(node.rawName ?? '')) return
        if (node.startTag?.attributes?.some(isInline)) return
        const siblings = node.parent?.children ?? []
        if (!siblings.some(isText)) return
        context.report({ node: node.startTag, messageId: 'inSentence' })
      }
    })
  }
}
