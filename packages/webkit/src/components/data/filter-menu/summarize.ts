import type {
  FilterMenuField,
  FilterMenuFieldType,
  FilterMenuModel,
  FilterMenuOption,
  FilterMenuRange,
  FilterMenuValue
} from './types'

export interface FilterMenuSummary {
  label: string
  extra: number
}

export const DATE_PERIODS = ['24h', '7d', '30d', '3m'] as const

export const kindOf = (field: FilterMenuField): FilterMenuFieldType => field.type ?? 'multiple'

export const isRange = (value: FilterMenuValue | undefined): value is FilterMenuRange =>
  typeof value === 'object' && value !== null

export const valuesOf = (model: FilterMenuModel, field: FilterMenuField): FilterMenuValue[] =>
  model[field.id] ?? []

export const isApplied = (model: FilterMenuModel, field: FilterMenuField): boolean =>
  valuesOf(model, field).length > 0

export const appliedFields = (
  fields: FilterMenuField[],
  model: FilterMenuModel
): FilterMenuField[] => fields.filter((field) => isApplied(model, field))

export const summarize = (
  values: FilterMenuValue[],
  options: FilterMenuOption[],
  formatRange: (range: FilterMenuRange) => string
): FilterMenuSummary | null => {
  const first = values[0]
  if (first === undefined) return null
  const extra = values.length - 1
  if (isRange(first)) return { label: formatRange(first), extra }
  const option = options.find((entry) => entry.value === first)
  return { label: option ? option.label : String(first), extra }
}

export const pickedAvatars = (
  values: FilterMenuValue[],
  options: FilterMenuOption[],
  max = 3
): FilterMenuOption[] =>
  options.filter((option) => 'avatar' in option && values.includes(option.value)).slice(0, max)

export const toggleValue = (
  model: FilterMenuModel,
  field: FilterMenuField,
  value: FilterMenuValue
): FilterMenuModel => {
  const current = valuesOf(model, field)
  const next =
    kindOf(field) === 'multiple'
      ? current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
      : current[0] === value
        ? []
        : [value]
  const result = { ...model }
  if (next.length) result[field.id] = next
  else delete result[field.id]
  return result
}

export const clearField = (model: FilterMenuModel, field: FilterMenuField): FilterMenuModel => {
  const result = { ...model }
  delete result[field.id]
  return result
}
