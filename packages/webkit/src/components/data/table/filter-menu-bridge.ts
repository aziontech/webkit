import type {
  FilteringProperty,
  PropertyFilterOperator,
  PropertyFilterQuery
} from '../../../composables/use-collection/property-filter'
import type { FilterMenuField, FilterMenuModel, FilterMenuValue } from '../filter-menu/types'
import type { AppliedFilter, FilterField, FilterOperator, FilterValue } from './injection-key'

const KINDS: Partial<Record<FilterField['type'], FilterMenuField['kind']>> = {
  'multi-select': 'multi',
  select: 'single',
  date: 'date'
}

export const toMenuFields = (fields: FilterField[]): FilterMenuField[] =>
  fields.flatMap((field) => {
    const kind = KINDS[field.type]
    if (!kind) return []
    const options = (field.options ?? [])
      .filter((option) => typeof option.value !== 'boolean')
      .map((option) => ({ value: option.value as string | number, label: option.label }))
    if (kind !== 'date' && options.length === 0) return []
    return [{ id: field.id, label: field.label, kind, options }]
  })

const toTime = (value: string | number | undefined): Date | null =>
  value === undefined || value === '' ? null : new Date(Number(value))

export const toMenuModel = (
  applied: AppliedFilter[],
  fields: FilterMenuField[]
): FilterMenuModel => {
  const model: FilterMenuModel = {}
  for (const filter of applied) {
    if (!fields.some((field) => field.id === filter.field)) continue
    const { operator, value } = filter
    if (operator === 'in' && Array.isArray(value)) model[filter.field] = [...value]
    else if (operator === 'eq' && !Array.isArray(value) && typeof value !== 'boolean')
      model[filter.field] = [value]
    else if (operator === 'within' && !Array.isArray(value) && typeof value !== 'boolean')
      model[filter.field] = [value]
    else if (operator === 'between' && Array.isArray(value))
      model[filter.field] = [{ start: toTime(value[0]), end: toTime(value[1]) }]
  }
  return model
}

const toAppliedFilter = (
  field: FilterMenuField,
  values: FilterMenuValue[]
): AppliedFilter | null => {
  const first = values[0]
  if (first === undefined) return null
  if (field.kind === 'multi')
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
  return { field: field.id, operator: field.kind === 'date' ? 'within' : 'eq', value: first }
}

export const toAppliedFilters = (
  model: FilterMenuModel,
  fields: FilterMenuField[],
  label: (field: FilterMenuField) => string
): AppliedFilter[] =>
  fields.flatMap((field) => {
    const filter = toAppliedFilter(field, model[field.id] ?? [])
    return filter ? [{ ...filter, label: `${field.label}: ${label(field)}` }] : []
  })

const TO_APPLIED: Partial<Record<PropertyFilterOperator, FilterOperator>> = {
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
) as Partial<Record<FilterOperator, PropertyFilterOperator>>

const PROPERTY_OPERATORS: Record<FilterField['type'], PropertyFilterOperator[]> = {
  text: ['=', '!=', ':', '!:', '^'],
  number: ['=', '!=', '>', '<', '>=', '<='],
  date: ['=', '!=', '>', '<', '>=', '<='],
  select: ['=', '!='],
  'multi-select': ['=', '!='],
  boolean: ['=', '!=']
}

const PROPERTY_TYPES: Partial<Record<FilterField['type'], FilteringProperty['type']>> = {
  number: 'number',
  date: 'date'
}

const operatorsOf = (field: FilterField): PropertyFilterOperator[] => {
  const own = (field.operators ?? [])
    .map((operator) => TO_PROPERTY[operator])
    .filter((operator): operator is PropertyFilterOperator => Boolean(operator))
  return own.length ? own : PROPERTY_OPERATORS[field.type]
}

export const toProperties = (fields: FilterField[]): FilteringProperty[] =>
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

const representable = (filter: AppliedFilter): boolean =>
  Boolean(TO_PROPERTY[filter.operator]) && !Array.isArray(filter.value)

const tokenValue = (field: FilterField | undefined, value: FilterValue): string =>
  field?.type === 'date' && typeof value === 'number'
    ? new Date(value).toISOString().slice(0, 10)
    : String(value)

export const toQuery = (applied: AppliedFilter[], fields: FilterField[]): PropertyFilterQuery => ({
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

const valueOf = (field: FilterField | undefined, value: string): FilterValue => {
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
  applied: AppliedFilter[],
  fields: FilterField[]
): AppliedFilter[] => {
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
