/** Comparison operators of a property filter token. `:` contains, `^` starts with. */
export type PropertyFilterOperator = '=' | '!=' | ':' | '!:' | '^' | '!^' | '>' | '<' | '>=' | '<='

/** How the tokens of a query combine. */
export type PropertyFilterOperation = 'and' | 'or'

/** One condition: `property operator value`. A token without `propertyKey` is free text. */
export interface PropertyFilterToken {
  propertyKey?: string
  operator: PropertyFilterOperator
  value: string
}

/** The whole property filter: its tokens and how they combine. */
export interface PropertyFilterQuery {
  tokens: PropertyFilterToken[]
  operation: PropertyFilterOperation
}

/** A value suggested for a property. */
export interface PropertyFilterOption {
  value: string
  label?: string
}

/** One property the filter offers. */
export interface FilteringProperty {
  /** Field read from each item. */
  key: string
  /** Name shown in suggestions and tokens. */
  label: string
  /** Operators offered; defaults to `=`, `!=`, `:`, `!:` (plus `>`, `<`, `>=`, `<=` for `number` and `date`). */
  operators?: PropertyFilterOperator[]
  /** Values suggested after the operator. */
  options?: PropertyFilterOption[]
  /** How values compare. */
  type?: 'text' | 'number' | 'date'
}

const TEXT_OPERATORS: PropertyFilterOperator[] = ['=', '!=', ':', '!:', '^', '!^']
const ORDERED_OPERATORS: PropertyFilterOperator[] = ['=', '!=', '>', '<', '>=', '<=']

export const PROPERTY_FILTER_OPERATORS: readonly PropertyFilterOperator[] = [
  '=',
  '!=',
  ':',
  '!:',
  '^',
  '!^',
  '>',
  '<',
  '>=',
  '<='
]

export function operatorsOf(property: FilteringProperty): PropertyFilterOperator[] {
  if (property.operators?.length) return property.operators
  return property.type === 'number' || property.type === 'date' ? ORDERED_OPERATORS : TEXT_OPERATORS
}

export function emptyQuery(): PropertyFilterQuery {
  return { tokens: [], operation: 'and' }
}

const lower = (value: unknown): string => String(value ?? '').toLocaleLowerCase()

function comparable(
  raw: unknown,
  value: string,
  type: FilteringProperty['type']
): [number, number] {
  if (type === 'date' || raw instanceof Date) {
    const left = raw instanceof Date ? raw.getTime() : Date.parse(String(raw))
    return [left, Date.parse(value)]
  }
  return [Number(raw), Number(value)]
}

export function matchesOperator(
  raw: unknown,
  operator: PropertyFilterOperator,
  value: string,
  type?: FilteringProperty['type']
): boolean {
  const values = Array.isArray(raw) ? raw : [raw]
  const negated = operator === '!=' || operator === '!:' || operator === '!^'
  const test = (one: unknown): boolean => {
    switch (operator) {
      case '=':
      case '!=':
        return lower(one) === lower(value)
      case ':':
      case '!:':
        return lower(one).includes(lower(value))
      case '^':
      case '!^':
        return lower(one).startsWith(lower(value))
      default: {
        const [left, right] = comparable(one, value, type)
        if (Number.isNaN(left) || Number.isNaN(right)) return false
        if (operator === '>') return left > right
        if (operator === '<') return left < right
        if (operator === '>=') return left >= right
        return left <= right
      }
    }
  }
  return negated ? !values.some(test) : values.some(test)
}

export function textOf(item: unknown, fields?: string[]): string[] {
  if (item === null || typeof item !== 'object') return [String(item ?? '')]
  const record = item as Record<string, unknown>
  const keys = fields?.length ? fields : Object.keys(record)
  const out: string[] = []
  for (const key of keys) {
    const value = record[key]
    if (value === null || value === undefined) continue
    if (Array.isArray(value)) out.push(...value.map((entry) => String(entry)))
    else if (value instanceof Date) out.push(value.toISOString())
    else if (typeof value !== 'object') out.push(String(value))
  }
  return out
}

export function matchesText(item: unknown, text: string, fields?: string[]): boolean {
  const needle = lower(text.trim())
  if (!needle) return true
  return textOf(item, fields).some((entry) => lower(entry).includes(needle))
}

export function matchesToken(
  item: unknown,
  token: PropertyFilterToken,
  properties: FilteringProperty[],
  fields?: string[]
): boolean {
  if (!token.propertyKey) {
    const found = matchesText(item, token.value, fields)
    return token.operator === '!:' ? !found : found
  }
  const property = properties.find((p) => p.key === token.propertyKey)
  const raw = (item as Record<string, unknown> | null)?.[token.propertyKey]
  return matchesOperator(raw, token.operator, token.value, property?.type)
}

export function matchesQuery(
  item: unknown,
  query: PropertyFilterQuery,
  properties: FilteringProperty[],
  fields?: string[]
): boolean {
  if (!query.tokens.length) return true
  const check = (token: PropertyFilterToken) => matchesToken(item, token, properties, fields)
  return query.operation === 'or' ? query.tokens.some(check) : query.tokens.every(check)
}

export interface ParsedFilterText {
  property?: FilteringProperty
  operator?: PropertyFilterOperator
  value: string
}

export function parseFilterText(text: string, properties: FilteringProperty[]): ParsedFilterText {
  const source = text.trimStart()
  const lowered = source.toLocaleLowerCase()
  const property = [...properties]
    .sort((a, b) => b.label.length - a.label.length)
    .find((p) => lowered.startsWith(p.label.toLocaleLowerCase()))
  if (!property) return { value: source }
  const rest = source.slice(property.label.length)
  if (rest && !/^\s|^[!=:^<>]/.test(rest)) return { value: source }
  const trimmed = rest.trimStart()
  const operator = [...operatorsOf(property)]
    .sort((a, b) => b.length - a.length)
    .find((op) => trimmed.startsWith(op))
  if (!operator) return { property, value: trimmed }
  return { property, operator, value: trimmed.slice(operator.length).trim() }
}

export function tokenText(token: PropertyFilterToken, properties: FilteringProperty[]): string {
  if (!token.propertyKey) return token.value
  const property = properties.find((p) => p.key === token.propertyKey)
  const label = property?.label ?? token.propertyKey
  const option = property?.options?.find((o) => o.value === token.value)
  return `${label} ${token.operator} ${option?.label ?? token.value}`
}
