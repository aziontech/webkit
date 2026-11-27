import { startOfDay } from '../format'

const YEAR_SPAN = 10

type Bound = Date | undefined

export const dayOutOfBounds = (date: Date, min: Bound, max: Bound): boolean =>
  Boolean((min && date < startOfDay(min)) || (max && date > startOfDay(max)))

export const monthOutOfBounds = (year: number, month: number, min: Bound, max: Bound): boolean => {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  return Boolean((min && last < startOfDay(min)) || (max && first > startOfDay(max)))
}

export const yearRange = (current: number, viewYear: number, min: Bound, max: Bound): number[] => {
  const first = Math.min(min ? min.getFullYear() : current - YEAR_SPAN, viewYear)
  const last = Math.max(max ? max.getFullYear() : current + YEAR_SPAN, viewYear, first)
  return Array.from({ length: last - first + 1 }, (_, index) => first + index)
}

export const clampMonth = (year: number, month: number, min: Bound, max: Bound): number => {
  let clamped = month
  if (min && year === min.getFullYear()) clamped = Math.max(clamped, min.getMonth())
  if (max && year === max.getFullYear()) clamped = Math.min(clamped, max.getMonth())
  return clamped
}
