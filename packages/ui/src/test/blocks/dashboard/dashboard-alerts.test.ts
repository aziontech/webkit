import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import DashboardAlerts from '../../../../blocks/dashboard/dashboard-alerts/dashboard-alerts.vue'
import OpenAlertTable from '../../../../blocks/dashboard/dashboard-alerts/parts/open-alert-table.vue'
import AlertsDashboardEmpty from '../../../../blocks/dashboard/dashboard-alerts/variants/empty.vue'

afterEach(() => cleanup())

describe('dashboard/dashboard-alerts', () => {
  it('renders the records it is given instead of the sample', async () => {
    const view = render(DashboardAlerts, {
      props: {
        kpis: { open: { value: 7, delta: null } },
        openByLevel: [{ id: 'high', count: 7 }],
        entities: [
          { id: 'e1', name: 'jane.doe', type: 'User', score: 70, level: 'high', alerts: 7 }
        ],
        alerts: [
          {
            id: 'a1',
            level: 'high',
            rank: 4,
            title: 'Acme token leaked',
            entity: 'jane.doe',
            opened: 'Nov 10, 08:00',
            status: 'Open'
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Acme token leaked'))
    expect(view.container.textContent).toContain('jane.doe')
    expect(view.container.textContent).toContain('100%')
    expect(view.container.textContent).not.toContain('ava.wilson')
  })

  it('shows one page-level empty state with a next step, and zeros in the tiles', async () => {
    const view = render(AlertsDashboardEmpty)
    const empty = view.container.querySelector('[data-testid="dashboard-alerts__empty"]')!
    expect(empty.textContent).toContain('No alerts in the last 30 days')
    expect(view.container.textContent).not.toContain('No entities at risk yet')
    expect(view.container.textContent).not.toContain('ava.wilson')
    const values = [...view.container.querySelectorAll('[data-testid="stat-tile__value"]')]
    expect(values.map((value) => value.textContent?.trim())).toEqual(['0', '0', '0', '0%'])
    await fireEvent.click(view.getByRole('button', { name: 'Show the last 90 days' }))
    await waitFor(() => expect(empty.textContent).toContain('No alerts in the last 90 days'))
  })

  it('loads Highest risk with as many skeleton rows as it shows, and tiles that keep their delta line', async () => {
    const loaded = render(DashboardAlerts)
    const tableOf = (root: HTMLElement) =>
      within(root).getByRole('table', { name: /Highest risk/ }) as HTMLElement
    const bodyRows = (table: HTMLElement) =>
      table.querySelectorAll('[data-testid="table-body"] [data-testid="table-row"]').length
    const shown = await waitFor(() => {
      const count = bodyRows(tableOf(loaded.container as HTMLElement))
      expect(count).toBeGreaterThan(0)
      return count
    })
    loaded.unmount()
    const loading = render(DashboardAlerts, { props: { loading: true } })
    await waitFor(() => expect(bodyRows(tableOf(loading.container as HTMLElement))).toBe(shown))
    const tile = loading.container.querySelector('[data-testid="stat-tile"]')!
    expect(tile.querySelectorAll('[data-testid="skeleton"]').length).toBe(1)
  })

  it('hides the sample while loading', () => {
    const view = render(DashboardAlerts, { props: { loading: true } })
    expect(view.container.querySelector('[aria-busy="true"]')).not.toBeNull()
    expect(view.container.textContent).not.toContain('ava.wilson')
  })

  it('names each region in its error alert and emits retry', async () => {
    const view = render(DashboardAlerts, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain("Couldn't load the alerts. The API answered 503.")
    expect(view.container.textContent).not.toContain('ava.wilson')
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('lets the ghost period trigger size to its label instead of a fixed box', () => {
    const view = render(DashboardAlerts)
    const wrapper = view.getByRole('combobox', { name: 'Period' }).closest('div.shrink-0')
    expect(wrapper).not.toBeNull()
    expect(wrapper!.className).not.toMatch(/\bw-(?:\d|full)/)
  })

  it('emits the period the reader picks', async () => {
    const view = render(DashboardAlerts)
    await userEvent.click(view.getByRole('combobox', { name: 'Period' }))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === 'Last 7 days'
      )
      if (!found) throw new Error('no option')
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(view.emitted('update:period')?.[0]).toEqual(['7d']))
  })

  it('stacks the Open alerts rows as cards on a phone instead of scrolling sideways', async () => {
    const host = document.createElement('div')
    host.style.width = '360px'
    document.body.appendChild(host)
    const view = render(OpenAlertTable, {
      props: {
        alerts: [
          {
            id: 'a1',
            level: 'high',
            rank: 4,
            title: 'Acme token leaked',
            entity: 'jane.doe',
            opened: 'Nov 10, 08:00',
            status: 'Open'
          }
        ]
      },
      container: host
    })
    await waitFor(() =>
      expect(view.getByTestId('data-table').hasAttribute('data-stacked')).toBe(true)
    )
    host.remove()
  })
})
