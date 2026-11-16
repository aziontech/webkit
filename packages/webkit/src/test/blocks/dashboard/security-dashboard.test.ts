import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Security, {
  type SecuritySourceIp
} from '../../../../blocks/dashboard/security-dashboard/security-dashboard.vue'
import SecurityByActor from '../../../../blocks/dashboard/security-dashboard/variants/by-actor.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const byTestId = (id: string, root: Document | HTMLElement = document) =>
  root.querySelector<HTMLElement>(`[data-testid="${id}"]`)
describe('dashboard/security-dashboard#ByActor', () => {
  it('narrows the log by destination and offers Clear filters when nothing matches', async () => {
    const view = render(SecurityByActor)
    const table = () => byTestId('data-table', view.container)
    expect(table()?.textContent).toContain('storage.example.com')
    const input = view.getByRole('textbox', { name: 'Destination host' })
    await userEvent.fill(input, 'storage.example.com')
    await waitFor(() => expect(table()?.textContent).not.toContain('api.example.com'))
    expect(table()?.textContent).toContain('storage.example.com')
    await userEvent.fill(input, 'nothing.example.org')
    await waitFor(() =>
      expect(view.container.textContent).toContain('No requests match these filters')
    )
    const clear = Array.from(view.container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Clear filters'
    ) as HTMLButtonElement
    await fireEvent.click(clear)
    await waitFor(() => expect(table()?.textContent).toContain('api.example.com'))
  })

  it('moves the time range to the header and the closed-set filters into FilterMenu', async () => {
    const view = render(SecurityByActor)
    expect(byTestId('filter-menu', view.container)).not.toBeNull()
    expect(view.getByRole('combobox', { name: 'Time range' })).toBeTruthy()
  })

  it('emits refresh from the Refresh button', async () => {
    const view = render(SecurityByActor)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')?.length).toBe(1)
  })
})

describe('dashboard/security-dashboard', () => {
  it('renders the source IPs it is given instead of the sample', () => {
    const row: SecuritySourceIp = {
      id: '198.51.100.7',
      remoteAddress: '198.51.100.7',
      asn: 'AS64510 Acme network',
      country: 'United States',
      category: 'SQL injection',
      requests: 42
    }
    const view = render(Security, { props: { sourceIps: [row] } })
    const table = byTestId('data-table', view.container)
    expect(table?.textContent).toContain('198.51.100.7')
    expect(table?.textContent).not.toContain('203.0.113.42')
  })

  it('shows the add rule set empty state when every region is empty', () => {
    const view = render(Security, {
      props: {
        matchedRequests: { labels: [], series: [] },
        categories: [],
        countries: [],
        sourceIps: [],
        attention: []
      }
    })
    expect(view.container.textContent).toContain('No security rules protect your services')
    expect(view.queryByRole('button', { name: 'Expand Matched requests over time' })).toBeNull()
  })

  it('disables the card actions while loading', () => {
    const view = render(Security, { props: { loading: true } })
    const expand = view.getByRole('button', {
      name: 'Expand Matched requests over time'
    }) as HTMLButtonElement
    expect(expand.disabled).toBe(true)
    expect(view.container.textContent).not.toContain('3 open')
  })

  it('names what failed in each card and emits retry', async () => {
    const view = render(Security, { props: { error: 'Check your connection and retry.' } })
    expect(view.container.textContent).toContain(
      "Couldn't load top source IPs by blocked requests. Check your connection and retry."
    )
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
