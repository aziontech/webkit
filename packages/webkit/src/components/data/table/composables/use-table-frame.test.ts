import { describe, expect, it } from 'vitest'
import { effectScope, reactive } from 'vue'

import { useTableFrame } from './use-table-frame'

describe('useTableFrame', () => {
  it('keeps aria attributes for the table and labels it by a registered caption', () => {
    const attrs = reactive<Record<string, unknown>>({ class: 'x', 'aria-describedby': 'hint' })
    const scope = effectScope()
    const frame = scope.run(() => useTableFrame(attrs, () => false))!
    expect(frame.frameAttrs.value).toEqual({ class: 'x' })
    expect(frame.tableAttrs()).toEqual({ 'aria-describedby': 'hint' })
    const stop = frame.registerCaption()
    expect(frame.tableAttrs()['aria-labelledby']).toBe(frame.captionId)
    stop()
    expect(frame.tableAttrs()['aria-labelledby']).toBeUndefined()
    attrs['aria-label'] = 'Domains'
    expect(useTableFrame(attrs, () => true).tableAttrs()['aria-labelledby']).toBeUndefined()
    scope.stop()
  })
})
