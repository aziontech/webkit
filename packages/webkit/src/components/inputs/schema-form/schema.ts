/** JSON Schema types SchemaForm reads. */
export type SchemaFormType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'

/** The draft-07 subset SchemaForm renders and validates. Other keywords are ignored. */
export interface SchemaFormSchema {
  type?: SchemaFormType
  title?: string
  description?: string
  default?: unknown
  enum?: Array<string | number>
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  items?: SchemaFormSchema
  minItems?: number
  maxItems?: number
  properties?: Record<string, SchemaFormSchema>
  required?: string[]
  readOnly?: boolean
  'x-multiline'?: boolean
  [keyword: string]: unknown
}

/** The control a field renders. */
export type SchemaFormWidget =
  'input' | 'textarea' | 'select' | 'number' | 'switch' | 'list' | 'json' | 'fieldset'

/** Per-path presentation overrides: `''` addresses the root object. */
export interface SchemaFormUi {
  /** Control to render instead of the one the schema implies. */
  widget?: Exclude<SchemaFormWidget, 'fieldset'>
  /** Placeholder of the control. */
  placeholder?: string
  /** Leaves the field out of the form (its value is kept). */
  hidden?: boolean
  /** For an object: the keys to ask first, in this order; the rest follow in schema order. */
  order?: string[]
}

/** One rendered field or fieldset. */
export interface SchemaFormNode {
  key: string
  path: string
  schema: SchemaFormSchema
  type: SchemaFormType | undefined
  widget: SchemaFormWidget
  label: string
  description: string
  required: boolean
  readOnly: boolean
  placeholder: string
  options: Array<string | number>
  itemType: 'string' | 'number' | 'integer'
  children: SchemaFormNode[]
}

/** A validation failure: the catalog message key under `schemaForm` and its parameters. */
export interface SchemaFormIssue {
  key:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'minimum'
    | 'maximum'
    | 'number'
    | 'integer'
    | 'enum'
    | 'minItems'
    | 'maxItems'
    | 'json'
  params?: Record<string, string | number>
  line?: number
}

/** Keywords SchemaForm does not apply. A schema that uses them still renders; they are ignored. */
export const UNSUPPORTED_KEYWORDS = [
  '$ref',
  'allOf',
  'anyOf',
  'oneOf',
  'not',
  'if',
  'then',
  'else',
  'const',
  'dependencies',
  'patternProperties',
  'additionalProperties',
  'propertyNames',
  'uniqueItems',
  'contains',
  'multipleOf',
  'format'
] as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function resolveType(schema: SchemaFormSchema): SchemaFormType | undefined {
  if (schema.type) return schema.type
  if (schema.properties) return 'object'
  if (schema.items) return 'array'
  if (Array.isArray(schema.default)) return 'array'
  if (typeof schema.default === 'boolean') return 'boolean'
  if (typeof schema.default === 'number')
    return Number.isInteger(schema.default) ? 'integer' : 'number'
  if (schema.enum?.length || typeof schema.default === 'string') return 'string'
  return undefined
}

const itemTypeOf = (schema: SchemaFormSchema): SchemaFormNode['itemType'] | null => {
  const items = schema.items
  if (!items) return 'string'
  const type = resolveType(items)
  if (type === 'number' || type === 'integer' || type === 'string') return type
  if (!type && !items.properties) return 'string'
  return null
}

function widgetOf(schema: SchemaFormSchema, type: SchemaFormType | undefined): SchemaFormWidget {
  if (type === 'object') return schema.properties ? 'fieldset' : 'json'
  if (schema.enum?.length) return 'select'
  if (type === 'boolean') return 'switch'
  if (type === 'number' || type === 'integer') return 'number'
  if (type === 'array') return itemTypeOf(schema) && !schema.items?.enum ? 'list' : 'json'
  if (type === 'string')
    return schema['x-multiline'] === true || (schema.maxLength ?? 0) > 200 ? 'textarea' : 'input'
  return 'json'
}

const orderedKeys = (keys: string[], order: string[] | undefined) => {
  if (!order?.length) return keys
  const first = order.filter((key) => keys.includes(key))
  return [...first, ...keys.filter((key) => !first.includes(key))]
}

export function buildNodes(
  schema: SchemaFormSchema,
  ui: Record<string, SchemaFormUi> = {},
  base = '',
  parentReadOnly = false
): SchemaFormNode[] {
  const properties = isRecord(schema.properties) ? schema.properties : {}
  const required = new Set(Array.isArray(schema.required) ? schema.required : [])
  return orderedKeys(Object.keys(properties), ui[base]?.order)
    .map((key) => {
      const child = properties[key] ?? {}
      const path = base ? `${base}.${key}` : key
      const options = ui[path] ?? {}
      const type = resolveType(child)
      const natural = widgetOf(child, type)
      const widget = natural === 'fieldset' ? natural : (options.widget ?? natural)
      const readOnly = parentReadOnly || child.readOnly === true
      return {
        key,
        path,
        schema: child,
        type,
        widget,
        label: child.title || key,
        description: child.description ?? '',
        required: required.has(key),
        readOnly,
        placeholder: options.placeholder ?? '',
        options: Array.isArray(child.enum) ? child.enum : [],
        itemType: itemTypeOf(child) ?? 'string',
        children: widget === 'fieldset' ? buildNodes(child, ui, path, readOnly) : [],
        hidden: options.hidden === true
      }
    })
    .filter((node) => !node.hidden)
    .map(({ hidden: _hidden, ...node }) => node)
}

export function getAt(value: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), value)
}

export function setAt(
  value: Record<string, unknown>,
  path: string,
  next: unknown
): Record<string, unknown> {
  const [key, ...rest] = path.split('.') as [string, ...string[]]
  const copy = { ...value }
  if (rest.length) {
    const inner = isRecord(copy[key]) ? (copy[key] as Record<string, unknown>) : {}
    const updated = setAt(inner, rest.join('.'), next)
    if (Object.keys(updated).length) copy[key] = updated
    else delete copy[key]
    return copy
  }
  if (next === undefined) delete copy[key]
  else copy[key] = next
  return copy
}

export function seedDefaults(
  nodes: SchemaFormNode[],
  value: Record<string, unknown>
): Record<string, unknown> | null {
  let next = value
  let seeded = false
  const visit = (list: SchemaFormNode[]) => {
    for (const node of list) {
      if (node.widget === 'fieldset') {
        visit(node.children)
        continue
      }
      if (getAt(next, node.path) !== undefined || node.schema.default === undefined) continue
      next = setAt(next, node.path, structuredClone(node.schema.default))
      seeded = true
    }
  }
  visit(nodes)
  return seeded ? next : null
}

export const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

function checkString(schema: SchemaFormSchema, text: string): SchemaFormIssue | null {
  if (schema.enum?.length && !schema.enum.map(String).includes(text)) return { key: 'enum' }
  if (schema.minLength !== undefined && [...text].length < schema.minLength)
    return { key: 'minLength', params: { min: schema.minLength } }
  if (schema.maxLength !== undefined && [...text].length > schema.maxLength)
    return { key: 'maxLength', params: { max: schema.maxLength } }
  if (schema.pattern) {
    try {
      if (!new RegExp(schema.pattern, 'u').test(text)) return { key: 'pattern' }
    } catch {
      return null
    }
  }
  return null
}

export function parseNumber(text: string): number | undefined {
  const trimmed = text.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function checkNumber(
  schema: SchemaFormSchema,
  integer: boolean,
  value: number
): SchemaFormIssue | null {
  if (Number.isNaN(value)) return { key: integer ? 'integer' : 'number' }
  if (integer && !Number.isInteger(value)) return { key: 'integer' }
  if (schema.minimum !== undefined && value < schema.minimum)
    return { key: 'minimum', params: { min: schema.minimum } }
  if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum)
    return { key: 'minimum', params: { min: schema.exclusiveMinimum } }
  if (schema.maximum !== undefined && value > schema.maximum)
    return { key: 'maximum', params: { max: schema.maximum } }
  if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum)
    return { key: 'maximum', params: { max: schema.exclusiveMaximum } }
  return null
}

export const listLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/** Validates one field. `draft` is the text a number, list or JSON control holds. */
export function validateNode(
  node: SchemaFormNode,
  value: unknown,
  draft?: string
): SchemaFormIssue | null {
  const { schema, widget } = node
  if (widget === 'fieldset' || widget === 'switch') return null
  const blank = draft !== undefined ? !draft.trim() : isEmpty(value)
  if (blank) return node.required ? { key: 'required' } : null

  if (widget === 'json') {
    if (draft === undefined) return null
    try {
      JSON.parse(draft)
      return null
    } catch {
      return { key: 'json' }
    }
  }

  if (widget === 'number' || (widget === 'select' && typeof value === 'number')) {
    const number = draft !== undefined ? parseNumber(draft) : Number(value)
    const issue = checkNumber(schema, node.type === 'integer', number ?? Number.NaN)
    if (issue || widget === 'number') return issue
  }

  if (widget === 'list') {
    const lines = draft !== undefined ? listLines(draft) : (value as unknown[]).map(String)
    if (schema.minItems !== undefined && lines.length < schema.minItems)
      return { key: 'minItems', params: { min: schema.minItems } }
    if (schema.maxItems !== undefined && lines.length > schema.maxItems)
      return { key: 'maxItems', params: { max: schema.maxItems } }
    const items = schema.items ?? {}
    for (const [index, line] of lines.entries()) {
      const issue =
        node.itemType === 'string'
          ? checkString(items, line)
          : checkNumber(items, node.itemType === 'integer', parseNumber(line) ?? Number.NaN)
      if (issue) return { ...issue, line: index + 1 }
    }
    return null
  }

  return checkString(schema, String(value))
}

/** Every leaf of the tree, depth first. */
export function leavesOf(nodes: SchemaFormNode[]): SchemaFormNode[] {
  return nodes.flatMap((node) => (node.widget === 'fieldset' ? leavesOf(node.children) : [node]))
}
