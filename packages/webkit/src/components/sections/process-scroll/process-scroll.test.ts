import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/process-scroll/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ProcessScroll from './process-scroll.vue'

describe('ProcessScroll', () => {
  it('renders nothing without a title or steps', () => {
    const { queryByTestId } = render(ProcessScroll, { props: { title: 'T' } })
    expect(queryByTestId('sections-process-scroll')).toBeNull()
  })

  it('lists the stages in order with their headings', () => {
    const { getByRole } = render(Default)
    const list = getByRole('list')
    expect(list.tagName).toBe('OL')
    expect([...list.querySelectorAll('h3')].map((el) => el.textContent?.trim())).toEqual([
      'Push',
      'Build',
      'Deploy',
      'Observe'
    ])
  })

  it('hides the decorative stage numbers from assistive technology', () => {
    const { getByText } = render(Default)
    expect(getByText('01')).toHaveAttribute('aria-hidden', 'true')
  })

  it('makes the row a focusable region named by the title', async () => {
    const { getByRole } = render(Default)
    const row = getByRole('region', { name: 'From commit to production', hidden: false })
    expect(row).toHaveAttribute('tabindex', '0')
    await userEvent.tab()
    expect(document.activeElement).toBe(row)
  })

  it('renders under rtl with logical card borders', () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(container.querySelector('li')?.className).toContain('not-last:border-e')
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
