import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'

import { logicalArrowKey, resolveDirection, useDirection } from './index'

const flush = async () => {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

afterEach(() => {
  document.documentElement.removeAttribute('dir')
  document.body.querySelectorAll(':scope > div[data-dir-test]').forEach((el) => el.remove())
})

function host(dir?: string): HTMLElement {
  const el = document.createElement('div')
  el.dataset['dirTest'] = ''
  if (dir) el.setAttribute('dir', dir)
  document.body.appendChild(el)
  return el
}

describe('resolveDirection', () => {
  it('reads the closest ltr/rtl ancestor, skipping dir="auto"', () => {
    const outer = host('rtl')
    const middle = document.createElement('div')
    middle.setAttribute('dir', 'auto')
    const inner = document.createElement('span')
    middle.appendChild(inner)
    outer.appendChild(middle)
    expect(resolveDirection(inner)).toBe('rtl')
    middle.setAttribute('dir', 'LTR')
    expect(resolveDirection(inner)).toBe('ltr')
  })

  it('falls back to the document element, then ltr', () => {
    expect(resolveDirection(null)).toBe('ltr')
    document.documentElement.setAttribute('dir', 'rtl')
    expect(resolveDirection(host())).toBe('rtl')
  })
})

describe('useDirection', () => {
  it('follows the component root by default and reacts to dir changes on an ancestor', async () => {
    const seen = ref('')
    const Probe = defineComponent({
      setup() {
        const dir = useDirection()
        return () => h('span', { 'data-testid': 'probe' }, (seen.value = dir.value))
      }
    })
    const container = host('rtl')
    render(Probe, { container })
    await flush()
    expect(seen.value).toBe('rtl')

    container.setAttribute('dir', 'ltr')
    await flush()
    expect(seen.value).toBe('ltr')
  })

  it('follows an explicit element ref, including when it changes', async () => {
    const rtlEl = host('rtl')
    const ltrEl = host('ltr')
    const target = ref<HTMLElement | null>(rtlEl)
    const scope = effectScope()
    const dir = scope.run(() => useDirection(target))!
    expect(dir.value).toBe('rtl')
    target.value = ltrEl
    await flush()
    expect(dir.value).toBe('ltr')
    scope.stop()
  })

  it('reads the document direction when no element is known', async () => {
    const scope = effectScope()
    const dir = scope.run(() => useDirection(null))!
    expect(dir.value).toBe('ltr')
    document.documentElement.setAttribute('dir', 'rtl')
    await flush()
    expect(dir.value).toBe('rtl')
    scope.stop()
  })
})

describe('logicalArrowKey', () => {
  it('swaps ArrowLeft and ArrowRight only under rtl', () => {
    expect(logicalArrowKey('ArrowLeft', 'rtl')).toBe('ArrowRight')
    expect(logicalArrowKey('ArrowRight', 'rtl')).toBe('ArrowLeft')
    expect(logicalArrowKey('ArrowUp', 'rtl')).toBe('ArrowUp')
    expect(logicalArrowKey('ArrowLeft', 'ltr')).toBe('ArrowLeft')
  })
})
