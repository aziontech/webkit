import { describe, expect, it } from 'vitest'

import { CUSTOM, draftValueOf, seedOf } from './range-draft'
import { emptyPanel } from './range-panel'

describe('rangeDraft', () => {
  const options = [
    { key: '15m', amount: 15, unit: 'minute' as const },
    { key: 'today', amount: 1, unit: 'day' as const, snap: true }
  ]

  it('builds the relative value of a quick or custom range', () => {
    const panel = { ...emptyPanel(), key: 'today', amount: null }
    expect(draftValueOf(panel, options)).toEqual({
      type: 'relative',
      amount: 1,
      unit: 'day',
      key: 'today',
      snap: true
    })
    expect(draftValueOf({ ...panel, key: CUSTOM, amount: 3 }, options)).toEqual({
      type: 'relative',
      amount: 3,
      unit: 'hour'
    })
    expect(draftValueOf({ ...panel, key: CUSTOM, amount: null }, options)).toBeNull()
  })

  it('seeds the panel from the value', () => {
    expect(seedOf(null, options, true, true)).toEqual({
      mode: 'relative',
      key: '15m',
      amount: '15',
      unit: 'minute'
    })
    expect(seedOf(null, options, false, true).mode).toBe('absolute')
  })
})
