import { CONTENT_CHECKS, isJsComposable, MESSAGES } from '../authoring-checks.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce the webkit construction standards (defineModel, typed props/emits/slots, composable contract) on your own components.'
    },
    schema: [],
    messages: Object.fromEntries(Object.entries(MESSAGES))
  },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    const rel = typeof filename === 'string' ? filename.split('\\').join('/') : ''

    return {
      Program(node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode()
        const text = sourceCode.text
        for (const c of CONTENT_CHECKS) {
          if (!c.applies(rel)) continue
          if (c.locate) {
            for (const index of c.locate(text, rel)) {
              context.report({ loc: sourceCode.getLocFromIndex(index), messageId: c.id })
            }
          } else if (c.violated(text, rel)) {
            context.report({ node, messageId: c.id })
          }
        }
        if (isJsComposable(rel)) {
          context.report({ node, messageId: 'composable-js' })
        }
      }
    }
  }
}
