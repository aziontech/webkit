import { render, screen } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { useMinuteClock } from './use-minute-clock'

const START = Date.UTC(2026, 10, 24, 12, 0)

const Probe = defineComponent({
  setup() {
    const now = useMinuteClock()
    return () => h('span', { 'data-testid': 'now' }, String(now.value))
  }
})

let hidden = false

const setHidden = (value: boolean): void => {
  hidden = value
  document.dispatchEvent(new Event('visibilitychange'))
}

const shown = (): number => Number(screen.getByTestId('now').textContent)

describe('useMinuteClock', () => {
  beforeEach(() => {
    hidden = false
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => (hidden ? 'hidden' : 'visible')
    })
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] })
    vi.setSystemTime(START)
  })

  afterEach(() => {
    vi.useRealTimers()
    Reflect.deleteProperty(document, 'visibilityState')
  })

  it('ticks once a minute while the document shows', async () => {
    const { unmount } = render(Probe)
    await nextTick()
    expect(shown()).toBe(START)

    vi.advanceTimersByTime(60_000)
    await nextTick()
    expect(shown()).toBe(START + 60_000)
    unmount()
  })

  it('stops while the document is hidden and reads the time again when it shows', async () => {
    const { unmount } = render(Probe)
    await nextTick()

    setHidden(true)
    vi.advanceTimersByTime(180_000)
    await nextTick()
    expect(shown()).toBe(START)
    expect(vi.getTimerCount()).toBe(0)

    setHidden(false)
    await nextTick()
    expect(shown()).toBe(START + 180_000)
    expect(vi.getTimerCount()).toBe(1)
    unmount()
  })

  it('clears its interval and its listener when the last subscriber leaves', async () => {
    const remove = vi.spyOn(document, 'removeEventListener')
    const first = render(Probe)
    const second = render(Probe)
    await nextTick()
    expect(vi.getTimerCount()).toBe(1)

    first.unmount()
    expect(vi.getTimerCount()).toBe(1)
    second.unmount()
    expect(vi.getTimerCount()).toBe(0)
    expect(remove).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    remove.mockRestore()
  })
})
