import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DashboardBreakdown from '../../../../blocks/dashboard/dashboard-breakdown/dashboard-breakdown.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

describe('dashboard/dashboard-breakdown', () => {
  it('renders the records it is given instead of the sample', async () => {
    const view = render(DashboardBreakdown, {
      props: {
        contributors: [
          {
            id: 'acme-store',
            rank: 1,
            name: 'acme-store',
            icon: 'az az-server',
            category: 'Compute',
            amount: 1200,
            share: 100,
            change: 0
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('acme-store'))
    expect(view.container.textContent).not.toContain('worker-pool')
  })

  it('emits export with the card and still downloads the CSV', async () => {
    const view = render(DashboardBreakdown)
    await fireEvent.click(view.getByRole('button', { name: 'Export CSV' }))
    expect(view.emitted<unknown[]>('export')?.[0]?.[1]).toBe('spend-by-category')
    await waitFor(() => expect(document.body.textContent).toContain('CSV exported.'))
  })

  it('disables the exports and names each card while failed, and emits retry', async () => {
    const view = render(DashboardBreakdown, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain(
      "Couldn't load the cost breakdown. The API answered 503."
    )
    expect(view.container.textContent).not.toContain('worker-pool')
    expect((view.getByRole('button', { name: 'Export CSV' }) as HTMLButtonElement).disabled).toBe(
      true
    )
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })

  it('hides the sample while loading', () => {
    const view = render(DashboardBreakdown, { props: { loading: true } })
    expect(view.container.textContent).not.toContain('worker-pool')
    expect((view.getByRole('button', { name: 'Export CSV' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })
})
