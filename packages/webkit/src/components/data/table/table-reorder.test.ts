import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import ReorderableRows from '../../../../examples/table/reorderable-rows.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Table from './index'

type Row = { id: string; name: string }

const seed = (): Row[] => [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Bravo' },
  { id: 'c', name: 'Charlie' },
  { id: 'd', name: 'Delta' }
]

const handles = (root: Document | HTMLElement = document): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-reorder-handle]'))
const order = (root: Document | HTMLElement = document): string[] =>
  handles(root).map((handle) => handle.getAttribute('data-reorder-handle') ?? '')
const status = (): string =>
  document.body.querySelector('[data-testid="data-table__reorder-status"]')?.textContent ?? ''

const mountTable = (extra: Record<string, unknown> = {}) => {
  const data = ref<Row[]>(seed())
  const events: { from: number; to: number; row: Row }[] = []
  const Host = defineComponent({
    setup: () => () =>
      h(Table, {
        data: data.value,
        'onUpdate:data': (next: Row[]) => (data.value = next),
        onReorder: (payload: { from: number; to: number; row: Row }) => events.push(payload),
        columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
        rowKey: 'id',
        reorderable: true,
        stackable: false,
        ...extra
      })
  })
  const view = render(Host)
  return { view, data, events }
}

afterEach(() => cleanup())

describe('Table reorderable rows', () => {
  it('renders a named grip per row and a labelled order column', () => {
    const { view } = mountTable()
    expect(handles()).toHaveLength(4)
    expect(view.getByRole('button', { name: 'Reorder Alpha, position 1 of 4' })).toBeTruthy()
    expect(view.getByRole('columnheader', { name: 'Order' })).toBeTruthy()
    const hint = document.getElementById(handles()[0].getAttribute('aria-describedby')!)
    expect(hint?.textContent).toContain('Arrow Up')
  })

  it('moves the focused row with the arrow keys, Home and End, and announces it', async () => {
    const { data, events } = mountTable()
    handles()[0].focus()
    await fireEvent.keyDown(handles()[0], { key: 'ArrowDown' })
    expect(data.value.map((row) => row.id)).toEqual(['b', 'a', 'c', 'd'])
    expect(events[0]).toMatchObject({ from: 0, to: 1, row: { id: 'a' } })
    await waitFor(() => expect(status()).toBe('Moved Alpha to position 2 of 4.'))
    await waitFor(() =>
      expect((document.activeElement as HTMLElement).getAttribute('data-reorder-handle')).toBe('a')
    )

    await fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'End' })
    expect(data.value.map((row) => row.id)).toEqual(['b', 'c', 'd', 'a'])
    await fireEvent.keyDown(handles()[1], { key: 'Home' })
    expect(data.value.map((row) => row.id)).toEqual(['c', 'b', 'd', 'a'])
    await fireEvent.keyDown(handles()[0], { key: 'ArrowUp' })
    expect(data.value.map((row) => row.id)).toEqual(['c', 'b', 'd', 'a'])
    expect(order()).toEqual(['c', 'b', 'd', 'a'])
  })

  it('drags a row onto another with the pointer', async () => {
    const { data } = mountTable()
    const [first] = handles()
    const target = document.body.querySelector<HTMLElement>('[data-reorder-row="c"]')!
    const box = target.getBoundingClientRect()
    await fireEvent.pointerDown(first, { button: 0, pointerId: 1, clientX: 4, clientY: 4 })
    expect(
      document.body.querySelector('[data-reorder-row="a"]')!.hasAttribute('data-dragging')
    ).toBe(true)
    await fireEvent.pointerMove(first, {
      pointerId: 1,
      clientX: box.left + 4,
      clientY: box.top + box.height / 2
    })
    expect(target.getAttribute('data-drop')).toBe('after')
    await fireEvent.pointerUp(first, { pointerId: 1 })
    expect(data.value.map((row) => row.id)).toEqual(['b', 'c', 'a', 'd'])
    await waitFor(() => expect(status()).toBe('Dropped Alpha at position 3 of 4.'))
  })

  it('cancels a drag with Escape', async () => {
    const { data } = mountTable()
    const [first] = handles()
    await fireEvent.pointerDown(first, { button: 0, pointerId: 1 })
    await fireEvent.keyDown(first, { key: 'Escape' })
    await fireEvent.pointerUp(first, { pointerId: 1 })
    expect(data.value.map((row) => row.id)).toEqual(['a', 'b', 'c', 'd'])
    await waitFor(() => expect(status()).toBe('Reorder cancelled.'))
  })

  it('locks the grips while a sort is applied', async () => {
    const { data } = mountTable({ sorting: [{ id: 'name', desc: true }] })
    expect(handles().every((handle) => handle.hasAttribute('disabled'))).toBe(true)
    await fireEvent.keyDown(handles()[0], { key: 'ArrowDown' })
    expect(data.value.map((row) => row.id)).toEqual(['a', 'b', 'c', 'd'])
    const hint = document.getElementById(handles()[0].getAttribute('aria-describedby')!)
    expect(hint?.textContent).toBe('Clear the sort to reorder rows.')
  })

  it('does not render grips unless reorderable', () => {
    mountTable({ reorderable: false })
    expect(handles()).toHaveLength(0)
  })

  it('keeps grips with row selection and maps positions under pagination', async () => {
    const { data } = mountTable({ enableRowSelection: true, paginated: true, pageSize: 2 })
    expect(handles()).toHaveLength(2)
    expect(
      document.body.querySelectorAll('[role="checkbox"], input[type="checkbox"]').length
    ).toBeGreaterThan(0)
    await fireEvent.keyDown(handles()[1], { key: 'ArrowUp' })
    expect(data.value.map((row) => row.id)).toEqual(['b', 'a', 'c', 'd'])
  })

  it('reads the active locale', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          {
            default: () =>
              h(Table, {
                data: seed(),
                columns: [{ accessorKey: 'name', header: 'Nome' }],
                rowKey: 'id',
                reorderable: true,
                stackable: false
              })
          }
        )
    })
    const view = render(Host)
    expect(view.getByRole('button', { name: 'Reordenar Alpha, posição 1 de 4' })).toBeTruthy()
  })

  it('works under rtl', async () => {
    const Host = defineComponent({
      setup: () => {
        const data = ref<Row[]>(seed())
        return () =>
          h('div', { dir: 'rtl' }, [
            h(Table, {
              data: data.value,
              'onUpdate:data': (next: Row[]) => (data.value = next),
              columns: [{ accessorKey: 'name', header: 'Name' }],
              rowKey: 'id',
              reorderable: true,
              stackable: false
            })
          ])
      }
    })
    render(Host)
    await fireEvent.keyDown(handles()[2], { key: 'ArrowUp' })
    expect(order()).toEqual(['a', 'c', 'b', 'd'])
  })

  it('has no axe violations', async () => {
    const view = render(ReorderableRows)
    await expectNoA11yViolations(view.container)
  })
})
