// Blocks a barrel import from the bare package — `import { Button } from '@aziontech/webkit'`
// — which defeats tree-shaking (and today does not even resolve, since webkit publishes
// no `.` export). Import each component from its own subpath instead. Type-only imports
// are exempt (erased at build). Namespace imports are flagged separately.

import { WEBKIT_BARE, WEBKIT_PREFIX } from '../catalog.js'

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
    return {
      ImportDeclaration(node) {
        if (node.source.value !== WEBKIT_BARE) return
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
        const example = `import ${first.local.name} from '${WEBKIT_PREFIX}${kebab(first.imported.name)}'`
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
                  return `import ${local} from '${WEBKIT_PREFIX}${sub}'`
                })
                return fixer.replaceText(node, lines.join('\n'))
              }
            }
          ]
        })
      }
    }
  }
}
