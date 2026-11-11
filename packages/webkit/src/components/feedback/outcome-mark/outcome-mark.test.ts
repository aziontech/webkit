import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import Animated from '../../../../examples/outcome-mark/animated.vue'
import Default from '../../../../examples/outcome-mark/default.vue'
import Sizes from '../../../../examples/outcome-mark/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import OutcomeMark from './outcome-mark.vue'

describe('OutcomeMark', () => {
  it('names each severity from the catalog', () => {
    const view = render(Default)
    for (const name of ['Succeeded', 'Failed', 'Needs attention', 'Not set']) {
      expect(view.getByRole('img', { name })).toBeTruthy()
    }
  })

  it('draws a distinct glyph per severity', () => {
    const view = render(Default)
    const glyphs = view
      .getAllByTestId('feedback-outcome-mark__glyph')
      .map((path) => path.getAttribute('d'))
    expect(new Set(glyphs).size).toBe(4)
  })

  it('prefers ariaLabel and maps size to data-size', () => {
    const view = render(OutcomeMark, {
      props: { severity: 'danger', size: 'large', ariaLabel: 'Deploy failed' }
    })
    const mark = view.getByRole('img', { name: 'Deploy failed' })
    expect(mark.getAttribute('data-size')).toBe('large')
  })

  it('is settled at once when not animated', () => {
    const view = render(OutcomeMark)
    expect(view.getByRole('img').getAttribute('data-state')).toBe('settled')
  })

  it('replays when animated and the severity changes', async () => {
    const view = render(OutcomeMark, { props: { animated: true, severity: 'neutral' } })
    const mark = view.getByRole('img')
    await waitFor(() => expect(mark.getAttribute('data-state')).toBe('settled'))
    await view.rerender({ animated: true, severity: 'success' })
    await nextTick()
    expect(mark.getAttribute('data-state')).toBe('pending')
    await waitFor(() => expect(mark.getAttribute('data-state')).toBe('settled'))
    expect(view.getByRole('img', { name: 'Succeeded' })).toBeTruthy()
  })

  it('reads the active locale', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(OutcomeMark, { severity: 'danger' }) }
        )
    })
    const view = render(Host)
    expect(view.getByRole('img', { name: 'Falhou' })).toBeTruthy()
  })

  it('renders under rtl without change', () => {
    const view = render(OutcomeMark, { attrs: { dir: 'rtl' } })
    expect(view.getByRole('img').getAttribute('dir')).toBe('rtl')
  })

  it('has no axe violations', async () => {
    for (const example of [Default, Sizes, Animated]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
