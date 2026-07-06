// Blocks reaching into webkit internals: `@aziontech/webkit/src/**` or any subpath
// deeper than a published entry point (e.g. `.../table/internal/x`). These break on
// any refactor and bypass the public API. Suggests the published entry point.

import { loadCatalog } from '../catalog.js'
import { ctxCwd } from '../util.js'

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow importing @aziontech/webkit internals (deep paths / src).' },
    // The replacement is a single, catalog-verified published entry point, so it is a
    // safe autofix (not just a suggestion).
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    messages: {
      deep: "'{{source}}' reaches into @aziontech/webkit internals. Import the published entry point{{hint}}.",
      replace: "Import from '{{replacement}}'"
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const pkgPrefix = catalog.prefix

    function check(sourceNode) {
      if (!sourceNode || typeof sourceNode.value !== 'string') return
      const source = sourceNode.value
      if (!source.startsWith(pkgPrefix)) return
      const sub = source.slice(pkgPrefix.length)
      if (catalog.has(sub)) return
      const isSrc = sub.startsWith('src/')
      const prefix = catalog.nearestPublishedPrefix(sub)
      if (!isSrc && !prefix) return // unknown-but-not-deep → valid-import-path owns it

      const replacement = prefix ? pkgPrefix + prefix : null
      const applyFix = (fixer) => fixer.replaceText(sourceNode, JSON.stringify(replacement))
      context.report({
        node: sourceNode,
        messageId: 'deep',
        data: { source, hint: replacement ? ` '${replacement}'` : '' },
        // Autofix + suggestion share the same deterministic replacement when one exists.
        fix: replacement ? applyFix : undefined,
        suggest: replacement
          ? [{ messageId: 'replace', data: { replacement }, fix: applyFix }]
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
