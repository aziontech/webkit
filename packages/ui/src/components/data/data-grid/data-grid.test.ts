import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent as browserEvent } from 'vitest/browser'
import { defineComponent, h, ref } from 'vue'

import Default from '../../../../examples/data-grid/default.vue'
import Readonly from '../../../../examples/data-grid/readonly.vue'
import RowSelection from '../../../../examples/data-grid/row-selection.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { hostable } from '../../../test/hostable'
import DataGridRoot from './data-grid.vue'
import type { DataGridColumn } from './types'

const DataGrid = hostable(DataGridRoot)

type Row = { id: string; name: string; plan: string; seats: number | null; active: boolean }

const seed = (): Row[] => [
  { id: '1', name: 'Acme Inc.', plan: 'pro', seats: 12, active: true },
  { id: '2', name: 'Jane Doe', plan: 'free', seats: 1, active: false },
  { id: '3', name: 'Sam Lee', plan: 'free', seats: 2, active: true }
]

const columns: DataGridColumn[] = [
  { id: 'name', header: 'Name' },
  {
    id: 'plan',
    header: 'Plan',
    type: 'select',
    options: [
      { label: 'Free', value: 'free' },
      { label: 'Pro', value: 'pro' }
    ]
  },
  { id: 'seats', header: 'Seats', type: 'number', align: 'end' },
  { id: 'active', header: 'Active', type: 'boolean' },
  { id: 'id', header: 'ID', editable: false }
]

const mount = (extra: Record<string, unknown> = {}, dir = 'ltr') => {
  const rows = ref<Row[]>(seed())
  const selection = ref<string[]>([])
  const events: Record<string, unknown[][]> = {}
  const record =
    (name: string) =>
    (...args: unknown[]) =>
      (events[name] ??= []).push(args)
  const view = render(
    defineComponent({
      setup: () => () =>
        h('div', { dir }, [
          h(
            DataGrid,
            {
              modelValue: rows.value,
              'onUpdate:modelValue': (next: Row[]) => (rows.value = next),
              selectedKeys: selection.value,
              'onUpdate:selectedKeys': (next: string[]) => (selection.value = next),
              columns,
              ariaLabel: 'Customers',
              onChange: record('change'),
              onRowAdd: record('row-add'),
              onRowRemove: record('row-remove'),
              onCopy: record('copy'),
              ...extra
            },
            {
              toolbar: ({
                add,
                remove
              }: {
                add: (event: Event) => void
                remove: (event: Event) => void
              }) => [
                h('button', { type: 'button', onClick: add }, 'Add row'),
                h('button', { type: 'button', onClick: remove }, 'Delete rows')
              ]
            }
          )
        ])
    })
  )
  const cell = (row: number, id: string): HTMLElement =>
    view.getByTestId(`data-grid__cell-${row}-${id}`)
  return { view, rows, selection, events, cell }
}

const paste = (target: HTMLElement, text: string): ClipboardEvent => {
  const clipboardData = new DataTransfer()
  clipboardData.setData('text/plain', text)
  const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData })
  target.dispatchEvent(event)
  return event
}

describe('DataGrid', () => {
  it('renders the grid pattern with a roving tab stop and the derived test id', async () => {
    const { view, cell } = mount()
    expect(view.getByTestId('data-grid')).toBeTruthy()
    const grid = view.getByRole('grid', { name: 'Customers' })
    expect(grid.getAttribute('aria-rowcount')).toBe('4')
    expect(grid.getAttribute('aria-colcount')).toBe('5')
    expect(view.getAllByRole('columnheader')).toHaveLength(5)
    expect(view.getAllByRole('row')[1]?.getAttribute('aria-rowindex')).toBe('2')
    expect(cell(0, 'name').getAttribute('tabindex')).toBe('0')
    expect(cell(0, 'plan').getAttribute('tabindex')).toBe('-1')
    expect(cell(1, 'seats').getAttribute('aria-colindex')).toBe('3')
    expect(grid.getAttribute('aria-multiselectable')).toBe('true')
    expect(cell(1, 'seats').getAttribute('aria-selected')).toBe('false')
    expect(cell(0, 'name').getAttribute('aria-selected')).toBe('false')
    expect(cell(0, 'name').hasAttribute('data-selected')).toBe(false)
    expect(cell(0, 'id').getAttribute('aria-readonly')).toBe('true')
    expect(cell(0, 'plan').textContent).toContain('Pro')
    expect(cell(1, 'active').textContent).toContain('No')
    await expectNoA11yViolations(view.container)
  })

  it('lets a consumer data-testid win and forwards aria-labelledby to the grid', () => {
    const view = render(
      defineComponent({
        setup: () => () => [
          h('h2', { id: 'title' }, 'Invoices'),
          h(DataGrid, {
            columns,
            modelValue: seed(),
            'data-testid': 'grid',
            'aria-labelledby': 'title',
            'aria-describedby': 'title'
          })
        ]
      })
    )
    expect(view.getByTestId('grid').hasAttribute('aria-labelledby')).toBe(false)
    expect(view.getByTestId('grid__grid').getAttribute('aria-describedby')).toBe('title')
    expect(view.getByRole('grid', { name: 'Invoices' })).toBe(view.getByTestId('grid__grid'))
  })

  it('moves the cursor with the arrows, Home and End, into the header, and Tab leaves the grid', async () => {
    const { view, cell } = mount()
    cell(0, 'name').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(cell(0, 'plan'))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(cell(1, 'plan'))
    expect(cell(1, 'plan').getAttribute('tabindex')).toBe('0')
    expect(cell(0, 'name').getAttribute('tabindex')).toBe('-1')
    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(cell(1, 'id'))
    await userEvent.keyboard('{Control>}{Home}{/Control}')
    expect(document.activeElement).toBe(cell(0, 'name'))
    await userEvent.keyboard('{ArrowUp}')
    const head = view.getByTestId('data-grid__head-name')
    expect(document.activeElement).toBe(head)
    expect(head.getAttribute('tabindex')).toBe('0')
    expect(cell(0, 'name').getAttribute('tabindex')).toBe('-1')
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(cell(0, 'name'))
    const grid = view.getByRole('grid')
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1)
    await userEvent.tab()
    expect(grid.contains(document.activeElement)).toBe(false)
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(cell(0, 'name'))
    await userEvent.tab({ shift: true })
    expect(grid.contains(document.activeElement)).toBe(false)
  })

  it('reaches a resize handle with Enter on its header and returns with Escape', async () => {
    const { view } = mount()
    const head = view.getByTestId('data-grid__head-seats')
    const handle = view.getByTestId('data-grid__resize-seats')
    expect(handle.getAttribute('tabindex')).toBe('-1')
    head.focus()
    await userEvent.keyboard('{Enter}')
    expect(document.activeElement).toBe(handle)
    await userEvent.keyboard('{ArrowRight}{Escape}')
    expect(handle.getAttribute('aria-valuenow')).toBe('176')
    await waitFor(() => expect(document.activeElement).toBe(head))
  })

  it('follows the reading direction under rtl', async () => {
    const { cell } = mount({}, 'rtl')
    cell(0, 'name').focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(cell(0, 'plan'))
  })

  it('edits a text cell with Enter, commits with Enter and moves down', async () => {
    const { view, rows, events, cell } = mount()
    cell(0, 'name').focus()
    await userEvent.keyboard('{Enter}')
    const editor = await view.findByTestId('data-grid__editor')
    expect(document.activeElement).toBe(editor)
    await userEvent.clear(editor)
    await userEvent.type(editor, 'Acme Corp{Enter}')
    expect(rows.value[0]?.name).toBe('Acme Corp')
    const [event, edit] = events['change']?.at(-1) ?? []
    expect(event).toBeInstanceOf(Event)
    expect(edit).toMatchObject({ columnId: 'name', value: 'Acme Corp', previous: 'Acme Inc.' })
    await waitFor(() => expect(document.activeElement).toBe(cell(1, 'name')))
  })

  it('starts editing on a typed character, parses numbers and cancels with Escape', async () => {
    const { view, rows, cell } = mount()
    cell(1, 'seats').focus()
    await userEvent.keyboard('7')
    const editor = (await view.findByTestId('data-grid__editor')) as HTMLInputElement
    expect(editor.value).toBe('7')
    await userEvent.keyboard('{Tab}')
    expect(rows.value[1]?.seats).toBe(7)
    await waitFor(() => expect(document.activeElement).toBe(cell(1, 'active')))
    cell(1, 'id').focus()
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{Enter}')
    const wrap = (await view.findByTestId('data-grid__editor')) as HTMLInputElement
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    expect(wrap.isConnected).toBe(false)
    await waitFor(() => expect(document.activeElement).toBe(cell(1, 'plan')))
    cell(0, 'name').focus()
    await userEvent.keyboard('X{Escape}')
    expect(rows.value[0]?.name).toBe('Acme Inc.')
    expect(view.queryByTestId('data-grid__editor')).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(cell(0, 'name')))
  })

  it('edits a select cell, toggles a boolean with Space and clears with Delete', async () => {
    const { view, rows, cell } = mount()
    cell(0, 'plan').focus()
    await userEvent.keyboard('{Enter}')
    const select = (await view.findByTestId('data-grid__editor')) as HTMLSelectElement
    await userEvent.selectOptions(select, 'free')
    expect(rows.value[0]?.plan).toBe('pro')
    expect(view.getByTestId('data-grid__editor')).toBe(select)
    select.focus()
    await userEvent.keyboard('{Enter}')
    expect(rows.value[0]?.plan).toBe('free')
    cell(1, 'active').focus()
    await userEvent.keyboard(' ')
    expect(rows.value[1]?.active).toBe(true)
    cell(2, 'seats').focus()
    await userEvent.keyboard('{Delete}')
    expect(rows.value[2]?.seats).toBeNull()
  })

  it('opens no editor and writes nothing while readonly or on a read-only column', async () => {
    const { view, rows, events, cell } = mount({ readonly: true })
    expect(view.getByRole('grid').getAttribute('aria-readonly')).toBe('true')
    cell(0, 'name').focus()
    await userEvent.keyboard('{Enter}x{Delete}')
    cell(1, 'active').focus()
    await userEvent.keyboard(' ')
    expect(view.queryByTestId('data-grid__editor')).toBeNull()
    expect(rows.value).toEqual(seed())
    expect(events['change']).toBeUndefined()
    view.unmount()
    const editable = mount()
    editable.cell(0, 'id').focus()
    await userEvent.keyboard('{Enter}')
    expect(editable.view.queryByTestId('data-grid__editor')).toBeNull()
  })

  it('keeps an invalid number in its editor with a message and commits nothing', async () => {
    const { view, rows, events, cell } = mount()
    cell(0, 'seats').focus()
    await userEvent.keyboard('{Enter}')
    const editor = (await view.findByTestId('data-grid__editor')) as HTMLInputElement
    await userEvent.clear(editor)
    await userEvent.type(editor, 'twelve{Enter}')
    expect(rows.value[0]?.seats).toBe(12)
    expect(events['change']).toBeUndefined()
    expect(editor.isConnected).toBe(true)
    expect(editor.getAttribute('aria-invalid')).toBe('true')
    expect(cell(0, 'seats').hasAttribute('data-invalid')).toBe(true)
    const message = view.getByTestId('data-grid__error')
    expect(message.textContent).toBe('Enter a number')
    expect(editor.getAttribute('aria-describedby')).toBe(message.id)
    await userEvent.clear(editor)
    await userEvent.type(editor, '14{Enter}')
    expect(rows.value[0]?.seats).toBe(14)
    expect(view.queryByTestId('data-grid__error')).toBeNull()
  })

  it.each(['Control', 'Meta'])(
    'copies the range through the native copy event on a real %s+C key press',
    async (modifier) => {
      const { events, cell } = mount()
      cell(1, 'name').focus()
      await browserEvent.keyboard('{Shift>}{ArrowRight}{/Shift}')
      await browserEvent.keyboard(`{${modifier}>}c{/${modifier}}`)
      await waitFor(() => expect(events['copy']).toHaveLength(1))
      const [event, text] = events['copy']?.at(-1) ?? []
      expect(event).toBeInstanceOf(ClipboardEvent)
      expect(text).toBe('Jane Doe\tfree')
    }
  )

  it('quotes a copied cell holding a tab, a line break or a quote, so it pastes back as one cell', async () => {
    const { view, rows, events, cell } = mount()
    rows.value = [
      { ...seed()[0]!, name: 'Acme\t"Inc."' },
      { ...seed()[1]!, name: 'Jane\nDoe' },
      seed()[2]!
    ]
    await waitFor(() => expect(cell(0, 'name').textContent).toContain('Acme'))
    cell(0, 'name').focus()
    await browserEvent.keyboard('{Shift>}{ArrowDown}{ArrowRight}{/Shift}')
    const copy = new ClipboardEvent('copy', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer()
    })
    view.getByTestId('data-grid__cell-0-name').dispatchEvent(copy)
    expect(copy.defaultPrevented).toBe(true)
    const text = copy.clipboardData?.getData('text/plain') ?? ''
    expect(text).toBe('"Acme\t""Inc."""\tpro\n"Jane\nDoe"\tfree')
    expect(events['copy']?.at(-1)?.[1]).toBe(text)
    cell(2, 'name').focus()
    paste(cell(2, 'name'), text)
    expect(rows.value[2]).toMatchObject({ name: 'Acme\t"Inc."', plan: 'pro' })
    expect(rows.value[3]).toBeUndefined()
  })

  it('selects a range with Shift and copies it as tab-separated text', async () => {
    const { view, events, cell } = mount()
    cell(0, 'name').focus()
    await userEvent.keyboard('{Shift>}{ArrowDown}{ArrowRight}{/Shift}')
    expect(cell(1, 'plan').getAttribute('aria-selected')).toBe('true')
    expect(cell(0, 'plan').getAttribute('aria-selected')).toBe('true')
    expect(cell(2, 'name').getAttribute('aria-selected')).toBe('false')
    const copy = new ClipboardEvent('copy', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer()
    })
    view.getByTestId('data-grid__cell-1-plan').dispatchEvent(copy)
    const [event, text] = events['copy']?.at(-1) ?? []
    expect(event).toBeInstanceOf(ClipboardEvent)
    expect(text).toBe('Acme Inc.\tpro\nJane Doe\tfree')
    expect(copy.clipboardData?.getData('text/plain')).toBe(text)
  })

  it('pastes a tab-separated block from the cursor in one write with a change per cell', async () => {
    const { view, rows, events, cell } = mount()
    const updates: Row[][] = []
    const watched = render(DataGrid, {
      props: {
        columns,
        modelValue: seed(),
        ariaLabel: 'Watched',
        'data-testid': 'watched',
        'onUpdate:modelValue': (next: Row[]) => updates.push(next)
      }
    })
    const before = seed()
    const target = watched.getByTestId('watched__cell-1-name')
    target.focus()
    const event = paste(target, 'Alex Morgan\tpro\r\nJohn Smith\tBusiness\r\n')
    expect(event.defaultPrevented).toBe(true)
    expect(updates).toHaveLength(1)
    expect(updates[0]?.[0]).toEqual(before[0])
    expect(updates[0]?.[1]).toMatchObject({ name: 'Alex Morgan', plan: 'pro' })
    expect(updates[0]?.[2]).toMatchObject({ name: 'John Smith', plan: 'free' })
    watched.unmount()

    cell(0, 'name').focus()
    paste(cell(0, 'name'), 'Alex Morgan\tpro\nJohn Smith\tfree\n')
    expect(rows.value[0]).toMatchObject({ name: 'Alex Morgan', plan: 'pro' })
    expect(rows.value[1]).toMatchObject({ name: 'John Smith', plan: 'free' })
    expect(rows.value[2]).toEqual(seed()[2])
    const changes = events['change'] ?? []
    expect(changes).toHaveLength(2)
    expect(changes[0]?.[0]).toBeInstanceOf(ClipboardEvent)
    expect(changes[0]?.[1]).toMatchObject({
      columnId: 'name',
      value: 'Alex Morgan',
      previous: 'Acme Inc.',
      row: rows.value[0]
    })
    expect(changes[1]?.[1]).toMatchObject({
      columnId: 'name',
      value: 'John Smith',
      previous: 'Jane Doe'
    })
    await waitFor(() => expect(cell(1, 'plan').getAttribute('aria-selected')).toBe('true'))
    expect(cell(2, 'name').getAttribute('aria-selected')).toBe('false')
    await waitFor(() =>
      expect(view.getByTestId('data-grid__status').textContent?.trim()).toBe('Pasted 4 cells')
    )
    await expectNoA11yViolations(view.container)
  })

  it('anchors at the top-left of the range and clips the block at the last row and column', async () => {
    const { view, rows, cell } = mount()
    cell(2, 'active').focus()
    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}')
    paste(cell(1, 'active'), 'yes\tX9\tspill\nno\tX8\tspill\nyes\tX7\tspill')
    expect(rows.value[1]).toMatchObject({ active: true, id: '2' })
    expect(rows.value[2]).toMatchObject({ active: false, id: '3' })
    expect(rows.value).toHaveLength(3)
    await waitFor(() => expect(cell(2, 'id').getAttribute('aria-selected')).toBe('true'))
    expect(cell(1, 'active').getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(cell(1, 'active'))
    await waitFor(() =>
      expect(view.getByTestId('data-grid__status').textContent?.trim()).toBe(
        'Pasted 2 cells, 2 skipped'
      )
    )
  })

  it('fills every cell of a selected range with a single value', async () => {
    const { rows, events, cell } = mount()
    cell(0, 'seats').focus()
    await userEvent.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')
    paste(cell(2, 'seats'), '5\n')
    expect(rows.value.map((row) => row.seats)).toEqual([5, 5, 5])
    expect(events['change']).toHaveLength(3)
  })

  it('coerces values by column type and skips what does not fit', async () => {
    const { view, rows, cell } = mount()
    cell(0, 'name').focus()
    paste(cell(0, 'name'), '"Acme ""West""\tInc."\tFREE\t1,5\tYES\t99\n\tgold\t\t0\t')
    expect(rows.value[0]).toMatchObject({
      name: 'Acme "West"\tInc.',
      plan: 'free',
      seats: 12,
      active: true,
      id: '1'
    })
    expect(rows.value[1]).toMatchObject({ name: '', plan: 'free', seats: null, active: false })
    await waitFor(() =>
      expect(view.getByTestId('data-grid__status').textContent?.trim()).toBe(
        'Pasted 6 cells, 4 skipped'
      )
    )
  })

  it('pastes nothing while readonly and announces it', async () => {
    const { view, rows, events, cell } = mount({ readonly: true })
    cell(0, 'name').focus()
    paste(cell(0, 'name'), 'Alex Morgan')
    expect(rows.value).toEqual(seed())
    expect(events['change']).toBeUndefined()
    await waitFor(() =>
      expect(view.getByTestId('data-grid__status').textContent?.trim()).toBe(
        'Read-only, nothing pasted'
      )
    )
  })

  it('leaves a paste into an open editor to the editor', async () => {
    const { view, rows, events, cell } = mount()
    cell(0, 'name').focus()
    await userEvent.keyboard('{Enter}')
    const editor = await view.findByTestId('data-grid__editor')
    const event = paste(editor, 'Alex\tMorgan')
    expect(event.defaultPrevented).toBe(false)
    expect(rows.value).toEqual(seed())
    expect(events['change']).toBeUndefined()
  })

  it('selects rows with the checkbox column, Space and Select all', async () => {
    const { view, selection } = mount({ selectable: true })
    expect(
      within(view.getByTestId('data-grid__select-1')).getByRole('checkbox')
    ).toHaveAccessibleName('Select row Jane Doe')
    view.getByTestId('data-grid__select-0').focus()
    await userEvent.keyboard(' ')
    expect(selection.value).toEqual(['1'])
    expect(view.getAllByRole('row')[1]?.getAttribute('aria-selected')).toBe('true')
    await userEvent.click(within(view.getByTestId('data-grid__select-all')).getByRole('checkbox'))
    expect(selection.value).toEqual(['1', '2', '3'])
    await expectNoA11yViolations(view.container)
  })

  it('emits row-add and row-remove with the selected rows from the toolbar', async () => {
    const { view, events } = mount({ selectable: true })
    await userEvent.click(view.getByRole('button', { name: 'Delete rows' }))
    expect(events['row-remove']).toBeUndefined()
    await userEvent.click(view.getByRole('button', { name: 'Add row' }))
    expect(events['row-add']?.[0]?.[0]).toBeInstanceOf(Event)
    view.getByTestId('data-grid__select-1').focus()
    await userEvent.keyboard(' ')
    await userEvent.click(view.getByRole('button', { name: 'Delete rows' }))
    const [event, removed] = events['row-remove']?.[0] ?? []
    expect(event).toBeInstanceOf(Event)
    expect(removed).toEqual([seed()[1]])
  })

  it('resizes a column from its separator with the keyboard', async () => {
    const { view } = mount()
    const handle = view.getByTestId('data-grid__resize-name')
    expect(handle.getAttribute('role')).toBe('separator')
    expect(handle).toHaveAccessibleName('Resize Name')
    expect(handle.getAttribute('aria-valuenow')).toBe('160')
    expect(handle.getAttribute('aria-valuemax')).toBe('960')
    handle.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    expect(handle.getAttribute('aria-valuenow')).toBe('192')
    await userEvent.keyboard('{ArrowLeft}')
    expect(handle.getAttribute('aria-valuenow')).toBe('176')
  })

  it('pins the first column and shows the empty state with no rows', async () => {
    const { cell } = mount({ frozenFirstColumn: true })
    expect(cell(0, 'name').getAttribute('data-frozen')).toBe('start')
    expect(cell(0, 'plan').hasAttribute('data-frozen')).toBe(false)
    const empty = render(DataGrid, { props: { columns, modelValue: [], ariaLabel: 'Empty' } })
    expect(empty.getByTestId('data-grid__empty').textContent).toContain('No rows yet')
    const grid = within(empty.container as HTMLElement).getByRole('grid')
    expect(grid.getAttribute('aria-rowcount')).toBe('1')
    expect(within(grid).getAllByRole('row')).toHaveLength(1)
    await expectNoA11yViolations(empty.container)
  })

  it('renders the documented examples', async () => {
    for (const Example of [Default, RowSelection, Readonly]) {
      const view = render(Example)
      expect(view.getByRole('grid')).toBeTruthy()
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
    const readonly = render(Readonly)
    const first = readonly.getAllByRole('gridcell')[0] as HTMLElement
    await fireEvent.dblClick(first)
    expect(readonly.queryByTestId('data-grid__editor')).toBeNull()
  })

  it('asks before the row-selection example deletes rows, and names the count', async () => {
    const view = render(RowSelection)
    const checkboxes = view.getAllByRole('checkbox', { name: /Select row/ })
    await userEvent.click(checkboxes[0] as HTMLElement)
    await userEvent.click(checkboxes[1] as HTMLElement)
    await userEvent.click(view.getByRole('button', { name: 'Delete 2 rows' }))
    expect(view.getAllByRole('row')).toHaveLength(4)
    const dialog = await within(document.body).findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete records' }))
    await waitFor(() => expect(view.getAllByRole('row')).toHaveLength(2))
  })
})
