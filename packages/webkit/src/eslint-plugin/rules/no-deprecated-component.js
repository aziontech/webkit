// Blocks importing a @aziontech/webkit component that the installed catalog marks as
// deprecated (spec frontmatter `deprecated: true`), and points at the replacement
// (`replaced_by`). Steers consumers off a component before it is removed. Fires only when
// the catalog actually flags a component as deprecated — none are today, so it is inert
// until a deprecation lands.

import { loadCatalog } from '../catalog.js'
import { ctxCwd } from '../util.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow importing a @aziontech/webkit component marked deprecated in the catalog.'
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      deprecated: "'{{source}}' is deprecated in @aziontech/webkit.{{hint}}",
      replace: "Import '{{replacement}}' instead"
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const prefix = catalog.prefix

    function check(sourceNode) {
      if (!sourceNode || typeof sourceNode.value !== 'string') return
      const source = sourceNode.value
      if (!source.startsWith(prefix)) return
      const sub = source.slice(prefix.length)
      const entry = catalog.getEntry(sub)
      if (!entry || !entry.deprecated) return

      const replacement = entry.replacedBy ? `${prefix}${entry.replacedBy}` : null
      context.report({
        node: sourceNode,
        messageId: 'deprecated',
        data: { source, hint: replacement ? ` Use '${replacement}' instead.` : '' },
        suggest: replacement
          ? [
              {
                messageId: 'replace',
                data: { replacement },
                fix: (fixer) => fixer.replaceText(sourceNode, JSON.stringify(replacement))
              }
            ]
          : []
      })
    }

    return {
      ImportDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => node.source && check(node.source),
      ExportAllDeclaration: (node) => node.source && check(node.source),
      ImportExpression: (node) => node.source?.type === 'Literal' && check(node.source)
    }
  }
}
