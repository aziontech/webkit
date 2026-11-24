import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import Button from '../components/action/button/button.vue'
import DataTableRoot from '../components/data/data-table/data-table.vue'
import type { TableColumn } from '../components/data/table/injection-key'
import TableCellLink from '../components/data/table/table-cell-link/table-cell-link.vue'
import { hostable } from './hostable'

const DataTable = hostable(DataTableRoot)

const LONG_NAME = 'checkout-service-production-europe-west-primary-origin-with-a-very-long-name'

const rows = [
  { id: '1', name: LONG_NAME, cache: '7 days' },
  { id: '2', name: 'static-assets', cache: '30 days' }
]

const columns: TableColumn[] = [
  { accessorKey: 'name', header: 'Name', principal: true },
  { accessorKey: 'cache', header: 'Browser cache', minWidth: 140 }
]

const settle = async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))
}

const mount = (width: number, linked: boolean) =>
  render(
    defineComponent({
      setup: () => () =>
        h('div', { style: { width: `${width}px` } }, [
          h(
            DataTable,
            { data: rows, columns, rowKey: 'id', ariaLabel: 'Cache settings' },
            linked
              ? {
                  'cell-name': ({ row }: { row: (typeof rows)[number] }) =>
                    h(
                      Button,
                      { variant: 'link', class: 'min-w-0 max-w-full', title: row.name },
                      () => h('span', { class: 'truncate' }, row.name)
                    )
                }
              : {}
          )
        ])
    })
  )

describe('a long cell value in a narrow table', () => {
  it.each([
    { width: 390, linked: true },
    { width: 390, linked: false }
  ])(
    'ends in an ellipsis inside the visible table at $width px (link: $linked)',
    async ({ width, linked }) => {
      const { getAllByRole } = mount(width, linked)
      await settle()
      const table = getAllByRole('table')[0]!
      const cell = getAllByRole('cell').find((el) => el.textContent?.includes(LONG_NAME))!
      const text = Array.from(cell.querySelectorAll<HTMLElement>('.truncate')).find(
        (el) => el.textContent === LONG_NAME
      )!
      expect(cell.getBoundingClientRect().width).toBeLessThanOrEqual(
        table.getBoundingClientRect().width + 0.5
      )
      expect(getComputedStyle(text).textOverflow).toBe('ellipsis')
      expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
      expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(
        cell.getBoundingClientRect().right + 0.5
      )
      if (linked)
        expect(cell.querySelector('[data-variant="link"]')?.getAttribute('title')).toBe(LONG_NAME)
    }
  )

  it('shows the whole value when the table has room for it', async () => {
    const { getAllByRole } = mount(1280, true)
    await settle()
    const cell = getAllByRole('cell').find((el) => el.textContent?.includes(LONG_NAME))!
    const text = cell.querySelector<HTMLElement>('.truncate')!
    expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
  })
})

describe('a copyable link in a wide cell', () => {
  it('keeps the copy button right after the value and its +N count', async () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h('div', { style: { width: '900px' } }, [
            h(TableCellLink, {
              label: 'resource-01.example.com',
              href: 'https://resource-01.example.com',
              more: [{ label: 'www.example.com', href: 'https://www.example.com' }],
              copyable: true
            })
          ])
      })
    )
    await settle()
    const more = view.getByTestId('table-cell-link__more').getBoundingClientRect()
    const copy = view.getByTestId('table-cell-link__copy').getBoundingClientRect()
    expect(copy.left).toBeGreaterThanOrEqual(more.right)
    expect(copy.left - more.right).toBeLessThan(24)
  })
})
