import { describe, expect, it } from 'vitest'
import { effectScope, ref } from 'vue'

import { useOverlayLayer } from './use-overlay-layer'

describe('useOverlayLayer', () => {
  it('only the last opened overlay is the top layer', () => {
    const scope = effectScope()
    const first = ref(false)
    const second = ref(false)
    const [a, b] = scope.run(() => [useOverlayLayer(first), useOverlayLayer(second)])!
    expect(a!.isTop.value).toBe(false)
    first.value = true
    expect(a!.isTop.value).toBe(true)
    second.value = true
    expect(a!.isTop.value).toBe(false)
    expect(b!.isTop.value).toBe(true)
    second.value = false
    expect(a!.isTop.value).toBe(true)
    scope.stop()
  })

  it('leaves the stack when its scope is disposed', () => {
    const outer = ref(true)
    const inner = ref(true)
    const outerScope = effectScope()
    const innerScope = effectScope()
    const a = outerScope.run(() => useOverlayLayer(outer))!
    innerScope.run(() => useOverlayLayer(inner))
    expect(a.isTop.value).toBe(false)
    innerScope.stop()
    expect(a.isTop.value).toBe(true)
    outerScope.stop()
  })
})
