import { describe, expect, it } from 'vitest'

import { buildWeeks, dayBand } from './calendar-weeks'

describe('calendar weeks', () => {
  it('bands a range from its start to its end', () => {
    const draft = { start: new Date(2024, 0, 10), end: new Date(2024, 0, 12) }
    expect(dayBand(new Date(2024, 0, 10), 'range', draft)).toBe('start')
    expect(dayBand(new Date(2024, 0, 11), 'range', draft)).toBe('middle')
    expect(dayBand(new Date(2024, 0, 12), 'range', draft)).toBe('end')
    expect(dayBand(new Date(2024, 0, 13), 'range', draft)).toBe('none')
    expect(dayBand(new Date(2024, 0, 10), 'range', { start: draft.start, end: null })).toBe(
      'single'
    )
    expect(dayBand(new Date(2024, 0, 10), 'single', draft.start)).toBe('single')
  })

  it('builds six weeks, or only the weeks of the month when trimmed', () => {
    const today = new Date(2024, 1, 14)
    const weeks = buildWeeks(
      2024,
      1,
      false,
      today,
      () => false,
      () => 'none'
    )
    expect(weeks).toHaveLength(6)
    expect(weeks.flat().filter((day) => day.today)).toHaveLength(1)
    expect(
      buildWeeks(
        2024,
        1,
        true,
        today,
        () => false,
        () => 'none'
      )
    ).toHaveLength(5)
  })
})
