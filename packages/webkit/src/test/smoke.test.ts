import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

// Proves the browser-mode stack boots end to end: real Chromium (Playwright),
// @testing-library/vue, and the Vue plugin. Not a component test — it is the
// foundation health check and is removed once real suites exist.
const Probe = defineComponent({
  props: { label: { type: String, default: 'ok' } },
  setup: (props) => () => h('button', { type: 'button' }, props.label)
})

describe('browser-mode smoke', () => {
  it('renders a Vue component in real Chromium and reads the DOM', () => {
    const { getByRole } = render(Probe, { props: { label: 'hi' } })
    expect(getByRole('button', { name: 'hi' }).tagName).toBe('BUTTON')
  })
})
