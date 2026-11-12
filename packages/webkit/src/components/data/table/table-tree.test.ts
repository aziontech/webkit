import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import TreeRows from '../../../../examples/table/tree-rows.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Table from './index'

type Node = { id: string; name: string; children?: Node[] }

const seed = (): Node[] => [
  {
    id: 'a',
    name: 'Alpha',
    children: [
      { id: 'a1', name: 'Zulu', children: [{ id: 'a1x', name: 'Xray' }] },
      { id: 'a2', name: 'Echo' }
    ]
  },
  { id: 'b', name: 'Bravo' }
]

const treeRows = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-tree-row]'))
const ids = (): string[] => treeRows().map((row) => row.getAttribute('data-tree-row') ?? '')
const rowOf = (id: string): HTMLElement =>
  treeRows().find((row) => row.getAttribute('data-tree-row') === id) as HTMLElement
const focusedId = (): string | null =>
  (document.activeElement as HTMLElement | null)?.getAttribute('data-tree-row') ?? null
const press = async (key: string): Promise<void> => {
  await fireEvent.keyDown(document.activeElement as HTMLElement, { key })
  await nextTick()
}

const mountTree = (extra: Record<string, unknown> = {}, dir?: 'rtl') => {
  const expanded = ref<Record<string, boolean> | true>({})
  const selection = ref<Record<string, boolean>>({})
  const selectedCounts: number[] = []
  const Host = defineComponent({
    setup: () => () => {
      const table = h(
        Table,
        {
          data: seed(),
          columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
          rowKey: 'id',
          getSubRows: (row: Record<string, unknown>) => row['children'] as Node[] | undefined,
          expanded: expanded.value,
          'onUpdate:expanded': (next: Record<string, boolean> | true) => (expanded.value = next),
          rowSelection: selection.value,
          'onUpdate:rowSelection': (next: Record<string, boolean>) => (selection.value = next),
          stackable: false,
          'aria-label': 'Accounts',
          ...extra
        },
        {
          toolbar: ({ selectedCount }: { selectedCount: number }) => {
            selectedCounts.push(selectedCount)
            return h('span', { 'data-testid': 'count' }, String(selectedCount))
          }
        }
      )
      return dir ? h('div', { dir }, [table]) : table
    }
  })
  const view = render(Host)
  return { view, expanded, selection, selectedCounts }
}

afterEach(() => cleanup())

describe('Table tree rows', () => {
  it('renders a treegrid with level, set position and expanded state', () => {
    const { view } = mountTree()
    const grid = view.getByRole('treegrid', { name: 'Accounts' })
    expect(grid.getAttribute('data-tree')).toBe('true')
    expect(ids()).toEqual(['a', 'b'])
    const alpha = rowOf('a')
    expect(alpha.getAttribute('aria-level')).toBe('1')
    expect(alpha.getAttribute('aria-setsize')).toBe('2')
    expect(alpha.getAttribute('aria-posinset')).toBe('1')
    expect(alpha.getAttribute('aria-expanded')).toBe('false')
    expect(rowOf('b').hasAttribute('aria-expanded')).toBe(false)
    expect(alpha.getAttribute('tabindex')).toBe('0')
    expect(rowOf('b').getAttribute('tabindex')).toBe('-1')
  })

  it('keeps the plain table untouched without getSubRows', () => {
    const view = render(Table, {
      props: {
        data: seed(),
        columns: [{ accessorKey: 'name', header: 'Name' }],
        stackable: false,
        'aria-label': 'Plain'
      }
    })
    expect(view.getByRole('table', { name: 'Plain' })).toBeTruthy()
    expect(view.queryByRole('treegrid')).toBeNull()
    expect(treeRows()).toHaveLength(0)
    const row = view.getAllByRole('row')[1]
    expect(row.hasAttribute('tabindex')).toBe(false)
    expect(row.hasAttribute('aria-level')).toBe(false)
  })

  it('expands and collapses with the pointer toggle and emits update:expanded', async () => {
    const { view, expanded } = mountTree()
    const toggles = view.getAllByTestId('data-table__expand-toggle')
    expect(toggles).toHaveLength(1)
    expect(toggles[0].closest('[data-tree-gutter]')?.getAttribute('aria-hidden')).toBe('true')
    const gutters = Array.from(document.querySelectorAll<HTMLElement>('[data-tree-gutter]'))
    expect(gutters).toHaveLength(2)
    expect(gutters[1].children).toHaveLength(0)
    await fireEvent.click(toggles[0])
    expect(expanded.value).toEqual({ a: true })
    await waitFor(() => expect(ids()).toEqual(['a', 'a1', 'a2', 'b']))
    const zulu = rowOf('a1')
    expect(zulu.getAttribute('aria-level')).toBe('2')
    expect(zulu.getAttribute('aria-setsize')).toBe('2')
    expect(zulu.getAttribute('aria-posinset')).toBe('1')
    expect(zulu.getAttribute('data-depth')).toBe('1')
    expect(rowOf('a').getAttribute('aria-expanded')).toBe('true')
    await fireEvent.click(view.getAllByTestId('data-table__expand-toggle')[0])
    await waitFor(() => expect(ids()).toEqual(['a', 'b']))
  })

  it('follows the treegrid keyboard map', async () => {
    const { selection } = mountTree({ enableRowSelection: true })
    rowOf('a').focus()
    await press('ArrowRight')
    await waitFor(() => expect(ids()).toEqual(['a', 'a1', 'a2', 'b']))
    expect(focusedId()).toBe('a')
    await press('ArrowRight')
    await waitFor(() => expect(focusedId()).toBe('a1'))
    await press('Enter')
    await waitFor(() => expect(ids()).toEqual(['a', 'a1', 'a1x', 'a2', 'b']))
    await press('ArrowDown')
    await waitFor(() => expect(focusedId()).toBe('a1x'))
    expect(rowOf('a1x').getAttribute('aria-level')).toBe('3')
    await press('ArrowLeft')
    await waitFor(() => expect(focusedId()).toBe('a1'))
    await press('ArrowLeft')
    await waitFor(() => expect(ids()).toEqual(['a', 'a1', 'a2', 'b']))
    await press('End')
    await waitFor(() => expect(focusedId()).toBe('b'))
    await press('ArrowUp')
    await waitFor(() => expect(focusedId()).toBe('a2'))
    await press(' ')
    expect(selection.value).toEqual({ a2: true })
    await press('Home')
    await waitFor(() => expect(focusedId()).toBe('a'))
    expect(rowOf('a').getAttribute('tabindex')).toBe('0')
    expect(rowOf('a2').getAttribute('tabindex')).toBe('-1')
  })

  it('moves focus to the row that collapses over a focused descendant', async () => {
    const { view } = mountTree()
    await fireEvent.click(view.getAllByTestId('data-table__expand-toggle')[0])
    await waitFor(() => expect(ids()).toContain('a2'))
    rowOf('a2').focus()
    await fireEvent.click(view.getAllByTestId('data-table__expand-toggle')[0])
    await waitFor(() => expect(ids()).toEqual(['a', 'b']))
    await waitFor(() => expect(focusedId()).toBe('a'))
  })

  it('selects one row at a time and reports every selected row, nested ones included', async () => {
    const { view, selection, selectedCounts } = mountTree({
      enableRowSelection: true,
      expanded: { a: true }
    })
    await waitFor(() => expect(ids()).toEqual(['a', 'a1', 'a2', 'b']))
    const boxes = view.getAllByRole('checkbox', { name: 'Select row' })
    await fireEvent.click(boxes[0])
    expect(selection.value).toEqual({ a: true })
    await fireEvent.click(view.getAllByRole('checkbox', { name: 'Select row' })[2])
    expect(selection.value).toEqual({ a: true, a2: true })
    await waitFor(() => expect(view.getByTestId('count').textContent).toBe('2'))
    expect(selectedCounts.at(-1)).toBe(2)
  })

  it('sorts siblings and keeps children under their parent', async () => {
    const { view } = mountTree({ expanded: { a: true }, sorting: [{ id: 'name', desc: false }] })
    await waitFor(() => expect(ids()).toEqual(['a', 'a2', 'a1', 'b']))
    expect(view.getByRole('treegrid')).toBeTruthy()
  })

  it('mirrors Arrow Left and Arrow Right under rtl', async () => {
    mountTree({}, 'rtl')
    rowOf('a').focus()
    await press('ArrowLeft')
    await waitFor(() => expect(ids()).toEqual(['a', 'a1', 'a2', 'b']))
    await press('ArrowRight')
    await waitFor(() => expect(ids()).toEqual(['a', 'b']))
  })

  it('leaves keys typed inside a cell control alone', async () => {
    const { view } = mountTree({ enableRowSelection: true })
    const box = view.getAllByRole('checkbox', { name: 'Select row' })[0]
    box.focus()
    await fireEvent.keyDown(box, { key: 'ArrowRight' })
    expect(ids()).toEqual(['a', 'b'])
  })

  it('has no axe violations', async () => {
    const view = render(TreeRows)
    await waitFor(() => expect(treeRows().length).toBeGreaterThan(2))
    await expectNoA11yViolations(view.container)
  })
})
