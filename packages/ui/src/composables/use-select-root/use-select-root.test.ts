import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, reactive, ref } from 'vue'

import { type SelectRootState, useSelectRoot, type UseSelectRootProps } from './index'

const mount = (overrides: Partial<UseSelectRootProps> = {}, attrs: Record<string, string> = {}) => {
  const props = reactive<UseSelectRootProps>({
    defaultOpen: false,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    ...overrides
  })
  const open = ref<boolean | undefined>(undefined)
  const sink: { root?: SelectRootState } = {}
  render(
    defineComponent({
      inheritAttrs: false,
      setup() {
        sink.root = useSelectRoot('select', props, open)
        return () => h('div')
      }
    }),
    { attrs }
  )
  return { root: sink.root as SelectRootState, props, open }
}

describe('useSelectRoot', () => {
  it('seeds the open state from defaultOpen until the model is bound', () => {
    const { root, open } = mount({ defaultOpen: true })
    expect(root.open.value).toBe(true)
    root.setOpen(false)
    expect(open.value).toBe(false)
    expect(root.open.value).toBe(false)
  })

  it('does not open while disabled or read-only', () => {
    const disabled = mount({ disabled: true })
    disabled.root.setOpen(true)
    expect(disabled.open.value).toBeUndefined()
    expect(disabled.root.locked()).toBe(true)

    const readonly = mount({ readonly: true })
    readonly.root.setOpen(true)
    expect(readonly.open.value).toBeUndefined()
    expect(readonly.root.locked()).toBe(true)
  })

  it('moves the accessible name from the root attributes to the context', () => {
    const { root } = mount(
      {},
      { 'aria-label': 'Region', 'aria-labelledby': 'region-label', id: 'region' }
    )
    expect(root.ariaLabel.value).toBe('Region')
    expect(root.ariaLabelledby.value).toBe('region-label')
    expect(root.rootAttrs.value).toMatchObject({ id: 'region' })
    expect(root.rootAttrs.value).not.toHaveProperty('aria-label')
    expect(root.rootAttrs.value).not.toHaveProperty('aria-labelledby')
  })

  it('records option labels and ignores an empty one', () => {
    const { root } = mount()
    expect(root.labels.has('us')).toBe(false)
    root.registerLabel('us', 'United States')
    root.registerLabel('us', '')
    expect(root.labels.get('us')).toBe('United States')
  })

  it('prefixes the content id with the component name and mirrors the flags', () => {
    const { root, props } = mount({ size: 'large', invalid: true, required: true })
    expect(root.contentId.startsWith('select-')).toBe(true)
    expect(root.invalid.value).toBe(true)
    expect(root.required.value).toBe(true)
    props.readonly = true
    expect(root.readonly.value).toBe(true)
  })

  it('mirrors the state as data attributes on the root', () => {
    const { root, props, open } = mount({ size: 'large', invalid: true })
    expect(root.stateAttrs.value).toEqual({
      'data-state': 'closed',
      'data-size': 'large',
      'data-disabled': null,
      'data-readonly': null,
      'data-invalid': true,
      'data-required': null
    })
    open.value = true
    props.disabled = true
    expect(root.rootAttrs.value).toMatchObject({ 'data-state': 'open', 'data-disabled': true })
  })

  it('names the control from its own attributes first, then from the root', () => {
    const { root } = mount({ required: true }, { 'aria-label': 'Region' })
    expect(root.controlAttrs({})).toEqual({
      id: `${root.contentId}-trigger`,
      'aria-describedby': undefined,
      'aria-label': 'Region',
      'aria-labelledby': undefined,
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': false,
      'aria-controls': root.contentId,
      'aria-invalid': undefined,
      'aria-required': true,
      disabled: false
    })
    expect(root.controlAttrs({ id: 'region', 'aria-label': 'Zone' })).toMatchObject({
      id: 'region',
      'aria-label': 'Zone'
    })
  })
})
