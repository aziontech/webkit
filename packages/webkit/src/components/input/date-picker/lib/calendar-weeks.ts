import { asRange, asSingle, sameDay, startOfDay } from '../format'
import type { DatePickerDraft, DatePickerMode } from '../injection-key'

/** Where a day sits in the selected band. */
export type DatePickerDayBand = 'none' | 'single' | 'start' | 'middle' | 'end'

/** One cell of the month grid. */
export interface DatePickerDay {
  date: Date
  time: number
  label: number
  outside: boolean
  disabled: boolean
  today: boolean
  selected: boolean
  band: DatePickerDayBand
}

const closedBand = (time: number, start: number, end: number): DatePickerDayBand => {
  const lo = Math.min(start, end)
  const hi = Math.max(start, end)
  if (lo === hi) {
    return time === lo ? 'single' : 'none'
  }
  if (time === lo) {
    return 'start'
  }
  if (time === hi) {
    return 'end'
  }
  return time > lo && time < hi ? 'middle' : 'none'
}

const rangeBand = (date: Date, draft: DatePickerDraft): DatePickerDayBand => {
  const range = asRange(draft)
  const time = startOfDay(date).getTime()
  const start = range.start ? startOfDay(range.start).getTime() : null
  const end = range.end ? startOfDay(range.end).getTime() : null

  if (start !== null && end !== null) {
    return closedBand(time, start, end)
  }

  return time === start || time === end ? 'single' : 'none'
}

export const dayBand = (
  date: Date,
  mode: DatePickerMode,
  draft: DatePickerDraft
): DatePickerDayBand => {
  if (mode !== 'range') {
    return sameDay(date, asSingle(draft)) ? 'single' : 'none'
  }
  return rangeBand(date, draft)
}

type DayTest<T> = (date: Date) => T

export const buildWeeks = (
  year: number,
  month: number,
  trim: boolean,
  today: Date,
  disabled: DayTest<boolean>,
  band: DayTest<DatePickerDayBand>
): DatePickerDay[][] => {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay())
  const rows: DatePickerDay[][] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const rowCount = trim ? Math.ceil((firstOfMonth.getDay() + daysInMonth) / 7) : 6

  for (let row = 0; row < rowCount; row += 1) {
    const cells: DatePickerDay[] = []
    for (let col = 0; col < 7; col += 1) {
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + row * 7 + col
      )
      const cellBand = band(date)
      cells.push({
        date,
        time: date.getTime(),
        label: date.getDate(),
        outside: date.getMonth() !== month,
        disabled: disabled(date),
        today: sameDay(date, today),
        selected: cellBand === 'single' || cellBand === 'start' || cellBand === 'end',
        band: cellBand
      })
    }
    rows.push(cells)
  }

  return rows
}
