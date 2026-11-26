import { describe, expect, it } from 'vitest'

import { compactAge } from './compact-age'

const now = Date.parse('2026-11-11T15:00:00')
const ago = (minutes: number) => now - minutes * 60_000

describe('compactAge', () => {
  it('writes the age in the largest whole narrow unit', () => {
    expect(compactAge(ago(0.5), now, 'en-US')).toBeNull()
    expect(compactAge(ago(10), now, 'en-US')).toBe('10m')
    expect(compactAge(ago(15 * 60), now, 'en-US')).toBe('15h')
    expect(compactAge(ago(3 * 1440), now, 'en-US')).toBe('3d')
    expect(compactAge(ago(15 * 1440), now, 'en-US')).toBe('2w')
    expect(compactAge(ago(400 * 1440), now, 'en-US')).toBe('1y')
  })

  it('follows the locale', () => {
    expect(compactAge(ago(10), now, 'pt-BR')).toBe('10 min')
  })
})
