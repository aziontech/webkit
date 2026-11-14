import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/doc-call-to-action/default.vue'
import TwoActions from '../../../../examples/doc-call-to-action/two-actions.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCallToAction from './doc-call-to-action.vue'

describe('DocCallToAction', () => {
  it('is a complementary landmark named by its headline', () => {
    const { getByRole } = render(Default)
    expect(getByRole('complementary', { name: 'Ready to build?' })).toBeInTheDocument()
  })

  it('renders the copy and one action', () => {
    const { getByText, getAllByRole } = render(Default)
    expect(getByText('Deploy your first application in minutes.')).toBeInTheDocument()
    const links = getAllByRole('link').filter(
      (link) => link.getAttribute('href') !== null && link.textContent?.trim()
    )
    expect(links.map((link) => link.textContent?.trim())).toContain('Start for free')
  })

  it('stacks a secondary action when given', () => {
    const { getByText } = render(TwoActions)
    expect(getByText('Talk to sales')).toBeInTheDocument()
  })

  it('carries no built-in copy: no props, no headline and no actions', () => {
    const { container, queryByRole } = render(DocCallToAction)
    expect(container.querySelector('p')).toBeNull()
    expect(queryByRole('link', { name: /start/i })).toBeNull()
  })

  it('lets a consumer testid win', () => {
    const { getByTestId } = render(DocCallToAction, {
      props: { title: 'T' },
      attrs: { 'data-testid': 'rail-cta' }
    })
    expect(getByTestId('rail-cta')).toBeInTheDocument()
  })

  it('falls back to its own testid and renders actions from their objects', () => {
    const { getByTestId, getByRole, queryByRole } = render(DocCallToAction, {
      props: {
        title: 'T',
        primaryAction: { label: 'Start', href: '/signup' },
        secondaryAction: { label: '', href: '/contact' }
      }
    })
    expect(getByTestId('documentation-doc-call-to-action')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/signup')
    expect(queryByRole('link', { name: /contact/i })).toBeNull()
  })

  it('renders under rtl', () => {
    const { getByRole } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(getByRole('complementary')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(TwoActions)
    await expectNoA11yViolations(container)
  })
})
