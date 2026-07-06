// Blocks a barrel import from the bare package — `import { Button } from '@aziontech/webkit'`
// — which defeats tree-shaking (and today does not even resolve, since webkit publishes
// no `.` export). Covers static imports, `export … from` re-exports, and dynamic
// `import()`. Import each component from its own subpath instead. Type-only imports are
// exempt (erased at build). Namespace imports / `export *` are flagged separately.

import { loadCatalog, isWebkitBare } from '../catalog.js'
import { ctxCwd } from '../util.js'

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow barrel imports from the bare @aziontech/webkit entry (defeats tree-shaking).' },
    hasSuggestions: true,
    schema: [],
    messages: {
      barrel:
        'Barrel import from @aziontech/webkit defeats tree-shaking. Import each component from its own subpath (e.g. {{example}}).',
      namespace:
        'Namespace import of @aziontech/webkit pulls in every component. Import only the subpaths you use.',
      split: 'Split into per-subpath default imports'
    }
  },
  create(context) {
    // Load the catalog only for its import PREFIX (per installed channel). Matching the
    // bare package uses isWebkitBare(), which is catalog-independent, so this rule still
    // fires even when the catalog cannot be resolved.
    const prefix = loadCatalog(ctxCwd(context)).prefix

    return {
      ImportDeclaration(node) {
        if (!isWebkitBare(node.source.value)) return
        if (node.importKind === 'type') return

        const named = node.specifiers.filter(
          (s) => s.type === 'ImportSpecifier' && s.importKind !== 'type'
        )
        const namespace = node.specifiers.find((s) => s.type === 'ImportNamespaceSpecifier')

        if (namespace) {
          context.report({ node, messageId: 'namespace' })
          return
        }
        if (!named.length) return

        const first = named[0]
        const example = `import ${first.local.name} from '${prefix}${kebab(first.imported.name)}'`
        context.report({
          node,
          messageId: 'barrel',
          data: { example },
          suggest: [
            {
              messageId: 'split',
              fix: (fixer) => {
                const lines = named.map((s) => {
                  const local = s.local.name
                  const sub = kebab(s.imported.name)
                  return `import ${local} from '${prefix}${sub}'`
                })
                return fixer.replaceText(node, lines.join('\n'))
              }
            }
          ]
        })
      },
      // `export * from '@aziontech/webkit'` re-exports the whole barrel.
      ExportAllDeclaration(node) {
        if (node.source && isWebkitBare(node.source.value)) {
          context.report({ node, messageId: 'namespace' })
        }
      },
      // `export { Button } from '@aziontech/webkit'` is a barrel re-export.
      ExportNamedDeclaration(node) {
        if (!node.source || !isWebkitBare(node.source.value)) return
        const named = node.specifiers.filter((s) => s.type === 'ExportSpecifier')
        if (!named.length) return
        const first = named[0]
        const example = `export { default as ${first.exported.name} } from '${prefix}${kebab(first.local.name)}'`
        context.report({ node, messageId: 'barrel', data: { example } })
      },
      // Dynamic `import('@aziontech/webkit')` pulls the barrel at runtime.
      ImportExpression(node) {
        if (node.source?.type === 'Literal' && isWebkitBare(node.source.value)) {
          context.report({ node, messageId: 'namespace' })
        }
      }
    }
  }
}
