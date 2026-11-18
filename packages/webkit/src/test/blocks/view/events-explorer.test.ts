import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import EventsExplorer, {
  type EventsExplorerEvent,
  type EventsExplorerField
} from '../../../../blocks/view/events-explorer/events-explorer.vue'
import EventsExplorerEmpty from '../../../../blocks/view/events-explorer/variants/empty.vue'
import EventsExplorerFailed from '../../../../blocks/view/events-explorer/variants/error.vue'
import EventsExplorerFiltered from '../../../../blocks/view/events-explorer/variants/filtered.vue'
import EventsExplorerQuery from '../../../../blocks/view/events-explorer/variants/query.vue'

const now = new Date(Date.UTC(2026, 10, 1, 12))

const record = (id: string, message: string, extra: Record<string, unknown> = {}) =>
  ({
    id,
    at: new Date(now.getTime() - 5 * 60_000),
    source: 'http',
    level: 'Error',
    message,
    host: 'store.example.com',
    ...extra
  }) as EventsExplorerEvent

describe('view/events-explorer block', () => {
  it('states the time zone in the toolbar, outside the time range picker', async () => {
    const view = render(EventsExplorer)
    expect(view.getByTestId('events-time-zone').textContent?.trim()).toBe('Times in UTC')
  })

  it('shows the zone beside the picker in the Query variant and changes it there', async () => {
    const view = render(EventsExplorerQuery)
    const zone = await waitFor(() => view.getByRole('combobox', { name: 'Time zone' }))
    expect(zone.textContent).toContain('UTC+00:00')
    await userEvent.click(zone)
    const list = await waitFor(() => document.body.querySelector<HTMLElement>('[role="listbox"]'))
    await userEvent.click(within(list as HTMLElement).getByRole('option', { name: /Sao Paulo/ }))
    await waitFor(() => expect(zone.textContent).toContain('UTC−03:00 · Sao Paulo'))
  })

  it('opens an event from its detail button, a keyboard path to the document', async () => {
    const view = render(EventsExplorer)
    const [open] = await waitFor(() => view.getAllByRole('button', { name: /^Open event / }))
    expect(open).toHaveAttribute('aria-expanded', 'false')
    await fireEvent.click(open)
    await waitFor(() => expect(open).toHaveAttribute('aria-expanded', 'true'))
  })

  it('shows the trace of a request event with its critical path, and none for an event without spans', async () => {
    const spans = [
      { id: 'request', name: 'GET /cart', start: 0, duration: 120 },
      { id: 'origin', parentId: 'request', name: 'fetch origin', start: 10, duration: 100 }
    ]
    const view = render(EventsExplorer, {
      props: {
        now,
        events: [
          record('ev-trace', 'Origin slow', { requestId: 'req-1', spans }),
          record('ev-plain', 'Rule matched', { at: new Date(now.getTime() - 6 * 60_000) })
        ]
      }
    })
    const open = await waitFor(() => view.getByRole('button', { name: 'Open event ev-trace' }))
    await fireEvent.click(open)
    const [trace] = await waitFor(() =>
      view.getAllByRole('treegrid', { name: 'Trace of request req-1' })
    )
    const critical = trace?.querySelectorAll('[data-critical]') ?? []
    expect([...critical].map((row) => row.getAttribute('data-span-id'))).toEqual([
      'request',
      'origin'
    ])
    await fireEvent.click(view.getByRole('button', { name: 'Open event ev-plain' }))
    await waitFor(() => expect(view.queryAllByRole('treegrid')).toHaveLength(0))
  })

  it('filters through FilterMenu and shows its chips for applied fields', async () => {
    const view = render(EventsExplorerFiltered)
    expect(view.getByTestId('filter-button')).toBeTruthy()
    const chips = view.getByTestId('filter-chips')
    expect(chips.textContent).toContain('Source')
    expect(chips.textContent).toContain('Level')
  })

  it('renders the events it is given instead of the sample, and No events yet for none', async () => {
    const view = render(EventsExplorer, {
      props: { now, events: [record('ev-acme', 'Acme checkout failed')] }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Acme checkout failed'))
    expect(view.container.textContent).not.toContain('Delivered from cache')
    expect(view.getAllByRole('button', { name: /^Open event / })).toHaveLength(1)
    view.unmount()
    const empty = render(EventsExplorerEmpty)
    await waitFor(() => expect(empty.container.textContent).toContain('No events yet'))
  })

  it('builds the columns from the fields it is given', async () => {
    const fields: EventsExplorerField[] = [
      { id: 'time', label: 'Time', core: true },
      { id: 'level', label: 'Level', core: true },
      { id: 'message', label: 'Event', core: true, principal: true },
      { id: 'zone', label: 'DNS zone', category: 'dns' }
    ]
    const view = render(EventsExplorer, {
      props: { now, fields, events: [record('ev-1', 'Zone answered', { zone: 'example.org' })] }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Zone answered'))
    const headers = Array.from(view.container.querySelectorAll('[role=columnheader]')).map(
      (th) => th.textContent?.trim() ?? ''
    )
    expect(headers.some((text) => text.includes('Event'))).toBe(true)
    expect(headers.some((text) => text.includes('Source'))).toBe(false)
    expect(headers.some((text) => text.includes('DNS zone'))).toBe(true)
    expect(view.container.textContent).toContain('example.org')
  })

  it('shows the events of a server page as given, without filtering them again', async () => {
    const old = record('ev-old', 'Matched on the server', {
      at: new Date(now.getTime() - 3 * 86_400_000),
      level: 'Info'
    })
    const view = render(EventsExplorer, {
      props: { now, total: 120, events: [old], filters: { period: ['15m'], level: ['Error'] } }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Matched on the server'))
  })

  it('replaces the log with a danger alert whose Retry emits retry', async () => {
    const failed = render(EventsExplorerFailed)
    expect(failed.container.textContent).toContain("Couldn't load events.")
    failed.unmount()
    const view = render(EventsExplorer, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.container.textContent).not.toContain('Delivered from cache')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('emits refresh, select and the filter model instead of faking them', async () => {
    const given = record('ev-acme', 'Acme checkout failed')
    const view = render(EventsExplorer, { props: { now, events: [given] } })
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')).toHaveLength(1)
    const open = await waitFor(() => view.getByRole('button', { name: 'Open event ev-acme' }))
    await fireEvent.click(open)
    const selected = view.emitted('select') as [MouseEvent, EventsExplorerEvent][]
    expect(selected).toHaveLength(1)
    expect(selected[0][0]).toBeInstanceOf(Event)
    expect(selected[0][1]).toEqual(given)
    await fireEvent.update(view.getByRole('textbox', { name: 'Search events' }), 'checkout')
    expect(view.emitted('update:search')?.at(-1)).toEqual(['checkout'])
  })
})
