function typeArg(node) {
  const t = node.typeArguments || node.typeParameters
  return (t && t.params && t.params[0]) || null
}

function keyName(key) {
  if (key.type === 'Identifier') return key.name
  if (key.type === 'Literal') return String(key.value)
  return null
}

function callSignatureName(m) {
  const first = m.params && m.params[0]
  if (!first) return null
  const ann = first.typeAnnotation && first.typeAnnotation.typeAnnotation
  if (ann && ann.type === 'TSLiteralType' && ann.literal && ann.literal.type === 'Literal') {
    return String(ann.literal.value)
  }
  return null
}

function memberKeyName(m) {
  if (!m) return null
  const fromKey = m.key ? keyName(m.key) : null
  if (fromKey !== null) return fromKey
  return m.type === 'TSCallSignatureDeclaration' ? callSignatureName(m) : null
}

function membersOf(typeNode, interfaces) {
  if (!typeNode) return []
  if (typeNode.type === 'TSTypeLiteral') return typeNode.members || []
  if (typeNode.type === 'TSTypeReference') {
    const name = typeNode.typeName && typeNode.typeName.name
    return name && interfaces.has(name) ? interfaces.get(name) : []
  }
  return []
}

function runtimeNames(arg) {
  if (!arg) return []
  if (arg.type === 'ObjectExpression') {
    return arg.properties
      .filter((p) => p.type === 'Property')
      .map((p) => keyName(p.key))
      .filter(Boolean)
  }
  if (arg.type === 'ArrayExpression') {
    return arg.elements.filter((el) => el && el.type === 'Literal').map((el) => String(el.value))
  }
  return []
}

export function namesFromDefine(call, interfaces) {
  const names = new Set()
  for (const m of membersOf(typeArg(call), interfaces)) {
    const k = memberKeyName(m)
    if (k) names.add(k)
  }
  for (const k of runtimeNames(call.arguments && call.arguments[0])) names.add(k)
  return names
}
