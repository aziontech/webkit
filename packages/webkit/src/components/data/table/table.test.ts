import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Composition from '../../../../examples/table/composition.vue'
import Default from '../../../../examples/table/default.vue'
import Empty from '../../../../examples/table/empty.vue'
import StackedRows from '../../../../examples/table/stacked-rows.vue'
import WithCheckboxes from '../../../../examples/table/with-checkboxes.vue'
import { useCollection } from '../../../composables/use-collection'
import { expectNoA11yViolations } from '../../../test/axe'
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
    it('keeps the toolbar, scroll viewport, empty state and pagination outside role="table"', async () => {
      const view = render(Table, {
        attrs: { 'aria-label': 'Domains' },
        props: {
          data: Array.from({ length: 12 }, (_, i) => ({ id: String(i), name: `Row ${i}` })),
          columns: [{ accessorKey: 'name', header: 'Name' }],
          paginated: true,
          pageSize: 5,
          enableRowSelection: true
        },
        slots: { toolbar: '<button type="button">Refresh</button>' }
      })
      const table = view.getByRole('table')
      expect(table.getAttribute('aria-label')).toBe('Domains')
      expect(view.getByTestId('data-table').hasAttribute('aria-label')).toBe(false)
      expect(table.contains(view.getByTestId('data-table__viewport'))).toBe(false)
      expect(table.contains(view.getByRole('navigation'))).toBe(false)
      expect(table.contains(view.getByText('Refresh'))).toBe(false)
      await expectNoA11yViolations(view.container)

      const empty = render(Table, {
        props: { data: [], columns: [{ accessorKey: 'name', header: 'Name' }] }
      })
      const emptyTable = empty.getAllByRole('table').at(-1) as HTMLElement
      expect(emptyTable.contains(empty.getByTestId('data-table__empty'))).toBe(false)
      await expectNoA11yViolations(empty.container)
    })

    describe('accessibility — the table owns only its caption and row groups', () => {
      it('keeps the toolbar, the focusable viewport and the footer outside role=table', () => {
        const { getByRole, getByTestId } = render(Table, {
          props: { data: rows, columns, paginated: true, pageSize: 2, 'aria-label': 'Domains' },
          slots: { toolbar: '<button type="button">Refresh</button>', caption: 'Three domains' }
        })

        const table = getByRole('table', { name: 'Domains' })
        expect(table).toBe(getByTestId('data-table__table'))
        expect(getByTestId('data-table').hasAttribute('aria-label')).toBe(false)
        expect(table.contains(getByTestId('data-table__viewport'))).toBe(false)
        expect(table.contains(getByTestId('data-table__footer'))).toBe(false)
        expect(table.contains(getByRole('button', { name: 'Refresh' }))).toBe(false)
        expect(getByTestId('data-table__footer').getAttribute('role')).toBeNull()
      })

      it('is named by its caption unless the consumer names it', async () => {
        // A composed caption registers while it mounts, after the table's
        // first render; the data-driven caption names the table from the start.
        const composed = render(CompositionTree)
        const caption = composed.getByTestId('data-table__caption')
        expect(caption.hasAttribute('role')).toBe(false)
        expect(await composed.findByRole('table', { name: 'My caption' })).toBeTruthy()
        composed.unmount()

        const captioned = render(Table, {
          props: { data: rows, columns },
          slots: { caption: 'Three domains' }
        })
        expect(captioned.getByRole('table', { name: 'Three domains' })).toBeTruthy()
        captioned.unmount()

        const named = render(Table, {
          props: { data: rows, columns, 'aria-label': 'Domains' },
          slots: { caption: 'Three domains' }
        })
        expect(named.getByRole('table', { name: 'Domains' })).toBeTruthy()
      })

      it('has no a11y violations: composed, data-driven with toolbar, caption and pagination, and empty', async () => {
        const composed = render(CompositionTree)
        await expectNoA11yViolations(composed.container)
        composed.unmount()

        const narrow = render(
          defineComponent({
            components: { Table },
            setup: () => ({ rows, columns }),
            template: `
            <div style="width: 240px">
              <Table :data="rows" :columns="columns" paginated :page-size="2" aria-label="Domains">
                <template #toolbar><button type="button">Refresh</button></template>
                <template #caption>Three domains</template>
              </Table>
            </div>
          `
          })
        )
        await expectNoA11yViolations(narrow.container)
        narrow.unmount()

        const empty = render(Table, { props: { data: [], columns, 'aria-label': 'Domains' } })
        await expectNoA11yViolations(empty.container)
      })
    })
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

    it('sets data-border only when bordered is true', () => {
      const flush = render(Table, { props: { data: rows, columns } })
      expect(flush.getByTestId('data-table').hasAttribute('data-border')).toBe(false)
      flush.unmount()

      const framed = render(Table, { props: { data: rows, columns, bordered: true } })
      expect(framed.getByTestId('data-table').hasAttribute('data-border')).toBe(true)
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
      // row-click emits (event, row): the originating MouseEvent, then the record.
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
      expect(events[0][1]).toEqual(rows[0])
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

    it('rowSelectable leaves a rejected row without a checkbox, row click or select-all', async () => {
      const { getAllByLabelText, getByLabelText, getAllByRole, emitted } = render(Table, {
        props: {
          data: rows,
          columns,
          enableRowSelection: true,
          selectOnRowClick: true,
          rowKey: 'id',
          rowSelectable: (row: Record<string, unknown>) => row.id !== '1' && row.id !== 1
        }
      })

      expect(getAllByLabelText('Select row')).toHaveLength(2)
      await fireEvent.click(getAllByRole('row')[1])
      expect(emitted()['update:rowSelection']).toBeUndefined()
      expect(emitted()['row-click']).toBeTruthy()

      await fireEvent.click(getByLabelText('Select all rows'))
      const events = emitted()['update:rowSelection'] as unknown[][]
      expect(events[events.length - 1][0]).toEqual({ '2': true, '3': true })
      expect(getByLabelText('Select all rows')).toBeChecked()
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

      // TableSearch forwards its testid down to the Input native input.
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

    // `size` is bound BEFORE v-bind="$attrs" on the inner Input, so the
    // default is a default rather than a hard-code. Bound after, it would
    // clobber the consumer's value and a search field could never sit level
    // with a row of large toolbar controls.
    it('defaults to the small field but lets a consumer override the size', () => {
      const treeWith = (attrs: string) =>
        defineComponent({
          components: { Table, TableSearch },
          setup: () => ({ rows, columns }),
          template: `
            <Table :data="rows" :columns="columns">
              <template #toolbar>
                <TableSearch ${attrs} />
              </template>
            </Table>
          `
        })

      const bare = render(treeWith(''))
      const defaulted = within(bare.container).getByTestId('data-table__search')
      expect(defaulted.closest('[data-size]')?.getAttribute('data-size')).toBe('small')

      const overridden = render(treeWith('size="large"'))
      const large = within(overridden.container).getByTestId('data-table__search')
      expect(large.closest('[data-size]')?.getAttribute('data-size')).toBe('large')
    })
  })

  describe('minWidth columns — measured once per column, applied to header and body', () => {
    // The declared number is a FLOOR: the column resolves to the larger of it and
    // the widest of its own header and rendered cells. These assertions read the
    // inline width our own measurement writes — not a computed style derived from a
    // utility class — so they are meaningless unless the measurement actually ran.
    const inlineWidth = (el: Element): number | null => {
      const px = /width:\s*(\d+(?:\.\d+)?)px/.exec(el.getAttribute('style') ?? '')
      return px ? Number(px[1]) : null
    }

    it('resolves ONE width for the column — the header and every body cell agree', async () => {
      const { getAllByRole } = render(Table, {
        props: {
          data: rows,
          columns: [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'status', header: 'Status', minWidth: 40 }
          ]
        }
      })

      await waitFor(() => {
        const head = getAllByRole('columnheader')[1]
        expect(inlineWidth(head)).not.toBeNull()
      })

      const resolved = inlineWidth(getAllByRole('columnheader')[1])
      expect(resolved).toBeGreaterThanOrEqual(40)
      // Every body cell in that column carries the same width — the invariant a
      // per-cell `min-width` would break (each row sizing to its own content).
      const statusCells = getAllByRole('row')
        .slice(1)
        .map((row) => row.children[1] as HTMLElement)
      expect(statusCells).toHaveLength(3)
      for (const cell of statusCells) expect(inlineWidth(cell)).toBe(resolved)
    })

    it('grows past the floor when the content is wider, and never below it', async () => {
      const long = 'Cross-Site Scripting (XSS) and several more threat types'
      const { getAllByRole } = render(Table, {
        props: {
          data: [{ id: '1', name: 'One', status: long }],
          columns: [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'status', header: 'Status', minWidth: 8 }
          ]
        }
      })

      await waitFor(() => {
        expect(inlineWidth(getAllByRole('columnheader')[1])).not.toBeNull()
      })
      // The floor is 8px; the cell holds a long string, so content decides.
      const resolved = inlineWidth(getAllByRole('columnheader')[1]) as number
      expect(resolved).toBeGreaterThan(8)
      expect(inlineWidth(getAllByRole('row')[1].children[1])).toBe(resolved)
    })

    it('lets an explicit width win over the floor, and leaves other columns flexible', async () => {
      const { getAllByRole } = render(Table, {
        props: {
          data: rows,
          columns: [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'status', header: 'Status', minWidth: 40, width: 123 }
          ]
        }
      })

      await waitFor(() => {
        expect(inlineWidth(getAllByRole('columnheader')[1])).toBe(123)
      })
      // A column that declares neither stays flex-distributed (no inline width).
      expect(inlineWidth(getAllByRole('columnheader')[0])).toBeNull()
    })
  })

  describe('documented examples', () => {
    it('renders the Composition story cleanly', () => {
      const { getByTestId, getAllByRole } = render(Composition)

      expect(getByTestId('data-table')).toBeTruthy()
      // 1 header row + 5 body rows (the story slices the first five records).
      expect(getAllByRole('row')).toHaveLength(6)
    })

    it('renders the Default (data-driven) story with rows', () => {
      const { getByTestId, getAllByRole } = render(Default)

      expect(getByTestId('data-table')).toBeTruthy()
      // Header row + at least one body row.
      expect(getAllByRole('row').length).toBeGreaterThan(1)
    })

    it('renders the WithCheckboxes story with a selection column', () => {
      const { getByLabelText } = render(WithCheckboxes)

      expect(getByLabelText('Select all rows')).toBeTruthy()
    })

    it('renders the Empty story with the empty state', () => {
      const { getByTestId } = render(Empty)

      expect(getByTestId('data-table__empty')).toBeTruthy()
    })
  })

  describe('stacked rows in a narrow box', () => {
    const mountIn = (width: number, props: Record<string, unknown> = {}) => {
      const host = document.createElement('div')
      host.style.width = `${width}px`
      document.body.appendChild(host)
      return render(Table, { props: { columns, data: rows, ...props }, container: host })
    }

    it('keeps the scrolling grid on a phone by default, as the console does', async () => {
      const view = mountIn(320)
      await waitFor(() => expect(view.getAllByRole('row').length).toBe(rows.length + 1))

      expect(view.getByTestId('data-table').hasAttribute('data-stacked')).toBe(false)
      expect(view.queryByTestId('data-table__stacked-label')).toBeNull()
    })

    it('renders each row as label and value pairs below --container-lg when stackable', async () => {
      const view = mountIn(320, { stackable: true })
      const root = view.getByTestId('data-table')

      await waitFor(() => expect(root.hasAttribute('data-stacked')).toBe(true))
      const labels = view.getAllByTestId('data-table__stacked-label')
      expect(labels).toHaveLength(rows.length)
      expect(labels[0]?.textContent).toBe('Status')
      expect(labels[0]?.getAttribute('aria-hidden')).toBe('true')
      expect(view.getAllByRole('columnheader').map((cell) => cell.textContent?.trim())).toEqual([
        'Name',
        'Status'
      ])
    })

    it('keeps the scrolling grid in a wide box when stackable', async () => {
      const view = mountIn(1024, { stackable: true })
      await waitFor(() => expect(view.getAllByRole('row').length).toBe(rows.length + 1))

      expect(view.getByTestId('data-table').hasAttribute('data-stacked')).toBe(false)
      expect(view.queryByTestId('data-table__stacked-label')).toBeNull()
    })

    it('renders the StackedRows example as cards', async () => {
      const host = document.createElement('div')
      host.style.width = '360px'
      document.body.appendChild(host)
      const view = render(StackedRows, { container: host })

      await waitFor(() =>
        expect(view.getByTestId('data-table').hasAttribute('data-stacked')).toBe(true)
      )
    })

    it('never stacks a hand-composed table', () => {
      const { getByTestId } = render(Composition)

      expect(getByTestId('data-table').hasAttribute('data-stacked')).toBe(false)
    })
  })
  describe('select-all above stacked rows', () => {
    it('shows a labelled select-all that selects the page', async () => {
      const host = document.createElement('div')
      host.style.width = '320px'
      document.body.appendChild(host)
      const view = render(Table, {
        props: { columns, data: rows, enableRowSelection: true, stackable: true },
        container: host
      })
      const bar = await waitFor(() => view.getByTestId('data-table__stacked-select-all'))
      const box = within(bar).getByLabelText('Select all rows')
      expect(view.getAllByLabelText('Select all rows')).toHaveLength(1)
      await fireEvent.click(box)
      const emitted = view.emitted('update:rowSelection') as Record<string, boolean>[][]
      expect(emitted.at(-1)?.[0]).toEqual({ '1': true, '2': true, '3': true })
    })

    it('keeps the select-all in the header of the grid', async () => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const view = render(Table, {
        props: { columns, data: rows, enableRowSelection: true },
        container: host
      })
      await waitFor(() => expect(view.getAllByRole('row').length).toBe(rows.length + 1))
      expect(view.queryByTestId('data-table__stacked-select-all')).toBeNull()
      expect(view.getAllByLabelText('Select all rows')).toHaveLength(1)
    })
  })

  describe('density, wrapped lines and stripes', () => {
    it('reflects the preferences on the root and the rows', () => {
      const { getByTestId, getAllByRole } = render(Table, {
        props: { columns, data: rows, density: 'compact', wrapLines: true, striped: true }
      })
      const root = getByTestId('data-table')
      expect(root.getAttribute('data-density')).toBe('compact')
      expect(root.hasAttribute('data-wrap')).toBe(true)
      const bodyRows = getAllByRole('row').slice(1)
      expect(bodyRows[1]?.className).toContain('[--table-row-bg:var(--bg-surface-raised)]')
      expect(bodyRows[0]?.className).not.toContain('[--table-row-bg:var(--bg-surface-raised)]')
    })
  })

  describe('virtual rows', () => {
    const many = Array.from({ length: 10000 }, (_, i) => ({
      id: String(i),
      name: `row-${i}`,
      status: i % 2 ? 'Active' : 'Inactive'
    }))

    it('mounts 10k rows fast and renders only the rows in view', async () => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const started = performance.now()
      const view = render(Table, {
        props: { columns, data: many, virtual: true, maxHeight: '480px' },
        container: host
      })
      const elapsed = performance.now() - started
      expect(elapsed).toBeLessThan(1000)
      const rendered = view.getAllByRole('row').length - 1
      expect(rendered).toBeGreaterThan(5)
      expect(rendered).toBeLessThan(60)
      expect(view.getByTestId('data-table__table').getAttribute('aria-rowcount')).toBe('10001')

      const viewport = view.getByTestId('data-table__viewport')
      viewport.style.maxHeight = '480px'
      viewport.style.overflow = 'auto'
      viewport.scrollTop = 48 * 5000
      viewport.dispatchEvent(new Event('scroll'))
      await waitFor(() => expect(view.getByText('row-5000')).toBeTruthy())
      const row = view.getByText('row-5000').closest('[role="row"]') as HTMLElement
      expect(Number(row.getAttribute('aria-rowindex'))).toBe(5002)
      expect(view.getAllByRole('row').length).toBeLessThan(60)
    })

    it('under manual sorting, filtering and pagination selects and exports every row while rendering only the window', async () => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const selection = ref<Record<string, boolean>>({})
      const exported = vi.fn()
      const tableRef = ref<{ exportCsv: (o?: object) => Promise<void> } | null>(null)
      const view = render(
        defineComponent({
          setup: () => () =>
            h(Table, {
              ref: tableRef,
              columns,
              data: many,
              virtual: true,
              maxHeight: '480px',
              enableRowSelection: true,
              manualSorting: true,
              manualFiltering: true,
              manualPagination: true,
              rowSelection: selection.value,
              'onUpdate:rowSelection': (value: Record<string, boolean>) =>
                (selection.value = value),
              onExport: exported
            })
        }),
        { container: host }
      )
      expect(view.getAllByRole('row').length - 1).toBeLessThan(60)
      expect(view.getByTestId('data-table__table').getAttribute('aria-rowcount')).toBe('10001')

      await fireEvent.click(view.getByLabelText('Select all rows'))
      await nextTick()
      expect(Object.keys(selection.value)).toHaveLength(10000)
      expect(selection.value['9999']).toBe(true)

      const { '42': _dropped, ...rest } = selection.value
      selection.value = rest
      await nextTick()
      await fireEvent.click(view.getByLabelText('Select all rows'))
      await nextTick()
      expect(Object.keys(selection.value)).toHaveLength(10000)

      await fireEvent.click(view.getByLabelText('Select all rows'))
      await nextTick()
      expect(Object.keys(selection.value)).toHaveLength(0)

      await tableRef.value?.exportCsv({ scope: 'all' })
      expect(exported).toHaveBeenCalledTimes(1)
      expect((exported.mock.calls[0][0] as unknown[]).length).toBe(10000)
      view.unmount()
      host.remove()
    })

    it('measures rows of mixed heights and keeps the rows in view still while scrolling', async () => {
      const long = 'wrapped text that runs over several lines '.repeat(6)
      const mixed = Array.from({ length: 2000 }, (_, i) => ({
        id: String(i),
        name: `row-${i}`,
        status: i % 3 === 0 ? long : 'Active'
      }))
      const host = document.createElement('div')
      host.style.width = '640px'
      document.body.appendChild(host)
      const view = render(Table, {
        props: { columns, data: mixed, virtual: true, wrapLines: true, maxHeight: '480px' },
        container: host
      })
      const viewport = view.getByTestId('data-table__viewport')
      viewport.style.maxHeight = '480px'
      viewport.style.overflow = 'auto'
      const frames = async (n = 3) => {
        for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(() => r(null)))
        await nextTick()
      }
      const bodyRows = () =>
        Array.from(viewport.querySelectorAll<HTMLElement>('[role="row"][aria-rowindex]'))
      await frames()
      const heights = new Set(bodyRows().map((row) => row.offsetHeight))
      expect(heights.size).toBeGreaterThan(1)

      viewport.scrollTop = 30_000
      viewport.dispatchEvent(new Event('scroll'))
      await frames(6)
      const top = viewport.getBoundingClientRect().top
      const anchor = bodyRows().find((row) => row.getBoundingClientRect().top >= top) as HTMLElement
      const anchorIndex = anchor.getAttribute('aria-rowindex')
      const before = anchor.getBoundingClientRect().top

      viewport.scrollTop -= 400
      viewport.dispatchEvent(new Event('scroll'))
      await frames(6)
      const same = bodyRows().find((row) => row.getAttribute('aria-rowindex') === anchorIndex)
      expect(same).toBeTruthy()
      expect(
        Math.abs((same as HTMLElement).getBoundingClientRect().top - (before + 400))
      ).toBeLessThan(2)
      const rendered = bodyRows()
      expect(rendered[0].getBoundingClientRect().top).toBeLessThanOrEqual(top)
      expect(rendered.at(-1)?.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(top + 480)

      viewport.scrollTop = viewport.scrollHeight
      viewport.dispatchEvent(new Event('scroll'))
      await frames(8)
      viewport.scrollTop = viewport.scrollHeight
      viewport.dispatchEvent(new Event('scroll'))
      await frames(4)
      const last = bodyRows().at(-1) as HTMLElement
      expect(last.getAttribute('aria-rowindex')).toBe('2001')
      expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        viewport.getBoundingClientRect().bottom + 1
      )
    })
  })

  describe('long lists without virtual', () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      name: `row-${i}`,
      status: 'Active'
    }))

    it('renders the first rows and mounts the rest as they near the viewport', async () => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const view = render(Table, { props: { columns, data: many }, container: host })
      const rendered = () => view.getAllByRole('row').length - 1
      expect(rendered()).toBeLessThan(100)
      expect(view.getByTestId('data-table__table').getAttribute('aria-rowcount')).toBe('1001')
      const gap = view.getByTestId('data-table__lazy-rows')
      expect(gap.offsetHeight).toBeGreaterThan(40 * 900)
      gap.scrollIntoView()
      await waitFor(() => expect(rendered()).toBeGreaterThan(100))
      window.scrollTo(0, document.documentElement.scrollHeight)
      await waitFor(() => expect(view.getByText('row-999')).toBeTruthy(), { timeout: 4000 })
      await waitFor(() => expect(view.queryByTestId('data-table__lazy-rows')).toBeNull())
      expect(view.getByTestId('data-table__table').hasAttribute('aria-rowcount')).toBe(false)
      window.scrollTo(0, 0)
    })

    it('renders every row of a short list at once', () => {
      const view = render(Table, { props: { columns, data: many.slice(0, 200) } })
      expect(view.getAllByRole('row')).toHaveLength(201)
      expect(view.queryByTestId('data-table__lazy-rows')).toBeNull()
    })
  })

  describe('with useCollection', () => {
    const Harness = (mode: 'client' | 'server') =>
      defineComponent({
        setup() {
          const data = Array.from({ length: 30 }, (_, i) => ({
            id: String(i + 1),
            name: `item-${String(i + 1).padStart(2, '0')}`,
            status: i % 2 ? 'Active' : 'Inactive'
          }))
          const collection = useCollection({
            ...(mode === 'client'
              ? { items: data }
              : {
                  fetch: async ({
                    page,
                    pageSize,
                    sort
                  }: {
                    page: number
                    pageSize: number
                    sort: { id: string; desc: boolean }[]
                  }) => {
                    const sorted = sort[0]?.desc ? [...data].reverse() : data
                    return {
                      items: sorted.slice((page - 1) * pageSize, page * pageSize),
                      total: data.length
                    }
                  }
                }),
            columns: [
              { accessorKey: 'name', header: 'Name', enableSorting: true },
              { accessorKey: 'status', header: 'Status' }
            ],
            pagination: { pageSize: 10 },
            selection: {}
          })
          return () => h(Table, { ...collection.tableProps.value, 'data-testid': 'coll' })
        }
      })

    it.each(['client', 'server'] as const)('pages and sorts in %s mode', async (mode) => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const view = render(Harness(mode), { container: host })
      await waitFor(() => expect(view.getByText('item-01')).toBeTruthy())
      expect(view.getAllByRole('row')).toHaveLength(11)
      await fireEvent.click(view.getByRole('button', { name: 'Next page' }))
      await waitFor(() => expect(view.getByText('item-11')).toBeTruthy())
      expect(view.queryByText('item-01')).toBeNull()
    })

    const exportHarness = (mode: 'client' | 'server', onExport: (rows: unknown[]) => void) =>
      defineComponent({
        setup() {
          const data = Array.from({ length: 30 }, (_, i) => ({
            id: String(i + 1),
            name: `item-${String(i + 1).padStart(2, '0')}`,
            status: i % 2 ? 'Active' : 'Inactive'
          }))
          const matches = (text: string) => data.filter((item) => item.name.includes(text))
          const collection = useCollection({
            ...(mode === 'client'
              ? { items: data }
              : {
                  fetch: async ({ page, pageSize, filteringText }) => {
                    const found = matches(filteringText)
                    return {
                      items: found.slice((page - 1) * pageSize, page * pageSize),
                      total: found.length
                    }
                  },
                  exportAll: async ({ filteringText, scope }) =>
                    scope === 'all' ? data : matches(filteringText)
                }),
            columns: [
              { accessorKey: 'name', header: 'Name' },
              { accessorKey: 'status', header: 'Status' }
            ],
            filtering: { debounce: 0 },
            pagination: { pageSize: 10 }
          })
          collection.setFilteringText('1')
          return () =>
            h(
              Table,
              { ...collection.tableProps.value, onExport },
              { toolbar: () => h(Table.Export) }
            )
        }
      })

    it.each(['client', 'server'] as const)(
      'exports every match, not only the page, in %s mode',
      async (mode) => {
        const onExport = vi.fn()
        const host = document.createElement('div')
        host.style.width = '1024px'
        document.body.appendChild(host)
        const view = render(exportHarness(mode, onExport), { container: host })
        await waitFor(() => expect(view.getByText('item-10')).toBeTruthy())
        await fireEvent.click(view.getByTestId('data-table__export'))
        await waitFor(() => expect(onExport).toHaveBeenCalled())
        const exported = onExport.mock.calls[0][0] as { name: string }[]
        expect(exported.map((row) => row.name)).toEqual([
          'item-01',
          ...Array.from({ length: 10 }, (_, i) => `item-1${i}`),
          'item-21'
        ])
        expect(view.getAllByRole('row')).toHaveLength(11)
      }
    )
  })

  describe('export', () => {
    it('downloads the rows the caller passes and the visible columns', async () => {
      const created: string[] = []
      const createObjectURL = vi
        .spyOn(URL, 'createObjectURL')
        .mockImplementation((blob: Blob | MediaSource) => {
          void (blob as Blob).text().then((text) => created.push(text))
          return 'blob:test'
        })
      const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
      const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
      const tableRef = ref<{ exportCsv: (o?: object) => Promise<void> } | null>(null)
      render(
        defineComponent({
          setup: () => () =>
            h(Table, {
              ref: tableRef,
              columns: [
                { id: 'label', accessorKey: 'name', header: 'Name' },
                { accessorKey: 'status', header: 'Status' }
              ],
              data: rows
            })
        })
      )
      await tableRef.value?.exportCsv({ rows: [{ id: '9', name: 'Zulu', status: 'Active' }] })
      await waitFor(() => expect(created).toHaveLength(1))
      expect(created[0]).toBe('Name,Status\r\nZulu,Active')
      createObjectURL.mockRestore()
      revoke.mockRestore()
      click.mockRestore()
    })
  })
})

describe('Table slot presence', () => {
  it('names the table by a v-if caption slot that appears and disappears after mount', async () => {
    const shown = ref(false)
    const { getByTestId, queryByTestId } = render({
      components: { Table },
      setup: () => ({ shown, rows, columns }),
      template: `<Table :data="rows" :columns="columns"><template v-if="shown" #caption><span data-testid="probe">Three domains</span></template></Table>`
    })
    const table = getByTestId('data-table__table')
    expect(queryByTestId('data-table__caption')).toBeNull()
    expect(table.hasAttribute('aria-labelledby')).toBe(false)

    shown.value = true
    await nextTick()
    const caption = getByTestId('data-table__caption')
    expect(queryByTestId('probe')).not.toBeNull()
    expect(table.getAttribute('aria-labelledby')).toBe(caption.id)

    shown.value = false
    await nextTick()
    expect(queryByTestId('data-table__caption')).toBeNull()
    expect(queryByTestId('probe')).toBeNull()
    expect(table.hasAttribute('aria-labelledby')).toBe(false)
  })
})
