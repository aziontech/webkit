import { dateEvidence, describeTextControl } from '../lib/field-data-type.js'
import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when a free-text control (Input, InputGroup.Input, Textarea or a native input) holds a date or a time: its v-model key or name ends in _at / At, date, time or timestamp, its placeholder shows a date format (2026-01-31, YYYY-MM-DD, ISO 8601), its label names a date, or it is a native date input. A typed ISO string is the wrong control: DatePicker (show-time for an instant) and DateRangePicker parse, bound and localise the value.'
    },
    schema: [],
    messages: {
      preferDatePicker:
        "{{tag}} for a date or time ({{evidence}}): a person should not type an ISO string. Use DatePicker from '@aziontech/webkit/date-picker-root' (with show-time for an instant such as expires_at, without it for a calendar date) or DateRangePicker for a period (a from / to pair); set min / max from the rule and send value.toISOString(). Skill webkit-form, Control by data type."
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        const control = describeTextControl(node)
        if (!control) return
        const evidence = dateEvidence(control)
        if (!evidence) return
        context.report({
          node: node.startTag,
          messageId: 'preferDatePicker',
          data: { tag: control.tag, evidence }
        })
      }
    })
  }
}
