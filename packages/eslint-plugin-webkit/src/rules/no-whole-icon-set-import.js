// Flags importing the ENTIRE @aziontech/icons set (default or namespace import), the
// classic UI-lib bundle killer — every glyph ships even when a handful are used. Import
// per-icon subpaths instead. Type-only imports are exempt. A central icon-registry module
// that intentionally re-exports the set can opt out via the `allowedFiles` option.

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow importing the whole @aziontech/icons set (import per-icon subpaths).' },
    schema: [
      {
        type: 'object',
        properties: {
          packages: { type: 'array', items: { type: 'string' } },
          allowedFiles: { type: 'array', items: { type: 'string' } }
        },
        additionalProperties: false
      }
    ],
    messages: {
      wholeSet:
        "Importing the entire '{{pkg}}' set ships every glyph. Import only the icons you use (e.g. import ChevronIcon from '{{pkg}}/chevron')."
    }
  },
  create(context) {
    const opts = context.options[0] || {}
    const packages = new Set(opts.packages || ['@aziontech/icons'])
    const allowed = opts.allowedFiles || []
    const filename = context.filename || (context.getFilename && context.getFilename()) || ''
    if (allowed.some((frag) => filename.includes(frag))) return {}

    return {
      ImportDeclaration(node) {
        if (!packages.has(node.source.value)) return
        if (node.importKind === 'type') return
        const wholeSet = node.specifiers.some(
          (s) => s.type === 'ImportDefaultSpecifier' || s.type === 'ImportNamespaceSpecifier'
        )
        if (wholeSet) {
          context.report({ node, messageId: 'wholeSet', data: { pkg: node.source.value } })
        }
      }
    }
  }
}
