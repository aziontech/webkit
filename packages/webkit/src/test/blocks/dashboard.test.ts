import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import Analytics from '../../../blocks/dashboard/dashboard-analytics/dashboard-analytics.vue'
import AnalyticsMetrics from '../../../blocks/dashboard/dashboard-analytics/variants/metrics.vue'
import AnalyticsMetricsOverview from '../../../blocks/dashboard/dashboard-analytics/variants/metrics-overview.vue'
import AnalyticsUsage from '../../../blocks/dashboard/dashboard-analytics/variants/usage.vue'
import Composition from '../../../blocks/dashboard/dashboard-breakdown/dashboard-breakdown.vue'
import CompositionEmpty from '../../../blocks/dashboard/dashboard-breakdown/variants/empty.vue'
import Executive from '../../../blocks/dashboard/dashboard-executive-summary/dashboard-executive-summary.vue'
import Security from '../../../blocks/dashboard/dashboard-security/dashboard-security.vue'
import { useToastRegion } from '../toast-region'

useToastRegion()

afterEach(() => cleanup())

const pickMenuOption = async (trigger: HTMLElement, label: string) => {
  await userEvent.click(trigger)
  const option = await waitFor(() => {
    const found = Array.from(document.querySelectorAll('[role="menuitem"]')).find(
      (node) => node.textContent?.trim() === label
    )
    if (!found) throw new Error(`no ${label}`)
    return found as HTMLElement
  })
  await userEvent.click(option)
}
describe('dashboard blocks', () => {
  it('ships one block per data shape, with no merged or off-domain dashboard left', () => {
    const ids = Object.keys(import.meta.glob('../../../blocks/dashboard/*/block.json')).map(
      (path) => path.split('/').at(-2)
    )
    for (const removed of [
      'data-dashboard',
      'activity-outcomes-dashboard',
      'project-status-dashboard',
      'funnel-cohort-dashboard'
    ])
      expect(ids).not.toContain(removed)
    expect(ids).toContain('dashboard-analytics')
  })
})

describe.each([
  ['dashboard-analytics', Analytics],
  ['dashboard-analytics#Usage', AnalyticsUsage],
  ['dashboard-security', Security]
])('dashboard/%s period', (_name, Block) => {
  it('drives the delta comparison from the Period Select in the header', async () => {
    const view = render(Block)
    expect(view.container.textContent).toContain('vs previous 24 hours')
    await userEvent.click(view.getByRole('combobox', { name: 'Period' }))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === 'Last 7 days'
      )
      if (!found) throw new Error('no option')
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(view.container.textContent).toContain('vs previous 7 days'))
    expect(view.container.textContent).not.toContain('vs previous 24 hours')
  })
})

describe('dashboard exports', () => {
  it.each([['dashboard-breakdown', Composition, 'More options for Current split']])(
    '%s exports a card as CSV from its menu',
    async (_name, Block, trigger) => {
      const view = render(Block)
      await pickMenuOption(view.getByRole('button', { name: trigger }), 'Export CSV')
      await waitFor(() => expect(document.body.textContent).toContain('CSV exported.'))
    }
  )

  it('exports from the page header buttons', async () => {
    const composition = render(Composition)
    await fireEvent.click(composition.getByRole('button', { name: 'Export CSV' }))
    await waitFor(() =>
      expect(document.body.textContent).toContain('spend-by-category-last-12-months.csv')
    )
    composition.unmount()
    const executive = render(Executive)
    await fireEvent.click(executive.getByRole('button', { name: 'Export' }))
    await waitFor(() =>
      expect(document.body.textContent).toContain('executive-summary-q3-2026.csv')
    )
  })

  it('disables the exports when the period has no data', () => {
    const view = render(CompositionEmpty)
    expect((view.getByRole('button', { name: 'Export CSV' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })
})

describe('dashboard/dashboard-analytics data', () => {
  it('renders the hosts and figures it is given instead of the sample', async () => {
    const view = render(Analytics, {
      props: {
        kpis: { requests: { value: 1234, delta: null, trend: [] } },
        hosts: [{ id: 'store', host: 'store.example.com', service: 'Acme Store', requests: 42 }]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('store.example.com'))
    expect(view.container.textContent).not.toContain('www.example.com')
    expect(view.container.textContent).toContain('Acme Store')
  })

  it('disables Export CSV on a card with no data and keeps the sample out while loading', async () => {
    const empty = render(Analytics, { props: { hosts: [] } })
    expect(empty.container.textContent).toContain('No traffic yet')
    empty.unmount()
    const loading = render(Analytics, { props: { loading: true } })
    expect(loading.container.textContent).not.toContain('www.example.com')
    expect(
      (loading.getByRole('button', { name: 'Expand Top hosts' }) as HTMLButtonElement).disabled
    ).toBe(true)
  })

  it('shows the error once for the page and emits retry', async () => {
    const view = render(Analytics, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain("Couldn't load analytics. The API answered 503.")
    const retries = view.getAllByRole('button', { name: 'Retry' })
    expect(retries).toHaveLength(1)
    await fireEvent.click(retries[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('emits update:period when the Period Select changes', async () => {
    const view = render(Analytics, { props: { period: '24h' } })
    await userEvent.click(view.getByRole('combobox', { name: 'Period' }))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === 'Last 7 days'
      )
      if (!found) throw new Error('no option')
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(view.emitted('update:period')).toEqual([['7d']]))
  })
})

describe('dashboard/dashboard-analytics Copy query', () => {
  const copied = async (Block: object, trigger: string, props = {}) => {
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const view = render(Block, { props })
    await pickMenuOption(view.getByRole('button', { name: trigger }), 'Copy query')
    await waitFor(() => expect(write).toHaveBeenCalled())
    const query = String(write.mock.calls[0][0])
    write.mockRestore()
    return query
  }

  it('copies a query the Real-Time Metrics API accepts', async () => {
    const hosts = await copied(Analytics, 'More options for Top hosts', {
      range: { begin: '2026-11-13T11:00:00.000Z', end: '2026-11-14T10:59:59.000Z' }
    })
    expect(hosts).toContain('workloadMetrics(')
    expect(hosts).toContain('groupBy: [host, configurationId]')
    expect(hosts).toContain('orderBy: [sum_DESC]')
    expect(hosts).toContain('begin: "2026-11-13T11:00:00", end: "2026-11-14T10:59:59"')
    expect(hosts).not.toMatch(/httpMetrics|requests_DESC|\bservice\b|Z"/)
    cleanup()
    const countries = await copied(Analytics, 'More options for Requests by country')
    expect(countries).toContain('groupBy: [geolocCountryName]')
    expect(countries).not.toMatch(/\bcountry\b/)
    cleanup()
    const series = await copied(Analytics, 'More options for Requests over time')
    expect(series).toContain('groupBy: [ts]')
    expect(series).toContain('orderBy: [ts_ASC]')
  })

  it('groups every variant query and orders by the sum', async () => {
    const usage = await copied(AnalyticsUsage, 'More options for Usage by project')
    expect(usage).toContain('workloadMetrics(')
    expect(usage).toContain('orderBy: [sum_DESC]')
    expect(usage).toContain('groupBy: [configurationId]')
    cleanup()
    const metrics = await copied(AnalyticsMetrics, 'More options for Requests')
    expect(metrics).toContain('workloadMetrics(')
    expect(metrics).toContain('groupBy: [ts]')
    expect(metrics).not.toContain('httpMetrics')
  })
})

describe('dashboard/dashboard-analytics data shapes', () => {
  it('offers an Errors view of Status codes that hides 2xx and 3xx so 4xx and 5xx get the scale', async () => {
    const view = render(Analytics)
    const toggle = view.getByRole('radiogroup', { name: 'Chart form for Status codes' })
    await fireEvent.click(within(toggle).getByRole('radio', { name: 'Errors' }))
    const card = toggle.closest('[data-testid="chart-card"]') as HTMLElement
    await waitFor(() => {
      const pressed = Object.fromEntries(
        Array.from(card.querySelectorAll('[data-testid="chart-legend__item"]')).map((item) => [
          item.querySelectorAll('span')[1]?.textContent?.trim(),
          item.getAttribute('aria-pressed')
        ])
      )
      expect(pressed).toEqual({
        'Status 2xx': 'false',
        'Status 3xx': 'false',
        'Status 4xx': 'true',
        'Status 5xx': 'true'
      })
    })
  })

  it.each([
    ['Metrics', AnalyticsMetrics],
    ['Metrics overview', AnalyticsMetricsOverview]
  ])('offers the same Errors view of Status codes on the %s page', async (_, page) => {
    const view = render(page)
    const toggle = await waitFor(() =>
      view.getByRole('radiogroup', { name: 'Chart form for Status codes' })
    )
    await fireEvent.click(within(toggle).getByRole('radio', { name: 'Errors' }))
    const card = toggle.closest('[data-testid="chart-card"]') as HTMLElement
    await waitFor(() => {
      const pressed = Object.fromEntries(
        Array.from(card.querySelectorAll('[data-testid="chart-legend__item"]')).map((item) => [
          item.querySelectorAll('span')[1]?.textContent?.trim(),
          item.getAttribute('aria-pressed')
        ])
      )
      expect(pressed['Status 2xx']).toBe('false')
      expect(pressed['Status 5xx']).toBe('true')
    })
  })

  it('keeps the figures while refetching and marks every chart as refetching', async () => {
    const view = render(Analytics, {
      props: {
        refetching: true,
        hosts: [{ id: 'store', host: 'store.example.com', service: 'Acme Store', requests: 42 }]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('store.example.com'))
    const charts = view.container.querySelectorAll('[data-refetching]')
    expect(charts.length).toBeGreaterThanOrEqual(3)
    for (const chart of charts) expect(chart.getAttribute('aria-busy')).toBe('true')
    expect(view.container.querySelector('[data-loading]')).toBeNull()
    expect(view.getByTestId('period-header__updating').textContent).toContain('Updating')
    const figures = view.getByRole('group', { name: 'Key figures' })
    expect(figures.getAttribute('aria-busy')).toBe('true')
    expect(figures.parentElement?.hasAttribute('data-updating')).toBe(true)
    expect(
      figures.parentElement?.classList.contains(
        'data-[updating]:[&_[data-testid$=__sparkline]]:opacity-60'
      )
    ).toBe(true)
    const hostsTable = view.getByTestId('data-table')
    expect(hostsTable.closest('[aria-busy="true"]')).not.toBeNull()
    expect(
      hostsTable.parentElement?.classList.contains(
        'group-aria-busy/search-table:[&_[role=rowgroup]]:opacity-60'
      )
    ).toBe(true)
  })

  it('takes null gaps in a trend and sets the KPI tiles as the cells of one group', () => {
    const view = render(Analytics, {
      props: {
        kpis: {
          requests: { value: 1234, delta: 2, trend: [1, null, 3, 4] },
          'data-transferred': { value: 99, delta: null, trend: [] }
        }
      }
    })
    const group = view.getByRole('group', { name: 'Key figures' })
    const tiles = group.querySelectorAll('[data-testid="stat-tile"]')
    expect(tiles).toHaveLength(4)
    for (const tile of tiles) expect(tile.hasAttribute('data-grouped')).toBe(true)
    expect(group.querySelector('[data-testid="stat-tile__sparkline"]')).toBeTruthy()
  })
})
