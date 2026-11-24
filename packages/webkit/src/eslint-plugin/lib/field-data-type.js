const TEXT_CONTROLS = new Set([
  'input',
  'Input',
  'InputGroup.Input',
  'InputGroupInput',
  'input-group-input',
  'Textarea',
  'textarea'
])

const FIELD_TAGS = new Set(['Field', 'field'])

const LABEL_TAGS = new Set(['Field.Label', 'FieldLabel', 'field-label', 'label'])

const NON_TEXT_TYPES = new Set([
  'hidden',
  'checkbox',
  'radio',
  'number',
  'range',
  'color',
  'file',
  'submit',
  'button',
  'reset',
  'image',
  'password'
])

const normalized = (name) => String(name ?? '').toLowerCase()

function literalText(expression) {
  if (expression?.type === 'Literal' && typeof expression.value === 'string')
    return expression.value
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0) {
    return expression.quasis[0]?.value?.cooked ?? ''
  }
  return undefined
}

function boundName(attr) {
  if (attr.key?.name?.name !== 'bind') return null
  const argument = attr.key.argument
  return argument?.type === 'VIdentifier' ? normalized(argument.rawName) : null
}

function staticAttr(node, name) {
  for (const attr of node.startTag?.attributes ?? []) {
    if (!attr.directive) {
      if (normalized(attr.key?.name) === name) return attr.value?.value ?? ''
      continue
    }
    if (boundName(attr) !== name) continue
    const text = literalText(attr.value?.expression)
    if (text !== undefined) return text
  }
  return null
}

function hasAttr(node, name) {
  return (node.startTag?.attributes ?? []).some((attr) => {
    if (!attr.directive) return normalized(attr.key?.name) === name
    if (attr.key?.name?.name !== 'bind') return false
    return normalized(attr.key.argument?.rawName) === name
  })
}

function lastKey(expression) {
  if (!expression) return null
  if (expression.type === 'Identifier') return expression.name
  if (expression.type === 'MemberExpression' || expression.type === 'OptionalMemberExpression') {
    const property = expression.property
    if (!expression.computed && property?.type === 'Identifier') return property.name
    if (property?.type === 'Literal' && typeof property.value === 'string') return property.value
  }
  if (expression.type === 'ChainExpression') return lastKey(expression.expression)
  return null
}

function modelKeys(node) {
  const keys = []
  for (const attr of node.startTag?.attributes ?? []) {
    if (!attr.directive || attr.key?.name?.name !== 'model') continue
    const key = lastKey(attr.value?.expression)
    if (key) keys.push(key)
  }
  return keys
}

function textOf(node) {
  let text = ''
  for (const child of node.children ?? []) {
    if (child.type === 'VText') text += child.value
    else if (child.type === 'VElement') text += textOf(child)
  }
  return text.replace(/\s+/g, ' ').trim()
}

function findLabel(node) {
  for (const child of node.children ?? []) {
    if (child.type !== 'VElement') continue
    if (LABEL_TAGS.has(child.rawName)) return textOf(child)
    if (FIELD_TAGS.has(child.rawName)) continue
    const nested = findLabel(child)
    if (nested) return nested
  }
  return ''
}

function fieldLabel(node) {
  for (let parent = node.parent; parent && parent.type === 'VElement'; parent = parent.parent) {
    if (FIELD_TAGS.has(parent.rawName)) return findLabel(parent)
  }
  return ''
}

export function describeTextControl(node) {
  if (!TEXT_CONTROLS.has(node.rawName)) return null
  const type = normalized(staticAttr(node, 'type'))
  if (NON_TEXT_TYPES.has(type)) return null
  if (hasAttr(node, 'readonly')) return null
  const keys = modelKeys(node)
  const name = staticAttr(node, 'name')
  if (name) keys.push(name)
  const labels = [
    staticAttr(node, 'aria-label'),
    staticAttr(node, 'arialabel'),
    staticAttr(node, 'label'),
    fieldLabel(node)
  ].filter((text) => typeof text === 'string' && text.trim())
  return {
    tag: node.rawName,
    type,
    keys,
    labels: labels.map((text) => text.trim()),
    placeholder: (staticAttr(node, 'placeholder') ?? '').trim(),
    autocomplete: normalized(staticAttr(node, 'autocomplete')).trim()
  }
}

const DATE_KEY_SNAKE = /(?:^|_)(?:at|date|time|datetime|timestamp)$/i
const DATE_KEY_CAMEL = /[a-z0-9](?:At|Date|Time|DateTime|Datetime|Timestamp)$/
const DATE_LABEL = /\b(?:date|datetime|timestamp)\b|\s(?:at)$/i
const DATE_PLACEHOLDER =
  /\d{4}-\d{2}-\d{2}|\b(?:yyyy|YYYY)[-/.]?(?:mm|MM)\b|\b(?:dd|DD)[-/.](?:mm|MM)\b|\b(?:mm|MM)[-/.](?:dd|DD)\b|\bISO[ -]?8601\b|\bRFC[ -]?3339\b|\bhh:mm\b/i

const NATIVE_DATE_TYPES = new Set(['date', 'datetime-local', 'datetime', 'month', 'week'])

export function dateEvidence(control) {
  if (control.autocomplete.startsWith('cc-')) return null
  if (NATIVE_DATE_TYPES.has(control.type)) return `type="${control.type}"`
  const key = control.keys.find((k) => DATE_KEY_SNAKE.test(k) || DATE_KEY_CAMEL.test(k))
  if (key) return `'${key}'`
  if (DATE_PLACEHOLDER.test(control.placeholder)) return `placeholder "${control.placeholder}"`
  const label = control.labels.find((text) => DATE_LABEL.test(text))
  if (label) return `label "${label}"`
  return null
}

const ID_KEY_SNAKE = /.(?:_ids?)$/i
const ID_KEY_CAMEL = /[a-z0-9](?:Id|ID|Ids|IDs)$/
const ID_LABEL = /\bIDs?$|\bidentifiers?$/i
const ID_PLACEHOLDER =
  /\b[a-z]{2,12}_(?=[0-9a-f]*\d)[0-9a-f]{4,}|\b[0-9a-f]{24,}\b|\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i

const OWN_IDENTIFIER = /(?:^|[\s_])(?:tax|vat|national|passport|document|external|client)$/i

const stemOf = (text) =>
  text
    .replace(/[_\s]?(?:ids?|identifiers?)$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .trim()

const references = (text) => !OWN_IDENTIFIER.test(stemOf(text))

export function idEvidence(control) {
  const key = control.keys.find(
    (k) => (ID_KEY_SNAKE.test(k) || ID_KEY_CAMEL.test(k)) && references(k)
  )
  if (key) return `'${key}'`
  const label = control.labels.find((text) => ID_LABEL.test(text) && references(text))
  if (label) return `label "${label}"`
  if (ID_PLACEHOLDER.test(control.placeholder)) return `placeholder "${control.placeholder}"`
  return null
}
