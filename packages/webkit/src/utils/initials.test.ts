import { describe, expect, it } from 'vitest'

import { initialsOf } from './initials'

describe('initialsOf', () => {
  it('takes the first letter of the first and last word of a full name', () => {
    expect(initialsOf('Jane Doe')).toBe('JD')
    expect(initialsOf('  Jane Q. Doe ')).toBe('JD')
  })

  it('keeps the first two characters of a single word, so passed initials stay as they are', () => {
    expect(initialsOf('jd')).toBe('JD')
    expect(initialsOf('herbert')).toBe('HE')
  })

  it('returns an empty string for a blank name', () => {
    expect(initialsOf('   ')).toBe('')
  })
})
