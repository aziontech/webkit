import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Default from '../../../../examples/trace/default.vue'
import Empty from '../../../../examples/trace/empty.vue'
import Loading from '../../../../examples/trace/loading.vue'
import Selected from '../../../../examples/trace/selected.vue'
import SpanEvents from '../../../../examples/trace/span-events.vue'
import WithError from '../../../../examples/trace/with-error.vue'
import Zoom from '../../../../examples/trace/zoom.vue'
import { BUILT_IN_CATALOGS, provideLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import Trace from './trace.vue'

const spans = [
  { id: 'root', name: 'handler', service: 'Function', start: 0, duration: 400 },
  { id: 'a', parentId: 'root', name: 'fetch', service: 'Network', start: 10, duration: 200 },
  { id: 'a1', parentId: 'a', name: 'dns', start: 10, duration: 20 },
  {
    id: 'b',
    parentId: 'root',
    name: 'encode',
    start: 220,
    duration: 1500,
    status: 'error' as const
  }
]

const rows = (view: ReturnType<typeof render>) => view.getAllByRole('row')
const names = (view: ReturnType<typeof render>) =>
  rows(view).map((row) => row.getAttribute('data-span-id'))

describe('Trace', () => {
  it('renders a tree grid of spans with levels, positions and bars on the run clock', () => {
    const view = render(Trace, { props: { spans } })
    const grid = view.getByRole('treegrid', { name: 'Trace' })
    expect(names(view)).toEqual(['root', 'a', 'a1', 'b'])
    const [root, a, a1, b] = rows(view) as HTMLElement[]
    expect(root?.getAttribute('aria-level')).toBe('1')
    expect(a?.getAttribute('aria-level')).toBe('2')
    expect(a1?.getAttribute('aria-level')).toBe('3')
    expect(a?.getAttribute('aria-setsize')).toBe('2')
    expect(b?.getAttribute('aria-posinset')).toBe('2')
    expect(root?.getAttribute('aria-expanded')).toBe('true')
    expect(a1?.hasAttribute('aria-expanded')).toBe(false)
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(8)
    const bars = view.getAllByTestId('code-trace__bar')
    expect(bars[3]?.getAttribute('data-status')).toBe('error')
    expect(bars[3]?.hasAttribute('data-root')).toBe(false)
    expect(bars[0]?.getAttribute('data-status')).toBe('success')
    expect(bars[0]?.hasAttribute('data-root')).toBe(true)
    expect(bars[1]?.getAttribute('data-status')).toBe('success')
    expect(bars[1]?.hasAttribute('data-root')).toBe(false)
    expect(b?.style.getPropertyValue('--span-offset')).toBe(String(220 / 1720))
    expect(bars[3]?.textContent).toContain('1.50 s')
    expect(bars[1]?.textContent).toContain('200 ms')
    expect(b?.getAttribute('aria-label')).toBe('encode, +220 ms, 1.50 s, Failed')
  })

  it('collapses and expands a parent from its toggle', async () => {
    const view = render(Trace, { props: { spans } })
    const toggles = view.getAllByTestId('code-trace__toggle')
    await fireEvent.click(toggles[1] as HTMLElement)
    expect(names(view)).toEqual(['root', 'a', 'b'])
    expect(rows(view)[1]?.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.click(view.getAllByTestId('code-trace__toggle')[1] as HTMLElement)
    expect(names(view)).toEqual(['root', 'a', 'a1', 'b'])
  })

  it('selects a row, shows its details, deselects on a second click and closes', async () => {
    const view = render(Trace, {
      props: {
        spans: [
          ...spans,
          {
            id: 'c',
            parentId: 'root',
            name: 'call',
            start: 300,
            duration: 50,
            attributes: { 'http.status_code': 201 }
          }
        ]
      }
    })
    const call = rows(view)[4] as HTMLElement
    await fireEvent.click(call)
    expect(view.emitted()['update:selected']?.at(-1)).toEqual(['c'])
    expect(call.getAttribute('aria-selected')).toBe('true')
    const detail = view.getByRole('region', { name: 'Details of call' })
    expect(detail.textContent).toContain('Attributes')
    expect(detail.textContent).toContain('http.status_code')
    expect(detail.textContent).toContain('201')
    expect(view.getByRole('treegrid').getAttribute('aria-describedby')).toBe(detail.id)
    await fireEvent.click(call)
    expect(view.emitted()['update:selected']?.at(-1)).toEqual([''])
    expect(view.queryByRole('region')).toBeNull()
    await fireEvent.click(call)
    await fireEvent.click(view.getByRole('button', { name: 'Close' }))
    expect(view.emitted()['update:selected']?.at(-1)).toEqual([''])
    await nextTick()
    expect(document.activeElement).toBe(rows(view)[4])
  })

  it('follows the treegrid keyboard map with one tab stop', async () => {
    const view = render(Trace, { props: { spans } })
    const all = () => rows(view) as HTMLElement[]
    expect(all().filter((row) => row.tabIndex === 0)).toHaveLength(1)
    all()[0]?.focus()
    await fireEvent.keyDown(all()[0] as HTMLElement, { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement).toBe(all()[1])
    await fireEvent.keyDown(all()[1] as HTMLElement, { key: 'ArrowLeft' })
    expect(names(view)).toEqual(['root', 'a', 'b'])
    await fireEvent.keyDown(all()[1] as HTMLElement, { key: 'ArrowRight' })
    expect(names(view)).toEqual(['root', 'a', 'a1', 'b'])
    await fireEvent.keyDown(all()[1] as HTMLElement, { key: 'ArrowRight' })
    await nextTick()
    expect(document.activeElement).toBe(all()[2])
    await fireEvent.keyDown(all()[2] as HTMLElement, { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(all()[1])
    await fireEvent.keyDown(all()[1] as HTMLElement, { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(all()[3])
    expect(all()[3]?.tabIndex).toBe(0)
    await fireEvent.keyDown(all()[3] as HTMLElement, { key: 'Enter' })
    expect(view.emitted()['update:selected']?.at(-1)).toEqual(['b'])
    await fireEvent.keyDown(all()[3] as HTMLElement, { key: ' ' })
    expect(view.emitted()['update:selected']?.at(-1)).toEqual([''])
    await fireEvent.keyDown(all()[3] as HTMLElement, { key: 'Home' })
    await nextTick()
    expect(document.activeElement).toBe(all()[0])
  })

  it('narrows the rows by search, keeps ancestors, and offers Clear search on no match', async () => {
    const view = render(Trace, { props: { spans } })
    const search = view.getByRole('textbox', { name: 'Search spans' })
    await fireEvent.update(search, 'dns')
    expect(names(view)).toEqual(['root', 'a', 'a1'])
    await fireEvent.update(search, 'nothing')
    expect(view.queryByRole('treegrid')).toBeNull()
    expect(view.getByTestId('code-trace__empty').textContent).toContain(
      'No span matches “nothing”.'
    )
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    expect(names(view)).toEqual(['root', 'a', 'a1', 'b'])
  })

  it('shows the empty state with no spans', () => {
    const view = render(Trace)
    expect(view.getByTestId('code-trace__empty').textContent).toContain('No spans in this trace.')
  })

  it('keeps the selection itself when no v-model is bound', async () => {
    const view = render(Trace, { props: { spans } })
    const fetchRow = rows(view)[1] as HTMLElement
    await fireEvent.click(fetchRow)
    expect(fetchRow.getAttribute('aria-selected')).toBe('true')
    expect(view.getByRole('region', { name: 'Details of fetch' })).toBeTruthy()
  })

  it('renders the empty and no-match states through EmptyState', async () => {
    const view = render(Trace, { props: { spans } })
    await fireEvent.update(view.getByRole('textbox', { name: 'Search spans' }), 'nothing')
    const empty = view.getByTestId('code-trace__empty')
    expect(within(empty).getByTestId('feedback-empty-state')).toBeTruthy()
    expect(within(empty).getByRole('button', { name: 'Clear search' })).toBeTruthy()
  })

  it('shows placeholder rows in a status region while loading', () => {
    const view = render(Trace, { props: { spans, loading: true, selected: 'b' } })
    expect(view.getByTestId('code-trace').getAttribute('aria-busy')).toBe('true')
    expect(view.getByRole('status', { name: 'Loading spans' })).toBeTruthy()
    expect(view.getAllByTestId('code-trace__skeleton').length).toBeGreaterThan(0)
    expect(view.queryByRole('treegrid')).toBeNull()
    expect(view.queryByRole('region')).toBeNull()
    expect((view.getByRole('textbox', { name: 'Search spans' }) as HTMLInputElement).disabled).toBe(
      true
    )
  })

  it('drops the outer border when bordered is off', () => {
    const on = render(Trace, { props: { spans } })
    expect(on.getByTestId('code-trace').hasAttribute('data-bordered')).toBe(true)
    on.unmount()
    const off = render(Trace, { props: { spans, bordered: false } })
    expect(off.getByTestId('code-trace').hasAttribute('data-bordered')).toBe(false)
  })

  it('takes the consumer data-testid over the fallback', () => {
    const view = render(Trace, { props: { spans }, attrs: { 'data-testid': 'run-trace' } })
    expect(view.getByTestId('run-trace')).toBeTruthy()
    expect(view.queryByTestId('code-trace')).toBeNull()
    expect(view.getAllByTestId('run-trace__row')).toHaveLength(4)
  })

  it('mirrors under rtl: bars at the inline start and swapped arrows', async () => {
    const view = render({
      components: { Trace },
      setup: () => ({ spans }),
      template: `<div dir="rtl"><Trace :spans="spans" /></div>`
    })
    const bar = view.getAllByTestId('code-trace__bar')[0] as HTMLElement
    expect(bar.className).toContain('start-[calc(var(--span-offset)*100%)]')
    expect(bar.className).not.toMatch(/(^|\s)left-/)
    const grid = view.getByRole('treegrid')
    const barBox = bar.getBoundingClientRect()
    const gridBox = grid.getBoundingClientRect()
    expect(gridBox.right - barBox.right).toBeLessThan(gridBox.width / 2)
    const all = () => view.getAllByRole('row') as HTMLElement[]
    all()[1]?.focus()
    await fireEvent.keyDown(all()[1] as HTMLElement, { key: 'ArrowRight' })
    expect(names(view)).toEqual(['root', 'a', 'b'])
    await fireEvent.keyDown(all()[1] as HTMLElement, { key: 'ArrowLeft' })
    expect(names(view)).toEqual(['root', 'a', 'a1', 'b'])
  })

  it('reads its strings from the active locale', () => {
    const view = render({
      components: { Trace },
      setup() {
        provideLocale({ locale: 'pt-BR', catalogs: { ...BUILT_IN_CATALOGS, ...LOCALES } })
        return { spans }
      },
      template: `<Trace :spans="spans" selected="b" />`
    })
    expect(view.getByRole('treegrid', { name: 'Rastreamento' })).toBeTruthy()
    expect(view.getByRole('textbox', { name: 'Buscar spans' })).toBeTruthy()
    expect(view.getAllByTestId('code-trace__bar')[3]?.textContent).toContain('1,50 s')
    expect(view.getByRole('region', { name: 'Detalhes de encode' })).toBeTruthy()
  })

  it('has no axe violations in its examples', async () => {
    for (const example of [Default, WithError, Selected, Empty, Loading, Zoom, SpanEvents]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })

  describe('zoom, span events and slowest span', () => {
    const offsets = (view: ReturnType<typeof render>) =>
      rows(view).map((row) => Number(row.style.getPropertyValue('--span-offset')))

    it('places bars, ticks and hides spans outside a range window', () => {
      const view = render(Trace, { props: { spans, range: [200, 400] } })
      const [root, a, a1, b] = rows(view) as HTMLElement[]
      expect(root?.style.getPropertyValue('--span-offset')).toBe('0')
      expect(root?.style.getPropertyValue('--span-width')).toBe('1')
      expect(a?.style.getPropertyValue('--span-width')).toBe(String(10 / 200))
      expect(Number(b?.style.getPropertyValue('--span-offset'))).toBeCloseTo(0.1)
      const bars = view.getAllByTestId('code-trace__bar')
      expect(bars[2]?.hasAttribute('data-outside')).toBe(true)
      expect(a1?.getAttribute('aria-label')).toBe('dns, +10 ms, 20 ms')
      expect(view.getByTestId('code-trace__axis').textContent).toContain('200 ms')
      expect(view.getByTestId('code-trace__axis').textContent).toContain('400 ms')
      expect(view.queryByTestId('code-trace__minimap')).toBeNull()
    })

    it('widens a range narrower than 1% of the run', () => {
      const view = render(Trace, { props: { spans, range: [100, 100] } })
      expect(view.getByTestId('code-trace__axis').textContent).toContain('117 ms')
      expect(offsets(view).every(Number.isFinite)).toBe(true)
    })

    it('moves the window edges from the keyboard and resets the zoom', async () => {
      const view = render(Trace, { props: { spans, zoomable: true } })
      const emitted = () => view.emitted('update:range') as unknown[][]
      const [start, end] = view.getAllByRole('slider') as HTMLElement[]
      expect(start?.getAttribute('aria-label')).toBe('Zoom start')
      expect(end?.getAttribute('aria-valuenow')).toBe('1720')
      expect(view.queryByTestId('code-trace__reset-zoom')).toBeNull()
      await fireEvent.keyDown(start as HTMLElement, { key: 'PageUp' })
      expect(emitted().at(-1)?.[0]).toEqual([172, 1720])
      await view.rerender({ spans, zoomable: true, range: [172, 1720] })
      await fireEvent.keyDown(end as HTMLElement, { key: 'Home' })
      expect(emitted().at(-1)?.[0]).toEqual([172, 172 + 17.2])
      expect(view.getByTestId('code-trace__minimap').hasAttribute('data-zoomed')).toBe(true)
      await fireEvent.click(view.getByRole('button', { name: 'Reset zoom' }))
      expect(emitted().at(-1)?.[0]).toBeNull()
    })

    it('draws a window on the minimap track with the pointer', async () => {
      const view = render({
        components: { Trace },
        setup: () => ({ spans }),
        template: `<div style="width: 800px"><Trace :spans="spans" zoomable /></div>`
      })
      const track = view.getByTestId('code-trace__track')
      const box = track.getBoundingClientRect()
      const at = (share: number) => box.left + box.width * share
      await fireEvent.pointerDown(track, { button: 0, clientX: at(0.25), pointerId: 1 })
      await fireEvent.pointerMove(track, { clientX: at(0.5), pointerId: 1 })
      await fireEvent.pointerUp(track, { pointerId: 1 })
      const sliders = view.getAllByRole('slider')
      expect(Number(sliders[0]?.getAttribute('aria-valuenow'))).toBeCloseTo(430, -1)
      expect(Number(sliders[1]?.getAttribute('aria-valuenow'))).toBeCloseTo(860, -1)
    })

    it('draws span events as markers and lists them in the details', () => {
      const view = render(Trace, {
        props: {
          selected: 'a',
          spans: [
            spans[0],
            {
              ...spans[1],
              events: [
                { at: 110, name: 'first-byte' },
                { at: 30, name: 'cache-miss' }
              ]
            }
          ]
        }
      })
      const marks = view.getAllByTestId('code-trace__event')
      expect(marks).toHaveLength(2)
      expect(marks[0]?.style.getPropertyValue('--event-at')).toBe(String(110 / 400))
      expect(rows(view)[1]?.getAttribute('aria-label')).toBe(
        'fetch, Network, +10 ms, 200 ms, 2 events'
      )
      const list = view.getByTestId('code-trace__events')
      expect(list.textContent).toMatch(/\+30 ms\s*cache-miss[\s\S]*\+110 ms\s*first-byte/)
    })

    it('flags the slowest span under the root only when asked', () => {
      const plain = render(Trace, { props: { spans } })
      expect(plain.queryByTestId('code-trace__slowest')).toBeNull()
      plain.unmount()
      const view = render(Trace, { props: { spans, highlightSlowest: true, selected: 'b' } })
      const flagged = rows(view).filter((row) => row.hasAttribute('data-slowest'))
      expect(flagged.map((row) => row.getAttribute('data-span-id'))).toEqual(['b'])
      expect(flagged[0]?.getAttribute('aria-label')).toBe(
        'encode, +220 ms, 1.50 s, Failed, Slowest'
      )
      expect(view.getByTestId('code-trace__slowest-tag').textContent).toContain('Slowest')
    })
  })
})
