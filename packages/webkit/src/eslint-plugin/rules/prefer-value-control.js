import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const TEXT_INPUTS = new Set(['Input', 'input-root', 'InputGroup.Input', 'InputGroupInput'])

const BY_TYPE = new Map([
  ['number', 'number'],
  ['date', 'date'],
  ['datetime-local', 'dateTime'],
  ['datetime', 'dateTime'],
  ['time', 'dateTime'],
  ['month', 'date'],
  ['week', 'date'],
  ['tel', 'phone'],
  ['password', 'secret']
])

const DATE_FORMAT =
  /\b(yyyy|dd[/.-]mm|mm[/.-]dd|hh:mm|iso ?8601)\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{2}:\d{2}(:\d{2})?(z|\b)/i
const TIME_PART = /hh:mm|\d{2}:\d{2}|t\d{2}|iso ?8601/i

function staticValue(node, name) {
  const attr = (node.startTag?.attributes ?? []).find(
    (item) => !item.directive && String(item.key?.name ?? '').toLowerCase() === name
  )
  return attr ? String(attr.value?.value ?? '') : null
}

export function valueControlMessage(node) {
  if (!TEXT_INPUTS.has(node.rawName ?? '')) return null
  const type = staticValue(node, 'type')
  const byType = type === null ? undefined : BY_TYPE.get(type.toLowerCase())
  if (byType) return byType
  const placeholder = staticValue(node, 'placeholder')
  if (placeholder && DATE_FORMAT.test(placeholder)) {
    return TIME_PART.test(placeholder) ? 'dateTime' : 'date'
  }
  return null
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A plain Input is for free text. A number, a date, a date and time, a phone number or a secret takes the WebKit control made for that kind of value, never an Input with a native type or a format in its placeholder.'
    },
    schema: [],
    messages: {
      number:
        'Input type="number" holds a number: use NumberInput (@aziontech/webkit/number-input) bound to a number, with min, max and step.',
      date: 'This Input asks for a date: use DatePicker (@aziontech/webkit/date-picker) bound to a Date, and send toISOString() or the ISO date to the server.',
      dateTime:
        'This Input asks for a date and time: use DatePicker with show-time (@aziontech/webkit/date-picker) bound to a Date, and send toISOString() to the server. For a start and an end use DateRangePicker.',
      phone:
        'Input type="tel" holds a phone number: use PhoneInput (@aziontech/webkit/phone-input), which applies the country mask and gives the E.164 number.',
      secret:
        'Input type="password" holds a secret: use PasswordInput (@aziontech/webkit/password-input), which carries the reveal toggle.'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        const messageId = valueControlMessage(node)
        if (messageId) context.report({ node: node.startTag, messageId })
      }
    })
  }
}
