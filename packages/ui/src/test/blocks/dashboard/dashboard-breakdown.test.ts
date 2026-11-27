import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DashboardBreakdown from '../../../../blocks/dashboard/dashboard-breakdown/dashboard-breakdown.vue'
import BreakdownEmpty from '../../../../blocks/dashboard/dashboard-breakdown/variants/empty.vue'
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

  it('says on screen that the tiles read this month, apart from the header period', () => {
    const view = render(DashboardBreakdown)
    const deltas = view.container.querySelectorAll('[data-testid="stat-tile__delta"]')
    expect(deltas.length).toBe(4)
    for (const delta of deltas) expect(delta.textContent).toContain('this month vs previous month')
    const region = view.getByRole('region', { name: 'This month' })
    expect(region.querySelectorAll('[data-testid="stat-tile"]').length).toBe(4)
  })

  it('lets the ghost period trigger size to its label instead of a fixed box', () => {
    const view = render(DashboardBreakdown)
    const wrapper = view.getByRole('combobox', { name: 'Period' }).closest('div.shrink-0')
    expect(wrapper).not.toBeNull()
    expect(wrapper!.className).not.toMatch(/\bw-(?:\d|full)/)
  })

  it('shows one page-level empty state and zero spend in the tiles for an empty period', () => {
    const view = render(BreakdownEmpty)
    expect(
      view.container.querySelector('[data-testid="dashboard-breakdown__empty"]')?.textContent
    ).toContain('No spend in this period')
    expect(view.queryByText('Current split')).toBeNull()
    const values = [...view.container.querySelectorAll('[data-testid="stat-tile__value"]')]
    expect(values).toHaveLength(4)
    for (const value of values) expect(value.textContent).toContain('$0')
  })

  it('hides the sample while loading', () => {
    const view = render(DashboardBreakdown, { props: { loading: true } })
    expect(view.container.textContent).not.toContain('worker-pool')
    expect((view.getByRole('button', { name: 'Export CSV' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })
})
