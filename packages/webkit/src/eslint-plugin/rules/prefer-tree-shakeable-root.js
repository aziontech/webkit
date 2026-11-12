import { loadCatalog } from '../catalog.js'
import { ctxCwd } from '../util.js'

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function namedImportEntries(node, catalog) {
  const named = node.specifiers.filter((s) => s.type === 'ImportSpecifier')
  const lines = []
  for (const spec of named) {
    if (node.importKind === 'type' || spec.importKind === 'type') return null
    const imported = spec.imported.type === 'Identifier' ? spec.imported.name : spec.imported.value
    const sub = kebab(imported)
    const entry = catalog.getEntry(sub)
    if (!entry || entry.kind !== 'subcomponent') return null
    lines.push(`import ${spec.local.name} from ${JSON.stringify(entry.import)}`)
  }
  return lines
}

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
        "'{{binding}}' is imported from the compound entry '{{compound}}' (bundles all sub-components) but only '<{{binding}}>' is used. Import '{{root}}' to keep it tree-shakeable.",
      preferRootNamed:
        "'{{binding}}' is imported from the compound entry '{{compound}}' (bundles all sub-components) but only '<{{binding}}>' is used. Import it from '{{root}}', and import each named binding from its own entry: '{{root}}' has no named exports.",
      useRoot: "Import from '{{root}}'"
    }
  },
  create(context) {
    const catalog = loadCatalog(ctxCwd(context))
    if (!catalog.available) return {}
    const pkgPrefix = catalog.prefix

    const compoundImports = []
    const scriptMembers = new Set()

    return {
      ImportDeclaration(node) {
        const src = node.source.value
        if (typeof src !== 'string' || !src.startsWith(pkgPrefix)) return
        const sub = src.slice(pkgPrefix.length)
        const entry = catalog.getEntry(sub)
        if (!entry || !entry.compoundRoot) return
        if (!entry.treeShakeableImport || entry.treeShakeableImport === entry.import) return
        const def = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
        if (!def) return
        compoundImports.push({
          binding: def.local.name,
          compound: entry.import,
          root: entry.treeShakeableImport,
          declaration: node,
          namedLines: namedImportEntries(node, catalog)
        })
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
          const data = { binding: imp.binding, compound: imp.compound, root: imp.root }
          if (!imp.namedLines) {
            context.report({ node: imp.declaration.source, messageId: 'preferRootNamed', data })
            continue
          }
          const semi = context.sourceCode.getText(imp.declaration).trimEnd().endsWith(';')
            ? ';'
            : ''
          const lines = [
            `import ${imp.binding} from ${JSON.stringify(imp.root)}`,
            ...imp.namedLines
          ]
          const indent = ' '.repeat(imp.declaration.loc.start.column)
          context.report({
            node: imp.declaration.source,
            messageId: 'preferRoot',
            data,
            suggest: [
              {
                messageId: 'useRoot',
                data: { root: imp.root },
                fix: (fixer) =>
                  imp.namedLines.length
                    ? fixer.replaceText(
                        imp.declaration,
                        lines.map((line) => `${line}${semi}`).join(`\n${indent}`)
                      )
                    : fixer.replaceText(imp.declaration.source, JSON.stringify(imp.root))
              }
            ]
          })
        }
      }
    }
  }
}
