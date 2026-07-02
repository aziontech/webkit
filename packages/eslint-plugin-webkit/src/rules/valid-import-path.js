// Blocks importing a @aziontech/webkit subpath that is not a published export of
// the INSTALLED webkit version. Deep-internal paths (a published ancestor, or
// `/src/`) are owned by `no-deep-internal-import`, so this rule defers on those to
// avoid double-reporting.

import { loadCatalog, WEBKIT_PREFIX } from '../catalog.js'
import { ctxCwd } from '../util.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow importing a @aziontech/webkit path that is not a published export of the installed version.'
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      unknown:
        "'{{source}}' is not a published export of @aziontech/webkit{{version}}.{{hint}}",
      replace: "Replace with '{{replacement}}'"
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}

    function check(sourceNode) {
      if (!sourceNode || typeof sourceNode.value !== 'string') return
      const source = sourceNode.value
      if (source === 'catalog.json') return
      if (!source.startsWith(WEBKIT_PREFIX)) return
      const sub = source.slice(WEBKIT_PREFIX.length)
      if (catalog.has(sub)) return
      // Deep-internal is `no-deep-internal-import`'s job.
      if (sub.startsWith('src/') || catalog.nearestPublishedPrefix(sub)) return

      const suggestions = catalog.suggestSubpaths(sub)
      const hint = suggestions.length
        ? ` Did you mean ${suggestions.map((s) => WEBKIT_PREFIX + s).join(', ')}?`
        : ''
      context.report({
        node: sourceNode,
        messageId: 'unknown',
        data: { source, version: catalog.version ? `@${catalog.version}` : '', hint },
        suggest: suggestions.map((s) => ({
          messageId: 'replace',
          data: { replacement: WEBKIT_PREFIX + s },
          fix: (fixer) => fixer.replaceText(sourceNode, JSON.stringify(WEBKIT_PREFIX + s))
        }))
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
