import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { useOverlayPresence, type UseOverlayPresenceReturn } from './use-overlay-presence'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function mount(initial: boolean, openFrames?: number) {
  const isOpen = ref(initial)
  let presence!: UseOverlayPresenceReturn
  const view = render(
    defineComponent({
      setup() {
        presence = useOverlayPresence(isOpen, { exitMs: 20, openFrames })
        return () => h('div')
      }
    })
  )
  return { isOpen, presence, view }
}

describe('useOverlayPresence', () => {
  it('starts absent and closed when the overlay is closed', () => {
    const { presence } = mount(false)
    expect(presence.isPresent.value).toBe(false)
    expect(presence.motionState.value).toBe('closed')
  })

  it('mounts at once on open and paints open one frame later', async () => {
    const { isOpen, presence } = mount(false)
    isOpen.value = true
    expect(presence.isPresent.value).toBe(true)
    expect(presence.motionState.value).toBe('closed')
    await nextTick()
    await frame()
    expect(presence.motionState.value).toBe('open')
  })

  it('waits the requested number of frames before painting open', async () => {
    const { isOpen, presence } = mount(false, 2)
    isOpen.value = true
    await nextTick()
    await frame()
    expect(presence.motionState.value).toBe('closed')
    await frame()
    expect(presence.motionState.value).toBe('open')
  })

  it('paints open after mount when it starts open', async () => {
    const { presence } = mount(true)
    expect(presence.isPresent.value).toBe(true)
    await nextTick()
    await frame()
    expect(presence.motionState.value).toBe('open')
  })

  it('paints closed on close and stays mounted until the exit time passes', async () => {
    const { isOpen, presence } = mount(true)
    await nextTick()
    await frame()
    isOpen.value = false
    await nextTick()
    await frame()
    expect(presence.motionState.value).toBe('closed')
    expect(presence.isPresent.value).toBe(true)
    await wait(40)
    expect(presence.isPresent.value).toBe(false)
  })

  it('stays mounted when it reopens before the exit time passes', async () => {
    const { isOpen, presence } = mount(true)
    isOpen.value = false
    isOpen.value = true
    await wait(40)
    expect(presence.isPresent.value).toBe(true)
  })

  it('drops the pending frame and exit timer when its scope is disposed', async () => {
    const { isOpen, presence, view } = mount(false)
    isOpen.value = true
    await nextTick()
    view.unmount()
    await frame()
    expect(presence.motionState.value).toBe('closed')
  })
})
