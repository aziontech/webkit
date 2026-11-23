import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DashboardConfigurable from '../../../../blocks/dashboard/dashboard-configurable/dashboard-configurable.vue'

afterEach(() => cleanup())

describe('dashboard/dashboard-configurable', () => {
  it('renders the sources it is given instead of the sample', async () => {
    const view = render(DashboardConfigurable, {
      props: { sources: [{ id: 'acme-store', name: 'acme-store', value: 1200 }] }
    })
    await waitFor(() => expect(view.container.textContent).toContain('acme-store'))
    expect(view.container.textContent).not.toContain('payments-api')
  })

  it('emits editing and the reset layout through its models', async () => {
    const view = render(DashboardConfigurable, {
      props: { layout: [{ id: 'latency', span: 12 }] }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Edit layout' }))
    expect(view.emitted<unknown[]>('update:editing')?.[0]).toEqual([true])
    await fireEvent.click(view.getByRole('button', { name: 'Reset layout' }))
    const reset = view.emitted<unknown[]>('update:layout')?.at(-1)?.[0] as { id: string }[]
    expect(reset.map((card) => card.id)).toEqual([
      'requests',
      'regions',
      'transfer',
      'errors',
      'sources',
      'latency'
    ])
  })

  it('shows one page alert with one Retry when the period fails, and quiet cards', async () => {
    const view = render(DashboardConfigurable, { props: { error: 'The API answered 503.' } })
    expect(view.getAllByRole('alert')).toHaveLength(1)
    expect(view.getByRole('alert').textContent).toContain(
      "Couldn't load the traffic overview. The API answered 503."
    )
    expect(view.container.textContent).not.toContain('payments-api')
    expect(view.getAllByText('Not available.').length).toBeGreaterThan(1)
    const retries = view.getAllByRole('button', { name: 'Retry' })
    expect(retries).toHaveLength(1)
    await fireEvent.click(retries[0]!)
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })

  it('moves a card with Move up and Move down while editing', async () => {
    const view = render(DashboardConfigurable, {
      props: {
        layout: [
          { id: 'requests', span: 12 },
          { id: 'latency', span: 12 }
        ]
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Edit layout' }))
    const up = view.getAllByRole('button', { name: /^Move .* up$/ })
    expect((up[0] as HTMLButtonElement).disabled).toBe(true)
    await fireEvent.click(up[1]!)
    const moved = view.emitted<unknown[]>('update:layout')?.at(-1)?.[0] as { id: string }[]
    expect(moved.map((card) => card.id)).toEqual(['latency', 'requests'])
  })
})
