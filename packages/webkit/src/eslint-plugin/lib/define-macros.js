export function typeArg(node) {
  const t = node.typeArguments || node.typeParameters
  return (t && t.params && t.params[0]) || null
}

export function memberKeyName(m) {
  if (!m) return null
  if (m.key) {
    if (m.key.type === 'Identifier') return m.key.name
    if (m.key.type === 'Literal') return String(m.key.value)
  }
  if (m.type === 'TSCallSignatureDeclaration' && m.params && m.params[0]) {
    const ann = m.params[0].typeAnnotation && m.params[0].typeAnnotation.typeAnnotation
    if (ann && ann.type === 'TSLiteralType' && ann.literal && ann.literal.type === 'Literal') {
      return String(ann.literal.value)
    }
  }
  return null
}

export function membersOf(typeNode, interfaces) {
  if (!typeNode) return []
  if (typeNode.type === 'TSTypeLiteral') return typeNode.members || []
  if (typeNode.type === 'TSTypeReference') {
    const name = typeNode.typeName && typeNode.typeName.name
    return name && interfaces.has(name) ? interfaces.get(name) : []
  }
  return []
}

export function namesFromDefine(call, interfaces) {
  const names = new Set()
  for (const m of membersOf(typeArg(call), interfaces)) {
    const k = memberKeyName(m)
    if (k) names.add(k)
  }
  const arg = call.arguments && call.arguments[0]
  if (arg && arg.type === 'ObjectExpression') {
    for (const p of arg.properties) {
      if (p.type !== 'Property') continue
      const k =
        p.key.type === 'Identifier'
          ? p.key.name
          : p.key.type === 'Literal'
            ? String(p.key.value)
            : null
      if (k) names.add(k)
    }
  } else if (arg && arg.type === 'ArrayExpression') {
    for (const el of arg.elements) if (el && el.type === 'Literal') names.add(String(el.value))
  }
  return names
}
