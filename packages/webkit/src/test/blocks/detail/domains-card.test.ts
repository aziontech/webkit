import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DomainsCard from '../../../../blocks/detail/domains-card/domains-card.vue'

afterEach(() => cleanup())

describe('detail/domains-card', () => {
  it('renders the sample domains when none are given', () => {
    const view = render(DomainsCard)
    expect(view.container.textContent).toContain('shop.example.com')
    expect(view.container.textContent).toContain('3 domains')
  })

  it('renders the domains it is given and emits Add Domain', async () => {
    const view = render(DomainsCard, {
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
    const view = render(DomainsCard, {
      props: { error: "Couldn't load the domains." }
    })
    expect(view.container.textContent).toContain("Couldn't load the domains.")
    expect(view.container.textContent).not.toContain('shop.example.com')
    expect(view.container.textContent).toContain('0 domains')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })
})
