import { describe, expect, it } from 'vitest'

import { initials } from './initials'

describe('initials', () => {
  it('takes the first letter of the first and the last word of a full name', () => {
    expect(initials('Jane Doe')).toBe('JD')
    expect(initials('  priya   anand patel ')).toBe('PP')
    expect(initials('Acme Inc.')).toBe('AI')
  })

  it('keeps the first two characters of one word, so initials pass through', () => {
    expect(initials('JD')).toBe('JD')
    expect(initials('herbert')).toBe('HE')
  })

  it('returns nothing for a blank name', () => {
    expect(initials('   ')).toBe('')
  })
})
