import { daysAgo, monthsAgo, withinRange } from '@shared/lib/dates'

export const isApplied = (state, field) => Boolean(state[field.id]?.length)

export const appliedFields = (fields, state) => fields.filter((field) => isApplied(state, field))

export const filterCount = (state) => Object.values(state).filter((values) => values?.length).length

export const idleFields = (fields, state) => fields.filter((field) => !isApplied(state, field))

export const summarize = (field, values = []) => {
  if (!values.length) return null
  const first = field.options?.find((option) => option.value === values[0])
  if (first) return { label: first.label, extra: values.length - 1 }
  const label = field.formatValue ? field.formatValue(values[0]) : String(values[0])
  return { label, extra: values.length - 1 }
}

export const summarizeText = (field, values = []) => {
  const parts = summarize(field, values)
  if (!parts) return ''
  return parts.extra ? `${parts.label} +${parts.extra}` : parts.label
}

export const pickedAvatars = (field, values = [], max = 3) =>
  (field.options ?? [])
    .filter((option) => values.includes(option.value) && 'avatar' in option)
    .slice(0, max)

export const applyFilters = (rows, fields, state) =>
  rows.filter((row) =>
    fields.every((field) => {
      const values = state[field.id]
      if (!values?.length) return true
      return field.match(row, values)
    })
  )

export const toggleValue = (state, field, value) => {
  const current = state[field.id] ?? []
  if (field.kind === 'range') {
    return { ...state, [field.id]: current[0] === value ? [] : [value] }
  }
  return {
    ...state,
    [field.id]: current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  }
}

export const clearField = (state, field) => {
  const next = { ...state }
  delete next[field.id]
  return next
}

export const DATE_CUSTOM = 'custom'

export const DATE_PRESETS = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: DATE_CUSTOM, label: 'Custom…', custom: true }
]

export const dateRange = (value) => {
  if (value && typeof value === 'object') return value
  switch (value) {
    case '24h':
      return { start: daysAgo(1), end: null }
    case '7d':
      return { start: daysAgo(7), end: null }
    case '30d':
      return { start: daysAgo(30), end: null }
    case '3m':
      return { start: monthsAgo(3), end: null }
    default:
      return null
  }
}

const RANGE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export const formatDateRange = (value) => {
  if (!value || typeof value !== 'object') return ''
  const { start, end } = value
  if (start && end) return `${RANGE_FORMAT.format(start)} – ${RANGE_FORMAT.format(end)}`
  if (start) return `Since ${RANGE_FORMAT.format(start)}`
  if (end) return `Until ${RANGE_FORMAT.format(end)}`
  return ''
}

export const matchDate = (date, values) => withinRange(date, dateRange(values[0]))
