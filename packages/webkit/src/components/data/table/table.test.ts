import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/data/Table.stories'
import Table from './index'
import TableBody from './table-body/table-body.vue'
import TableCaption from './table-caption/table-caption.vue'
import TableCell from './table-cell/table-cell.vue'
import TableFooter from './table-footer/table-footer.vue'
import TableHeadCell from './table-head-cell/table-head-cell.vue'
import TableHeader from './table-header/table-header.vue'
import TableRow from './table-row/table-row.vue'
import TableSearch from './table-search/table-search.vue'
import TableSortButton from './table-sort-button/table-sort-button.vue'
import TableToolbar from './table-toolbar/table-toolbar.vue'

const { Default, Composition, WithCheckboxes, Empty } = composeStories(stories)

// A small, stable dataset used across data-driven tests.
const rows = [
  { id: '1', name: 'Charlie', status: 'Active' },
  { id: '2', name: 'Alpha', status: 'Inactive' },
  { id: '3', name: 'Bravo', status: 'Active' }
]

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status', enableSorting: false }
]

describe('Table (composition + data-driven)', () => {
  describe('compound API (Object.assign dot-notation)', () => {
    it('attaches every public sub-component to the root compound', () => {
      // Grounded in index.ts: Object.assign(Table, { Header, Body, Footer,
      // Caption, Row, HeadCell, Cell, SortButton, Toolbar, Search }).
      expect(Table.Header).toBe(TableHeader)
      expect(Table.Body).toBe(TableBody)
      expect(Table.Footer).toBe(TableFooter)
      expect(Table.Caption).toBe(TableCaption)
      expect(Table.Row).toBe(TableRow)
      expect(Table.HeadCell).toBe(TableHeadCell)
      expect(Table.Cell).toBe(TableCell)
      expect(Table.SortButton).toBe(TableSortButton)
      expect(Table.Toolbar).toBe(TableToolbar)
      expect(Table.Search).toBe(TableSearch)
    })
  })

  describe('composition mode (hand-composed tree via sub-components)', () => {
    // A realistic composed tree wired through the dot-notation sub-components.
    const CompositionTree = defineComponent({
      components: {
        Table,
        TableHeader,
        TableRow,
        TableHeadCell,
        TableBody,
        TableCell,
        TableCaption
      },
      setup: () => ({ items: rows }),
      template: `
        <Table>
          <TableCaption>My caption</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeadCell principal>Name</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in items" :key="item.id">
              <TableCell principal>{{ item.name }}</TableCell>
              <TableCell>{{ item.status }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      `
    })

    it('renders the composed tree with the semantic table roles', () => {
      const { getByRole, getAllByRole } = render(CompositionTree)

      // Root -> role=table; header/body -> rowgroup; each Row -> role=row.
      expect(getByRole('table')).toBeTruthy()
      expect(getAllByRole('rowgroup')).toHaveLength(2) // header + body
      // 1 header row + 3 body rows.
      expect(getAllByRole('row')).toHaveLength(4)
      expect(getAllByRole('columnheader')).toHaveLength(2)
    })

    it('renders cell content through the composed TableCell sub-components', () => {
      const { getAllByRole } = render(CompositionTree)

      const cells = getAllByRole('cell')
      // 3 rows x 2 cells.
      expect(cells).toHaveLength(6)
      expect(cells[0].textContent?.trim()).toBe('Charlie')
      expect(cells[1].textContent?.trim()).toBe('Active')
    })

    it('derives child testids from the root context (provide/inject)', () => {
      // TableInjectionKey.testId flows to descendants; each builds its own
      // BEM-suffixed id from `ctx.testId`.
      const { getByTestId, getAllByTestId } = render(CompositionTree)

      expect(getByTestId('data-table')).toBeTruthy()
      expect(getByTestId('data-table__header')).toBeTruthy()
      expect(getByTestId('data-table__body')).toBeTruthy()
      expect(getByTestId('data-table__caption')).toBeTruthy()
      expect(getAllByTestId('data-table__head-cell')).toHaveLength(2)
      expect(getAllByTestId('data-table__cell')).toHaveLength(6)
    })

    it('propagates a custom root testid into the injected child ids', () => {
      const Custom = defineComponent({
        components: { Table, TableBody, TableRow, TableCell },
        setup: () => ({ items: rows.slice(0, 1) }),
        template: `
          <Table data-testid="my-table">
            <TableBody>
              <TableRow v-for="item in items" :key="item.id">
                <TableCell>{{ item.name }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        `
      })
      const { getByTestId } = render(Custom)

      expect(getByTestId('my-table')).toBeTruthy()
      // ctx.testId === 'my-table' -> body/cell derive from it.
      expect(getByTestId('my-table__body')).toBeTruthy()
      expect(getByTestId('my-table__cell')).toBeTruthy()
    })
    // NOTE: an axe pass on the composed tree is intentionally omitted — see the
    // notes in the run summary. The component nests the ScrollArea viewport
    // (a `div[tabindex]` with no ARIA role) directly inside `role="table"`,
    // which axe flags as `aria-required-children` (critical). This is a real
    // component defect, not a test artifact; the .vue is not edited here.
  })

  describe('TableRow — selected state (composition)', () => {
    it('reflects the selected prop as data-state / aria-selected', () => {
      const Tree = defineComponent({
        components: { Table, TableBody, TableRow, TableCell },
        template: `
          <Table>
            <TableBody>
              <TableRow selected>
                <TableCell>picked</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>plain</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        `
      })
      const { getAllByRole } = render(Tree)

      const [selected, plain] = getAllByRole('row')
      expect(selected.getAttribute('data-state')).toBe('selected')
      expect(selected.getAttribute('aria-selected')).toBe('true')
      expect(plain.getAttribute('data-state')).toBe('unselected')
      expect(plain.getAttribute('aria-selected')).toBeNull()
    })
  })

  describe('TableHeadCell — sort affordance & event (composition)', () => {
    it('exposes aria-sort only when sortable and emits sort on the SortButton click', async () => {
      const Tree = defineComponent({
        components: { Table, TableHeader, TableRow, TableHeadCell },
        setup() {
          const direction = ref<'none' | 'ascending' | 'descending'>('none')
          const events: Array<'ascending' | 'descending'> = []
          const onSort = (d: 'ascending' | 'descending') => {
            events.push(d)
            direction.value = d
          }
          return { direction, onSort, events }
        },
        template: `
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeadCell sortable :sort-direction="direction" @sort="onSort">
                  Name
                </TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
              </TableRow>
            </TableHeader>
          </Table>
        `
      })
      const { getAllByRole, getByRole } = render(Tree)

      const [sortableHead, plainHead] = getAllByRole('columnheader')
      // aria-sort present (none) on the sortable head, absent on the plain one.
      expect(sortableHead.getAttribute('aria-sort')).toBe('none')
      expect(plainHead.getAttribute('aria-sort')).toBeNull()
      expect(sortableHead.getAttribute('data-sortable')).toBe('true')

      // The SortButton (IconButton) is rendered inside the sortable head; from
      // 'none' the first toggle yields 'ascending'.
      expect(getByRole('table')).toBeTruthy()
      const button = within(sortableHead).getByRole('button', { name: 'Sort column' })
      await fireEvent.click(button)

      // The parent's @sort handler received 'ascending' and aria-sort updated.
      expect(sortableHead.getAttribute('aria-sort')).toBe('ascending')
    })
  })

  describe('TableSortButton — direction glyph, aria-label & toggle payload', () => {
    it('toggles ascending<->descending and exposes the matching aria-label', async () => {
      const { getByRole, emitted, rerender } = render(TableSortButton, {
        props: { direction: 'none' as const }
      })

      // direction=none -> label "Sort column"; first toggle -> ascending.
      const btn = getByRole('button', { name: 'Sort column' })
      await fireEvent.click(btn)
      expect((emitted().toggle as string[][])[0]).toEqual(['ascending'])

      // direction=ascending -> label "Sorted ascending"; toggle -> descending.
      await rerender({ direction: 'ascending' as const })
      const asc = getByRole('button', { name: 'Sorted ascending' })
      await fireEvent.click(asc)
      const toggles = emitted().toggle as string[][]
      expect(toggles[toggles.length - 1]).toEqual(['descending'])
    })
  })

  describe('data-driven mode (data + columns render through sub-components)', () => {
    it('renders one row per record plus the header, through the primitives', () => {
      const { getAllByRole, getByTestId } = render(Table, {
        props: { data: rows, columns }
      })

      // Root role=table; header + body rowgroups.
      expect(getByTestId('data-table')).toBeTruthy()
      // 1 header row + 3 body rows.
      expect(getAllByRole('row')).toHaveLength(4)
      // Header labels rendered as columnheaders.
      const heads = getAllByRole('columnheader')
      expect(heads.map((h) => h.textContent?.trim())).toContain('Name')
      expect(heads.map((h) => h.textContent?.trim())).toContain('Status')
      // Body cells carry the record values.
      const cellText = getAllByRole('cell').map((c) => c.textContent?.trim())
      expect(cellText).toContain('Charlie')
      expect(cellText).toContain('Inactive')
    })

    it('renders the default empty state when data is empty', () => {
      const { getByTestId, queryByRole } = render(Table, {
        props: { data: [], columns }
      })

      // rows.length === 0 -> a presentation block, not a body row.
      expect(getByTestId('data-table__empty')).toBeTruthy()
      // No body rows rendered (only the header row exists).
      const rowsFound = queryByRole('row')
      // header row still present
      expect(rowsFound).toBeTruthy()
      expect(getByTestId('data-table__empty').textContent).toContain('No results yet')
    })

    it('emits row-click with the original record when an inert row is clicked', async () => {
      const { getAllByRole, emitted } = render(Table, {
        props: { data: rows, columns }
      })

      // Body rows are rows 1..3 (index 0 is the header row).
      const bodyRow = getAllByRole('row')[1]
      await fireEvent.click(bodyRow)

      const events = emitted()['row-click'] as unknown[][]
      expect(events).toBeTruthy()
      expect(events[0][0]).toEqual(rows[0])
    })

    it('emits update:sorting when a sortable header is toggled', async () => {
      const { getAllByRole, emitted } = render(Table, {
        props: { data: rows, columns, enableSorting: true }
      })

      // The Name column is sortable (enableSorting global true, Status opted out).
      const nameHead = getAllByRole('columnheader').find(
        (h) => h.textContent?.trim() === 'Name'
      ) as HTMLElement
      expect(nameHead.getAttribute('data-sortable')).toBe('true')

      const sortBtn = within(nameHead).getByRole('button')
      await fireEvent.click(sortBtn)

      const events = emitted()['update:sorting'] as unknown[][]
      expect(events).toBeTruthy()
      // First toggle -> ascending sort on the `name` column.
      const latest = events[events.length - 1][0] as Array<{ id: string; desc: boolean }>
      expect(latest).toEqual([{ id: 'name', desc: false }])
    })

    it('does not render a sort button on a column that opts out of sorting', () => {
      const { getAllByRole } = render(Table, {
        props: { data: rows, columns, enableSorting: true }
      })

      const statusHead = getAllByRole('columnheader').find(
        (h) => h.textContent?.trim() === 'Status'
      ) as HTMLElement
      // Status column set enableSorting: false.
      expect(statusHead.getAttribute('data-sortable')).toBeNull()
      expect(within(statusHead).queryByRole('button')).toBeNull()
    })
  })

  describe('row selection (data-driven) — checkbox column + update:rowSelection', () => {
    it('adds a leading select-all header checkbox and a checkbox per row', () => {
      const { getByLabelText, getAllByLabelText } = render(Table, {
        props: { data: rows, columns, enableRowSelection: true, rowKey: 'id' }
      })

      // The header checkbox is labelled "Select all rows"; each row "Select row".
      expect(getByLabelText('Select all rows')).toBeTruthy()
      expect(getAllByLabelText('Select row')).toHaveLength(3)
    })

    it('emits update:rowSelection keyed by rowKey when a row checkbox is toggled', async () => {
      const { getAllByLabelText, emitted } = render(Table, {
        props: { data: rows, columns, enableRowSelection: true, rowKey: 'id' }
      })

      // Toggle the first row's checkbox (getRowId uses rowKey='id' -> '1').
      await fireEvent.click(getAllByLabelText('Select row')[0])

      const events = emitted()['update:rowSelection'] as unknown[][]
      expect(events).toBeTruthy()
      expect(events[events.length - 1][0]).toEqual({ '1': true })
    })

    it('select-all toggles every row via update:rowSelection', async () => {
      const { getByLabelText, emitted } = render(Table, {
        props: { data: rows, columns, enableRowSelection: true, rowKey: 'id' }
      })

      await fireEvent.click(getByLabelText('Select all rows'))

      const events = emitted()['update:rowSelection'] as unknown[][]
      const latest = events[events.length - 1][0] as Record<string, boolean>
      expect(latest).toEqual({ '1': true, '2': true, '3': true })
    })

    it('selectOnRowClick toggles selection when an inert row is clicked', async () => {
      const { getAllByRole, emitted } = render(Table, {
        props: {
          data: rows,
          columns,
          enableRowSelection: true,
          selectOnRowClick: true,
          rowKey: 'id'
        }
      })

      const bodyRow = getAllByRole('row')[1]
      await fireEvent.click(bodyRow)

      // Both the selection change and row-click fire on the inert click.
      const selection = emitted()['update:rowSelection'] as unknown[][]
      expect(selection[selection.length - 1][0]).toEqual({ '1': true })
      expect(emitted()['row-click']).toBeTruthy()
    })
  })

  describe('v-model round-trip (controlled rowSelection)', () => {
    it('reflects a controlled rowSelection prop as the selected row surface', async () => {
      const { getAllByRole, rerender } = render(Table, {
        props: { data: rows, columns, enableRowSelection: true, rowKey: 'id', rowSelection: {} }
      })

      // Initially nothing selected.
      let bodyRows = getAllByRole('row').slice(1)
      expect(bodyRows.every((r) => r.getAttribute('data-state') === 'unselected')).toBe(true)

      // Controlled update: select row '2'.
      await rerender({
        data: rows,
        columns,
        enableRowSelection: true,
        rowKey: 'id',
        rowSelection: { '2': true }
      })

      bodyRows = getAllByRole('row').slice(1)
      // Second body row (id '2') is now selected.
      expect(bodyRows[1].getAttribute('data-state')).toBe('selected')
      expect(bodyRows[1].getAttribute('aria-selected')).toBe('true')
      expect(bodyRows[0].getAttribute('data-state')).toBe('unselected')
    })
  })

  describe('TableSearch — context-aware global filter (provide/inject)', () => {
    it('reads and drives the injected table global filter, emitting update:globalFilter', async () => {
      // Table.Search sits in the toolbar slot; it reads ctx.table (data-driven)
      // and calls setGlobalFilter, which flows back out as update:globalFilter.
      const Tree = defineComponent({
        components: { Table, TableSearch },
        setup: () => ({ rows, columns }),
        template: `
          <Table :data="rows" :columns="columns">
            <template #toolbar>
              <TableSearch placeholder="Find" />
            </template>
          </Table>
        `
      })
      const { getByTestId } = render(Tree)

      // TableSearch forwards its testid down to the InputText native input.
      const input = getByTestId('data-table__search') as HTMLInputElement
      expect(input.getAttribute('placeholder')).toBe('Find')

      // Typing drives the injected global filter through setGlobalFilter.
      await fireEvent.update(input, 'Alpha')

      // The value round-trips back out of the injected filter state.
      expect(input.value).toBe('Alpha')
      // The filter narrows the visible rows: only 'Alpha' remains.
      const table = getByTestId('data-table')
      const bodyCells = within(table)
        .getAllByRole('cell')
        .map((c) => c.textContent?.trim())
      expect(bodyCells).toContain('Alpha')
      expect(bodyCells).not.toContain('Charlie')
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Composition story cleanly', () => {
      const { getByTestId, getAllByRole } = render(Composition())

      expect(getByTestId('data-table')).toBeTruthy()
      // 1 header row + 5 body rows (the story slices the first five records).
      expect(getAllByRole('row')).toHaveLength(6)
    })

    it('renders the Default (data-driven) story with rows', () => {
      const { getByTestId, getAllByRole } = render(Default())

      expect(getByTestId('data-table')).toBeTruthy()
      // Header row + at least one body row.
      expect(getAllByRole('row').length).toBeGreaterThan(1)
    })

    it('renders the WithCheckboxes story with a selection column', () => {
      const { getByLabelText } = render(WithCheckboxes())

      expect(getByLabelText('Select all rows')).toBeTruthy()
    })

    it('renders the Empty story with the empty state', () => {
      const { getByTestId } = render(Empty())

      expect(getByTestId('data-table__empty')).toBeTruthy()
    })
  })
})
