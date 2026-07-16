// Enforces the construction standards on components the CONSUMER writes — the same
// checks the design system's own write-time hook and CI ratchet run, via the shared
// engine in ../authoring-checks.js (one definition, three surfaces: AI hook, DS ratchet,
// consumer lint). Text-level, parser-agnostic, fail-open on virtual filenames.

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
    // Virtual/unknown filenames (stdin, <input>) — skip path-based checks gracefully.
    const rel = typeof filename === 'string' ? filename.split('\\').join('/') : ''

    return {
      Program(node) {
        const text = context.sourceCode?.text ?? context.getSourceCode().text
        for (const c of CONTENT_CHECKS) {
          if (c.applies(rel) && c.violated(text)) {
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
