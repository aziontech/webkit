import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ConfigurableDashboard from '../../../../blocks/dashboard/configurable-dashboard/configurable-dashboard.vue'

afterEach(() => cleanup())

describe('dashboard/configurable-dashboard', () => {
  it('renders the sources it is given instead of the sample', async () => {
    const view = render(ConfigurableDashboard, {
      props: { sources: [{ id: 'acme-store', name: 'acme-store', value: 1200 }] }
    })
    await waitFor(() => expect(view.container.textContent).toContain('acme-store'))
    expect(view.container.textContent).not.toContain('payments-api')
  })

  it('emits editing and the reset layout through its models', async () => {
    const view = render(ConfigurableDashboard, {
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

  it('names each card in its error alert and emits retry', async () => {
    const view = render(ConfigurableDashboard, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain("Couldn't load top sources. The API answered 503.")
    expect(view.container.textContent).not.toContain('payments-api')
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })
})
