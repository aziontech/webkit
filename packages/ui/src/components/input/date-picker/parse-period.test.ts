import { describe, expect, it } from 'vitest'

import { fixedHints, parseFixedDate, parsePeriod, parseTime, relativeHints } from './parse-period'

const NOW = new Date(2026, 9, 19, 12, 0)

const day = (date: Date | null | undefined) =>
  date ? [date.getFullYear(), date.getMonth() + 1, date.getDate()] : null

describe('parsePeriod', () => {
  describe('en', () => {
    it('reads relative spans, keywords and fixed ranges', () => {
      expect(parsePeriod('12 hours', NOW)?.start?.getHours()).toBe(0)
      expect(day(parsePeriod('yesterday', NOW)?.start)).toEqual([2026, 10, 18])
      expect(day(parsePeriod('last month', NOW)?.start)).toEqual([2026, 9, 19])
      expect(day(parsePeriod('3mo', NOW)?.start)).toEqual([2026, 7, 19])
      const range = parsePeriod('1/1 - 1/2', NOW)
      expect(day(range?.start)).toEqual([2026, 1, 1])
      expect(day(range?.end)).toEqual([2026, 1, 2])
      expect(day(parsePeriod('Jan 1 to Jan 5', NOW)?.end)).toEqual([2026, 1, 5])
    })

    it('reads month-first numeric dates and printed dates', () => {
      expect(day(parseFixedDate('1/2/2026', NOW))).toEqual([2026, 1, 2])
      expect(day(parseFixedDate('Jun 1, 2026', NOW))).toEqual([2026, 6, 1])
      expect(day(parseFixedDate('2026-01-05', NOW))).toEqual([2026, 1, 5])
      expect(parseFixedDate('Feb 30', NOW)).toBeNull()
    })

    it('every hint chip parses', () => {
      for (const hint of [...relativeHints('en'), ...fixedHints('en', NOW)]) {
        expect(parsePeriod(hint, NOW), hint).not.toBeNull()
      }
      expect(relativeHints('en')).toContain('12 hours')
      expect(relativeHints('en')).toContain('yesterday')
    })
  })

  describe('pt-BR', () => {
    const options = { locale: 'pt-BR', separators: ['a', 'até'] }

    it('prints the hint chips in Portuguese and parses each one', () => {
      const hints = [...relativeHints('pt-BR'), ...fixedHints('pt-BR', NOW)]
      expect(hints).toContain('12 horas')
      expect(hints).toContain('ontem')
      expect(hints).toContain('mês passado')
      for (const hint of hints) {
        expect(parsePeriod(hint, NOW, options), hint).not.toBeNull()
      }
    })

    it('reads Portuguese words, day-first dates and range separators', () => {
      expect(day(parsePeriod('ontem', NOW, options)?.start)).toEqual([2026, 10, 18])
      expect(day(parsePeriod('hoje', NOW, options)?.start)).toEqual([2026, 10, 19])
      expect(day(parsePeriod('2 semanas', NOW, options)?.start)).toEqual([2026, 10, 5])
      expect(day(parsePeriod('mes passado', NOW, options)?.start)).toEqual([2026, 9, 19])
      expect(day(parseFixedDate('1/2/2026', NOW, options))).toEqual([2026, 2, 1])
      expect(day(parseFixedDate('1 de jun. de 2026', NOW, options))).toEqual([2026, 6, 1])
      const range = parsePeriod('1 de jan. até 5 de jan.', NOW, options)
      expect(day(range?.start)).toEqual([2026, 1, 1])
      expect(day(range?.end)).toEqual([2026, 1, 5])
    })

    it('still understands English input', () => {
      expect(day(parsePeriod('yesterday', NOW, options)?.start)).toEqual([2026, 10, 18])
      expect(parsePeriod('45m', NOW, options)).not.toBeNull()
    })
  })

  it('reads 24-hour and 12-hour times', () => {
    expect(parseTime('14:30')).toEqual({ hours: 14, minutes: 30 })
    expect(parseTime('2:30 pm')).toEqual({ hours: 14, minutes: 30 })
    expect(parseTime('12:05 a.m.')).toEqual({ hours: 0, minutes: 5 })
    expect(parseTime('25:00')).toBeNull()
  })
})
