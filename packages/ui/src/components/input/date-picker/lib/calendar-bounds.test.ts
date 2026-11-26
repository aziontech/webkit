import { describe, expect, it } from 'vitest'

import { clampMonth, dayOutOfBounds, monthOutOfBounds, yearRange } from './calendar-bounds'

describe('calendarBounds', () => {
  it('keeps days, months and years inside the bounds', () => {
    const min = new Date(2024, 2, 5)
    const max = new Date(2025, 5, 20)
    expect(dayOutOfBounds(new Date(2024, 2, 4), min, max)).toBe(true)
    expect(dayOutOfBounds(new Date(2024, 2, 5), min, max)).toBe(false)
    expect(monthOutOfBounds(2024, 1, min, max)).toBe(true)
    expect(monthOutOfBounds(2024, 2, min, max)).toBe(false)
    expect(clampMonth(2024, 0, min, max)).toBe(2)
    expect(clampMonth(2025, 11, min, max)).toBe(5)
    expect(yearRange(2024, 2024, min, max)).toEqual([2024, 2025])
  })
})
