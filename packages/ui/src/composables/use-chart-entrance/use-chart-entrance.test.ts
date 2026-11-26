import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useChartEntrance, type UseChartEntranceReturn } from './index'

const frames = (count: number) =>
  new Promise<void>((resolve) => {
    const step = (left: number) =>
      left ? globalThis.requestAnimationFrame(() => step(left - 1)) : resolve()
    step(count)
  })

function setup<T>(run: () => T): { api: T; stop: () => void } {
  const scope = effectScope()
  const api = scope.run(run) as T
  return { api, stop: () => scope.stop() }
}

describe('useChartEntrance', () => {
  it('stays out until asked, then enters two frames after scheduleEnter', async () => {
    const { api, stop } = setup<UseChartEntranceReturn>(() => useChartEntrance())
    expect(api.entered.value).toBe(false)
    api.scheduleEnter()
    expect(api.entered.value).toBe(false)
    await frames(3)
    expect(api.entered.value).toBe(true)
    stop()
  })

  it('resetEnter cancels a pending entrance and leaves the marks out', async () => {
    const { api, stop } = setup<UseChartEntranceReturn>(() => useChartEntrance())
    api.scheduleEnter()
    api.resetEnter()
    await frames(3)
    expect(api.entered.value).toBe(false)
    stop()
  })

  it('enters when show and ready are both true and leaves when show turns false', async () => {
    const show = ref(true)
    const ready = ref(false)
    const { api, stop } = setup<UseChartEntranceReturn>(() => useChartEntrance({ show, ready }))
    await frames(3)
    expect(api.entered.value).toBe(false)
    ready.value = true
    await nextTick()
    await frames(3)
    expect(api.entered.value).toBe(true)
    show.value = false
    await nextTick()
    expect(api.entered.value).toBe(false)
    stop()
  })

  it('does not enter after its scope is disposed', async () => {
    const { api, stop } = setup<UseChartEntranceReturn>(() => useChartEntrance())
    api.scheduleEnter()
    stop()
    await frames(3)
    expect(api.entered.value).toBe(false)
  })
})
