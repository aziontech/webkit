import type { DateRangeValue } from '../../../input/date-range-picker/date-range'
import type { FilterMenuField, FilterMenuModel } from '../types'

export const withRange = (
  model: FilterMenuModel,
  field: FilterMenuField,
  picked: DateRangeValue | null
): FilterMenuModel => {
  const range =
    picked?.type === 'absolute'
      ? { start: new Date(picked.start), end: new Date(picked.end) }
      : null
  const next = { ...model }
  if (range?.start || range?.end) next[field.id] = [{ start: range.start, end: range.end }]
  else delete next[field.id]
  return next
}
