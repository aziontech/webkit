import type {
  FilteringProperty,
  PropertyFilterOperator,
  PropertyFilterQuery
} from '../../../composables/use-collection/lib/property-filter'
import type { FilterMenuField, FilterMenuModel, FilterMenuValue } from '../filter-menu/types'
import type {
  TableAppliedFilter,
  TableFilterField,
  TableFilterOperator,
  TableFilterValue
} from './injection-key'

const TYPES: Partial<Record<TableFilterField['type'], FilterMenuField['type']>> = {
  'multi-select': 'multiple',
  select: 'single',
  date: 'date'
}

export const toMenuFields = (fields: TableFilterField[]): FilterMenuField[] =>
  fields.flatMap((field) => {
    const type = TYPES[field.type]
    if (!type) return []
    const options = (field.options ?? [])
      .filter((option) => typeof option.value !== 'boolean')
      .map((option) => ({ value: option.value as string | number, label: option.label }))
    if (type !== 'date' && options.length === 0) return []
    return [{ id: field.id, label: field.label, type, options }]
  })

const toTime = (value: string | number | undefined): Date | null =>
  value === undefined || value === '' ? null : new Date(Number(value))

const isScalar = (value: TableFilterValue): value is string | number =>
  !Array.isArray(value) && typeof value !== 'boolean'

const toMenuValues = (filter: TableAppliedFilter): FilterMenuValue[] | null => {
  const { operator, value } = filter
  if (operator === 'in' && Array.isArray(value)) return [...value]
  if ((operator === 'eq' || operator === 'within') && isScalar(value)) return [value]
  if (operator === 'between' && Array.isArray(value))
    return [{ start: toTime(value[0]), end: toTime(value[1]) }]
  return null
}

export const toMenuModel = (
  applied: TableAppliedFilter[],
  fields: FilterMenuField[]
): FilterMenuModel => {
  const model: FilterMenuModel = {}
  for (const filter of applied) {
    if (!fields.some((field) => field.id === filter.field)) continue
    const values = toMenuValues(filter)
    if (values) model[filter.field] = values
  }
  return model
}

const toAppliedFilter = (
  field: FilterMenuField,
  values: FilterMenuValue[]
): TableAppliedFilter | null => {
  const first = values[0]
  if (first === undefined) return null
  if (field.type === 'multiple')
    return {
      field: field.id,
      operator: 'in',
      value: values.filter((value): value is string | number => typeof value !== 'object')
    }
  if (typeof first === 'object')
    return {
      field: field.id,
      operator: 'between',
      value: [first.start ? first.start.getTime() : '', first.end ? first.end.getTime() : '']
    }
  return { field: field.id, operator: field.type === 'date' ? 'within' : 'eq', value: first }
}

export const toAppliedFilters = (
  model: FilterMenuModel,
  fields: FilterMenuField[],
  label: (field: FilterMenuField) => string
): TableAppliedFilter[] =>
  fields.flatMap((field) => {
    const filter = toAppliedFilter(field, model[field.id] ?? [])
    return filter ? [{ ...filter, label: `${field.label}: ${label(field)}` }] : []
  })

const TO_APPLIED: Partial<Record<PropertyFilterOperator, TableFilterOperator>> = {
  '=': 'eq',
  '!=': 'neq',
  ':': 'contains',
  '!:': 'not-contains',
  '^': 'starts-with',
  '>': 'gt',
  '<': 'lt',
  '>=': 'gte',
  '<=': 'lte'
}

const TO_PROPERTY = Object.fromEntries(
  Object.entries(TO_APPLIED).map(([token, applied]) => [applied, token])
) as Partial<Record<TableFilterOperator, PropertyFilterOperator>>

const PROPERTY_OPERATORS: Record<TableFilterField['type'], PropertyFilterOperator[]> = {
  text: ['=', '!=', ':', '!:', '^'],
  number: ['=', '!=', '>', '<', '>=', '<='],
  date: ['=', '!=', '>', '<', '>=', '<='],
  select: ['=', '!='],
  'multi-select': ['=', '!='],
  boolean: ['=', '!=']
}

const PROPERTY_TYPES: Partial<Record<TableFilterField['type'], FilteringProperty['type']>> = {
  number: 'number',
  date: 'date'
}

const operatorsOf = (field: TableFilterField): PropertyFilterOperator[] => {
  const own = (field.operators ?? [])
    .map((operator) => TO_PROPERTY[operator])
    .filter((operator): operator is PropertyFilterOperator => Boolean(operator))
  return own.length ? own : PROPERTY_OPERATORS[field.type]
}

export const toProperties = (fields: TableFilterField[]): FilteringProperty[] =>
  fields.map((field) => ({
    key: field.id,
    label: field.label,
    type: PROPERTY_TYPES[field.type] ?? 'text',
    operators: operatorsOf(field),
    options: (field.options ?? []).map((option) => ({
      value: String(option.value),
      label: option.label
    }))
  }))

const representable = (filter: TableAppliedFilter): boolean =>
  Boolean(TO_PROPERTY[filter.operator]) && !Array.isArray(filter.value)

const tokenValue = (field: TableFilterField | undefined, value: TableFilterValue): string =>
  field?.type === 'date' && typeof value === 'number'
    ? new Date(value).toISOString().slice(0, 10)
    : String(value)

export const toQuery = (
  applied: TableAppliedFilter[],
  fields: TableFilterField[]
): PropertyFilterQuery => ({
  operation: 'and',
  tokens: applied
    .filter((filter) => representable(filter) && fields.some((field) => field.id === filter.field))
    .map((filter) => ({
      propertyKey: filter.field,
      operator: TO_PROPERTY[filter.operator] as PropertyFilterOperator,
      value: tokenValue(
        fields.find((field) => field.id === filter.field),
        filter.value
      )
    }))
})

const valueOf = (field: TableFilterField | undefined, value: string): TableFilterValue => {
  if (field?.type === 'number') {
    const number = Number(value)
    return Number.isNaN(number) ? value : number
  }
  if (field?.type === 'date') {
    const time = Date.parse(value)
    return Number.isNaN(time) ? value : time
  }
  if (field?.type === 'boolean') return value === 'true'
  const option = field?.options?.find((entry) => String(entry.value) === value)
  return option ? option.value : value
}

export const fromQuery = (
  query: PropertyFilterQuery,
  applied: TableAppliedFilter[],
  fields: TableFilterField[]
): TableAppliedFilter[] => {
  const kept = applied.filter(
    (filter) => !representable(filter) || !fields.some((field) => field.id === filter.field)
  )
  const tokens = query.tokens.flatMap((token) => {
    const operator = TO_APPLIED[token.operator]
    if (!token.propertyKey || !operator) return []
    const field = fields.find((entry) => entry.id === token.propertyKey)
    return [{ field: token.propertyKey, operator, value: valueOf(field, token.value) }]
  })
  return [...kept, ...tokens]
}
