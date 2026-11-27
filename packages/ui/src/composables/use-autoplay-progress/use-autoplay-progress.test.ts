import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { useAutoplayProgress, type UseAutoplayProgressReturn } from './index'

function setup(enabled = true) {
  const on = ref(enabled)
  const onAdvance = vi.fn()
  let api: UseAutoplayProgressReturn | undefined
  const view = render(
    defineComponent({
      setup() {
        api = useAutoplayProgress({ enabled: on, interval: 300, onAdvance })
        return () => h('div')
      }
    })
  )
  return { api: api!, on, onAdvance, unmount: view.unmount }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useAutoplayProgress', () => {
  it('advances once per interval with one timeout, not a ticking interval', async () => {
    const intervals = vi.spyOn(globalThis, 'setInterval')
    const { api, onAdvance, unmount } = setup()
    expect(api.autoplayRunning.value).toBe(true)
    expect(api.playing.value).toBe(true)
    await wait(180)
    expect(onAdvance).not.toHaveBeenCalled()
    expect(api.cycle.value).toBe(0)
    await wait(250)
    expect(onAdvance).toHaveBeenCalledTimes(1)
    expect(api.cycle.value).toBe(1)
    expect(intervals).not.toHaveBeenCalled()
    unmount()
  })

  it('keeps the time already spent when it resumes after a hold', async () => {
    const { api, onAdvance, unmount } = setup()
    await wait(200)
    api.enterPointer()
    await wait(300)
    expect(onAdvance).not.toHaveBeenCalled()
    api.leavePointer()
    await wait(160)
    expect(onAdvance).toHaveBeenCalledTimes(1)
    unmount()
  })

  it('holds while its target is scrolled out of the viewport', async () => {
    const onAdvance = vi.fn()
    let api: UseAutoplayProgressReturn | undefined
    const view = render(
      defineComponent({
        setup() {
          const rootEl = ref<HTMLElement | null>(null)
          api = useAutoplayProgress({ enabled: true, interval: 300, onAdvance, target: rootEl })
          return () =>
            h('div', { style: 'height: 300vh' }, [
              h('div', { ref: rootEl, style: 'margin-top: 250vh; height: 10px' })
            ])
        }
      })
    )
    await vi.waitFor(() => expect(api!.playing.value).toBe(false))
    expect(api!.autoplayRunning.value).toBe(true)
    await wait(400)
    expect(onAdvance).not.toHaveBeenCalled()
    view.unmount()
  })

  it('does not run while disabled and starts when it is enabled', async () => {
    const { api, on, onAdvance, unmount } = setup(false)
    expect(api.autoplayEnabled.value).toBe(false)
    await wait(400)
    expect(onAdvance).not.toHaveBeenCalled()
    on.value = true
    await nextTick()
    expect(api.autoplayRunning.value).toBe(true)
    unmount()
  })

  it('holds while paused, while the pointer is inside and while focus is visible inside', () => {
    const { api, unmount } = setup()
    api.togglePause()
    expect(api.paused.value).toBe(true)
    expect(api.autoplayRunning.value).toBe(false)
    expect(api.autoplayEnabled.value).toBe(true)
    api.togglePause()
    api.enterPointer()
    expect(api.autoplayRunning.value).toBe(false)
    api.leavePointer()
    expect(api.autoplayRunning.value).toBe(true)
    unmount()
  })

  it('names the pause control for the action it performs', () => {
    const { api, unmount } = setup()
    const running = api.pauseLabel.value
    api.togglePause()
    expect(api.pauseLabel.value).not.toBe(running)
    unmount()
  })

  it('stops advancing after unmount and restartProgress starts a new cycle', async () => {
    const { api, onAdvance, unmount } = setup()
    await wait(150)
    api.restartProgress()
    expect(api.cycle.value).toBe(1)
    await wait(200)
    expect(onAdvance).not.toHaveBeenCalled()
    unmount()
    await wait(450)
    expect(onAdvance).not.toHaveBeenCalled()
  })
})
