import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { usePinnedRow, type UsePinnedRowReturn } from './index'

const host = (enabled: () => boolean, sink: { row?: UsePinnedRowReturn }) =>
  defineComponent({
    setup() {
      const runway = ref<HTMLElement | null>(null)
      const pinned = ref<HTMLElement | null>(null)
      const viewport = ref<HTMLElement | null>(null)
      const track = ref<HTMLElement | null>(null)
      sink.row = usePinnedRow({ runway, pinned, viewport, track }, enabled)
      return () =>
        h('div', { ref: runway }, [
          h('div', { ref: pinned }, [
            h('div', { ref: viewport }, [h('ol', { ref: track }, [h('li', 'one')])])
          ])
        ])
    }
  })

const scrollListeners = (spy: ReturnType<typeof vi.spyOn>) =>
  spy.mock.calls.filter(([type]) => type === 'scroll').length

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePinnedRow', () => {
  it('leaves the runway and the row at rest when the band is not sticky', async () => {
    const sink: { row?: UsePinnedRowReturn } = {}
    render(host(() => true, sink))
    await new Promise((done) => requestAnimationFrame(() => done(null)))
    expect(sink.row?.runwayHeight.value).toBe('')
    expect(sink.row?.shift.value).toBeUndefined()
  })

  it('listens to the page scroll only while enabled, and stops on unmount', async () => {
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    const enabled = ref(false)
    const sink: { row?: UsePinnedRowReturn } = {}
    const { unmount } = render(host(() => enabled.value, sink))
    expect(scrollListeners(add)).toBe(0)

    enabled.value = true
    await nextTick()
    expect(scrollListeners(add)).toBe(1)

    enabled.value = false
    await nextTick()
    expect(scrollListeners(remove)).toBe(1)
    expect(sink.row?.runwayHeight.value).toBe('')

    enabled.value = true
    await nextTick()
    expect(scrollListeners(add)).toBe(2)
    unmount()
    expect(scrollListeners(remove)).toBe(2)
  })

  it('returns read-only state', () => {
    const sink: { row?: UsePinnedRowReturn } = {}
    render(host(() => true, sink))
    const height = sink.row!.runwayHeight as unknown as { value: string }
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    height.value = '999px'
    expect(sink.row?.runwayHeight.value).toBe('')
    expect(warn).toHaveBeenCalled()
  })
})
