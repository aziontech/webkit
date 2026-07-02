// Performance: when a compound component is imported from its compound entry
// (`@aziontech/webkit/table`, which Object.assigns every sub-component and so is
// retained whole by bundlers) but the file only ever renders the root `<Table>`
// (never `<Table.Row>` dot-notation, nor `Table.Row` in script), suggest the
// tree-shakeable standalone root `@aziontech/webkit/table-root`.
//
// Only suggests — a compound root `X` is detected from the catalog (entry.compoundRoot).
// Conservative: any dotted usage / member access / namespace-ish use suppresses it.

import { loadCatalog, WEBKIT_PREFIX } from '../catalog.js'
import { ctxCwd } from '../util.js'

function collectElementNames(node, out) {
  if (!node || typeof node !== 'object') return
  if (node.type === 'VElement') {
    if (node.rawName) out.add(node.rawName)
    for (const child of node.children || []) collectElementNames(child, out)
  } else if (Array.isArray(node.children)) {
    for (const child of node.children) collectElementNames(child, out)
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer the tree-shakeable standalone root (`<name>-root`) when a compound component is imported but only its root is used.'
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferRoot:
        "'{{binding}}' is imported from the compound entry '@aziontech/webkit/{{sub}}' (bundles all sub-components) but only '<{{binding}}>' is used. Import '@aziontech/webkit/{{sub}}-root' to keep it tree-shakeable.",
      useRoot: "Import from '@aziontech/webkit/{{sub}}-root'"
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}

    const compoundImports = [] // { binding, sub, sourceNode }
    const scriptMembers = new Set() // identifiers used as `X.something` in <script>

    return {
      ImportDeclaration(node) {
        const src = node.source.value
        if (typeof src !== 'string' || !src.startsWith(WEBKIT_PREFIX)) return
        const sub = src.slice(WEBKIT_PREFIX.length)
        const entry = catalog.getEntry(sub)
        if (!entry || !entry.compoundRoot) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (!def) return
        compoundImports.push({ binding: def.local.name, sub, sourceNode: node.source })
      },
      MemberExpression(node) {
        if (node.object && node.object.type === 'Identifier') scriptMembers.add(node.object.name)
      },
      'Program:exit'() {
        if (!compoundImports.length) return
        const names = new Set()
        const tb = context.sourceCode?.ast?.templateBody
        if (tb) collectElementNames(tb, names)

        for (const imp of compoundImports) {
          if (scriptMembers.has(imp.binding)) continue
          const rootUsed = names.has(imp.binding)
          const compoundUsed = [...names].some((n) => n.startsWith(`${imp.binding}.`))
          if (compoundUsed || !rootUsed) continue
          context.report({
            node: imp.sourceNode,
            messageId: 'preferRoot',
            data: { binding: imp.binding, sub: imp.sub },
            suggest: [
              {
                messageId: 'useRoot',
                data: { sub: imp.sub },
                fix: (fixer) =>
                  fixer.replaceText(imp.sourceNode, JSON.stringify(`${WEBKIT_PREFIX}${imp.sub}-root`))
              }
            ]
          })
        }
      }
    }
  }
}
