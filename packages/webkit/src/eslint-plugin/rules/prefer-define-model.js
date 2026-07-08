// Steers component authors OFF the hand-rolled two-way binding pattern toward `defineModel`.
// Flags a `<script setup>` that declares BOTH a `modelValue` prop (via defineProps — runtime
// object, inline type literal, or a referenced `interface`/type alias) AND an `update:modelValue`
// emit (via defineEmits — runtime array/object, tuple type literal, or call-signature form).
// That pair is exactly what `defineModel()` replaces (Vue 3.4+): one macro, controlled and
// uncontrolled for free. See .claude/rules/v-model.md.
//
// Focused on the primary `modelValue` model (the measured divergence). Named models are not flagged.
// Parser-agnostic across typescript-eslint versions (typeArguments | typeParameters). Fail-open.

/** First type argument of a call (defineProps<T>()), across parser versions. */
function typeArg(node) {
  const t = node.typeArguments || node.typeParameters
  return (t && t.params && t.params[0]) || null
}

/** The declared key of a type member: `modelValue` or the string `'update:modelValue'`. */
function memberKeyName(m) {
  if (!m) return null
  if (m.key) {
    if (m.key.type === 'Identifier') return m.key.name
    if (m.key.type === 'Literal') return String(m.key.value)
  }
  // emit call-signature form: `(e: 'update:modelValue', v: T): void`
  if (m.type === 'TSCallSignatureDeclaration' && m.params && m.params[0]) {
    const ann = m.params[0].typeAnnotation && m.params[0].typeAnnotation.typeAnnotation
    if (ann && ann.type === 'TSLiteralType' && ann.literal && ann.literal.type === 'Literal') {
      return String(ann.literal.value)
    }
  }
  return null
}

/** Type members of an inline literal, or of a referenced interface/type alias. */
function membersOf(typeNode, interfaces) {
  if (!typeNode) return []
  if (typeNode.type === 'TSTypeLiteral') return typeNode.members || []
  if (typeNode.type === 'TSTypeReference') {
    const name = typeNode.typeName && typeNode.typeName.name
    return name && interfaces.has(name) ? interfaces.get(name) : []
  }
  return []
}

/** All declared names from a defineProps/defineEmits call (types + runtime forms). */
function namesFromDefine(call, interfaces) {
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

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer defineModel() over a hand-written modelValue prop + update:modelValue emit (see .claude/rules/v-model.md).'
    },
    schema: [],
    messages: {
      preferModel:
        'This component declares a `modelValue` prop and an `update:modelValue` emit by hand. Use `defineModel()` — it expresses the two-way value (controlled + uncontrolled) in one macro. See .claude/rules/v-model.md.'
    }
  },
  create(context) {
    const interfaces = new Map()
    let propsCall = null
    let emitsCall = null

    return {
      TSInterfaceDeclaration(node) {
        if (node.id && node.id.name) interfaces.set(node.id.name, node.body.body)
      },
      TSTypeAliasDeclaration(node) {
        if (
          node.id &&
          node.id.name &&
          node.typeAnnotation &&
          node.typeAnnotation.type === 'TSTypeLiteral'
        ) {
          interfaces.set(node.id.name, node.typeAnnotation.members)
        }
      },
      CallExpression(node) {
        const name = node.callee && node.callee.type === 'Identifier' && node.callee.name
        if (name === 'defineProps') propsCall = node
        else if (name === 'defineEmits') emitsCall = node
      },
      'Program:exit'() {
        if (!propsCall || !emitsCall) return
        const props = namesFromDefine(propsCall, interfaces)
        const emits = namesFromDefine(emitsCall, interfaces)
        if (props.has('modelValue') && emits.has('update:modelValue')) {
          context.report({ node: propsCall, messageId: 'preferModel' })
        }
      }
    }
  }
}
