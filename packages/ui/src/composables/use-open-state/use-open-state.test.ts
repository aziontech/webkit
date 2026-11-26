import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useOpenState } from './use-open-state'

describe('useOpenState', () => {
  it('starts at defaultOpen while the model is unbound', () => {
    const closed = useOpenState(ref<boolean | undefined>(undefined), {
      defaultOpen: false,
      disabled: false
    })
    const open = useOpenState(ref<boolean | undefined>(undefined), {
      defaultOpen: true,
      disabled: false
    })
    expect(closed.isOpen.value).toBe(false)
    expect(open.isOpen.value).toBe(true)
  })

  it('opens and closes, writing each change to the model', () => {
    const model = ref<boolean | undefined>(undefined)
    const { isOpen, setOpen } = useOpenState(model, { defaultOpen: false, disabled: false })
    setOpen(true)
    expect(isOpen.value).toBe(true)
    expect(model.value).toBe(true)
    setOpen(false)
    expect(isOpen.value).toBe(false)
    expect(model.value).toBe(false)
  })

  it('follows a bound model', () => {
    const model = ref<boolean | undefined>(true)
    const { isOpen } = useOpenState(model, { defaultOpen: false, disabled: false })
    expect(isOpen.value).toBe(true)
    model.value = false
    expect(isOpen.value).toBe(false)
  })

  it('does not open while disabled, and still closes', () => {
    const disabled = ref(true)
    const model = ref<boolean | undefined>(undefined)
    const { isOpen, setOpen } = useOpenState(model, { defaultOpen: false, disabled })
    setOpen(true)
    expect(isOpen.value).toBe(false)
    expect(model.value).toBeUndefined()
    disabled.value = false
    setOpen(true)
    expect(isOpen.value).toBe(true)
    disabled.value = true
    setOpen(false)
    expect(isOpen.value).toBe(false)
  })
})
