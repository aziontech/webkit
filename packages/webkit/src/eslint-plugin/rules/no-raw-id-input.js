import { describeTextControl, idEvidence } from '../lib/field-data-type.js'
import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when a free-text control (Input, InputGroup.Input, Textarea or a native input) asks for the ID of another resource: its v-model key or name ends in _id / Id, its label ends in ID, or its placeholder shows an opaque identifier (org_01a1, a UUID, 24 or more hex digits). People pick a resource by its name: a searchable picker (Select with a search field and Load more, or Combobox with server search) holds the ID. A read-only input showing an ID is not flagged.'
    },
    schema: [],
    messages: {
      rawId:
        '{{tag}} asks for an ID ({{evidence}}): people pick a resource by name, not by typing its identifier. Use a searchable resource picker: Select with a #search field, Load more in #footer and display-value resolving the chosen name, or Combobox with :filter="false", :allow-custom="false" and a debounced @search. Label the thing (\'Organization\'), not \'Organization ID\'. If the value is an identifier from another system that the person copies in, disable this rule on the line and say so. Skill webkit-form, Control by data type.'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        const control = describeTextControl(node)
        if (!control) return
        const evidence = idEvidence(control)
        if (!evidence) return
        context.report({
          node: node.startTag,
          messageId: 'rawId',
          data: { tag: control.tag, evidence }
        })
      }
    })
  }
}
