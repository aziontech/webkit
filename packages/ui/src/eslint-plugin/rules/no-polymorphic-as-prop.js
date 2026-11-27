import { namesFromDefine } from '../lib/define-macros.js'

const POLYMORPHIC = ['as', 'asChild', 'as-child']

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid `as` / `asChild` props: a component renders its own root and switches anchor vs. button on `href` (see the azion-ui-root-element rule shipped by `npx @aziontech/ui init`).'
    },
    schema: [],
    messages: {
      polymorphic:
        'Prop `{{name}}` makes the root element polymorphic by string or by slot. A component ' +
        'owns its root: switch anchor vs. button on a data prop (`href`) with `<component :is>`, ' +
        'and compose a child component instead of `asChild`. See ' +
        'contributing/rules/azion-ui-root-element.md (shipped by `npx @aziontech/ui init`).'
    }
  },
  create(context) {
    const interfaces = new Map()
    const calls = []

    return {
      TSInterfaceDeclaration(node) {
        if (node.id && node.id.name) interfaces.set(node.id.name, node.body.body)
      },
      TSTypeAliasDeclaration(node) {
        if (node.id && node.id.name && node.typeAnnotation?.type === 'TSTypeLiteral') {
          interfaces.set(node.id.name, node.typeAnnotation.members)
        }
      },
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'defineProps') {
          calls.push(node)
        }
      },
      'Program:exit'() {
        for (const call of calls) {
          const names = namesFromDefine(call, interfaces)
          for (const name of POLYMORPHIC) {
            if (names.has(name))
              context.report({ node: call, messageId: 'polymorphic', data: { name } })
          }
        }
      }
    }
  }
}
