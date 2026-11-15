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
  writeOnly?: boolean
  format?: string
  const?: unknown
  oneOf?: SchemaFormSchema[]
  discriminator?: { propertyName: string; mapping?: Record<string, string> }
  additionalProperties?: boolean | SchemaFormSchema
  'x-multiline'?: boolean
  [keyword: string]: unknown
}

/** The control a field renders. */
export type SchemaFormWidget =
  | 'input'
  | 'textarea'
  | 'select'
  | 'number'
  | 'switch'
  | 'list'
  | 'json'
  | 'password'
  | 'combobox'
  | 'multiselect'
  | 'repeat'
  | 'map'
  | 'fieldset'
  | 'section'

/** One option a `ui[path].options` loader returns. */
export interface SchemaFormOption {
  /** The value written to the form. */
  value: string | number
  /** Text shown instead of the value. */
  label?: string
  /** Muted text at the end of the row. */
  description?: string
}

/** Loads the options of a field for the typed text (empty on first load); the form calls it, the app fetches. */
export type SchemaFormOptionsLoader = (query: string) => Promise<SchemaFormOption[]>

/** Shows the field while it returns true; receives the whole value and the object that holds the field. */
export type SchemaFormWhen = (
  value: Record<string, unknown>,
  parent: Record<string, unknown>
) => boolean

/** A group of an object's keys, shown under a legend or folded under a disclosure. */
export interface SchemaFormSection {
  /** Legend or disclosure title. Empty uses the locale catalog (Advanced settings). */
  title?: string
  /** Helper text under the legend. */
  description?: string
  /** The keys of the object the section holds, in this order. */
  keys: string[]
  /** Folds the section under a closed disclosure. */
  collapsed?: boolean
}

/** Per-path presentation overrides: `''` addresses the root object, `*` stands for a repeat item index. */
export interface SchemaFormUi {
  /** Control to render instead of the one the schema implies. */
  widget?: Exclude<SchemaFormWidget, 'fieldset' | 'section' | 'combobox' | 'multiselect'>
  /** Placeholder of the control. */
  placeholder?: string
  /** Leaves the field out of the form (its value is kept). */
  hidden?: boolean
  /** For an object: the keys to ask first, in this order; the rest follow in schema order. */
  order?: string[]
  /** Shows the field only while it returns true; a hidden field is not validated and its key is removed. */
  when?: SchemaFormWhen
  /** Loads the choices from the app: a searchable single choice, or several for an array. */
  options?: SchemaFormOptionsLoader
  /** For an object: groups of its keys; ungrouped keys come first. */
  sections?: SchemaFormSection[]
}

/** One choice of a `oneOf` with a discriminator, and the fields it adds. */
export interface SchemaFormVariant {
  value: string | number
  label: string
  children: SchemaFormNode[]
}

/** One rendered field, fieldset or section. */
export interface SchemaFormNode {
  key: string
  path: string
  uiPath: string
  schema: SchemaFormSchema
  type: SchemaFormType | undefined
  widget: SchemaFormWidget
  label: string
  description: string
  required: boolean
  readOnly: boolean
  writeOnly: boolean
  format: string
  placeholder: string
  options: Array<string | number>
  optionLabels: Record<string, string>
  itemType: 'string' | 'number' | 'integer'
  children: SchemaFormNode[]
  variants: SchemaFormVariant[]
  entries: SchemaFormNode[][]
  collapsed: boolean
  when?: SchemaFormWhen
  load?: SchemaFormOptionsLoader
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
    | 'email'
    | 'uri'
    | 'date'
  params?: Record<string, string | number>
  line?: number
}

export const UNSUPPORTED_KEYWORDS = [
  '$ref',
  'allOf',
  'anyOf',
  'not',
  'if',
  'then',
  'else',
  'const',
  'dependencies',
  'patternProperties',
  'propertyNames',
  'uniqueItems',
  'contains',
  'multipleOf'
] as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const discriminatorOf = (schema: SchemaFormSchema): string => {
  const discriminator = schema.discriminator
  if (!Array.isArray(schema.oneOf) || !isRecord(discriminator)) return ''
  const name = discriminator['propertyName']
  return typeof name === 'string' ? name : ''
}

const isStringMap = (schema: SchemaFormSchema) => {
  const extra = schema.additionalProperties
  return (
    !schema.properties &&
    isRecord(extra) &&
    resolveType(extra as SchemaFormSchema) === 'string' &&
    !Array.isArray(extra['enum'])
  )
}

export function resolveType(schema: SchemaFormSchema): SchemaFormType | undefined {
  if (schema.type) return schema.type
  if (schema.properties || discriminatorOf(schema)) return 'object'
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

const repeatable = (schema: SchemaFormSchema) =>
  isRecord(schema.items) &&
  resolveType(schema.items) === 'object' &&
  (isRecord(schema.items.properties) || Boolean(discriminatorOf(schema.items)))

function widgetOf(schema: SchemaFormSchema, type: SchemaFormType | undefined): SchemaFormWidget {
  if (type === 'object') {
    if (schema.properties || discriminatorOf(schema)) return 'fieldset'
    return isStringMap(schema) ? 'map' : 'json'
  }
  if (schema.enum?.length) return 'select'
  if (type === 'boolean') return 'switch'
  if (type === 'number' || type === 'integer') return 'number'
  if (type === 'array') return itemTypeOf(schema) && !schema.items?.enum ? 'list' : 'json'
  if (type === 'string') {
    if (schema.writeOnly === true || schema.format === 'password') return 'password'
    return schema['x-multiline'] === true || (schema.maxLength ?? 0) > 200 ? 'textarea' : 'input'
  }
  return 'json'
}

const pickWidget = (
  natural: SchemaFormWidget,
  type: SchemaFormType | undefined,
  schema: SchemaFormSchema,
  ui: SchemaFormUi
): SchemaFormWidget => {
  if (natural === 'fieldset') return natural
  if (ui.options) return type === 'array' ? 'multiselect' : 'combobox'
  const asked = ui.widget
  if (!asked) return natural
  if (asked === 'repeat') return type === 'array' && repeatable(schema) ? 'repeat' : natural
  if (asked === 'map') return type === 'object' ? 'map' : natural
  return asked
}

const orderedKeys = (keys: string[], order: string[] | undefined) => {
  if (!order?.length) return keys
  const first = order.filter((key) => keys.includes(key))
  return [...first, ...keys.filter((key) => !first.includes(key))]
}

const joinPath = (base: string, key: string) => (base ? `${base}.${key}` : key)

const blankNode = (key: string, path: string, uiPath: string): SchemaFormNode => ({
  key,
  path,
  uiPath,
  schema: {},
  type: undefined,
  widget: 'section',
  label: '',
  description: '',
  required: false,
  readOnly: false,
  writeOnly: false,
  format: '',
  placeholder: '',
  options: [],
  optionLabels: {},
  itemType: 'string',
  children: [],
  variants: [],
  entries: [],
  collapsed: false
})

function variantNode(
  schema: SchemaFormSchema,
  name: string,
  ui: Record<string, SchemaFormUi>,
  base: string,
  uiBase: string,
  readOnly: boolean
): SchemaFormNode {
  const own = isRecord(schema.properties) ? schema.properties[name] : undefined
  const variants: SchemaFormVariant[] = []
  for (const option of (schema.oneOf as unknown[]).filter(isRecord) as SchemaFormSchema[]) {
    const properties = isRecord(option.properties) ? { ...option.properties } : {}
    const tag = properties[name]
    const value = tag?.const ?? tag?.enum?.[0]
    if (typeof value !== 'string' && typeof value !== 'number') continue
    delete properties[name]
    const rest = { ...option, properties, oneOf: undefined, discriminator: undefined }
    variants.push({
      value,
      label: option.title || tag?.title || String(value),
      children: buildNodes(rest, ui, base, readOnly, uiBase)
    })
  }
  const path = joinPath(base, name)
  const uiPath = joinPath(uiBase, name)
  const firstVariant = (schema.oneOf ?? []).find((option) => isRecord(option))
  const firstTag = firstVariant?.properties?.[name]
  return {
    ...blankNode(name, path, uiPath),
    schema: own ?? {},
    type: typeof variants[0]?.value === 'number' ? 'number' : 'string',
    widget: 'select',
    label: own?.title || firstTag?.title || name,
    description: own?.description ?? '',
    required: true,
    readOnly: readOnly || own?.readOnly === true,
    placeholder: ui[path]?.placeholder ?? ui[uiPath]?.placeholder ?? '',
    options: variants.map((variant) => variant.value),
    optionLabels: Object.fromEntries(variants.map((v) => [String(v.value), v.label])),
    variants,
    when: ui[path]?.when ?? ui[uiPath]?.when
  }
}

function sectioned(
  nodes: SchemaFormNode[],
  sections: SchemaFormSection[] | undefined,
  base: string
): SchemaFormNode[] {
  if (!sections?.length) return nodes
  const claimed = new Set(sections.flatMap((section) => section.keys))
  const groups = sections.map((section, index) => {
    const key = `#section-${index}`
    return {
      ...blankNode(key, joinPath(base, key), joinPath(base, key)),
      label: section.title ?? '',
      description: section.description ?? '',
      collapsed: section.collapsed === true,
      children: section.keys
        .map((name) => nodes.find((node) => node.key === name))
        .filter((node): node is SchemaFormNode => Boolean(node))
    }
  })
  return [
    ...nodes.filter((node) => !claimed.has(node.key)),
    ...groups.filter((g) => g.children.length)
  ]
}

export function buildNodes(
  schema: SchemaFormSchema,
  ui: Record<string, SchemaFormUi> = {},
  base = '',
  parentReadOnly = false,
  uiBase = base
): SchemaFormNode[] {
  const properties = isRecord(schema.properties) ? schema.properties : {}
  const required = new Set(Array.isArray(schema.required) ? schema.required : [])
  const tag = discriminatorOf(schema)
  const objectUi = ui[base] ?? ui[uiBase] ?? {}
  const keys = Object.keys(properties)
  if (tag && !keys.includes(tag)) keys.unshift(tag)
  const nodes = orderedKeys(keys, objectUi.order)
    .map((key): SchemaFormNode | null => {
      if (key === tag) return variantNode(schema, tag, ui, base, uiBase, parentReadOnly)
      const child = properties[key] ?? {}
      const path = joinPath(base, key)
      const uiPath = joinPath(uiBase, key)
      const options = ui[path] ?? ui[uiPath] ?? {}
      if (options.hidden === true) return null
      const type = resolveType(child)
      const widget = pickWidget(widgetOf(child, type), type, child, options)
      const readOnly = parentReadOnly || child.readOnly === true
      return {
        ...blankNode(key, path, uiPath),
        schema: child,
        type,
        widget,
        label: child.title || key,
        description: child.description ?? '',
        required: required.has(key),
        readOnly,
        writeOnly: child.writeOnly === true,
        format: typeof child.format === 'string' ? child.format : '',
        placeholder: options.placeholder ?? '',
        options: Array.isArray(child.enum) ? child.enum : [],
        itemType: itemTypeOf(child) ?? 'string',
        children: widget === 'fieldset' ? buildNodes(child, ui, path, readOnly, uiPath) : [],
        when: options.when,
        load: options.options
      }
    })
    .filter((node): node is SchemaFormNode => node !== null)
  return sectioned(nodes, objectUi.sections, base)
}

const segmentsOf = (path: string) => path.split('.')

export function getAt(value: unknown, path: string): unknown {
  return segmentsOf(path).reduce<unknown>((current, key) => {
    if (Array.isArray(current)) return current[Number(key)]
    return isRecord(current) ? current[key] : undefined
  }, value)
}

const isIndex = (key: string | undefined) => key !== undefined && /^\d+$/.test(key)

function setIn(container: unknown, keys: string[], next: unknown): unknown {
  const [key, ...rest] = keys as [string, ...string[]]
  if (Array.isArray(container)) {
    const copy = [...container]
    const index = Number(key)
    copy[index] = rest.length ? (setIn(copy[index] ?? {}, rest, next) ?? {}) : next
    return copy
  }
  const copy: Record<string, unknown> = isRecord(container) ? { ...container } : {}
  if (rest.length) {
    const current = copy[key]
    const inner = isRecord(current) || Array.isArray(current) ? current : isIndex(rest[0]) ? [] : {}
    const updated = setIn(inner, rest, next)
    if (isRecord(updated) && !Object.keys(updated).length) delete copy[key]
    else copy[key] = updated
    return copy
  }
  if (next === undefined) delete copy[key]
  else copy[key] = next
  return copy
}

export function setAt(
  value: Record<string, unknown>,
  path: string,
  next: unknown
): Record<string, unknown> {
  return setIn(value, segmentsOf(path), next) as Record<string, unknown>
}

const parentPath = (path: string) => path.split('.').slice(0, -1).join('.')

/** The fields on screen for a value: `when` applied, the chosen variants and one entry per repeat item. */
export interface SchemaFormTree {
  nodes: SchemaFormNode[]
  hidden: string[]
}

const valuePaths = (nodes: SchemaFormNode[]): string[] =>
  nodes.flatMap((node) => {
    if (node.widget === 'fieldset' || node.widget === 'section') return valuePaths(node.children)
    return [node.path, ...node.variants.flatMap((variant) => valuePaths(variant.children))]
  })

export function expand(
  nodes: SchemaFormNode[],
  value: Record<string, unknown>,
  ui: Record<string, SchemaFormUi> = {}
): SchemaFormTree {
  const hidden: string[] = []
  const shown = new Set<string>()
  const visit = (list: SchemaFormNode[]): SchemaFormNode[] =>
    list.flatMap((node) => {
      const parent = getAt(value, parentPath(node.path))
      if (node.when && !node.when(value, isRecord(parent) ? parent : {})) {
        hidden.push(...valuePaths([node]))
        return []
      }
      if (node.widget === 'fieldset' || node.widget === 'section') {
        const children = visit(node.children)
        return children.length || node.widget === 'fieldset' ? [{ ...node, children }] : []
      }
      shown.add(node.path)
      if (node.variants.length) {
        const current = getAt(value, node.path)
        const chosen = node.variants.find((v) => String(v.value) === String(current))
        for (const variant of node.variants) {
          if (variant !== chosen) hidden.push(...valuePaths(variant.children))
        }
        return [node, ...(chosen ? visit(chosen.children) : [])]
      }
      if (node.widget === 'repeat') {
        const items = getAt(value, node.path)
        const item = node.schema.items as SchemaFormSchema
        const entries = (Array.isArray(items) ? items : []).map((_, index) =>
          visit(buildNodes(item, ui, `${node.path}.${index}`, node.readOnly, `${node.uiPath}.*`))
        )
        return [{ ...node, entries }]
      }
      return [node]
    })
  const visible = visit(nodes)
  return { nodes: visible, hidden: hidden.filter((path) => !shown.has(path)) }
}

export function seedDefaults(
  nodes: SchemaFormNode[],
  value: Record<string, unknown>
): Record<string, unknown> | null {
  let next = value
  let seeded = false
  const visit = (list: SchemaFormNode[]) => {
    for (const node of list) {
      if (node.widget === 'fieldset' || node.widget === 'section') {
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
  return checkFormat(schema.format, text)
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/u

const validDate = (text: string) => {
  const match = DATE.exec(text)
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const validUri = (text: string) => {
  try {
    return Boolean(new URL(text).protocol)
  } catch {
    return false
  }
}

function checkFormat(format: unknown, text: string): SchemaFormIssue | null {
  if (format === 'email' && !EMAIL.test(text)) return { key: 'email' }
  if ((format === 'uri' || format === 'url') && !validUri(text)) return { key: 'uri' }
  if (format === 'date' && !validDate(text)) return { key: 'date' }
  return null
}

const countIssue = (schema: SchemaFormSchema, count: number): SchemaFormIssue | null => {
  if (schema.minItems !== undefined && count < schema.minItems)
    return { key: 'minItems', params: { min: schema.minItems } }
  if (schema.maxItems !== undefined && count > schema.maxItems)
    return { key: 'maxItems', params: { max: schema.maxItems } }
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

export function validateNode(
  node: SchemaFormNode,
  value: unknown,
  draft?: string
): SchemaFormIssue | null {
  const { schema, widget } = node
  if (widget === 'fieldset' || widget === 'section' || widget === 'switch') return null
  const blank =
    draft !== undefined
      ? !draft.trim()
      : isEmpty(value) || (isRecord(value) && !Object.keys(value).length)
  if (blank) return node.required ? { key: 'required' } : null

  if (widget === 'repeat' || widget === 'multiselect')
    return countIssue(schema, Array.isArray(value) ? value.length : 0)
  if (widget === 'map' || widget === 'combobox') return null
  if (node.variants.length)
    return node.options.map(String).includes(String(value)) ? null : { key: 'enum' }

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
    const count = countIssue(schema, lines.length)
    if (count) return count
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

export function leavesOf(nodes: SchemaFormNode[]): SchemaFormNode[] {
  return nodes.flatMap((node) => {
    if (node.widget === 'fieldset' || node.widget === 'section') return leavesOf(node.children)
    if (node.widget === 'repeat') return [node, ...node.entries.flatMap(leavesOf)]
    return [node]
  })
}
