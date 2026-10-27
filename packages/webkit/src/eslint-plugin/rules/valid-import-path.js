import { loadCatalog } from '../catalog.js'
import { ctxCwd } from '../util.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow importing a @aziontech/webkit path that is not a published export of the installed version.'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    messages: {
      unknown: "'{{source}}' is not a published export of @aziontech/webkit{{version}}.{{hint}}",
      replace: "Replace with '{{replacement}}'"
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const prefix = catalog.prefix

    function check(sourceNode) {
      if (!sourceNode || typeof sourceNode.value !== 'string') return
      const source = sourceNode.value
      if (source === 'catalog.json') return
      if (!source.startsWith(prefix)) return
      const sub = source.slice(prefix.length)
      if (catalog.has(sub)) return
      if (sub.startsWith('src/') || catalog.nearestPublishedPrefix(sub)) return

      const suggestions = catalog.suggestSubpaths(sub)
      const hint = suggestions.length
        ? ` Did you mean ${suggestions.map((s) => prefix + s).join(', ')}?`
        : ''
      context.report({
        node: sourceNode,
        messageId: 'unknown',
        data: { source, version: catalog.version ? `@${catalog.version}` : '', hint },
        fix:
          suggestions.length === 1
            ? (fixer) => fixer.replaceText(sourceNode, JSON.stringify(prefix + suggestions[0]))
            : undefined,
        suggest: suggestions.map((s) => ({
          messageId: 'replace',
          data: { replacement: prefix + s },
          fix: (fixer) => fixer.replaceText(sourceNode, JSON.stringify(prefix + s))
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
