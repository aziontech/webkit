import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Default from '../../../../examples/trace/default.vue'
import Selected from '../../../../examples/trace/selected.vue'
import WithError from '../../../../examples/trace/with-error.vue'
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
    expect(bars[3]?.getAttribute('data-tone')).toBe('error')
    expect(bars[0]?.getAttribute('data-tone')).toBe('root')
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
    for (const example of [Default, WithError, Selected]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
