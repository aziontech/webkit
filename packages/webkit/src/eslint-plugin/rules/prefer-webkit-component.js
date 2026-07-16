// Steers consumers OFF foreign UI libraries toward the webkit design system: flags an
// import from a configured foreign package (default: PrimeVue) and points at webkit.
// Configurable via options so a team can add its own "don't use X, use webkit" mappings.
// Catalog-independent (pure import-source matching), so it works even without a catalog.

const DEFAULT_PACKAGES = {
  // foreign package prefix → human hint
  primevue:
    'Use the @aziontech/webkit equivalent (see @aziontech/webkit/list_components or suggest_component).'
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer @aziontech/webkit components over foreign UI libraries (e.g. PrimeVue).'
    },
    schema: [
      {
        type: 'object',
        properties: {
          // { "<package-or-prefix>": "<hint>" } — overrides the default map entirely.
          packages: { type: 'object', additionalProperties: { type: 'string' } }
        },
        additionalProperties: false
      }
    ],
    messages: {
      prefer: "Avoid importing from '{{source}}'. {{hint}}"
    }
  },
  create(context) {
    const opts = context.options[0] || {}
    const map = opts.packages || DEFAULT_PACKAGES
    const prefixes = Object.keys(map)

    function match(source) {
      // exact package or a subpath of it (primevue, primevue/button)
      return prefixes.find((p) => source === p || source.startsWith(`${p}/`)) || null
    }

    function check(sourceNode) {
      if (!sourceNode || typeof sourceNode.value !== 'string') return
      const hit = match(sourceNode.value)
      if (!hit) return
      context.report({
        node: sourceNode,
        messageId: 'prefer',
        data: { source: sourceNode.value, hint: map[hit] }
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
