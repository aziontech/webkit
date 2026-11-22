import { describe, expect, it } from 'vitest'

import { buildSections, nextEnabled, optionLabel } from './combobox-rows'

describe('combobox rows', () => {
  const options = [
    { value: 'a', group: 'Two' },
    { value: 'b' },
    { value: 'c', group: 'Two', disabled: true }
  ]

  it('puts the untitled group first and adds the custom row last', () => {
    const sections = buildSections(options, 'x', 'typed')
    expect(sections.map((section) => section.title)).toEqual(['', 'Two', ''])
    expect(sections[2]?.rows[0]).toEqual({ kind: 'custom', id: 'x-option-custom', value: 'typed' })
    expect(buildSections(options, 'x', '')).toHaveLength(2)
  })

  it('skips disabled rows and wraps around', () => {
    const rows = buildSections(options, 'x', '').flatMap((section) => section.rows)
    expect(nextEnabled(rows, 2, 1)).toBe(0)
    expect(nextEnabled(rows, -1, -1)).toBe(1)
    expect(nextEnabled([], 0, 1)).toBe(-1)
  })

  it('labels an option by its label, else its value', () => {
    expect(optionLabel({ value: 'v', label: 'Label' })).toBe('Label')
    expect(optionLabel({ value: 'v' })).toBe('v')
  })
})
