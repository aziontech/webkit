export const FIELD_TYPES = [
  { value: 'string', label: 'Text', hint: 'A line of text.' },
  { value: 'integer', label: 'Integer', hint: 'A whole number.' },
  { value: 'number', label: 'Number', hint: 'A number, decimals allowed.' },
  { value: 'boolean', label: 'True / false', hint: 'A switch.' },
  { value: 'select', label: 'Choice', hint: 'One value from a list you define.' },
  { value: 'array', label: 'List', hint: 'Several values of one type.' }
]

export const ITEM_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' }
]

export const EMPTY_SCHEMA = { type: 'object', properties: {} }

const SCHEMA_KEYWORDS = ['type', 'properties', 'required']

export const FORM_JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Function argument form',
  markdownDescription:
    'A JSON Schema over `default_args`. Each entry in `properties` is one field the form asks for.',
  type: 'object',
  properties: {
    type: {
      const: 'object',
      markdownDescription: 'Always `object`. A form describes the arguments object.'
    },
    properties: {
      type: 'object',
      markdownDescription:
        'One entry per field. The property name is the key the function reads, and the order here is the order the form asks in.',
      additionalProperties: { $ref: '#/definitions/field' },
      defaultSnippets: [
        {
          label: 'Text field',
          markdownDescription: 'A field that takes a line of text.',
          body: {
            '${1:field_name}': {
              type: 'string',
              title: '${2:Label}',
              description: '${3:What this argument does}'
            }
          }
        },
        {
          label: 'Choice field',
          markdownDescription: 'A field that takes one value from a list.',
          body: {
            '${1:field_name}': {
              type: 'string',
              title: '${2:Label}',
              enum: ['${3:first}', '${4:second}']
            }
          }
        }
      ]
    },
    required: {
      type: 'array',
      markdownDescription: 'The names of the fields the form refuses to save without.',
      items: { type: 'string' },
      uniqueItems: true
    }
  },
  definitions: {
    field: {
      type: 'object',
      markdownDescription: 'One field of the form. Leave `type` out and it is read from the rest.',
      properties: {
        type: {
          markdownDescription: 'What the field accepts, and the control the form renders.',
          enum: ['string', 'integer', 'number', 'boolean', 'array'],
          markdownEnumDescriptions: [
            'A line of text. With `enum`, a list to choose one value from.',
            'A whole number.',
            'A number, decimals allowed.',
            'A switch.',
            'Several values of one type. `items` says which.'
          ]
        },
        title: {
          type: 'string',
          markdownDescription:
            'How the field is named in the form. Falls back to the property name.'
        },
        description: { type: 'string', markdownDescription: 'The guidance under the field.' },
        default: {
          markdownDescription:
            'What an instance starts from. This is also the field entry in `default_args`.'
        },
        enum: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
          markdownDescription:
            'The values the form offers, as a list to choose one from. Text fields only.'
        },
        items: {
          type: 'object',
          markdownDescription: 'For a list: the type of every value in it.',
          properties: {
            type: { enum: ['string', 'integer', 'number'] }
          }
        },
        minLength: { type: 'integer', minimum: 0, markdownDescription: 'Text fields only.' },
        maxLength: { type: 'integer', minimum: 0, markdownDescription: 'Text fields only.' },
        pattern: {
          type: 'string',
          format: 'regex',
          markdownDescription: 'A regular expression the value has to match. Text fields only.'
        },
        minimum: { type: 'number', markdownDescription: 'Number fields only.' },
        maximum: { type: 'number', markdownDescription: 'Number fields only.' },
        required: {
          type: 'boolean',
          markdownDescription:
            "Read here, and moved to the form's own `required` list the next time it is written."
        }
      }
    }
  }
}

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

let sequence = 0
const nextId = () => `field-${(sequence += 1)}`

const KEYWORDS_BY_TYPE = {
  string: ['type', 'title', 'description', 'default', 'minLength', 'maxLength', 'pattern'],
  integer: ['type', 'title', 'description', 'default', 'minimum', 'maximum'],
  number: ['type', 'title', 'description', 'default', 'minimum', 'maximum'],
  boolean: ['type', 'title', 'description', 'default'],
  select: ['type', 'title', 'description', 'default', 'enum'],
  array: ['type', 'title', 'description', 'default', 'items']
}

export function blankField() {
  return {
    id: nextId(),
    key: '',
    type: 'string',
    title: '',
    description: '',
    required: false,
    default: '',
    minLength: '',
    maxLength: '',
    pattern: '',
    minimum: '',
    maximum: '',
    options: [],
    itemType: 'string',
    raw: null
  }
}

export function constraintsFor(type) {
  if (type === 'string') return ['minLength', 'maxLength', 'pattern']
  if (type === 'integer' || type === 'number') return ['minimum', 'maximum']
  if (type === 'select') return ['options']
  if (type === 'array') return ['itemType']
  return []
}

const blank = (value) => value === '' || value === null || value === undefined

const readNumber = (value, integer = false) => {
  if (blank(value)) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return undefined
  return integer ? Math.trunc(parsed) : parsed
}

export function fieldDefault(field) {
  if (!field) return undefined
  if (field.raw) return field.raw.default

  switch (field.type) {
    case 'boolean':
      return field.default === true
    case 'integer':
      return readNumber(field.default, true)
    case 'number':
      return readNumber(field.default)
    case 'array': {
      if (!Array.isArray(field.default) || field.default.length === 0) return undefined
      if (field.itemType === 'string') return field.default.map(String)
      return field.default
        .map((item) => readNumber(item, field.itemType === 'integer'))
        .filter((item) => item !== undefined)
    }
    default:
      return blank(field.default) ? undefined : String(field.default)
  }
}

function toNode(field) {
  if (field.raw) return field.raw

  const node = {}

  node.type = field.type === 'select' ? 'string' : field.type
  if (field.title.trim()) node.title = field.title.trim()
  if (field.description.trim()) node.description = field.description.trim()

  if (field.type === 'select') {
    const options = field.options.map((option) => String(option).trim()).filter(Boolean)
    if (options.length) node.enum = options
  }

  if (field.type === 'array') {
    node.items = { type: field.itemType }
  }

  for (const constraint of constraintsFor(field.type)) {
    if (constraint === 'options' || constraint === 'itemType') continue
    const integer = constraint === 'minLength' || constraint === 'maxLength'
    const value = readNumber(field[constraint], integer || field.type === 'integer')
    if (value !== undefined) node[constraint] = value
  }

  if (field.type === 'string' && field.pattern.trim()) node.pattern = field.pattern.trim()

  const value = fieldDefault(field)
  if (value !== undefined) node.default = value

  return node
}

function nodeType(node) {
  if (typeof node.type === 'string') {
    return node.type === 'string' && Array.isArray(node.enum) ? 'select' : node.type
  }
  if (Array.isArray(node.enum)) return 'select'
  if ('items' in node) return 'array'
  if (Array.isArray(node.default)) return 'array'
  if (typeof node.default === 'boolean') return 'boolean'
  if (typeof node.default === 'number') {
    return Number.isInteger(node.default) ? 'integer' : 'number'
  }
  if ('minimum' in node || 'maximum' in node) return 'number'
  if ('minLength' in node || 'maxLength' in node || 'pattern' in node) return 'string'
  return 'string'
}

function readNumberKeyword(value, integer) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(integer ? Math.trunc(value) : value)
  }
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return value.trim()
  }
  return null
}

const blankDefault = (type) => {
  if (type === 'boolean') return false
  if (type === 'array') return []
  return ''
}

function readNodeDefault(node, type) {
  if (!('default' in node)) return { ok: true, value: blankDefault(type) }
  const value = node.default

  switch (type) {
    case 'boolean':
      if (typeof value === 'boolean') return { ok: true, value }
      if (value === 'true' || value === 'false') return { ok: true, value: value === 'true' }
      return { ok: false }

    case 'integer':
    case 'number': {
      const number = readNumberKeyword(value, type === 'integer')
      return number === null ? { ok: false } : { ok: true, value: number }
    }

    case 'array':
      if (!Array.isArray(value)) return { ok: false }
      if (value.some((item) => item === null || typeof item === 'object')) return { ok: false }
      return { ok: true, value: value.map(String) }

    case 'select':
      return typeof value === 'string' ? { ok: true, value } : { ok: false }

    default:
      if (typeof value === 'string') return { ok: true, value }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return { ok: true, value: String(value) }
      }
      return { ok: false }
  }
}

function inferItemType(value) {
  if (!Array.isArray(value) || value.length === 0) return 'string'
  if (!value.every((item) => typeof item === 'number')) return 'string'
  return value.every(Number.isInteger) ? 'integer' : 'number'
}

function toField(key, node, required) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return null

  if ('required' in node && typeof node.required !== 'boolean') return null
  const isRequired = required || node.required === true

  const type = nodeType(node)
  const allowed = KEYWORDS_BY_TYPE[type]
  if (!allowed) return null
  if (Object.keys(node).some((keyword) => keyword !== 'required' && !allowed.includes(keyword))) {
    return null
  }
  if ('title' in node && typeof node.title !== 'string') return null
  if ('description' in node && typeof node.description !== 'string') return null

  const value = readNodeDefault(node, type)
  if (!value.ok) return null

  const field = blankField()
  field.key = key
  field.required = isRequired
  field.type = type
  field.title = node.title ?? ''
  field.description = node.description ?? ''
  field.default = value.value

  switch (type) {
    case 'select':
      if (node.enum.some((option) => typeof option !== 'string')) return null
      field.options = [...node.enum]
      return field

    case 'string':
      for (const keyword of ['minLength', 'maxLength']) {
        if (!(keyword in node)) continue
        const number = readNumberKeyword(node[keyword], true)
        if (number === null) return null
        field[keyword] = number
      }
      if ('pattern' in node) {
        if (typeof node.pattern !== 'string') return null
        field.pattern = node.pattern
      }
      return field

    case 'integer':
    case 'number':
      for (const keyword of ['minimum', 'maximum']) {
        if (!(keyword in node)) continue
        const number = readNumberKeyword(node[keyword], type === 'integer')
        if (number === null) return null
        field[keyword] = number
      }
      return field

    case 'array':
      if ('items' in node) {
        const items = node.items
        if (!items || typeof items !== 'object' || Array.isArray(items)) return null
        if (Object.keys(items).length !== 1) return null
        if (!ITEM_TYPES.some((item) => item.value === items.type)) return null
        field.itemType = items.type
      } else {
        field.itemType = inferItemType(node.default)
      }
      return field

    default:
      return field
  }
}

function jsonError(text, exception) {
  const message = String(exception?.message ?? '')
  const stated = /\(line (\d+) column (\d+)\)/.exec(message)
  if (stated) return `This is not valid JSON yet. Line ${stated[1]}, column ${stated[2]}.`

  const offset = /position (\d+)/.exec(message)
  if (offset) {
    const upTo = text.slice(0, Number(offset[1]))
    const line = upTo.split('\n').length
    const column = upTo.length - upTo.lastIndexOf('\n')
    return `This is not valid JSON yet. Line ${line}, column ${column}.`
  }

  return 'This is not valid JSON yet.'
}

export function parseSchema(text) {
  const nothing = { fields: [], extras: {}, extraRequired: [] }
  const empty = { ok: false, error: '', ...nothing }

  if (typeof text !== 'string' || !text.trim()) {
    return { ok: true, error: '', ...nothing }
  }

  let schema
  try {
    schema = JSON.parse(text)
  } catch (exception) {
    return { ...empty, error: jsonError(text, exception) }
  }

  if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) {
    return { ...empty, error: 'A form schema is a JSON object.' }
  }
  if (schema.properties && typeof schema.properties !== 'object') {
    return { ...empty, error: '`properties` is an object, one entry per field.' }
  }

  const required = new Set(Array.isArray(schema.required) ? schema.required : [])
  const fields = []

  for (const [key, node] of Object.entries(schema.properties ?? {})) {
    const field = toField(key, node, required.has(key))
    if (field) {
      fields.push(field)
      continue
    }
    const kept = blankField()
    kept.key = key
    kept.required = required.has(key)
    kept.title = typeof node?.title === 'string' ? node.title : ''
    kept.description = typeof node?.description === 'string' ? node.description : ''
    kept.raw = node
    fields.push(kept)
  }

  const extras = {}
  for (const [keyword, value] of Object.entries(schema)) {
    if (!SCHEMA_KEYWORDS.includes(keyword)) extras[keyword] = value
  }

  const properties = schema.properties ?? {}
  const extraRequired = [...required].filter((key) => !(key in properties))

  return { ok: true, error: '', fields, extras, extraRequired }
}

export function serializeSchema(fields, options = {}) {
  const { indent = 2, extras = null, extraRequired = [] } = options
  const properties = {}
  const required = []

  for (const field of fields) {
    const key = String(field.key ?? '').trim()
    if (!key || key in properties) continue
    properties[key] = toNode(field)
    if (field.required) required.push(key)
  }

  const schema = { type: 'object', ...(extras ?? {}) }
  schema.properties = properties

  const names = [...required, ...extraRequired.filter((key) => !required.includes(key))]
  if (names.length) schema.required = names

  return JSON.stringify(schema, null, indent)
}

export function hasForm(text) {
  const { ok, fields } = parseSchema(text)
  return ok && fields.length > 0
}

export function applyFormDefaults(args, fields) {
  const owned = new Set(
    fields.map((field) => String(field.key ?? '').trim()).filter((key) => key.length > 0)
  )

  const next = {}
  for (const [key, value] of Object.entries(args ?? {})) {
    if (!owned.has(key)) next[key] = value
  }
  for (const field of fields) {
    const key = String(field.key ?? '').trim()
    if (!key) continue
    const value = fieldDefault(field)
    if (value !== undefined) next[key] = value
  }

  return next
}

export function fieldsFromArgs(args) {
  const fields = []

  for (const [key, value] of Object.entries(args ?? {})) {
    if (!KEY_PATTERN.test(key)) continue

    const field = blankField()
    field.key = key

    if (typeof value === 'boolean') {
      field.type = 'boolean'
      field.default = value
    } else if (typeof value === 'number') {
      field.type = Number.isInteger(value) ? 'integer' : 'number'
      field.default = String(value)
    } else if (typeof value === 'string') {
      field.type = 'string'
      field.default = value
    } else if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      field.type = 'array'
      field.itemType = 'string'
      field.default = [...value]
    } else if (Array.isArray(value) && value.every((item) => typeof item === 'number')) {
      field.type = 'array'
      field.itemType = value.every(Number.isInteger) ? 'integer' : 'number'
      field.default = value.map(String)
    } else {
      continue
    }

    fields.push(field)
  }

  return fields
}

export function keyError(key, fields, id) {
  const value = String(key ?? '').trim()
  if (!value) return 'Give the field a name.'
  if (!KEY_PATTERN.test(value)) {
    return 'Letters, digits and underscore, not starting with a digit.'
  }
  const duplicate = fields.some(
    (field) => field.id !== id && String(field.key ?? '').trim() === value
  )
  return duplicate ? 'Another field already uses this name.' : ''
}
