import { fromWallClock, toWallClock } from '../../date-range-picker/date-range'
import { asSingle } from '../format'
import type { DatePickerValue } from '../injection-key'

export const toPanelValue = (value: DatePickerValue | undefined, zone: string): Date | null => {
  const date = asSingle(value ?? null)
  if (!date) return null
  return zone ? toWallClock(date, zone) : new Date(date.getTime())
}

export const fromPanelValue = (value: DatePickerValue, zone: string): DatePickerValue => {
  const date = asSingle(value)
  if (!date) return null
  return zone ? fromWallClock(date, zone) : new Date(date.getTime())
}
