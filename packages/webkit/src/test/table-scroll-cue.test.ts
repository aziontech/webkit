import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands, page } from 'vitest/browser'
import type { Component } from 'vue'
import { defineComponent, h, nextTick } from 'vue'

import ScanResults from '../../blocks/dashboard/dashboard-scan-results/dashboard-scan-results.vue'
import RulesList from '../../blocks/view/view-rule-list/view-rule-list.vue'
import ViewTable from '../../blocks/view/view-table/view-table.vue'
import DataGridDefault from '../../examples/data-grid/default.vue'
import DataGridReadonly from '../../examples/data-grid/readonly.vue'
import DataGridRowSelection from '../../examples/data-grid/row-selection.vue'
import DataTableDefault from '../../examples/data-table/default.vue'
import DataTableFixedLayout from '../../examples/data-table/fixed-layout-with-column-sizes.vue'
import PropertyFilterCollection from '../../examples/property-filter/with-collection.vue'
import TableCellPresets from '../../examples/table/cell-presets.vue'
import TableDefault from '../../examples/table/default.vue'
import DataTableRoot from '../components/data/data-table/data-table.vue'
import type { TableColumn } from '../components/data/table/injection-key'
import { hostable } from './hostable'

const DataTable = hostable(DataTableRoot)

const rows = [
  { id: '1', name: 'production', origin: 'origin.example.com', region: 'us-east', requests: 137 },
  { id: '2', name: 'staging', origin: 'staging.example.com', region: 'eu-west', requests: 548 },
  { id: '3', name: 'docs-site', origin: 'docs.example.com', region: 'ap-south', requests: 822 }
]

const plainColumns: TableColumn[] = [
  { accessorKey: 'name', header: 'Name', principal: true, width: 160 },
  { accessorKey: 'origin', header: 'Origin', width: 200 },
  { accessorKey: 'region', header: 'Region', width: 120 },
  { accessorKey: 'requests', header: 'Requests', align: 'end', width: 120 }
]

const twoEndFrozen: TableColumn[] = [
  { accessorKey: 'name', header: 'Name', principal: true, width: 160 },
  { accessorKey: 'origin', header: 'Origin', width: 240 },
  { accessorKey: 'region', header: 'Region', width: 160 },
  { id: 'status', header: 'Status', width: 64, frozen: 'end' },
  { id: 'move', header: 'Move', width: 56, frozen: 'end' }
]

const settle = async (): Promise<void> => {
  await nextTick()
  await new Promise((done) => requestAnimationFrame(() => done(null)))
  await new Promise((done) => requestAnimationFrame(() => done(null)))
}

const mount = (child: () => ReturnType<typeof h>, dir: 'ltr' | 'rtl', width = 390) =>
  render(
    defineComponent({
      setup: () => () => h('div', { dir, style: { width: `${width}px` } }, [child()])
    })
  )

const shown = (el: Element | null): boolean => {
  if (!el) return false
  const style = getComputedStyle(el)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

const parts = (container: Element, id: string) => ({
  scroll: container.querySelector<HTMLElement>(`[data-testid="${id}__scroll"]`)!,
  viewport: container.querySelector<HTMLElement>(`[data-testid="${id}__viewport"]`)!,
  start: container.querySelector<HTMLElement>(`[data-testid="${id}__fade-start"]`),
  end: container.querySelector<HTMLElement>(`[data-testid="${id}__fade-end"]`)
})

const scrollTo = async (viewport: HTMLElement, dir: 'ltr' | 'rtl', where: 'middle' | 'end') => {
  const max = viewport.scrollWidth - viewport.clientWidth
  const offset = where === 'end' ? max : Math.round(max / 2)
  viewport.scrollLeft = dir === 'rtl' ? -offset : offset
  viewport.dispatchEvent(new Event('scroll'))
  await settle()
}

const cases: { name: string; id: string; view: () => ReturnType<typeof h> }[] = [
  { name: 'Table', id: 'table', view: () => h(TableDefault as Component) },
  { name: 'DataGrid', id: 'data-grid', view: () => h(DataGridDefault as Component) },
  {
    name: 'DataTable without an actions column',
    id: 'data-table',
    view: () =>
      h(DataTable, { data: rows, columns: plainColumns, rowKey: 'id', ariaLabel: 'Workloads' })
  }
]

afterEach(async () => {
  await commands.emulateMedia({ forcedColors: null })
})

describe('a table that scrolls sideways shows a cue at the hidden edge', () => {
  describe.each(['ltr', 'rtl'] as const)('%s', (dir) => {
    it.each(cases)(
      '$name fades the inline end, then the start once scrolled',
      async ({ id, view }) => {
        const { container } = mount(view, dir, 320)
        await settle()
        const { scroll, viewport, start, end } = parts(container, id)
        expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)

        expect(scroll.dataset['overflowEnd']).toBeTruthy()
        expect(shown(end)).toBe(true)
        expect(getComputedStyle(end!).backgroundImage).toContain('gradient')
        const box = scroll.getBoundingClientRect()
        end!.style.pointerEvents = 'auto'
        const fade = end!.getBoundingClientRect()
        if (dir === 'rtl') expect(fade.left).toBeCloseTo(box.left, 0)
        else expect(fade.right).toBeCloseTo(box.right, 0)
        expect(fade.width).toBe(24)
        expect(shown(start)).toBe(false)

        await scrollTo(viewport, dir, 'middle')
        expect(scroll.dataset['overflowStart']).toBeTruthy()
        expect(shown(start)).toBe(true)
        expect(shown(end)).toBe(true)

        await scrollTo(viewport, dir, 'end')
        expect(scroll.dataset['overflowEnd']).toBeUndefined()
        expect(shown(end)).toBe(false)
        expect(shown(start)).toBe(true)
      }
    )
  })

  it('shows no cue when every column fits', async () => {
    const { container } = mount(
      () =>
        h(DataTable, {
          data: rows,
          columns: plainColumns.slice(0, 2),
          rowKey: 'id',
          ariaLabel: 'Workloads'
        }),
      'ltr',
      1200
    )
    await settle()
    const { start, end } = parts(container, 'data-table')
    expect(shown(start)).toBe(false)
    expect(shown(end)).toBe(false)
  })

  it.each(['ltr', 'rtl'] as const)(
    'puts the end fade beside the frozen end columns, which draw no cut (%s)',
    async (dir) => {
      const { container } = mount(
        () => h(DataTable, { data: rows, columns: twoEndFrozen, rowKey: 'id', ariaLabel: 'Rules' }),
        dir
      )
      await settle()
      const { scroll, end } = parts(container, 'data-table')
      expect(scroll.dataset['overflowEnd']).toBeTruthy()
      const frozen = Array.from(
        container.querySelectorAll<HTMLElement>('[role="columnheader"][data-frozen="end"]')
      ).map((el) => el.getBoundingClientRect())
      const fade = end!.getBoundingClientRect()
      if (dir === 'rtl') expect(fade.left).toBeCloseTo(Math.max(...frozen.map((r) => r.right)), 0)
      else expect(fade.right).toBeCloseTo(Math.min(...frozen.map((r) => r.left)), 0)
    }
  )

  it('starts the DataGrid start fade after its frozen columns', async () => {
    const { container } = mount(() => h(DataGridRowSelection as Component), 'rtl', 320)
    await settle()
    const { scroll, viewport, start } = parts(container, 'data-grid')
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    await scrollTo(viewport, 'rtl', 'middle')
    expect(shown(start)).toBe(true)
    const frozen = Array.from(
      container.querySelectorAll<HTMLElement>('[role="columnheader"][data-frozen]')
    )
    const innerEdge = Math.min(...frozen.map((el) => el.getBoundingClientRect().left))
    expect(start!.getBoundingClientRect().right).toBeCloseTo(innerEdge, 0)
    expect(scroll.getBoundingClientRect().right).toBeGreaterThan(innerEdge)
  })

  it('keeps the fade under forced colors', async () => {
    await commands.emulateMedia({ forcedColors: 'active' })
    const { container } = mount(cases[2]!.view, 'ltr', 320)
    await settle()
    const { end } = parts(container, 'data-table')
    expect(shown(end)).toBe(true)
    expect(getComputedStyle(end!).backgroundImage).toContain('gradient')
  })
})

describe('two frozen end columns keep their own places', () => {
  it.each(['ltr', 'rtl'] as const)('%s at 390px', async (dir) => {
    const { container } = mount(
      () => h(DataTable, { data: rows, columns: twoEndFrozen, rowKey: 'id', ariaLabel: 'Rules' }),
      dir
    )
    await settle()
    const status = container.querySelector<HTMLElement>('[role="columnheader"][data-frozen="end"]')!
    const heads = Array.from(
      container.querySelectorAll<HTMLElement>('[role="columnheader"][data-frozen="end"]')
    )
    expect(heads).toHaveLength(2)
    const [first, second] = heads.map((el) => el.getBoundingClientRect())
    expect(status.style.insetInlineEnd).toBe('56px')
    expect(status.style.left).toBe('')
    expect(status.style.right).toBe('')
    if (dir === 'rtl') {
      expect(first!.left).toBeCloseTo(second!.right, 0)
      expect(second!.left).toBeCloseTo(
        container.querySelector('[data-testid="data-table__viewport"]')!.getBoundingClientRect()
          .left,
        0
      )
    } else {
      expect(first!.right).toBeCloseTo(second!.left, 0)
    }
    const switches = Array.from(
      container.querySelectorAll<HTMLElement>('[role="cell"][data-frozen="end"]')
    )
    for (let i = 0; i + 1 < switches.length; i += 2) {
      const a = switches[i]!.getBoundingClientRect()
      const b = switches[i + 1]!.getBoundingClientRect()
      expect(Math.min(a.right, b.right) - Math.max(a.left, b.left)).toBeLessThanOrEqual(0.5)
    }
  })
})

describe('view/view-rule-list on a phone', () => {
  afterEach(async () => {
    await page.viewport(414, 896)
  })

  it.each(['ltr', 'rtl'] as const)(
    'keeps every on/off switch beside the Move column (%s)',
    async (dir) => {
      await page.viewport(390, 844)
      const { container } = mount(() => h(RulesList as Component), dir, 390)
      await settle()
      await settle()
      const rowsWithSwitch = Array.from(
        container.querySelectorAll<HTMLElement>('[role="row"]')
      ).filter((row) => row.querySelector('[role="switch"]'))
      expect(rowsWithSwitch.length).toBeGreaterThan(0)
      for (const row of rowsWithSwitch) {
        const ends = Array.from(
          row.querySelectorAll<HTMLElement>('[role="cell"][data-frozen="end"]')
        )
        expect(ends).toHaveLength(2)
        const [status, move] = ends.map((el) => el.getBoundingClientRect())
        expect(
          Math.min(status!.right, move!.right) - Math.max(status!.left, move!.left)
        ).toBeLessThanOrEqual(0.5)
        const toggle = row.querySelector<HTMLElement>('[role="switch"]')!.getBoundingClientRect()
        const middle = (toggle.left + toggle.right) / 2
        expect(middle).toBeGreaterThan(status!.left)
        expect(middle).toBeLessThan(status!.right)
      }
    }
  )
})

describe('a fade never covers content that is fully visible', () => {
  it.each([
    { extra: 3, fade: 0 },
    { extra: 10, fade: 10 },
    { extra: 200, fade: 24 }
  ])('a $extra px overflow draws a $fade px fade', async ({ extra, fade }) => {
    const columns: TableColumn[] = [
      { accessorKey: 'name', header: 'Name', principal: true, width: 200 },
      { accessorKey: 'region', header: 'Region', width: 200 + extra }
    ]
    const { container } = mount(
      () => h(DataTable, { data: rows, columns, rowKey: 'id', ariaLabel: 'Workloads' }),
      'ltr',
      400
    )
    await settle()
    const { viewport, end } = parts(container, 'data-table')
    expect(viewport.scrollWidth - viewport.clientWidth).toBe(extra)
    expect(shown(end)).toBe(fade > 0)
    if (fade) expect(end!.getBoundingClientRect().width).toBe(fade)
  })

  describe('blocks whose tables fit at 1280', () => {
    afterEach(async () => {
      await page.viewport(414, 896)
    })

    it.each([
      { name: 'dashboard/dashboard-scan-results', view: ScanResults },
      { name: 'view/view-table', view: ViewTable },
      { name: 'view/view-rule-list', view: RulesList }
    ])('$name shows no fade', async ({ view }) => {
      await page.viewport(1280, 900)
      const { container } = render(view as Component)
      await settle()
      await settle()
      const fades = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-testid$="__fade-start"], [data-testid$="__fade-end"]'
        )
      )
      expect(fades.length).toBeGreaterThan(0)
      for (const fade of fades) expect(shown(fade), fade.dataset['testid']).toBe(false)
    })
  })
})

const endEdge = (viewport: HTMLElement, dir: 'ltr' | 'rtl'): number => {
  const box = viewport.getBoundingClientRect()
  const inner =
    dir === 'rtl'
      ? box.left + viewport.clientLeft
      : box.left + viewport.clientLeft + viewport.clientWidth
  const frozen = Array.from(
    viewport.querySelectorAll<HTMLElement>('[role="columnheader"][data-frozen="end"]')
  ).map((el) => el.getBoundingClientRect())
  if (frozen.length === 0) return inner
  return dir === 'rtl'
    ? Math.max(...frozen.map((r) => r.right))
    : Math.min(...frozen.map((r) => r.left))
}

describe('a column cut at the end edge never shows a partial value', () => {
  it.each([
    { name: 'data-grid/row-selection', id: 'data-grid', view: DataGridRowSelection },
    { name: 'data-grid/readonly', id: 'data-grid', view: DataGridReadonly },
    { name: 'data-table/default', id: 'data-table', view: DataTableDefault },
    {
      name: 'data-table/fixed-layout-with-column-sizes',
      id: 'data-table',
      view: DataTableFixedLayout
    },
    { name: 'property-filter/with-collection', id: 'data-table', view: PropertyFilterCollection },
    { name: 'table/cell-presets', id: 'data-table', view: TableCellPresets }
  ])('$name at 320 and 390', async ({ id, view }) => {
    for (const dir of ['ltr', 'rtl'] as const) {
      for (const width of [320, 390]) {
        const { container, unmount } = mount(() => h(view as Component), dir, width)
        await settle()
        const { viewport, end } = parts(container, id)
        const edge = endEdge(viewport, dir)
        const fade = end!.getBoundingClientRect()
        const covered = dir === 'rtl' ? fade.right : fade.left
        for (const head of viewport.querySelectorAll<HTMLElement>('[role="columnheader"]')) {
          if (head.dataset['frozen']) continue
          const r = head.getBoundingClientRect()
          if (r.left >= edge - 0.5 || r.right <= edge + 0.5) continue
          const slice = dir === 'rtl' ? r.right - edge : edge - r.left
          const label = `${head.textContent?.trim()} ${dir} ${width}`
          const endAligned = head.matches('[data-align=end], :has(> [data-align=end])')
          if (endAligned || slice < r.width / 2) {
            expect(
              Math.abs(covered - (dir === 'rtl' ? r.right : r.left)),
              label
            ).toBeLessThanOrEqual(1)
          }
        }
        unmount()
      }
    }
  })

  it('keeps the Status column in view on a phone in the data-table examples', async () => {
    for (const width of [320, 390]) {
      const { container, unmount } = mount(() => h(DataTableDefault as Component), 'ltr', width)
      await settle()
      const { viewport } = parts(container, 'data-table')
      const status = Array.from(
        viewport.querySelectorAll<HTMLElement>('[role="columnheader"]')
      ).find((el) => el.textContent?.includes('Status'))!
      expect(status.getBoundingClientRect().right).toBeLessThanOrEqual(
        endEdge(viewport, 'ltr') + 0.5
      )
      unmount()
    }
  })
})
