import { templateBodyVisitorFactory } from '../util.js'

const LINK = new Set(['Link', 'link'])

const isText = (child) =>
  (child.type === 'VText' && child.value.trim() !== '') || child.type === 'VExpressionContainer'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'The Link component is a standalone navigation control (fixed height, hover surface, trailing icon). Inside a sentence it breaks the line box and misaligns what sits beside it (a checkbox, an icon); a link inside running text is a plain anchor with the text-link class.'
    },
    schema: [],
    messages: {
      inSentence:
        'Link inside a sentence. Write the in-sentence link as a plain anchor with class="text-link" (it inherits the sentence size and keeps the underline); keep Link for standalone navigation (.claude/docs/DESIGN.md, "Inline links vs navigation Link").'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        if (!LINK.has(node.rawName ?? '')) return
        const siblings = node.parent?.children ?? []
        if (!siblings.some(isText)) return
        context.report({ node: node.startTag, messageId: 'inSentence' })
      }
    })
  }
}
