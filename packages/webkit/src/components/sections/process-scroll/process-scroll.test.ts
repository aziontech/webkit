import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/process-scroll/default.vue'
import Pinned from '../../../../examples/process-scroll/pinned.vue'
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

  it('does not pin by default', () => {
    const { getByTestId } = render(Default)
    const root = getByTestId('sections-process-scroll')
    expect(root).not.toHaveAttribute('data-pinned')
    expect(root.style.height).toBe('')
  })

  it('marks a pinned band and sticks it under the site header token', () => {
    const { getByTestId, getByRole } = render(Pinned)
    const root = getByTestId('sections-process-scroll')
    expect(root).toHaveAttribute('data-pinned')
    expect(root.style.getPropertyValue('--process-scroll-offset')).toBe(
      'var(--layout-header-height)'
    )
    expect(getByRole('region', { name: 'Hiring process' })).toHaveAttribute('tabindex', '0')
  })

  it('takes a custom header offset', () => {
    const { getByTestId } = render(ProcessScroll, {
      props: {
        pinned: true,
        headerOffset: '4rem',
        title: 'Hiring process',
        steps: [{ title: 'Role request', description: 'A manager requests a role.' }]
      }
    })
    expect(
      getByTestId('sections-process-scroll').style.getPropertyValue('--process-scroll-offset')
    ).toBe('4rem')
  })

  it('leaves the runway and the row at rest while the band is not sticky', () => {
    const { getByTestId, getByRole } = render(Pinned)
    expect(getByTestId('sections-process-scroll').style.height).toBe('')
    expect(getByRole('list').style.translate).toBe('')
  })

  it('has no axe violations when pinned', async () => {
    const { container } = render(Pinned)
    await expectNoA11yViolations(container)
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
