import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/data-table/default.vue'
import Empty from '../../../../examples/data-table/empty.vue'
import ErrorExample from '../../../../examples/data-table/error.vue'
import ExportExample from '../../../../examples/data-table/export.vue'
import FilterMenuExample from '../../../../examples/data-table/filter-menu.vue'
import Loading from '../../../../examples/data-table/loading.vue'
import SerializableState from '../../../../examples/data-table/serializable-state.vue'
import StackedRows from '../../../../examples/data-table/stacked-rows.vue'
import WithCheckboxes from '../../../../examples/data-table/with-checkboxes.vue'
import { useCollection } from '../../../composables/use-collection'
import { expectNoA11yViolations } from '../../../test/axe'
import { hostable } from '../../../test/hostable'
import FilterMenu from '../filter-menu/index'
import Table from '../table/index'
import type { TableAppliedFilter } from '../table/injection-key'
import TableBody from '../table/table-body/table-body.vue'
import TableCaption from '../table/table-caption/table-caption.vue'
import TableCell from '../table/table-cell/table-cell.vue'
import TableExportButton from '../table/table-export-button/table-export-button.vue'
import TableFilter from '../table/table-filter/table-filter.vue'
import TableHeadCell from '../table/table-head-cell/table-head-cell.vue'
import TableHeader from '../table/table-header/table-header.vue'
import TableRefreshButton from '../table/table-refresh-button/table-refresh-button.vue'
import TableRow from '../table/table-row/table-row.vue'
import TableSearch from '../table/table-search/table-search.vue'
import DataTableRoot from './data-table.vue'
import DataTablePagination from './data-table-pagination/data-table-pagination.vue'

const DataTable = hostable(DataTableRoot)

// A small, stable dataset used across data-driven tests.
const rows = [
  { id: '1', name: 'Charlie', status: 'Active' },
  { id: '2', name: 'Alpha', status: 'Inactive' },
  { id: '3', name: 'Bravo', status: 'Active' }
]

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status', sortable: false }
]

describe('DataTable', () => {
  describe('frame and accessibility', () => {
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
    it('keeps the toolbar, scroll viewport, empty state and pagination outside role="table"', async () => {
      const view = render(DataTable, {
        attrs: { 'aria-label': 'Domains' },
        props: {
          data: Array.from({ length: 12 }, (_, i) => ({ id: String(i), name: `Row ${i}` })),
          columns: [{ accessorKey: 'name', header: 'Name' }],
          selectable: true
        },
        slots: {
          toolbar: '<button type="button">Refresh</button>',
          footer: () => h(DataTablePagination, { pageSize: 5 })
        }
      })
      const table = view.getByRole('table')
      expect(table.getAttribute('aria-label')).toBe('Domains')
      expect(view.getByTestId('data-table').hasAttribute('aria-label')).toBe(false)
      expect(table.contains(view.getByTestId('data-table__viewport'))).toBe(false)
      expect(table.contains(view.getByRole('navigation'))).toBe(false)
      expect(table.contains(view.getByText('Refresh'))).toBe(false)
      await expectNoA11yViolations(view.container)

      const empty = render(DataTable, {
        props: { data: [], columns: [{ accessorKey: 'name', header: 'Name' }] }
      })
      const emptyTable = empty.getAllByRole('table').at(-1) as HTMLElement
      expect(emptyTable.contains(empty.getByTestId('data-table__empty'))).toBe(false)
      await expectNoA11yViolations(empty.container)
    })

    describe('accessibility — the table owns only its caption and row groups', () => {
      it('keeps the toolbar, the focusable viewport and the footer outside role=table', () => {
        const { getByRole, getByTestId } = render(DataTable, {
          props: { data: rows, columns, 'aria-label': 'Domains' },
          slots: {
            toolbar: '<button type="button">Refresh</button>',
            caption: 'Three domains',
            footer: () => h(DataTablePagination, { pageSize: 2 })
          }
        })

        const table = getByRole('table', { name: 'Domains' })
        expect(table).toBe(getByTestId('data-table__table'))
        expect(getByTestId('data-table').hasAttribute('aria-label')).toBe(false)
        expect(table.contains(getByTestId('data-table__viewport'))).toBe(false)
        expect(table.contains(getByTestId('data-table-pagination'))).toBe(false)
        expect(table.contains(getByRole('button', { name: 'Refresh' }))).toBe(false)
        expect(getByTestId('data-table-pagination').getAttribute('role')).toBeNull()
      })

      it('is named by its caption unless the consumer names it', async () => {
        // A composed caption registers while it mounts, after the table's
        // first render; the data-driven caption names the table from the start.
        const composed = render(CompositionTree)
        const caption = composed.getByTestId('table-caption')
        expect(caption.hasAttribute('role')).toBe(false)
        expect(await composed.findByRole('table', { name: 'My caption' })).toBeTruthy()
        composed.unmount()

        const captioned = render(DataTable, {
          props: { data: rows, columns },
          slots: { caption: 'Three domains' }
        })
        expect(captioned.getByRole('table', { name: 'Three domains' })).toBeTruthy()
        captioned.unmount()

        const named = render(DataTable, {
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
            components: { DataTable, DataTablePagination, Table },
            setup: () => ({ rows, columns }),
            template: `
            <div style="width: 240px">
              <DataTable :data="rows" :columns="columns" aria-label="Domains">
                <template #toolbar><button type="button">Refresh</button></template>
                <template #caption>Three domains</template>
                <template #footer><DataTablePagination :page-size="2" /></template>
              </DataTable>
            </div>
          `
          })
        )
        await expectNoA11yViolations(narrow.container)
        narrow.unmount()

        const empty = render(DataTable, { props: { data: [], columns, 'aria-label': 'Domains' } })
        await expectNoA11yViolations(empty.container)
      })
    })
  })

  describe('data-driven mode (data + columns render through sub-components)', () => {
    it('renders one row per record plus the header, through the primitives', () => {
      const { getAllByRole, getByTestId } = render(DataTable, {
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

    it('sets data-bordered only when bordered is true', () => {
      const flush = render(DataTable, { props: { data: rows, columns } })
      expect(flush.getByTestId('data-table').hasAttribute('data-bordered')).toBe(false)
      flush.unmount()

      const framed = render(DataTable, { props: { data: rows, columns, bordered: true } })
      expect(framed.getByTestId('data-table').hasAttribute('data-bordered')).toBe(true)
    })

    it('renders the default empty state when data is empty', () => {
      const { getByTestId, queryByRole } = render(DataTable, {
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
      const { getAllByRole, emitted } = render(DataTable, {
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
      const { getAllByRole, emitted } = render(DataTable, {
        props: { data: rows, columns, sortable: true }
      })

      // The Name column is sortable (sortable global true, Status opted out).
      const nameHead = getAllByRole('columnheader').find(
        (h) => within(h).queryByText('Name') !== null
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
      const { getAllByRole } = render(DataTable, {
        props: { data: rows, columns, sortable: true }
      })

      const statusHead = getAllByRole('columnheader').find(
        (h) => within(h).queryByText('Status') !== null
      ) as HTMLElement
      // Status column set sortable: false.
      expect(statusHead.getAttribute('data-sortable')).toBeNull()
      expect(within(statusHead).queryByRole('button')).toBeNull()
    })
  })

  describe('row selection (data-driven) — checkbox column + update:selectedKeys', () => {
    it('adds a leading select-all header checkbox and a checkbox per row', () => {
      const { getByLabelText, getAllByLabelText } = render(DataTable, {
        props: { data: rows, columns, selectable: true, rowKey: 'id' }
      })

      // The header checkbox is labelled "Select all rows"; each row "Select row".
      expect(getByLabelText('Select all rows')).toBeTruthy()
      expect(getAllByLabelText('Select row')).toHaveLength(3)
    })

    it('emits update:selectedKeys keyed by rowKey when a row checkbox is toggled', async () => {
      const { getAllByLabelText, emitted } = render(DataTable, {
        props: { data: rows, columns, selectable: true, rowKey: 'id' }
      })

      // Toggle the first row's checkbox (getRowId uses rowKey='id' -> '1').
      await fireEvent.click(getAllByLabelText('Select row')[0])

      const events = emitted()['update:selectedKeys'] as unknown[][]
      expect(events).toBeTruthy()
      expect(events[events.length - 1][0]).toEqual(['1'])
    })

    it('select-all toggles every row via update:selectedKeys', async () => {
      const { getByLabelText, emitted } = render(DataTable, {
        props: { data: rows, columns, selectable: true, rowKey: 'id' }
      })

      await fireEvent.click(getByLabelText('Select all rows'))

      const events = emitted()['update:selectedKeys'] as unknown[][]
      const latest = events[events.length - 1][0] as string[]
      expect(latest).toEqual(['1', '2', '3'])
    })

    it('selectOnRowClick toggles selection when an inert row is clicked', async () => {
      const { getAllByRole, emitted } = render(DataTable, {
        props: {
          data: rows,
          columns,
          selectable: true,
          selectOnRowClick: true,
          rowKey: 'id'
        }
      })

      const bodyRow = getAllByRole('row')[1]
      await fireEvent.click(bodyRow)

      // Both the selection change and row-click fire on the inert click.
      const selection = emitted()['update:selectedKeys'] as unknown[][]
      expect(selection[selection.length - 1][0]).toEqual(['1'])
      expect(emitted()['row-click']).toBeTruthy()
    })

    it('rowSelectable leaves a rejected row without a checkbox, row click or select-all', async () => {
      const { getAllByLabelText, getByLabelText, getAllByRole, emitted } = render(DataTable, {
        props: {
          data: rows,
          columns,
          selectable: true,
          selectOnRowClick: true,
          rowKey: 'id',
          rowSelectable: (row: Record<string, unknown>) => row.id !== '1' && row.id !== 1
        }
      })

      expect(getAllByLabelText('Select row')).toHaveLength(2)
      await fireEvent.click(getAllByRole('row')[1])
      expect(emitted()['update:selectedKeys']).toBeUndefined()
      expect(emitted()['row-click']).toBeTruthy()

      await fireEvent.click(getByLabelText('Select all rows'))
      const events = emitted()['update:selectedKeys'] as unknown[][]
      expect(events[events.length - 1][0]).toEqual(['2', '3'])
      expect(getByLabelText('Select all rows')).toBeChecked()
    })
  })

  describe('v-model round-trip (controlled selectedKeys)', () => {
    it('reflects a controlled selectedKeys prop as the selected row surface', async () => {
      const { getAllByRole, rerender } = render(DataTable, {
        props: { data: rows, columns, selectable: true, rowKey: 'id', selectedKeys: [] }
      })

      // Initially nothing selected.
      let bodyRows = getAllByRole('row').slice(1)
      expect(bodyRows.every((r) => r.getAttribute('data-state') === 'unselected')).toBe(true)

      // Controlled update: select row '2'.
      await rerender({
        data: rows,
        columns,
        selectable: true,
        rowKey: 'id',
        selectedKeys: ['2']
      })

      bodyRows = getAllByRole('row').slice(1)
      // Second body row (id '2') is now selected.
      expect(bodyRows[1].getAttribute('data-state')).toBe('selected')
      expect(bodyRows[1].getAttribute('aria-selected')).toBe('true')
      expect(bodyRows[0].getAttribute('data-state')).toBe('unselected')
    })
  })

  describe('data-driven slot scopes (typed by defineSlots)', () => {
    it('passes row and value to cell slots, column to header slots, and the selection to toolbar', async () => {
      const Tree = defineComponent({
        components: { DataTable, Table },
        setup: () => ({ rows, columns }),
        template: `
          <DataTable :data="rows" :columns="columns" selectable>
            <template #toolbar="{ selectedCount, selectedRows, clearSelection, loading, table }">
              <button type="button" data-testid="scope-toolbar" @click="clearSelection">
                {{ selectedCount }}|{{ selectedRows.map((row) => row.id).join(',') }}|{{ loading }}|{{ Boolean(table) }}
              </button>
            </template>
            <template #header-name="{ column }"><span data-testid="scope-header">{{ column.id }}</span></template>
            <template #cell-name="{ row, value }"><span data-testid="scope-cell">{{ row.id }}:{{ value }}</span></template>
          </DataTable>
        `
      })
      const { getByTestId, getAllByTestId, getAllByRole } = render(Tree)

      expect(getByTestId('scope-header').textContent).toBe('name')
      expect(getAllByTestId('scope-cell').map((cell) => cell.textContent)).toEqual([
        '1:Charlie',
        '2:Alpha',
        '3:Bravo'
      ])
      expect(getByTestId('scope-toolbar').textContent?.trim()).toBe('0||false|true')

      const [, firstRowCheckbox] = getAllByRole('checkbox')
      await fireEvent.click(firstRowCheckbox)
      await waitFor(() =>
        expect(getByTestId('scope-toolbar').textContent?.trim()).toBe('1|1|false|true')
      )
      await fireEvent.click(getByTestId('scope-toolbar'))
      await waitFor(() =>
        expect(getByTestId('scope-toolbar').textContent?.trim()).toBe('0||false|true')
      )
    })
  })

  describe('keyboard rows', () => {
    const bodyRows = () =>
      Array.from(document.body.querySelectorAll<HTMLElement>('[data-focus-row]'))
    const key = (target: HTMLElement, init: ConstructorParameters<typeof KeyboardEvent>[1]) =>
      target.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
      )

    it('keeps body rows out of the tab order without a row listener', () => {
      render(DataTable, { props: { data: rows, columns } })
      expect(bodyRows()).toHaveLength(0)
    })

    it('moves with the arrows and opens the row on Enter', async () => {
      const onRowClick = vi.fn()
      render(DataTable, { props: { data: rows, columns, rowKey: 'id' }, attrs: { onRowClick } })
      await nextTick()
      const list = bodyRows()
      expect(list.map((row) => row.tabIndex)).toEqual([0, -1, -1])
      list[0]!.focus()
      key(list[0]!, { key: 'ArrowDown' })
      await waitFor(() => expect(document.activeElement).toBe(bodyRows()[1]))
      key(bodyRows()[1]!, { key: 'End' })
      await waitFor(() => expect(document.activeElement).toBe(bodyRows()[2]))
      key(bodyRows()[2]!, { key: 'Enter' })
      expect(onRowClick).toHaveBeenCalledTimes(1)
      expect(onRowClick.mock.calls[0]![0]).toBeInstanceOf(KeyboardEvent)
      expect(onRowClick.mock.calls[0]![1]).toEqual(rows[2])
    })

    it('selects on Space and asks to remove on Delete, never with a modifier', async () => {
      const onRowRemove = vi.fn()
      const selected = ref<string[]>([])
      const Host = defineComponent({
        components: { DataTable },
        setup: () => ({ rows, columns, selected, onRowRemove }),
        template: `<DataTable :data="rows" :columns="columns" row-key="id" selectable v-model:selected-keys="selected" @row-remove="onRowRemove" />`
      })
      render(Host)
      await nextTick()
      const first = bodyRows()[0]!
      first.focus()
      key(first, { key: ' ' })
      await waitFor(() => expect(selected.value).toEqual(['1']))
      key(first, { key: 'Delete', metaKey: true })
      expect(onRowRemove).not.toHaveBeenCalled()
      key(first, { key: 'Delete' })
      key(first, { key: 'Backspace' })
      expect(onRowRemove).toHaveBeenCalledTimes(2)
      expect(onRowRemove.mock.calls[0]![1]).toEqual(rows[0])
    })

    it('moves focus to the next row, then the previous row, then the table after a delete', async () => {
      const data = ref(rows.map((row) => ({ ...row })))
      const remove = (_event: KeyboardEvent, row: { id: string }) => {
        data.value = data.value.filter((item) => item.id !== row.id)
      }
      const Host = defineComponent({
        components: { DataTable },
        setup: () => ({ data, columns, remove }),
        template: `<DataTable :data="data" :columns="columns" row-key="id" @row-remove="remove" />`
      })
      const { getByTestId } = render(Host)
      await nextTick()
      bodyRows()[1]!.focus()
      key(bodyRows()[1]!, { key: 'Delete' })
      await waitFor(() => expect(document.activeElement?.textContent).toContain('Bravo'))
      key(document.activeElement as HTMLElement, { key: 'Delete' })
      await waitFor(() => expect(document.activeElement?.textContent).toContain('Charlie'))
      key(document.activeElement as HTMLElement, { key: 'Delete' })
      await waitFor(() => {
        expect(document.activeElement).not.toBe(document.body)
        expect(getByTestId('data-table').contains(document.activeElement)).toBe(true)
      })
    })

    it('leaves focus alone when the person moved it elsewhere', async () => {
      const data = ref(rows.map((row) => ({ ...row })))
      const Host = defineComponent({
        components: { DataTable },
        setup: () => ({ data, columns }),
        template: `<div><button type="button" data-testid="elsewhere">Elsewhere</button><DataTable :data="data" :columns="columns" row-key="id" @row-click="() => {}" /></div>`
      })
      const { getByTestId } = render(Host)
      await nextTick()
      bodyRows()[0]!.focus()
      getByTestId('elsewhere').focus()
      data.value = data.value.slice(1)
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(document.activeElement).toBe(getByTestId('elsewhere'))
    })
  })

  describe('TableSearch — context-aware global filter (provide/inject)', () => {
    it('reads and drives the injected table global filter, emitting update:globalFilter', async () => {
      // TableSearch sits in the toolbar slot; it reads ctx.table (data-driven)
      // and calls setGlobalFilter, which flows back out as update:globalFilter.
      const Tree = defineComponent({
        components: { DataTable, Table, TableSearch },
        setup: () => ({ rows, columns }),
        template: `
          <DataTable :data="rows" :columns="columns">
            <template #toolbar>
              <TableSearch placeholder="Find" />
            </template>
          </DataTable>
        `
      })
      const { getByTestId } = render(Tree)

      // TableSearch forwards its testid down to the Input native input.
      const input = getByTestId('table-search') as HTMLInputElement
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

    it('filters by its v-model from the first render and writes the typed text back', async () => {
      const search = ref('Alpha')
      const Tree = defineComponent({
        components: { DataTable, TableSearch },
        setup: () => ({ rows, columns, search }),
        template: `
          <DataTable :data="rows" :columns="columns">
            <template #toolbar><TableSearch v-model="search" /></template>
          </DataTable>
        `
      })
      const view = render(Tree)
      expect(view.getAllByRole('row')).toHaveLength(2)
      await fireEvent.update(view.getByTestId('table-search') as HTMLInputElement, 'Bravo')
      expect(search.value).toBe('Bravo')
      expect(view.getByText('Bravo')).toBeTruthy()
      search.value = ''
      await nextTick()
      await nextTick()
      expect(view.getAllByRole('row')).toHaveLength(rows.length + 1)
    })

    it('focuses the search on / from the page, but not while typing in a field', async () => {
      const Tree = defineComponent({
        components: { DataTable, Table, TableSearch },
        setup: () => ({ rows, columns }),
        template: `
          <div>
            <input aria-label="Other" data-testid="other" />
            <DataTable :data="rows" :columns="columns">
              <template #toolbar>
                <TableSearch />
              </template>
            </DataTable>
          </div>
        `
      })
      const { getByTestId } = render(Tree)
      await nextTick()
      const other = getByTestId('other')
      other.focus()
      other.dispatchEvent(
        new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })
      )
      expect(document.activeElement).toBe(other)
      other.blur()
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })
      )
      expect(document.activeElement).toBe(getByTestId('table-search'))
    })

    // `size` is bound BEFORE v-bind="$attrs" on the inner Input, so the
    // default is a default rather than a hard-code. Bound after, it would
    // clobber the consumer's value and a search field could never sit level
    // with a row of large toolbar controls.
    it('defaults to the small field but lets a consumer override the size', () => {
      const treeWith = (attrs: string) =>
        defineComponent({
          components: { DataTable, Table, TableSearch },
          setup: () => ({ rows, columns }),
          template: `
            <DataTable :data="rows" :columns="columns">
              <template #toolbar>
                <TableSearch ${attrs} />
              </template>
            </DataTable>
          `
        })

      const bare = render(treeWith(''))
      const defaulted = within(bare.container as HTMLElement).getByTestId('table-search')
      expect(defaulted.closest('[data-size]')?.getAttribute('data-size')).toBe('small')

      const overridden = render(treeWith('size="large"'))
      const large = within(overridden.container as HTMLElement).getByTestId('table-search')
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
      const { getAllByRole } = render(DataTable, {
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
      const { getAllByRole } = render(DataTable, {
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
      const { getAllByRole } = render(DataTable, {
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
      return render(DataTable, { props: { columns, data: rows, ...props }, container: host })
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
  })
  describe('select-all above stacked rows', () => {
    it('shows a labelled select-all that selects the page', async () => {
      const host = document.createElement('div')
      host.style.width = '320px'
      document.body.appendChild(host)
      const view = render(DataTable, {
        props: { columns, data: rows, selectable: true, stackable: true },
        container: host
      })
      const bar = await waitFor(() => view.getByTestId('data-table__stacked-select-all'))
      const box = within(bar).getByLabelText('Select all rows')
      expect(view.getAllByLabelText('Select all rows')).toHaveLength(1)
      await fireEvent.click(box)
      const emitted = view.emitted('update:selectedKeys') as string[][][]
      expect(emitted.at(-1)?.[0]).toEqual(['1', '2', '3'])
    })

    it('keeps the select-all in the header of the grid', async () => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const view = render(DataTable, {
        props: { columns, data: rows, selectable: true },
        container: host
      })
      await waitFor(() => expect(view.getAllByRole('row').length).toBe(rows.length + 1))
      expect(view.queryByTestId('data-table__stacked-select-all')).toBeNull()
      expect(view.getAllByLabelText('Select all rows')).toHaveLength(1)
    })
  })

  describe('density, wrapped lines and stripes', () => {
    it('reflects the preferences on the root and the rows', () => {
      const { getByTestId, getAllByRole } = render(DataTable, {
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
      const view = render(DataTable, {
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
      const selection = ref<string[]>([])
      const exported = vi.fn()
      const tableEl = ref<{ exportCsv: (o?: object) => Promise<void> } | null>(null)
      const view = render(
        defineComponent({
          setup: () => () =>
            h(DataTable, {
              ref: tableEl,
              columns,
              data: many,
              virtual: true,
              maxHeight: '480px',
              selectable: true,
              manualSorting: true,
              manualFiltering: true,
              manualPagination: true,
              selectedKeys: selection.value,
              'onUpdate:selectedKeys': (value: string[]) => (selection.value = value),
              onExport: exported
            })
        }),
        { container: host }
      )
      expect(view.getAllByRole('row').length - 1).toBeLessThan(60)
      expect(view.getByTestId('data-table__table').getAttribute('aria-rowcount')).toBe('10001')

      await fireEvent.click(view.getByLabelText('Select all rows'))
      await nextTick()
      expect(selection.value).toHaveLength(10000)
      expect(selection.value).toContain('9999')

      selection.value = selection.value.filter((key) => key !== '42')
      await nextTick()
      await fireEvent.click(view.getByLabelText('Select all rows'))
      await nextTick()
      expect(selection.value).toHaveLength(10000)

      await fireEvent.click(view.getByLabelText('Select all rows'))
      await nextTick()
      expect(selection.value).toHaveLength(0)

      await tableEl.value?.exportCsv({ scope: 'all' })
      expect(exported).toHaveBeenCalledTimes(1)
      expect((exported.mock.calls[0][0] as Event).type).toBe('export')
      expect((exported.mock.calls[0][1] as unknown[]).length).toBe(10000)
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
      const view = render(DataTable, {
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
      const view = render(DataTable, { props: { columns, data: many }, container: host })
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

    it('drops back to the rows in reach when the data or the sort changes at the top', async () => {
      const host = document.createElement('div')
      host.style.width = '1024px'
      document.body.appendChild(host)
      const view = render(DataTable, { props: { columns, data: many }, container: host })
      const rendered = () => view.getAllByRole('row').length - 1
      window.scrollTo(0, document.documentElement.scrollHeight)
      await waitFor(() => expect(view.getByText('row-999')).toBeTruthy(), { timeout: 4000 })
      window.scrollTo(0, 0)
      await view.rerender({ columns, data: [...many].reverse() })
      await waitFor(() => expect(rendered()).toBeLessThan(200))
      expect(view.getByTestId('data-table__lazy-rows')).toBeTruthy()
      await view.rerender({ columns, data: many, sorting: [{ id: 'name', desc: true }] })
      expect(rendered()).toBeLessThan(200)
    })

    it('renders every row of a short list at once', () => {
      const view = render(DataTable, { props: { columns, data: many.slice(0, 200) } })
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
              { accessorKey: 'name', header: 'Name', sortable: true },
              { accessorKey: 'status', header: 'Status' }
            ],
            pagination: { pageSize: 10 },
            selection: {}
          })
          return () =>
            h(
              DataTable,
              { ...collection.tableProps.value, 'data-testid': 'coll' },
              {
                footer: () =>
                  h(DataTablePagination, { ...collection.paginationProps.value, manual: true })
              }
            )
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

    const exportHarness = (
      mode: 'client' | 'server',
      onExport: (event: Event, rows: unknown[]) => void
    ) =>
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
              DataTable,
              { ...collection.tableProps.value, onExport },
              {
                toolbar: () => h(TableExportButton, { rows: collection.exportItems }),
                footer: () =>
                  h(DataTablePagination, { ...collection.paginationProps.value, manual: true })
              }
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
        await fireEvent.click(view.getByTestId('table-export-button'))
        await waitFor(() => expect(onExport).toHaveBeenCalled())
        expect(onExport.mock.calls[0][0]).toBeInstanceOf(Event)
        const exported = onExport.mock.calls[0][1] as { name: string }[]
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
      const tableEl = ref<{ exportCsv: (o?: object) => Promise<void> } | null>(null)
      render(
        defineComponent({
          setup: () => () =>
            h(DataTable, {
              ref: tableEl,
              columns: [
                { id: 'label', accessorKey: 'name', header: 'Name' },
                { accessorKey: 'status', header: 'Status' }
              ],
              data: rows
            })
        })
      )
      await tableEl.value?.exportCsv({ rows: [{ id: '9', name: 'Zulu', status: 'Active' }] })
      await waitFor(() => expect(created).toHaveLength(1))
      expect(created[0]).toBe('Name,Status\r\nZulu,Active')
      createObjectURL.mockRestore()
      revoke.mockRestore()
      click.mockRestore()
    })
  })

  describe('slot presence', () => {
    it('names the table by a v-if caption slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { getByTestId, queryByTestId } = render({
        components: { DataTable, Table },
        setup: () => ({ shown, rows, columns }),
        template: `<DataTable :data="rows" :columns="columns"><template v-if="shown" #caption><span data-testid="probe">Three domains</span></template></DataTable>`
      })
      const table = getByTestId('data-table__table')
      expect(queryByTestId('table-caption')).toBeNull()
      expect(table.hasAttribute('aria-labelledby')).toBe(false)

      shown.value = true
      await nextTick()
      const caption = getByTestId('table-caption')
      expect(queryByTestId('probe')).not.toBeNull()
      expect(table.getAttribute('aria-labelledby')).toBe(caption.id)

      shown.value = false
      await nextTick()
      expect(queryByTestId('table-caption')).toBeNull()
      expect(queryByTestId('probe')).toBeNull()
      expect(table.hasAttribute('aria-labelledby')).toBe(false)
    })
  })

  describe('filter events carry the DOM event first', () => {
    const filterFields = [
      {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' }
        ]
      },
      { id: 'name', label: 'Name', type: 'text' as const }
    ]
    const applied = { field: 'status', operator: 'eq' as const, value: 'Active' }
    const models: unknown[][] = []
    const renderFiltered = (type: 'menu' | 'property' = 'menu') =>
      render(DataTable, {
        props: {
          data: rows,
          columns: [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'status', header: 'Status' }
          ],
          rowKey: 'id',
          ariaLabel: 'People'
        },
        slots: {
          toolbar: () =>
            h(TableFilter, {
              type,
              fields: filterFields,
              modelValue: [applied],
              'onUpdate:modelValue': (next?: unknown[]) => models.push(next ?? [])
            }),
          filters: () => h(FilterMenu.ChipGroup)
        }
      })
    const chipRemove = async (view: ReturnType<typeof renderFiltered>): Promise<HTMLElement> => {
      const chip = await view.findByTestId('filter-menu-chip-group__chip-status')
      return [...chip.querySelectorAll<HTMLElement>('button')].at(-1) as HTMLElement
    }

    it('emits filter-remove as (event, filter) from a pointer click on the chip', async () => {
      const view = renderFiltered()
      await userEvent.click(await chipRemove(view))
      const payload = view.emitted()['filter-remove']?.[0] as unknown[]
      expect(payload[0]).toBeInstanceOf(MouseEvent)
      expect(payload[1]).toEqual(applied)
    })

    it('emits filter-remove as (event, filter) from the keyboard', async () => {
      const view = renderFiltered()
      ;(await chipRemove(view)).focus()
      await userEvent.keyboard('{Enter}')
      const payload = view.emitted()['filter-remove']?.[0] as unknown[]
      expect(payload[0]).toBeInstanceOf(Event)
      expect(payload[1]).toEqual(applied)
    })

    it('renders the applied filters as PropertyFilter tokens with type="property", AND only', async () => {
      const view = renderFiltered('property')
      const field = await view.findByTestId('table-filter')
      await waitFor(() => expect(field.textContent).toContain('Active'))
      expect(view.queryByTestId('table-filter__operation')).toBeNull()
      expect(view.getAllByRole('row')).toHaveLength(3)
    })

    it('emits filter-apply as (event, filters) when a property token is removed', async () => {
      const view = renderFiltered('property')
      const field = await view.findByTestId('table-filter')
      await waitFor(() => expect(field.textContent).toContain('Active'))
      const remove = within(field).getAllByRole('button', { name: /^Remove/ })[0] as HTMLElement
      await userEvent.click(remove)
      const payload = view.emitted()['filter-apply']?.at(-1) as unknown[]
      expect(payload[0]).toBeInstanceOf(Event)
      expect(payload[1]).toEqual([])
      expect(models.at(-1)).toEqual([])
    })
  })

  describe('TableFilter (menu) and FilterMenu.ChipGroup in a DataTable', () => {
    const panel = (): HTMLElement | null =>
      document.body.querySelector<HTMLElement>('[data-testid="table-filter__panel"]')
    const menuTrigger = (): HTMLButtonElement =>
      document.body.querySelector<HTMLButtonElement>(
        '[data-testid="table-filter__trigger"] button'
      )!
    const option = (value: string): HTMLElement =>
      document.body.querySelector<HTMLElement>(`[data-testid="table-filter__option-${value}"]`)!
    const visibleNames = (container: HTMLElement): string[] =>
      [...container.querySelectorAll('[role="row"]')]
        .slice(1)
        .map(
          (row) => row.querySelector('[role="cell"], [role="gridcell"]')?.textContent?.trim() ?? ''
        )

    const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10))
    const ready = (): Promise<void> =>
      waitFor(
        () => {
          expect(menuTrigger()).toBeTruthy()
          expect(
            document.body.querySelector('[data-testid^="filter-menu-chip-group"]')
          ).toBeTruthy()
        },
        { timeout: 3000 }
      )

    const openField = async (id: string): Promise<void> => {
      await settle()
      await fireEvent.click(menuTrigger())
      await waitFor(() => expect(panel()).not.toBeNull(), { timeout: 3000 })
      await fireEvent.click(
        document.body.querySelector<HTMLElement>(`[data-testid="table-filter__field-${id}"]`)!
      )
      await waitFor(() =>
        expect(panel()?.querySelector(`[data-level="values:${id}"]`)).not.toBeNull()
      )
    }

    it('renders the menu over the table filter fields with the applied count and the chips', async () => {
      const { getByTestId } = render(FilterMenuExample)
      await ready()
      expect(menuTrigger().getAttribute('aria-label')).toBe('Filter, 1 applied')
      expect(getByTestId('table-filter__count')).toHaveTextContent('1')
      const chip = getByTestId('filter-menu-chip-group__chip-region')
      expect(chip).toHaveTextContent('Region')
      expect(chip).toHaveTextContent('us-east')
      expect(chip).toHaveTextContent('+1')
    })

    it('filters the rows client-side from the menu picks', async () => {
      const { container } = render(FilterMenuExample)
      await ready()
      await waitFor(() =>
        expect(visibleNames(container as HTMLElement)).toEqual([
          'storefront',
          'docs-portal',
          'checkout-api'
        ])
      )
      await openField('status')
      await fireEvent.click(option('Active'))
      await waitFor(() =>
        expect(visibleNames(container as HTMLElement)).toEqual(['storefront', 'docs-portal'])
      )
    })

    it('writes in, eq, within and between filters with the event first on apply', async () => {
      const filters = ref<TableAppliedFilter[]>([])
      const applies: unknown[][] = []
      render(
        defineComponent({
          setup: () => () =>
            h(
              DataTable,
              {
                data: [{ id: '1', name: 'storefront', status: 'Active', modified: '2026-11-02' }],
                columns: [
                  { accessorKey: 'name', header: 'Name' },
                  { accessorKey: 'status', header: 'Status' }
                ],
                rowKey: 'id',
                onFilterApply: (...args: unknown[]) => applies.push(args)
              },
              {
                toolbar: () =>
                  h(TableFilter, {
                    modelValue: filters.value,
                    fields: [
                      {
                        id: 'status',
                        label: 'Status',
                        type: 'select',
                        options: [{ label: 'Active', value: 'Active' }]
                      },
                      { id: 'modified', label: 'Last modified', type: 'date' },
                      { id: 'name', label: 'Name', type: 'text' }
                    ],
                    'onUpdate:modelValue': (next?: TableAppliedFilter[]) =>
                      (filters.value = next ?? [])
                  })
              }
            )
        })
      )
      await waitFor(() => expect(menuTrigger()).toBeTruthy())
      await settle()
      await fireEvent.click(menuTrigger())
      await waitFor(() => expect(panel()).not.toBeNull(), { timeout: 3000 })
      expect(document.body.querySelector('[data-testid="table-filter__field-name"]')).toBeNull()
      await fireEvent.click(
        document.body.querySelector<HTMLElement>('[data-testid="table-filter__field-status"]')!
      )
      await waitFor(() => expect(option('Active')).toBeTruthy())
      await fireEvent.click(option('Active'))
      expect(filters.value).toEqual([
        { field: 'status', operator: 'eq', value: 'Active', label: 'Status: Active' }
      ])
      expect(applies.at(-1)?.[0]).toBeInstanceOf(Event)
      await waitFor(() => expect(panel()?.querySelector('[data-level="fields"]')).not.toBeNull())
      await fireEvent.click(
        document.body.querySelector<HTMLElement>('[data-testid="table-filter__field-modified"]')!
      )
      await waitFor(() => expect(option('30d')).toBeTruthy())
      await fireEvent.click(option('30d'))
      expect(filters.value).toContainEqual({
        field: 'modified',
        operator: 'within',
        value: '30d',
        label: 'Last modified: Last 30 days'
      })
    })

    it('reopens the menu at the chip field and removes the field filter from its chip', async () => {
      const { getByTestId, queryByTestId } = render(FilterMenuExample)
      await ready()
      const chip = getByTestId('filter-menu-chip-group__chip-region')
      await settle()
      await fireEvent.click(chip.querySelector<HTMLElement>('[role="button"], button') ?? chip)
      await waitFor(() =>
        expect(panel()?.querySelector('[data-level="values:region"]')).not.toBeNull()
      )
      const remove = [
        ...getByTestId('filter-menu-chip-group__chip-region').querySelectorAll<HTMLElement>(
          'button'
        )
      ].at(-1)!
      await fireEvent.click(remove)
      await waitFor(() => expect(queryByTestId('filter-menu-chip-group__chip-region')).toBeNull())
      expect(menuTrigger().getAttribute('aria-label')).toBe('Filter')
    })

    it('has no axe violations', async () => {
      const { container } = render(FilterMenuExample)
      await ready()
      await expectNoA11yViolations(container)
    })
  })

  describe('CollectionPreferences in a DataTable toolbar', () => {
    const panel = (): HTMLElement | null =>
      document.body.querySelector<HTMLElement>('[data-testid="collection-preferences__columns"]')
    const headers = (container: HTMLElement): string[] =>
      [...container.querySelectorAll('[role="columnheader"]')].map(
        (cell) => cell.textContent?.trim() ?? ''
      )
    const open = async (view: ReturnType<typeof render>): Promise<HTMLElement> => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      await fireEvent.click(view.getByTestId('collection-preferences__trigger'))
      await waitFor(() => expect(panel()).not.toBeNull(), { timeout: 3000 })
      return panel() as HTMLElement
    }

    it('lists the table columns with the locked one and writes visibility back on Confirm', async () => {
      const view = render(FilterMenuExample)
      await waitFor(() => expect(headers(view.container as HTMLElement)).toContain('Status'))
      const columns = await open(view)
      const rows = within(columns).getAllByTestId('collection-preferences__column')
      expect(rows.map((row) => row.textContent)).toEqual(
        expect.arrayContaining([expect.stringContaining('Name'), expect.stringContaining('Status')])
      )
      const locked = columns.querySelector('[data-locked]')
      expect(locked?.textContent).toContain('Name')
      const status = rows.find((row) => row.textContent?.includes('Status')) as HTMLElement
      await userEvent.click(within(status).getByRole('switch'))
      await userEvent.click(within(document.body).getByTestId('collection-preferences__confirm'))
      await waitFor(() => expect(headers(view.container as HTMLElement)).not.toContain('Status'))
      expect(headers(view.container as HTMLElement)).toContain('Name')
      expect(view.emitted()).toBeTruthy()
    })

    it('has no axe violations with the panel open', async () => {
      const view = render(FilterMenuExample)
      const columns = await open(view)
      await expectNoA11yViolations(columns.closest('[role="dialog"]') as HTMLElement)
    })
  })

  describe('density, page sizes and data states', () => {
    const headCells = (container: HTMLElement) =>
      Array.from(container.querySelectorAll<HTMLElement>('[role="columnheader"]'))

    it('compacts the header with density', () => {
      const dense = render(DataTable, { props: { columns, data: rows, density: 'compact' } })
      expect(
        headCells(dense.container as HTMLElement).every((cell) => cell.hasAttribute('data-compact'))
      ).toBe(true)
      dense.unmount()
      const roomy = render(DataTable, { props: { columns, data: rows } })
      expect(
        headCells(roomy.container as HTMLElement).some((cell) => cell.hasAttribute('data-compact'))
      ).toBe(false)
    })

    const paged = (pagination: Record<string, unknown>, table: Record<string, unknown> = {}) => {
      const events = { page: [] as number[], pageSize: [] as number[] }
      const tableProps = ref<Record<string, unknown>>({ columns, ...table })
      const pagingProps = ref<Record<string, unknown>>(pagination)
      const view = render(
        defineComponent({
          components: { DataTable, DataTablePagination },
          setup: () => ({ tableProps, pagingProps, events }),
          template: `
            <DataTable v-bind="tableProps">
              <template #footer>
                <DataTablePagination
                  v-bind="pagingProps"
                  @update:page="(page) => events.page.push(page)"
                  @update:page-size="(size) => events.pageSize.push(size)"
                />
              </template>
            </DataTable>
          `
        })
      )
      return { view, events, tableProps, pagingProps }
    }
    const numbered = (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: String(i),
        name: `Row ${i}`,
        status: 'Active'
      }))

    it('offers pageSizeOptions in the footer, 10 to 100 by default', () => {
      const sizes = (container: HTMLElement) =>
        Array.from(container.querySelectorAll('option')).map((option) => option.value)
      const next = paged({ pageSizeOptions: [5, 15], pageSize: 5 }, { data: numbered(30) })
      expect(sizes(next.view.container as HTMLElement)).toEqual(['5', '15'])
      next.view.unmount()
      const standard = paged({}, { data: numbered(30) })
      expect(sizes(standard.view.container as HTMLElement)).toEqual(['10', '25', '50', '100'])
    })

    it('renders the page and page size the part names from the first render', () => {
      const { view } = paged({ page: 2, pageSize: 5 }, { data: numbered(12) })
      expect(view.getAllByRole('row')).toHaveLength(6)
      expect(view.getByText('Row 5')).toBeTruthy()
      expect(view.queryByText('Row 4')).toBeNull()
      expect(view.getByTestId('data-table-pagination')).toBeTruthy()
    })

    it('renders every row without a pagination part', () => {
      const view = render(DataTable, { props: { columns, data: numbered(30) } })
      expect(view.getAllByRole('row')).toHaveLength(31)
      expect(view.queryByTestId('data-table-pagination')).toBeNull()
    })

    it('moves pages through the footer and emits a 1-based update:page', async () => {
      const { view, events } = paged({ pageSize: 5 }, { data: numbered(12) })
      await fireEvent.click(view.getByRole('button', { name: 'Next page' }))
      expect(events.page.at(-1)).toBe(2)
      expect(view.getByText('Row 5')).toBeTruthy()
      expect(view.queryByText('Row 0')).toBeNull()
    })

    it('shows the page a controlled v-model:page names and returns to page 1 on a new page size', async () => {
      const { view, events, pagingProps } = paged({ pageSize: 5, page: 3 }, { data: numbered(12) })
      expect(view.getByText('Row 10')).toBeTruthy()
      expect(view.queryByText('Row 0')).toBeNull()
      pagingProps.value = { pageSize: 10, page: 3 }
      await nextTick()
      await nextTick()
      expect(events.page.at(-1)).toBe(1)
    })

    it('renders data as one page and reports only the page under manual', async () => {
      const { view, events } = paged(
        { manual: true, total: 40, pageSize: 5 },
        { data: numbered(5) }
      )
      expect(view.getAllByRole('row')).toHaveLength(6)
      expect(view.getByTestId('data-table-pagination').textContent).toMatch(/of 40/)
      await fireEvent.click(view.getByRole('button', { name: 'Next page' }))
      expect(events.page.at(-1)).toBe(2)
      expect(view.getByText('Row 0')).toBeTruthy()
    })

    it('renders skeleton rows with aria-busy and ignores row clicks while loading', async () => {
      const view = render(DataTable, { props: { columns, data: rows, loading: true } })
      expect(view.container.querySelector('[aria-busy="true"]')).toBeTruthy()
      expect(view.queryByText('Charlie')).toBeNull()
      const body = view.getAllByRole('row').slice(1)
      if (body[0]) await fireEvent.click(body[0])
      expect(view.emitted()['row-click']).toBeUndefined()
    })

    it('states no row count while the first page loads, and hides only the count on a known total', async () => {
      const { view, tableProps } = paged({}, { data: [], loading: true })
      const footer = view.getByTestId('data-table-pagination')
      expect(footer.textContent).not.toMatch(/Showing/)
      expect(view.getByTestId('data-table-pagination__loading')).toBeTruthy()
      expect(view.queryByRole('navigation')).toBeNull()
      tableProps.value = { columns, data: rows, loading: false }
      await nextTick()
      expect(view.getByTestId('data-table-pagination').textContent).toMatch(/Showing 1 to/)
      tableProps.value = { columns, data: rows, loading: true }
      await nextTick()
      expect(view.getByRole('navigation')).toBeTruthy()
      expect(view.getByTestId('data-table-pagination').textContent).not.toMatch(/Showing/)
    })

    it('shows the error in an alert in place of the rows, and the error slot replaces it', () => {
      const view = render(DataTable, {
        props: { columns, data: rows, error: 'The service did not answer.' }
      })
      const alert = view.getByRole('alert')
      expect(alert.textContent).toContain('Could not load the data')
      expect(alert.textContent).toContain('The service did not answer.')
      expect(view.queryByText('Charlie')).toBeNull()
      view.unmount()
      const custom = render(DataTable, {
        props: { columns, data: [], error: 'Timeout' },
        slots: { error: ({ message }: { message: string }) => h('p', `Custom: ${message}`) }
      })
      expect(custom.getByRole('alert').textContent).toBe('Custom: Timeout')
      expect(custom.queryByTestId('data-table__empty')).toBeNull()
    })

    it('round-trips getSnapshot and setSnapshot', async () => {
      const tableEl = ref<{
        getSnapshot: () => { sorting: unknown[]; page: number; pageSize: number }
        setSnapshot: (next: {
          sorting?: { id: string; desc: boolean }[]
          page?: number
          pageSize?: number
        }) => void
      } | null>(null)
      render(
        defineComponent({
          setup: () => () =>
            h(DataTable, {
              ref: tableEl,
              columns: [{ accessorKey: 'name', header: 'Name', sortable: true }],
              data: rows,
              sortable: true
            })
        })
      )
      expect(tableEl.value?.getSnapshot().sorting).toEqual([])
      expect(tableEl.value?.getSnapshot().page).toBe(1)
      expect(tableEl.value?.getSnapshot().pageSize).toBe(10)
      tableEl.value?.setSnapshot({ sorting: [{ id: 'name', desc: true }] })
      await nextTick()
      expect(tableEl.value?.getSnapshot().sorting).toEqual([{ id: 'name', desc: true }])
      tableEl.value?.setSnapshot({ page: 2, pageSize: 25 })
      await nextTick()
      expect(tableEl.value?.getSnapshot().page).toBe(2)
      expect(tableEl.value?.getSnapshot().pageSize).toBe(25)
    })

    it('emits refresh from TableRefreshButton through the root', async () => {
      const refreshes: unknown[][] = []
      const view = render(
        defineComponent({
          setup: () => () =>
            h(
              DataTable,
              { columns, data: rows, onRefresh: (...args: unknown[]) => refreshes.push(args) },
              { toolbar: () => h(TableRefreshButton) }
            )
        })
      )
      await fireEvent.click(view.getByRole('button', { name: /refresh/i }))
      expect(refreshes).toHaveLength(1)
      expect(refreshes[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('names TableSearch from the locale catalog and an ariaLabel', () => {
      const view = render(
        defineComponent({
          setup: () => () =>
            h(DataTable, { columns, data: rows }, { toolbar: () => h(TableSearch) })
        })
      )
      expect(view.getByRole('textbox', { name: 'Search the table' })).toBeTruthy()
      view.unmount()
      const named = render(
        defineComponent({
          setup: () => () =>
            h(
              DataTable,
              { columns, data: rows },
              { toolbar: () => h(TableSearch, { 'aria-label': 'Search domains' }) }
            )
        })
      )
      expect(named.getByRole('textbox', { name: 'Search domains' })).toBeTruthy()
    })
  })

  describe('state examples', () => {
    it('render their state and have no axe violations', async () => {
      for (const example of [Loading, ErrorExample, ExportExample, SerializableState]) {
        const view = render(example)
        await nextTick()
        await expectNoA11yViolations(view.container)
        view.unmount()
      }
    })

    it('saves and restores the view in the SerializableState example', async () => {
      const view = render(SerializableState)
      await fireEvent.click(view.getByRole('button', { name: 'Save view' }))
      expect(view.getByRole('button', { name: 'Restore view' }).hasAttribute('disabled')).toBe(
        false
      )
    })
  })
})
