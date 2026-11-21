import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'

import { useElementListener } from './index'

describe('useElementListener', () => {
  it('attaches to an element that is already there', () => {
    const element = document.createElement('div')
    const seen: string[] = []
    const scope = effectScope()
    scope.run(() => useElementListener(ref(element), 'click', (event) => seen.push(event.type)))
    element.click()
    expect(seen).toEqual(['click'])
    scope.stop()
  })

  it('accepts a getter and a raw element', () => {
    const first = document.createElement('div')
    const second = document.createElement('div')
    const seen: string[] = []
    const scope = effectScope()
    scope.run(() => {
      useElementListener(
        () => first,
        'click',
        () => seen.push('getter')
      )
      useElementListener(second, 'click', () => seen.push('raw'))
    })
    first.click()
    second.click()
    expect(seen).toEqual(['getter', 'raw'])
    scope.stop()
  })

  it('attaches synchronously when the element appears and moves with it', () => {
    const target = ref<HTMLElement | null>(null)
    const first = document.createElement('div')
    const second = document.createElement('div')
    let count = 0
    const scope = effectScope()
    scope.run(() => useElementListener(target, 'click', () => count++))
    target.value = first
    first.click()
    expect(count).toBe(1)
    target.value = second
    first.click()
    second.click()
    expect(count).toBe(2)
    target.value = null
    second.click()
    expect(count).toBe(2)
    scope.stop()
  })

  it('stops listening when its scope is disposed or stop is called', () => {
    const element = document.createElement('div')
    let count = 0
    const scope = effectScope()
    const stop = scope.run(() => useElementListener(element, 'click', () => count++))!
    const other = document.createElement('div')
    const stopOther = useElementListener(other, 'click', () => count++)
    scope.stop()
    element.click()
    stopOther()
    other.click()
    expect(count).toBe(0)
    expect(typeof stop).toBe('function')
  })

  it('passes the listener options', () => {
    const element = document.createElement('div')
    let count = 0
    const scope = effectScope()
    scope.run(() => useElementListener(element, 'click', () => count++, { once: true }))
    element.click()
    element.click()
    expect(count).toBe(1)
    scope.stop()
  })

  it('reaches a template element right after render and follows a v-if swap', async () => {
    const seen: string[] = []
    const wide = ref(false)
    const { getByTestId } = render(
      defineComponent({
        setup() {
          const rootEl = ref<HTMLElement | null>(null)
          useElementListener(rootEl, 'keydown', (event) => seen.push(event.key))
          return () =>
            wide.value
              ? h('section', { ref: rootEl, 'data-testid': 'wide' })
              : h('div', { ref: rootEl, 'data-testid': 'narrow' })
        }
      })
    )
    getByTestId('narrow').dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    wide.value = true
    await nextTick()
    getByTestId('wide').dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    expect(seen).toEqual(['a', 'b'])
  })
})
