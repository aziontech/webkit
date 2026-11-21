import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'

import { type FieldContext, FieldInjectionKey } from '../../components/input/field/injection-key'
import { useFieldAttrs, type UseFieldAttrsReturn } from './index'

const host = (sink: { field?: UseFieldAttrsReturn }) =>
  defineComponent({
    inheritAttrs: false,
    props: { invalid: Boolean, disabled: Boolean, required: Boolean },
    setup(props) {
      sink.field = useFieldAttrs(props)
      return () => h('input')
    }
  })

describe('useFieldAttrs', () => {
  it('reads the id and the description from the attributes and the flags from the props', () => {
    const sink: { field?: UseFieldAttrsReturn } = {}
    render(host(sink), {
      props: { invalid: true },
      attrs: { id: 'zone', 'aria-describedby': 'zone-hint' }
    })
    expect(sink.field?.controlId.value).toBe('zone')
    expect(sink.field?.describedBy.value).toBe('zone-hint')
    expect(sink.field?.invalid.value).toBe(true)
    expect(sink.field?.disabled.value).toBe(false)
    expect(sink.field?.required.value).toBe(false)
  })

  it('keeps every attribute but class and data-testid for the native control', () => {
    const sink: { field?: UseFieldAttrsReturn } = {}
    render(host(sink), {
      attrs: { class: 'w-full', 'data-testid': 'zone-name', name: 'zone', 'aria-label': 'Zone' }
    })
    expect(sink.field?.passthroughAttrs.value).toEqual({ name: 'zone', 'aria-label': 'Zone' })
  })

  it('falls back to the enclosing Field', () => {
    const sink: { field?: UseFieldAttrsReturn } = {}
    const Child = host(sink)
    const context = {
      controlId: 'field-control',
      describedBy: computed(() => 'field-error'),
      labelledBy: computed(() => 'field-label'),
      invalid: computed(() => true),
      disabled: computed(() => true),
      required: computed(() => true)
    } as unknown as FieldContext
    render(
      defineComponent({
        setup() {
          provide(FieldInjectionKey, context)
          return () => h(Child, { 'aria-describedby': 'own-hint' })
        }
      })
    )
    expect(sink.field?.controlId.value).toBe('field-control')
    expect(sink.field?.describedBy.value).toBe('own-hint field-error')
    expect(sink.field?.invalid.value).toBe(true)
    expect(sink.field?.disabled.value).toBe(true)
    expect(sink.field?.required.value).toBe(true)
  })
})
