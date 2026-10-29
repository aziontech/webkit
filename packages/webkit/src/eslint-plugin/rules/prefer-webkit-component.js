const DEFAULT_PACKAGES = {
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
