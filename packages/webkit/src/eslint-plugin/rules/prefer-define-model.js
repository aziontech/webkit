import { namesFromDefine } from '../define-macros.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer defineModel() over a hand-written modelValue prop + update:modelValue emit (see the webkit-v-model rule shipped by `npx @aziontech/webkit init`).'
    },
    schema: [],
    messages: {
      preferModel:
        'This component declares a `modelValue` prop and an `update:modelValue` emit by hand. Use `defineModel()` — it expresses the two-way value (controlled + uncontrolled) in one macro. See .claude/rules/webkit-v-model.md (shipped by `npx @aziontech/webkit init`).'
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
