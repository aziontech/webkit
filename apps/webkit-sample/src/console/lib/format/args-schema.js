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
// to be destructive.

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

/** A property name the endpoint and the function's own code can both address. */
const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

let sequence = 0
/** A stable `v-for` key. Not the property name — that one is edited while it is a key. */
const nextId = () => `field-${(sequence += 1)}`

/** The keywords a row owns. Anything else on a node means the node cannot be a row. */
const OWNED = new Set([
  'type',
  'title',
  'description',
  'default',
  'enum',
  'items',
  'minLength',
  'maxLength',
  'pattern',
  'minimum',
  'maximum'
])

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

  // Anything outside the keywords a row owns means the node says more than the builder
  // can draw — `oneOf`, `$ref`, `additionalProperties`, `format`.
  if (Object.keys(node).some((keyword) => !OWNED.has(keyword))) return null

  const field = blankField()
  field.key = key
  field.required = required
  field.title = typeof node.title === 'string' ? node.title : ''
  field.description = typeof node.description === 'string' ? node.description : ''

  if (Array.isArray(node.enum)) {
    // An enum of anything but strings is a list the Choice row cannot round-trip.
    if (node.type !== 'string' || node.enum.some((option) => typeof option !== 'string')) return null
    field.type = 'select'
    field.options = [...node.enum]
    field.default = typeof node.default === 'string' ? node.default : ''
    return field
  }

  switch (node.type) {
    case 'string':
      field.type = 'string'
      field.minLength = node.minLength ?? ''
      field.maxLength = node.maxLength ?? ''
      field.pattern = typeof node.pattern === 'string' ? node.pattern : ''
      field.default = typeof node.default === 'string' ? node.default : ''
      return field

    case 'integer':
    case 'number':
      field.type = node.type
      field.minimum = node.minimum ?? ''
      field.maximum = node.maximum ?? ''
      field.default = typeof node.default === 'number' ? String(node.default) : ''
      return field

    case 'boolean':
      field.type = 'boolean'
      field.default = node.default === true
      return field

    case 'array': {
      const itemType = node.items?.type
      // `items` has to be exactly one of the three the List row offers; an `items`
      // with its own constraints, or a tuple, is not a row.
      if (!ITEM_TYPES.some((item) => item.value === itemType)) return null
      if (Object.keys(node.items).length !== 1) return null
      field.type = 'array'
      field.itemType = itemType
      field.default = Array.isArray(node.default) ? node.default.map(String) : []
      return field
    }

    default:
      return null
  }
}

/**
 * Read a JSON Schema — as TEXT, because that is what the JSON surface holds — into the
 * ordered field list the builder edits.
 *
 * Text in and not an object, because parsing is where this can fail and the failure is
 * the caller's to render: a builder that silently shows an empty field list over
 * unparseable JSON has thrown the reader's schema away on screen.
 *
 * @param {string} text
 * @returns {{ ok: boolean, error: string, fields: object[] }}
 */
export function parseSchema(text) {
  const empty = { ok: false, error: '', fields: [] }

  if (typeof text !== 'string' || !text.trim()) {
    return { ok: true, error: '', fields: [] }
  }

  let schema
  try {
    schema = JSON.parse(text)
  } catch {
    return { ...empty, error: 'This is not valid JSON yet.' }
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

  return { ok: true, error: '', fields }
}

/**
 * The field list → the JSON Schema text the endpoint receives.
 *
 * A field with no name is not written: a nameless row is a row mid-typing, and a
 * property named `""` is not what the reader is in the middle of asking for.
 *
 * @param {object[]} fields
 * @param {number} [indent]
 * @returns {string}
 */
export function serializeSchema(fields, indent = 2) {
  const properties = {}
  const required = []

  for (const field of fields) {
    const key = String(field.key ?? '').trim()
    if (!key || key in properties) continue
    properties[key] = toNode(field)
    if (field.required) required.push(key)
  }

  const schema = { type: 'object', properties }
  // `required: []` is legal and means the same as no `required` at all, so it is not
  // written — the schema a reader is shown should not carry keywords saying nothing.
  if (required.length) schema.required = required

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
