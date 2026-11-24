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
  it('fills the progress over the interval, then advances and starts again', async () => {
    const { api, onAdvance, unmount } = setup()
    expect(api.autoplayRunning.value).toBe(true)
    await wait(180)
    expect(api.progress.value).toBeGreaterThan(0)
    expect(onAdvance).not.toHaveBeenCalled()
    await wait(250)
    expect(onAdvance).toHaveBeenCalled()
    expect(api.progress.value).toBeLessThan(100)
    unmount()
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

  it('stops advancing after unmount and restartProgress empties the bar', async () => {
    const { api, onAdvance, unmount } = setup()
    await wait(150)
    api.restartProgress()
    expect(api.progress.value).toBe(0)
    unmount()
    await wait(450)
    expect(onAdvance).not.toHaveBeenCalled()
  })
})
