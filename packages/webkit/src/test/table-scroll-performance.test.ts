import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { commands, server } from 'vitest/browser'

import StickyColumn from '../../examples/data-table/sticky-column.vue'
import VirtualRows from '../../examples/data-table/virtual-rows.vue'
import budgets from '../../perf-budgets.json'
import DataTableRoot from '../components/data/data-table/data-table.vue'
import type { TableColumn } from '../components/data/table/injection-key'
import { hostable } from './hostable'

const DataTable = hostable(DataTableRoot)

const frozenRows = Array.from({ length: 10_000 }, (_, i) => ({
  id: String(i + 1),
  name: `edge-function-${String(i + 1).padStart(5, '0')}`,
  region: ['us-east', 'eu-west', 'ap-south'][i % 3],
  path: ['/', '/api/items', '/assets/app.js'][i % 3],
  duration: `${(i * 7) % 900} ms`
}))
const frozenColumns: TableColumn[] = [
  { accessorKey: 'name', header: 'Name', frozen: 'start', width: 200 },
  { accessorKey: 'region', header: 'Region', width: 240 },
  { accessorKey: 'path', header: 'Path', width: 240 },
  { accessorKey: 'duration', header: 'Duration', frozen: 'end', width: 120 }
]

const STEPS = 60

const frame = (): Promise<void> => new Promise((done) => requestAnimationFrame(() => done()))

const scrollerIn = (root: HTMLElement): HTMLElement => {
  const el = [root, ...root.querySelectorAll<HTMLElement>('*')].find(
    (node) =>
      node.scrollHeight > node.clientHeight + 200 &&
      /auto|scroll/.test(getComputedStyle(node).overflowY)
  )
  if (!el) throw new Error('no vertical scroller in the virtual table')
  return el
}

async function scrollCost(scroller: HTMLElement): Promise<number> {
  const before = await commands.styleRecalcMs()
  for (let i = 0; i < STEPS; i++) {
    scroller.scrollTop += 60
    await frame()
  }
  return (await commands.styleRecalcMs()) - before
}

async function fullRestyleCost(root: HTMLElement): Promise<number> {
  const before = await commands.styleRecalcMs()
  for (let i = 0; i < STEPS; i++) {
    root.style.setProperty('color', i % 2 ? 'currentcolor' : 'canvastext')
    await frame()
  }
  root.style.removeProperty('color')
  return (await commands.styleRecalcMs()) - before
}

describe('virtual DataTable scroll performance (styled)', () => {
  const cases: [string, () => ReturnType<typeof render>][] = [
    ['the documented virtual-rows example', () => render(VirtualRows)],
    [
      'frozen start and end columns',
      () =>
        render(DataTable, {
          props: { data: frozenRows, columns: frozenColumns, virtual: true, maxHeight: '480px' }
        })
    ]
  ]

  it.each(cases)(
    'scrolling 10,000 virtual rows restyles only the rows it mounts (%s)',
    async (_name, mount) => {
      const { getByTestId } = mount()
      const root = getByTestId('data-table')
      await frame()
      await frame()
      const scroller = scrollerIn(root)
      await scrollCost(scroller)
      scroller.scrollTop = 0
      await frame()

      const scroll = await scrollCost(scroller)
      const full = await fullRestyleCost(root)
      const ratio = scroll / full
      const budget = budgets.styleRecalc['data-table-10k-virtual-scroll']
      console.warn(
        `[perf] data-table-10k-virtual-scroll (${_name}): style recalc ${scroll.toFixed(1)} ms over ${STEPS} frames, a full table restyle per frame ${full.toFixed(1)} ms, ratio ${ratio.toFixed(2)} (budget ${budget.maxRatio})`
      )
      if (server.browser !== 'chromium') return
      expect(ratio).toBeLessThanOrEqual(budget.maxRatio)
    }
  )
})

async function sidewaysCost(scroller: HTMLElement): Promise<number> {
  const before = await commands.styleRecalcMs()
  for (let i = 0; i < STEPS; i++) {
    scroller.scrollLeft += i < STEPS / 2 ? 2 : -2
    scroller.dispatchEvent(new Event('scroll'))
    await frame()
  }
  return (await commands.styleRecalcMs()) - before
}

describe('frozen-column DataTable sideways scroll (styled)', () => {
  it('scrolling sideways through the fade ramp toggles the scroll frame state only at the edges', async () => {
    const { container } = render(StickyColumn, { attrs: { style: 'width: 390px' } })
    await frame()
    await frame()
    const scroll = container.querySelector<HTMLElement>('[data-testid$="__scroll"]')!
    const viewport = container.querySelector<HTMLElement>('[data-testid$="__viewport"]')!
    const scroller =
      [viewport, ...viewport.querySelectorAll<HTMLElement>('*')].find(
        (node) => node.scrollWidth > node.clientWidth + 100
      ) ?? viewport
    expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth)
    const writes: string[] = []
    const observer = new MutationObserver((records) => {
      for (const record of records) writes.push(record.attributeName ?? '')
    })
    observer.observe(scroll, { attributeFilter: ['data-overflow-start', 'data-overflow-end'] })

    await sidewaysCost(scroller)
    observer.disconnect()
    expect(writes.length).toBeLessThanOrEqual(2)
    expect(scroll.getAttribute('data-overflow-end')).toBe('')

    const sideways = await sidewaysCost(scroller)
    const full = await fullRestyleCost(scroll)
    const ratio = sideways / full
    const budget = budgets.styleRecalc['data-table-frozen-sideways-scroll']
    console.warn(
      `[perf] data-table-frozen-sideways-scroll: style recalc ${sideways.toFixed(1)} ms over ${STEPS} frames, a full table restyle per frame ${full.toFixed(1)} ms, ratio ${ratio.toFixed(2)} (budget ${budget.maxRatio})`
    )
    if (server.browser !== 'chromium') return
    expect(ratio).toBeLessThanOrEqual(budget.maxRatio)
  })
})
