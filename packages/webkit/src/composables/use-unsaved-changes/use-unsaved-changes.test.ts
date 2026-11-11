import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useUnsavedChanges, type UseUnsavedChangesOptions } from './index'

interface Form {
  name: string
  tags: string[]
}

const scopes: ReturnType<typeof effectScope>[] = []
afterEach(() => {
  scopes.splice(0).forEach((scope) => scope.stop())
})

const setup = (initial: Form, options: UseUnsavedChangesOptions<Form> = {}) => {
  const scope = effectScope()
  scopes.push(scope)
  const form = ref<Form>(structuredClone(initial))
  const guard = scope.run(() => useUnsavedChanges(form, options))!
  return { form, guard }
}

const beforeUnload = () => {
  const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent
  window.dispatchEvent(event)
  return event.defaultPrevented
}

describe('useUnsavedChanges', () => {
  it('is clean at first and dirty after a deep change', async () => {
    const { form, guard } = setup({ name: 'edge', tags: ['a'] })
    expect(guard.isDirty.value).toBe(false)
    form.value.tags.push('b')
    await nextTick()
    expect(guard.isDirty.value).toBe(true)
    form.value.tags.pop()
    expect(guard.isDirty.value).toBe(false)
  })

  it('commit makes the current value the baseline', () => {
    const { form, guard } = setup({ name: 'edge', tags: [] })
    form.value.name = 'edge-2'
    expect(guard.isDirty.value).toBe(true)
    guard.commit()
    expect(guard.isDirty.value).toBe(false)
    expect(guard.baseline.value.name).toBe('edge-2')
    guard.commit({ name: 'other', tags: [] })
    expect(guard.isDirty.value).toBe(true)
  })

  it('discard restores a ref source from the baseline', () => {
    const { form, guard } = setup({ name: 'edge', tags: ['a'] })
    form.value = { name: 'changed', tags: [] }
    const restored = guard.discard()
    expect(restored).toEqual({ name: 'edge', tags: ['a'] })
    expect(form.value).toEqual({ name: 'edge', tags: ['a'] })
    form.value.tags.push('b')
    expect(guard.baseline.value.tags).toEqual(['a'])
  })

  it('discard hands the baseline to onDiscard for a getter source', () => {
    const scope = effectScope()
    scopes.push(scope)
    const state = ref({ name: 'edge' })
    const onDiscard = vi.fn()
    const guard = scope.run(() => useUnsavedChanges(() => state.value, { onDiscard }))!
    state.value = { name: 'changed' }
    guard.discard()
    expect(onDiscard).toHaveBeenCalledWith({ name: 'edge' })
  })

  it('confirmLeave resolves at once while clean', async () => {
    const { guard } = setup({ name: 'edge', tags: [] })
    await expect(guard.confirmLeave()).resolves.toBe(true)
    expect(guard.dialogProps.value.open).toBe(false)
  })

  it('opens the dialog while dirty and stays on Keep editing', async () => {
    const { form, guard } = setup({ name: 'edge', tags: [] })
    form.value.name = 'x'
    const leaving = guard.confirmLeave()
    expect(guard.dialogProps.value.open).toBe(true)
    expect(guard.dialogProps.value.title).toBe('Unsaved changes')
    guard.keepEditing()
    await expect(leaving).resolves.toBe(false)
    expect(guard.dialogProps.value.open).toBe(false)
    expect(form.value.name).toBe('x')
  })

  it('closing the dialog counts as Keep editing', async () => {
    const { form, guard } = setup({ name: 'edge', tags: [] })
    form.value.name = 'x'
    const leaving = guard.confirmLeave()
    guard.dialogProps.value['onUpdate:open'](false)
    await expect(leaving).resolves.toBe(false)
  })

  it('Discard changes restores the baseline and leaves', async () => {
    const { form, guard } = setup({ name: 'edge', tags: [] })
    form.value.name = 'x'
    const leaving = guard.confirmLeave()
    guard.discardAndLeave()
    await expect(leaving).resolves.toBe(true)
    expect(form.value.name).toBe('edge')
  })

  it('Save changes runs onSave and leaves once the form is clean', async () => {
    let commit = () => {}
    const onSave = vi.fn(async () => {
      commit()
    })
    const { form, guard } = setup({ name: 'edge', tags: [] }, { onSave })
    commit = () => guard.commit()
    expect(guard.savable.value).toBe(true)
    expect(guard.dialogProps.value.description).toContain('Save them')
    form.value.name = 'x'
    const leaving = guard.confirmLeave()
    const saved = guard.saveAndLeave()
    expect(guard.saving.value).toBe(true)
    expect(guard.dialogProps.value.loading).toBe(true)
    await saved
    await expect(leaving).resolves.toBe(true)
    expect(onSave).toHaveBeenCalledOnce()
    expect(guard.saving.value).toBe(false)
  })

  it('a failed save keeps the dialog open', async () => {
    const onSave = vi.fn(async () => {
      throw new Error('nope')
    })
    const { form, guard } = setup({ name: 'edge', tags: [] }, { onSave })
    form.value.name = 'x'
    void guard.confirmLeave()
    await guard.saveAndLeave()
    expect(guard.dialogProps.value.open).toBe(true)
    expect(guard.saving.value).toBe(false)
  })

  it('warns before unload only while dirty and enabled', () => {
    const enabled = ref(true)
    const { form, guard } = setup({ name: 'edge', tags: [] }, { enabled })
    expect(beforeUnload()).toBe(false)
    form.value.name = 'x'
    expect(beforeUnload()).toBe(true)
    enabled.value = false
    expect(beforeUnload()).toBe(false)
    return expect(guard.confirmLeave()).resolves.toBe(true)
  })

  it('removes the unload listener when its scope stops', () => {
    const { form } = setup({ name: 'edge', tags: [] })
    form.value.name = 'x'
    scopes.splice(0).forEach((scope) => scope.stop())
    expect(beforeUnload()).toBe(false)
  })
})
