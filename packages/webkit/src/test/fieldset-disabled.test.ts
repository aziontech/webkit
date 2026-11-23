import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Switch from '../components/input/switch/switch.vue'

function paint(el: Element) {
  const root = getComputedStyle(el)
  const handle = getComputedStyle(el.querySelector('[data-testid$="__handle"]') as Element)
  return { fill: root.backgroundColor, border: root.borderColor, handle: handle.backgroundColor }
}

describe('a switch inside a disabled fieldset', () => {
  it.each([false, true])('paints like a disabled switch (checked %s)', (checked) => {
    const { getAllByRole } = render(() => [
      h('fieldset', { disabled: true }, [
        h(Switch, { modelValue: checked, 'aria-label': 'In fieldset' })
      ]),
      h(Switch, { modelValue: checked, disabled: true, 'aria-label': 'Disabled' }),
      h(Switch, { modelValue: checked, 'aria-label': 'Enabled' })
    ])
    const [inFieldset, disabled, enabled] = getAllByRole('switch')
    expect(paint(inFieldset as Element)).toEqual(paint(disabled as Element))
    expect(paint(inFieldset as Element)).not.toEqual(paint(enabled as Element))
  })
})
