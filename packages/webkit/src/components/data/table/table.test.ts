import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import Composition from '../../../../examples/table/composition.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Table from './index'
import tableSource from './table.vue?raw'
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

const rows = [
  { id: '1', name: 'Charlie', status: 'Active' },
  { id: '2', name: 'Alpha', status: 'Inactive' },
  { id: '3', name: 'Bravo', status: 'Active' }
]

describe('Table', () => {
  describe('hand-composed', () => {
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
        const button = within(sortableHead).getByRole('button', { name: 'Sort by Name' })
        await fireEvent.click(button)

        // The parent's @sort handler received 'ascending' and aria-sort updated.
        expect(sortableHead.getAttribute('aria-sort')).toBe('ascending')
      })
    })

    describe('TableHeadCell — one tab stop per sortable column (APG sortable table)', () => {
      it('keeps the header cell out of the tab order and names the sort button with the column', () => {
        const { getAllByRole } = render(
          defineComponent({
            components: { Table, TableHeader, TableRow, TableHeadCell },
            template: `
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell sortable sort-direction="none">Name</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </TableRow>
              </TableHeader>
            </Table>
          `
          })
        )
        const nameHead = getAllByRole('columnheader').find(
          (h) => within(h).queryByText('Name') !== null
        ) as HTMLElement
        expect(nameHead.hasAttribute('tabindex')).toBe(false)
        expect(nameHead.getAttribute('aria-sort')).toBe('none')
        const focusable = nameHead.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"]), a[href], input'
        )
        expect(focusable).toHaveLength(1)
        expect(within(nameHead).getByRole('button', { name: 'Sort by Name' })).toBe(focusable[0])
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

    describe('documented examples', () => {
      it('renders the Composition story cleanly', () => {
        const { getByTestId, getAllByRole } = render(Composition)

        expect(getByTestId('data-table')).toBeTruthy()
        // 1 header row + 5 body rows (the story slices the first five records).
        expect(getAllByRole('row')).toHaveLength(6)
      })
      it('never stacks a hand-composed table', () => {
        const { getByTestId } = render(Composition)

        expect(getByTestId('data-table').hasAttribute('data-stacked')).toBe(false)
      })
    })
  })

  describe('root (markup only)', () => {
    it('loads no table engine: the root imports neither TanStack nor the data-driven parts', () => {
      expect(tableSource).not.toMatch(/@tanstack/)
      expect(tableSource).not.toMatch(/pagination\.vue|checkbox\.vue|utils\/csv/)
    })

    it('frames the toolbar band, the viewport and the footer around the composed table', async () => {
      const view = render(
        defineComponent({
          components: { Table, TableBody, TableRow, TableCell, TableFooter },
          template: `
          <Table density="compact" wrap-lines bordered aria-label="Domains">
            <template #title>Domains</template>
            <template #toolbar><button type="button">Refresh</button></template>
            <TableBody><TableRow><TableCell>acme-prod</TableCell></TableRow></TableBody>
            <template #footer><TableFooter>3 domains</TableFooter></template>
          </Table>
        `
        })
      )
      const root = view.getByTestId('data-table')
      expect(root.getAttribute('data-density')).toBe('compact')
      expect(root.hasAttribute('data-wrap')).toBe(true)
      expect(root.hasAttribute('data-border')).toBe(true)
      const table = view.getByRole('table', { name: 'Domains' })
      expect(root.hasAttribute('aria-label')).toBe(false)
      expect(table.contains(view.getByRole('button', { name: 'Refresh' }))).toBe(false)
      expect(table.contains(view.getByText('3 domains'))).toBe(false)
      expect(view.getByTestId('data-table__toolbar').textContent).toContain('Domains')
      await fireEvent.scroll(view.getByTestId('data-table__viewport'))
      await expectNoA11yViolations(view.container)
    })
  })
})
