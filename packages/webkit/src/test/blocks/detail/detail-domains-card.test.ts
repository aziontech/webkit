import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailDomainsCard from '../../../../blocks/detail/detail-domains-card/detail-domains-card.vue'

afterEach(() => cleanup())

describe('detail/detail-domains-card', () => {
  it('renders the sample domains when none are given', () => {
    const view = render(DetailDomainsCard)
    expect(view.container.textContent).toContain('shop.example.com')
    expect(view.container.textContent).toContain('3 domains')
  })

  it('pins the row actions on the end edge so cells scroll under them', () => {
    const view = render(DetailDomainsCard)
    const actions = view.getAllByRole('button', { name: /actions/i })[0]?.closest('[data-frozen]')
    expect(actions?.getAttribute('data-frozen')).toBe('end')
  })

  it('stacks each domain into a card on a phone, so the environment is never cut', async () => {
    const host = document.createElement('div')
    host.style.width = '320px'
    document.body.appendChild(host)
    const view = render(DetailDomainsCard, { container: host })
    const table = view.getByTestId('data-table')
    await waitFor(() => expect(table.hasAttribute('data-stacked')).toBe(true))
    const labels = view.getAllByTestId('data-table__stacked-label').map((el) => el.textContent)
    expect(labels).toContain('Environment')
    host.remove()
  })

  it('renders the domains it is given and emits Add Domain', async () => {
    const view = render(DetailDomainsCard, {
      props: {
        domains: [
          {
            id: 'docs',
            domain: 'docs.example.org',
            environment: 'Production',
            policy: 'Single',
            certificate: 'Managed',
            generated: false
          }
        ]
      }
    })
    expect(view.container.textContent).toContain('docs.example.org')
    expect(view.container.textContent).not.toContain('shop.example.com')
    expect(view.container.textContent).toContain('1 domain')
    await fireEvent.click(view.getByRole('button', { name: 'Add Domain' }))
    expect(view.emitted<unknown[]>('create')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('shows the error with Retry instead of the sample', async () => {
    const view = render(DetailDomainsCard, {
      props: { error: "Couldn't load the domains." }
    })
    expect(view.container.textContent).toContain("Couldn't load the domains.")
    expect(view.container.textContent).not.toContain('shop.example.com')
    expect(view.container.textContent).toContain('0 domains')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })
})
