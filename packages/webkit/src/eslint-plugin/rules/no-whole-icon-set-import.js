// Flags a default/namespace BINDING import of @aziontech/icons — an icon FONT whose
// entry is CSS, so a binding is meaningless; correct usage is a side-effect import plus
// the icon CSS classes. Side-effect and type-only imports are exempt; a module that
// intentionally imports the set opts out via the `allowedFiles` option.

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow a default/namespace binding import of the @aziontech/icons font (use a side-effect import + CSS classes).'
    },
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
        "'{{pkg}}' is an icon font — import it once for its side effects (import '{{pkg}}') and use the icon CSS classes, not a default/namespace binding."
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
