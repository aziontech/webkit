import type { FilterMenuField, FilterMenuModel, FilterMenuValue } from '../filter-menu/types'
import type { AppliedFilter, FilterField } from './injection-key'

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
