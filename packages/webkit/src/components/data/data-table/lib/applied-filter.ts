import type { TableFilterOperator, TableFilterValue } from '../../table/injection-key'

const PERIOD_MS: Record<string, number> = {
  '24h': 86_400_000,
  '7d': 604_800_000,
  '30d': 2_592_000_000
}

const timeOf = (raw: unknown): number | null => {
  if (raw instanceof Date) return raw.getTime()
  if (typeof raw === 'number') return raw
  if (typeof raw !== 'string' || raw === '') return null
  const time = Date.parse(raw)
  return Number.isNaN(time) ? null : time
}

const periodStart = (period: string): number | null => {
  if (period === '3m') {
    const date = new Date()
    date.setMonth(date.getMonth() - 3)
    return date.getTime()
  }
  const span = PERIOD_MS[period]
  return span === undefined ? null : Date.now() - span
}

const text = (input: unknown): string => String(input ?? '').toLowerCase()
const listOf = (value: TableFilterValue): string[] =>
  Array.isArray(value) ? value.map(String) : []
const isEmpty = (raw: unknown): boolean => raw === null || raw === undefined || raw === ''

const within = (raw: unknown, value: TableFilterValue): boolean => {
  const start = periodStart(String(value))
  const time = timeOf(raw)
  return start === null || (time !== null && time >= start)
}

const between = (raw: unknown, value: TableFilterValue): boolean => {
  const [from, to] = Array.isArray(value) ? value : []
  const time = timeOf(raw)
  if (time === null) return false
  return (
    (from === undefined || from === '' || time >= Number(from)) &&
    (to === undefined || to === '' || time <= Number(to))
  )
}

const MATCHERS: Partial<
  Record<TableFilterOperator, (raw: unknown, value: TableFilterValue) => boolean>
> = {
  eq: (raw, value) => raw === value,
  neq: (raw, value) => raw !== value,
  contains: (raw, value) => text(raw).includes(text(value)),
  'not-contains': (raw, value) => !text(raw).includes(text(value)),
  'starts-with': (raw, value) => text(raw).startsWith(text(value)),
  'ends-with': (raw, value) => text(raw).endsWith(text(value)),
  gt: (raw, value) => Number(raw) > Number(value),
  gte: (raw, value) => Number(raw) >= Number(value),
  lt: (raw, value) => Number(raw) < Number(value),
  lte: (raw, value) => Number(raw) <= Number(value),
  in: (raw, value) => listOf(value).includes(String(raw)),
  'not-in': (raw, value) => !listOf(value).includes(String(raw)),
  'is-empty': (raw) => isEmpty(raw),
  'is-not-empty': (raw) => !isEmpty(raw),
  within,
  between
}

export const matchesApplied = (
  raw: unknown,
  operator: TableFilterOperator,
  value: TableFilterValue
): boolean => MATCHERS[operator]?.(raw, value) ?? true
