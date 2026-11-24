import type {
  SchemaFormNode,
  SchemaFormSchema,
  SchemaFormSection,
  SchemaFormType,
  SchemaFormUi,
  SchemaFormVariant,
  SchemaFormWidget
} from '../schema'
import { isRecord } from './schema-paths'

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

function resolveType(schema: SchemaFormSchema): SchemaFormType | undefined {
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

const objectWidget = (schema: SchemaFormSchema): SchemaFormWidget => {
  if (schema.properties || discriminatorOf(schema)) return 'fieldset'
  return isStringMap(schema) ? 'map' : 'json'
}

const stringWidget = (schema: SchemaFormSchema): SchemaFormWidget => {
  if (schema.writeOnly === true || schema.format === 'password') return 'password'
  return schema['x-multiline'] === true || (schema.maxLength ?? 0) > 200 ? 'textarea' : 'input'
}

function widgetOf(schema: SchemaFormSchema, type: SchemaFormType | undefined): SchemaFormWidget {
  if (type === 'object') return objectWidget(schema)
  if (schema.enum?.length) return 'select'
  if (type === 'boolean') return 'switch'
  if (type === 'number' || type === 'integer') return 'number'
  if (type === 'array') return itemTypeOf(schema) && !schema.items?.enum ? 'list' : 'json'
  return type === 'string' ? stringWidget(schema) : 'json'
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

function collectVariants(
  schema: SchemaFormSchema,
  name: string,
  ui: Record<string, SchemaFormUi>,
  base: string,
  uiBase: string,
  readOnly: boolean
): SchemaFormVariant[] {
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
  return variants
}

const pathUi = (
  ui: Record<string, SchemaFormUi>,
  path: string,
  uiPath: string
): SchemaFormUi | undefined => ui[path] ?? ui[uiPath]

const uiValue = <K extends keyof SchemaFormUi>(
  ui: Record<string, SchemaFormUi>,
  path: string,
  uiPath: string,
  key: K
): SchemaFormUi[K] | undefined => ui[path]?.[key] ?? ui[uiPath]?.[key]

const tagLabel = (schema: SchemaFormSchema, own: SchemaFormSchema | undefined, name: string) => {
  const firstVariant = (schema.oneOf ?? []).find((option) => isRecord(option))
  return own?.title || firstVariant?.properties?.[name]?.title || name
}

function variantNode(
  schema: SchemaFormSchema,
  name: string,
  ui: Record<string, SchemaFormUi>,
  base: string,
  uiBase: string,
  readOnly: boolean
): SchemaFormNode {
  const own = isRecord(schema.properties) ? schema.properties[name] : undefined
  const variants = collectVariants(schema, name, ui, base, uiBase, readOnly)
  const path = joinPath(base, name)
  const uiPath = joinPath(uiBase, name)
  return {
    ...blankNode(name, path, uiPath),
    schema: own ?? {},
    type: typeof variants[0]?.value === 'number' ? 'number' : 'string',
    widget: 'select',
    label: tagLabel(schema, own, name),
    description: own?.description ?? '',
    required: true,
    readOnly: readOnly || own?.readOnly === true,
    placeholder: uiValue(ui, path, uiPath, 'placeholder') ?? '',
    options: variants.map((variant) => variant.value),
    optionLabels: Object.fromEntries(variants.map((v) => [String(v.value), v.label])),
    variants,
    when: uiValue(ui, path, uiPath, 'when')
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

function fieldNode(
  key: string,
  child: SchemaFormSchema,
  ui: Record<string, SchemaFormUi>,
  path: string,
  uiPath: string,
  required: boolean,
  parentReadOnly: boolean
): SchemaFormNode | null {
  const options = pathUi(ui, path, uiPath) ?? {}
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
    required,
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
    .map((key): SchemaFormNode | null =>
      key === tag
        ? variantNode(schema, tag, ui, base, uiBase, parentReadOnly)
        : fieldNode(
            key,
            properties[key] ?? {},
            ui,
            joinPath(base, key),
            joinPath(uiBase, key),
            required.has(key),
            parentReadOnly
          )
    )
    .filter((node): node is SchemaFormNode => node !== null)
  return sectioned(nodes, objectUi.sections, base)
}
