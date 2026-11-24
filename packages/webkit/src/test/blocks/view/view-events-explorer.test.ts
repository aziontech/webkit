import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

import EventsExplorerEmpty from '../../../../blocks/view/view-events-explorer/variants/empty.vue'
import EventsExplorerFailed from '../../../../blocks/view/view-events-explorer/variants/error.vue'
import EventsExplorerEventDocument from '../../../../blocks/view/view-events-explorer/variants/event-document.vue'
import EventsExplorerFiltered from '../../../../blocks/view/view-events-explorer/variants/filtered.vue'
import EventsExplorerQuery from '../../../../blocks/view/view-events-explorer/variants/query.vue'
import EventsExplorerSessions from '../../../../blocks/view/view-events-explorer/variants/sessions.vue'
import ViewEventsExplorer, {
  type EventsExplorerEvent,
  type EventsExplorerField
} from '../../../../blocks/view/view-events-explorer/view-events-explorer.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

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

describe('view/view-events-explorer block', () => {
  it('states the time zone in the toolbar, outside the time range picker', async () => {
    const view = render(ViewEventsExplorer)
    expect(view.getByTestId('events-time-zone').textContent?.trim()).toBe('Times in UTC')
  })

  it('keeps the average request time reading number then unit in a right-to-left page', async () => {
    document.documentElement.dir = 'rtl'
    try {
      const view = render(ViewEventsExplorer)
      const time = await waitFor(() => view.getByTestId('log-summary__request-time'))
      expect(time.getAttribute('dir')).toBe('ltr')
      expect(time.textContent?.trim()).toMatch(/^\d[\d,]* ms$/)
    } finally {
      document.documentElement.removeAttribute('dir')
    }
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
    const view = render(ViewEventsExplorer)
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
    const view = render(ViewEventsExplorer, {
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
    const view = render(ViewEventsExplorer, {
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
    const view = render(ViewEventsExplorer, {
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
    const view = render(ViewEventsExplorer, {
      props: { now, total: 120, events: [old], filters: { period: ['15m'], level: ['Error'] } }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Matched on the server'))
  })

  it('never counts 0 values while the events load or after they fail to load', async () => {
    await page.viewport(1280, 900)
    const loading = render(ViewEventsExplorer, { props: { loading: true } })
    await waitFor(() =>
      expect(loading.getAllByTestId('field-row__count-loading').length).toBeGreaterThan(0)
    )
    expect(loading.queryAllByLabelText('0 distinct values')).toHaveLength(0)
    loading.unmount()
    const failed = render(ViewEventsExplorer, { props: { error: 'The API answered 503.' } })
    await waitFor(() =>
      expect(failed.getAllByLabelText(/values unknown$/).length).toBeGreaterThan(0)
    )
    expect(failed.queryAllByLabelText('0 distinct values')).toHaveLength(0)
    await page.viewport(414, 896)
  })

  it('gives each value count a framed trigger of at least 24 px that opens the top values', async () => {
    await page.viewport(1280, 900)
    try {
      const view = render(ViewEventsExplorer)
      const trigger = await waitFor(() =>
        view.getByRole('button', { name: /^Filter by Level, \d+ values$/ })
      )
      const count = within(trigger).getByTestId('field-row__count')
      expect(count.classList.contains('min-h-6')).toBe(true)
      expect(count.classList.contains('min-w-6')).toBe(true)
      expect(count.classList.contains('hover:bg-(--bg-hover)')).toBe(true)
    } finally {
      await page.viewport(414, 896)
    }
  })

  it('focuses Search events on / with nothing focused', async () => {
    const view = render(ViewEventsExplorer)
    const field = await waitFor(() => view.getByRole('textbox', { name: 'Search events' }))
    ;(document.activeElement as HTMLElement | null)?.blur()
    await fireEvent.keyDown(document.body, { key: '/' })
    await waitFor(() => expect(document.activeElement).toBe(field))
    expect(field.getAttribute('aria-keyshortcuts')).toBe('/')
  })

  it('replaces the log with a danger alert whose Retry emits retry', async () => {
    const failed = render(EventsExplorerFailed)
    expect(failed.container.textContent).toContain("Couldn't load events.")
    failed.unmount()
    const view = render(ViewEventsExplorer, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.container.textContent).not.toContain('Delivered from cache')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('emits refresh, select and the filter model instead of faking them', async () => {
    const given = record('ev-acme', 'Acme checkout failed')
    const view = render(ViewEventsExplorer, { props: { now, events: [given] } })
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

  it('keeps each investigation tab its own search, and Delete closes the focused tab (Sessions)', async () => {
    const view = render(EventsExplorerSessions)
    const search = () => view.getByRole('textbox', { name: 'Search events' }) as HTMLInputElement
    expect(search().value).toBe('')
    const security = view.getByTestId('session-tab-s3')
    await fireEvent.click(security)
    await waitFor(() => expect(search().value).toBe('blocked'))
    await fireEvent.click(view.getByTestId('session-tab-s2'))
    await waitFor(() => expect(search().value).toBe(''))

    const tab = view.getByTestId('session-tab-s3')
    expect(tab.getAttribute('aria-keyshortcuts')).toBe('Delete')
    tab.focus()
    await fireEvent.keyDown(tab, { key: 'Delete' })
    await waitFor(() => expect(view.queryByTestId('session-tab-s3')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(view.getByTestId('session-tab-s2')))
  })

  it('deletes a saved query with an Undo toast that brings it back (Query)', async () => {
    const view = render(EventsExplorerQuery)
    await fireEvent.click(view.getByTestId('saved-queries__trigger'))
    const panel = await waitFor(() => {
      const node = document.body.querySelector<HTMLElement>('[data-testid="saved-queries"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })
    await fireEvent.click(within(panel).getByRole('button', { name: 'Delete Server errors' }))
    await waitFor(() =>
      expect(within(panel).queryByRole('button', { name: 'Delete Server errors' })).toBeNull()
    )
    const toast = await waitFor(
      () => {
        const node = screen
          .getAllByText('Saved query “Server errors” deleted.')
          .map((text) => text.closest<HTMLElement>('[data-toast-id]'))
          .find(Boolean)
        expect(node).toBeTruthy()
        return node as HTMLElement
      },
      { timeout: 3000 }
    )
    await fireEvent.click(within(toast).getByRole('button', { name: 'Undo' }))
    if (!document.body.querySelector('[data-testid="saved-queries"]'))
      await fireEvent.click(view.getByTestId('saved-queries__trigger'))
    await waitFor(() =>
      expect(document.body.querySelector('[aria-label="Delete Server errors"]')).not.toBeNull()
    )
  })

  it('folds Time, Level and Source into the Event cell when the explorer is narrow (Query, EventDocument)', async () => {
    for (const variant of [EventsExplorerQuery, EventsExplorerEventDocument]) {
      const view = render(variant)
      await waitFor(() =>
        expect(view.queryByRole('columnheader', { name: /^Event/ })).not.toBeNull()
      )
      expect(view.queryByRole('columnheader', { name: /^Level/ })).toBeNull()
      view.unmount()
    }
  })

  it('opens the event drawer on a phone without focusing a search field', async () => {
    await page.viewport(390, 844)
    const view = render(ViewEventsExplorer)
    const [open] = await waitFor(() => view.getAllByRole('button', { name: /^Open event / }))
    await fireEvent.click(open!)
    const drawer = await waitFor(() => document.querySelector<HTMLElement>('[role="dialog"]')!)
    await waitFor(() => expect(drawer.contains(document.activeElement)).toBe(true))
    expect(['INPUT', 'TEXTAREA']).not.toContain(document.activeElement?.tagName)
    await page.viewport(414, 896)
  })

  it('states the time zone in the toolbar of the EventDocument variant', () => {
    const view = render(EventsExplorerEventDocument)
    expect(view.getByTestId('events-time-zone').textContent?.trim()).toBe('Times in UTC')
  })

  it('runs its typed query on the log through the block (Query)', async () => {
    const view = render(EventsExplorerQuery)
    const opens = await waitFor(() => view.getAllByRole('button', { name: /^Open event / }))
    const rows = opens.map((button) => button.closest<HTMLElement>('tr, [role="row"]')!)
    for (const row of rows) {
      expect(row.textContent).toContain('Error')
      expect(row.textContent).toContain('api.example.com')
    }
  })

  it('filters by and excludes a value from the open document, with an is not chip (EventDocument)', async () => {
    await page.viewport(1440, 900)
    try {
      const view = render(EventsExplorerEventDocument)
      expect(view.getByTestId('exclusion-chip').textContent).toContain('legacy.example.com')
      await waitFor(() => view.getByTestId('document-fields'))
      const query = view.getByRole('textbox', { name: 'Search in this event' })
      await fireEvent.update(query, 'zzz')
      await waitFor(() => expect(view.queryByTestId('document-fields')).toBeNull())
      await fireEvent.update(query, '')
      const fields = await waitFor(() => view.getByTestId('document-fields'))
      const exclude = within(fields).getAllByRole('button', { name: /^Exclude Host / })[0]
      await fireEvent.click(exclude)
      await waitFor(() => expect(view.getAllByTestId('exclusion-chip')).toHaveLength(2))
    } finally {
      await page.viewport(414, 896)
    }
  })
})
