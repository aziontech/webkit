// THE ARGUMENT SCHEMA — `azion_form`, read and written as a list of FIELDS.
//
// `POST v4/workspace/functions` takes two properties that describe the same thing from
// two directions:
//
//   `default_args`  the values an instance of the function starts from — a plain JSON
//                   object, `{ "cookie_name": "ab_test" }`;
//   `azion_form`    a JSON Schema over those values. The console renders it as a form,
//                   so whoever instances the function answers named fields with
//                   guidance and validation instead of typing raw JSON.
//
// The schema is the harder document to write by hand and the easier one to write as a
// form, which is the whole reason this module exists: it is the two-way translation
// between the JSON Schema the endpoint receives and the flat, ordered FIELD LIST the
// Form Builder edits (../../components/function/FunctionArgsForm.vue). Type the schema
// in Monaco or build it out of rows — both produce the same document, because both go
// through here.
//
// ── WHAT A ROUND TRIP MUST NOT DO ──
//
// Lose anything. A form builder that reads a schema into rows and writes those rows
// back is a lossy filter over every construct it does not offer — `oneOf`, a nested
// object, `additionalProperties`, a keyword we simply did not think of. Dropping those
// silently is the classic form-builder bug: the reader opens the builder to rename one
// label and their `oneOf` is gone with no message.
//
// So a property this module cannot express as a row is kept VERBATIM (`raw`) and
// written back byte-for-byte. The builder renders it as a row it will not edit, saying
// so. The builder is allowed to be less expressive than JSON Schema; it is not allowed
// to be destructive. That holds for the SCHEMA's own keywords too: a `$schema`, a
// `title` on the form, an `additionalProperties` the reader set are read out and written
// back, so renaming one label does not rewrite their schema as the three keywords this
// module happens to know.
//
// ── AND WHAT IT NORMALIZES, ON PURPOSE ──
//
// A schema written by hand is not written the way a form writes one. `type` is left out
// where the rest of the node already says it (`{ "enum": ["webp", "avif"] }`), `required`
// is put on the property instead of in the object's `required` array, a number arrives as
// `"3600"`. Reading those as "richer than a row" is what made the JSON surface a WORSE
// way to add a field than the rows: the field appeared, uneditable, and the two surfaces
// disagreed about one document.
//
// So each of those is read as what it means and written back explicitly the first time
// the form serializes — the JSON pane shows what it settled on immediately, so nothing is
// inferred behind the reader's back. Typing a field in JSON and building the same field
// out of rows end at the same document, which is the whole promise of two surfaces.

/**
 * The types the builder offers, in the order its Type select lists them.
 *
 * `select` and `array` are not JSON Schema types — they are the two shapes that need
 * more than a type to be useful (`string` + `enum`, and `array` + `items`), and naming
 * them in the reader's words is what keeps the Type field a single question.
 */
export const FIELD_TYPES = [
  { value: 'string', label: 'Text', hint: 'A line of text.' },
  { value: 'integer', label: 'Integer', hint: 'A whole number.' },
  { value: 'number', label: 'Number', hint: 'A number, decimals allowed.' },
  { value: 'boolean', label: 'True / false', hint: 'A switch.' },
  { value: 'select', label: 'Choice', hint: 'One value from a list you define.' },
  { value: 'array', label: 'List', hint: 'Several values of one type.' }
]

/** The types a `list` field may hold. A list of lists is not a row this builder draws. */
export const ITEM_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' }
]

/** An empty schema — what "the function has a form, and it has no fields yet" looks like. */
export const EMPTY_SCHEMA = { type: 'object', properties: {} }

/** The keywords THIS module writes at the top of a schema. Everything else there is the
 *  reader's own and rides along untouched (`extras`, below). */
const SCHEMA_KEYWORDS = ['type', 'properties', 'required']

/**
 * `azion_form`, described as JSON Schema — so the JSON surface teaches the shape instead
 * of expecting it to be known.
 *
 * Monaco's JSON language service takes this and turns it into the three things that make
 * a schema writable by hand: COMPLETION for the keyword you are inside of, HOVER text
 * explaining what each one does to the form, and a marker on the value whose shape does
 * not fit. It is the same document the rows read, said in the one language the editor
 * already understands.
 *
 * It is deliberately OPEN — no `additionalProperties: false` on a field. The builder KEEPS
 * constructs it cannot draw (`oneOf`, `$ref`, `format`), so marking them would report a
 * schema this surface handles correctly as broken. And nothing here is `required`: every
 * keyword the builder infers (`type` above all) is legal to leave out.
 */
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

/** A property name the endpoint and the function's own code can both address. */
const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

let sequence = 0
/** A stable `v-for` key. Not the property name — that one is edited while it is a key. */
const nextId = () => `field-${(sequence += 1)}`

/**
 * The keywords each row TYPE writes — and therefore the only ones a node of that type may
 * carry and still be a row. A node holding anything else says more than the builder can
 * draw (`oneOf`, `$ref`, `format`, a `minLength` on a Choice) and is kept whole instead of
 * read into a row that would write it away.
 *
 * Per type rather than one flat set, because the flat set let a keyword through that the
 * type would then drop: a `pattern` on an Integer field parsed into a row, and the row
 * wrote the schema back without it.
 *
 * `required` is not here — it is read and hoisted before this check (see `toField`).
 */
const KEYWORDS_BY_TYPE = {
  string: ['type', 'title', 'description', 'default', 'minLength', 'maxLength', 'pattern'],
  integer: ['type', 'title', 'description', 'default', 'minimum', 'maximum'],
  number: ['type', 'title', 'description', 'default', 'minimum', 'maximum'],
  boolean: ['type', 'title', 'description', 'default'],
  select: ['type', 'title', 'description', 'default', 'enum'],
  array: ['type', 'title', 'description', 'default', 'items']
}

/** A blank row, ready to be named. */
export function blankField() {
  return {
    id: nextId(),
    key: '',
    type: 'string',
    title: '',
    description: '',
    required: false,
    // `''` rather than `undefined` for every text-shaped value, so a control bound to
    // it never renders the string "undefined" (props.md — the same reason webkit's own
    // optional text props default to `''`).
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

/**
 * Which of a row's constraint fields the Type in force actually uses. One answer, read
 * by the builder (which rows to draw) and by the serializer (which keywords to write),
 * so a constraint can never be shown on a field that would then drop it.
 *
 * @param {string} type
 * @returns {string[]}
 */
export function constraintsFor(type) {
  if (type === 'string') return ['minLength', 'maxLength', 'pattern']
  if (type === 'integer' || type === 'number') return ['minimum', 'maximum']
  if (type === 'select') return ['options']
  if (type === 'array') return ['itemType']
  return []
}

/** `''`/`null`/`undefined` → nothing was entered. `0` and `false` were. */
const blank = (value) => value === '' || value === null || value === undefined

/** A number keyword, or `undefined` when the reader left it empty or typed nonsense. */
const readNumber = (value, integer = false) => {
  if (blank(value)) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return undefined
  return integer ? Math.trunc(parsed) : parsed
}

/**
 * A row's `default`, in the type the endpoint expects — the one place the builder's
 * text-shaped inputs become JSON values.
 *
 * Returns `undefined` when the field has no default, which is different from having an
 * empty one: a field with no default contributes NO key to `default_args`, rather than
 * contributing a key whose value is `""`.
 *
 * @param {object} field
 * @returns {unknown}
 */
export function fieldDefault(field) {
  if (!field) return undefined
  if (field.raw) return field.raw.default

  switch (field.type) {
    case 'boolean':
      // A switch always has a position, so a boolean field always has a default.
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

/**
 * One row → one JSON Schema property node.
 *
 * @param {object} field
 * @returns {object}
 */
function toNode(field) {
  if (field.raw) return field.raw

  const node = {}

  // `type` first, then the human words, then the machine constraints — the order a
  // person reads a schema in, so the JSON the builder writes looks hand-written.
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

/**
 * The type a property node describes, INCLUDING when it does not say so.
 *
 * `type` is the keyword a hand-written schema leaves out, because the rest of the node
 * already answers it: an `enum` is a choice, `"default": 3600` is a number, `items` is a
 * list. Every signal below is unambiguous, and the type it settles on is written back
 * explicitly the first time the form serializes — so the JSON pane says what it decided
 * rather than the reader having to trust it.
 *
 * A `type` the builder does not offer (`"object"`, or an array of types) is returned as is
 * and matches no row: the caller keeps that node whole.
 *
 * @param {object} node
 * @returns {string}
 */
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
  // Nothing said at all (`{}`, or a node carrying only a title): the same answer the Type
  // select gives a field built as a row, so both surfaces start a bare field the same way.
  return 'string'
}

/**
 * A number keyword as the row holds it: TEXT, because the control under it is a text input
 * (`''` when empty).
 *
 * `null` means the value is not a number at all, which makes the node richer than the row
 * rather than a row with a mangled constraint. A number written as a string (`"3600"`, what
 * a hand-written schema and every form post produce) is the same number and is read as one.
 *
 * @param {unknown} value
 * @param {boolean} integer
 * @returns {string | null}
 */
function readNumberKeyword(value, integer) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(integer ? Math.trunc(value) : value)
  }
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return value.trim()
  }
  return null
}

/** What a row's Default control holds for a field of `type` with no default. */
const blankDefault = (type) => {
  if (type === 'boolean') return false
  if (type === 'array') return []
  return ''
}

/**
 * A node's `default`, as the value the row's Default control holds.
 *
 * `{ ok: false }` when that control cannot show it — `{ "type": "integer", "default": {} }`.
 * The node then goes to `raw` and is written back exactly as it was, which is the point: a
 * default the builder cannot show is not a default it gets to delete. Before this, a default
 * whose type disagreed with the field's was read as "no default", and the next row edit
 * wrote the schema back without it — a value removed from the reader's document by the
 * builder having looked at it.
 *
 * A default merely written in another shape than the control's is CONVERTED rather than
 * refused (`"3600"` on an Integer, `5` on a Text field): the same value, in the shape this
 * surface holds it in.
 *
 * @param {object} node
 * @param {string} type
 * @returns {{ ok: boolean, value?: unknown }}
 */
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
      // A list of objects is not a list this builder's Default textarea can hold.
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

/**
 * The type of a list's values when `items` did not say — read off the default, so a
 * hand-written `{ "default": [1, 2] }` is a list of integers and not a list of text.
 *
 * @param {unknown} value
 * @returns {string}
 */
function inferItemType(value) {
  if (!Array.isArray(value) || value.length === 0) return 'string'
  if (!value.every((item) => typeof item === 'number')) return 'string'
  return value.every(Number.isInteger) ? 'integer' : 'number'
}

/**
 * One JSON Schema property node → one row, or `null` when the node is richer than a row
 * (which is not a failure: the caller keeps it as `raw`).
 *
 * @param {string} key
 * @param {object} node
 * @param {boolean} required
 * @returns {object | null}
 */
function toField(key, node, required) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return null

  // `"required": true` ON THE PROPERTY is how the keyword gets written by hand: it is
  // where other schema dialects keep it, and where anyone who has not read the JSON Schema
  // spec looks for it. JSON Schema keeps it in the OBJECT's `required` array, which is what
  // the form writes — so the boolean is HOISTED there rather than making the field
  // uneditable over a keyword in the wrong place. Anything else under that name is a
  // construct the rows do not draw.
  if ('required' in node && typeof node.required !== 'boolean') return null
  const isRequired = required || node.required === true

  const type = nodeType(node)
  const allowed = KEYWORDS_BY_TYPE[type]
  if (!allowed) return null
  if (Object.keys(node).some((keyword) => keyword !== 'required' && !allowed.includes(keyword))) {
    return null
  }
  // A name or guidance that is not text is not the row's to rewrite as `''`.
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
      // An enum of anything but strings is a list the Choice row cannot round-trip.
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
        // Exactly `{ "type": … }`, and one of the three the List row offers: an `items`
        // with its own constraints, or a tuple, is not a row.
        if (!items || typeof items !== 'object' || Array.isArray(items)) return null
        if (Object.keys(items).length !== 1) return null
        if (!ITEM_TYPES.some((item) => item.value === items.type)) return null
        field.itemType = items.type
      } else {
        field.itemType = inferItemType(node.default)
      }
      return field

    default:
      // `boolean` — nothing beyond the switch's own position.
      return field
  }
}

/**
 * Where the text stopped being JSON, in the reader's terms.
 *
 * The exception's own message is a parser's sentence ("Unexpected token } in JSON at
 * position 176"), so only the PLACE is taken from it. Engines that report the line and
 * column give it up directly; the rest report a character offset, which is counted into a
 * line and column here rather than shown as an offset nobody can find by eye.
 *
 * @param {string} text
 * @param {unknown} exception
 * @returns {string}
 */
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

/**
 * Read a JSON Schema — as TEXT, because that is what the JSON surface holds — into the
 * ordered field list the builder edits.
 *
 * Text in and not an object, because parsing is where this can fail and the failure is
 * the caller's to render: a builder that silently shows an empty field list over
 * unparseable JSON has thrown the reader's schema away on screen.
 *
 * `extras` and `extraRequired` are everything at the TOP of the schema that this module
 * does not write itself. They are handed back so the caller can hand them to
 * `serializeSchema` and the document survives a row edit intact.
 *
 * @param {string} text
 * @returns {{ ok: boolean, error: string, fields: object[], extras: object, extraRequired: string[] }}
 */
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

  // Property ORDER is the field order. JSON Schema does not define one, but every
  // renderer follows the object's key order and so does the reader building it, so the
  // builder treats it as the order and preserves it on the way back out.
  for (const [key, node] of Object.entries(schema.properties ?? {})) {
    const field = toField(key, node, required.has(key))
    if (field) {
      fields.push(field)
      continue
    }
    // Richer than a row — kept whole, rendered as a row that says it is not editable.
    const kept = blankField()
    kept.key = key
    kept.required = required.has(key)
    kept.title = typeof node?.title === 'string' ? node.title : ''
    kept.description = typeof node?.description === 'string' ? node.description : ''
    kept.raw = node
    fields.push(kept)
  }

  // EVERYTHING ELSE AT THE TOP IS THE READER'S. `$schema`, a `title` on the form itself,
  // an `additionalProperties` they set: none of it is the builder's to write, and none of
  // it is the builder's to remove. Handed back for `serializeSchema` to write again.
  const extras = {}
  for (const [keyword, value] of Object.entries(schema)) {
    if (!SCHEMA_KEYWORDS.includes(keyword)) extras[keyword] = value
  }

  // A `required` entry naming no property — a field being renamed, or a schema mid-edit.
  // Kept for the same reason, so the name does not disappear while it is being typed.
  const properties = schema.properties ?? {}
  const extraRequired = [...required].filter((key) => !(key in properties))

  return { ok: true, error: '', fields, extras, extraRequired }
}

/**
 * The field list → the JSON Schema text the endpoint receives.
 *
 * A field with no name is not written: a nameless row is a row mid-typing, and a
 * property named `""` is not what the reader is in the middle of asking for.
 *
 * `extras` / `extraRequired` come straight back from `parseSchema`. Pass them and the
 * schema's own keywords survive the trip through the rows; leave them out and the rows are
 * the whole document, which is what a form being started from nothing means.
 *
 * @param {object[]} fields
 * @param {{ indent?: number, extras?: object, extraRequired?: string[] }} [options]
 * @returns {string}
 */
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

  // `type` first and `properties` after whatever the reader put between them: the two
  // keywords a person scans a form schema for stay where they expect, and the rest keeps
  // the place it had in the document.
  const schema = { type: 'object', ...(extras ?? {}) }
  schema.properties = properties

  const names = [...required, ...extraRequired.filter((key) => !required.includes(key))]
  // `required: []` is legal and means the same as no `required` at all, so it is not
  // written — the schema a reader is shown should not carry keywords saying nothing.
  if (names.length) schema.required = names

  return JSON.stringify(schema, null, indent)
}

/** Whether a schema text describes a form at all (an object with at least one property). */
export function hasForm(text) {
  const { ok, fields } = parseSchema(text)
  return ok && fields.length > 0
}

/**
 * `default_args`, given the form and whatever the reader already had there.
 *
 * The form OWNS the keys it declares — their value is the field's Default, which is the
 * one place a default is written. Every other key is the reader's own and is preserved
 * untouched: adding a form to a function that already had arguments must not delete the
 * arguments it had.
 *
 * @param {object} args The current `default_args`.
 * @param {object[]} fields
 * @returns {object}
 */
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
    // A field with no default contributes no key — the instance is asked for it.
    if (value !== undefined) next[key] = value
  }

  return next
}

/**
 * A field list inferred from arguments a function ALREADY has.
 *
 * A function can hold `default_args` and no `azion_form` — it is the older of the two
 * properties, and every function written before the Form Builder existed is in exactly
 * that state. Starting its form from a blank row would ask the reader to retype what the
 * function already declares, so `Add form` starts from the arguments instead: one field
 * per key, its type read off the value, the value kept as the default.
 *
 * The type is inferred, never guessed at: a value whose shape is not one of the rows
 * (a nested object, a mixed array) is skipped rather than flattened into a Text field
 * that would rewrite it on the next edit. Its key stays in `default_args` untouched —
 * `applyFormDefaults` preserves every key the form does not declare.
 *
 * @param {object} args `default_args`.
 * @returns {object[]}
 */
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
      // A nested object, an empty/mixed array — not a row. Left in `default_args`.
      continue
    }

    fields.push(field)
  }

  return fields
}

/**
 * Why a property name cannot be used — empty when it can. The message is the field's,
 * so the row can show it under the Name input.
 *
 * @param {string} key
 * @param {object[]} fields Every field, so a duplicate can be named as one.
 * @param {string} id The field being checked, so it does not collide with itself.
 * @returns {string}
 */
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
