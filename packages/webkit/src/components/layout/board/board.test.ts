import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ChartCard, {
  ChartCardContent,
  ChartCardDragHandle,
  ChartCardHeader,
  ChartCardResizeHandle,
  ChartCardTitle
} from '../../chart/chart-card/index'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Board, { BoardItem, type BoardLayoutItem } from './index'

const titles: Record<string, string> = {
  requests: 'Requests',
  regions: 'Regions',
  errors: 'Errors'
}

const initial = (): BoardLayoutItem[] => [
  { id: 'requests', span: 8 },
  { id: 'regions', span: 4 },
  { id: 'errors', span: 6, height: 400 }
]

function mount(props: Record<string, unknown> = {}, start = initial()) {
  const layout = ref<BoardLayoutItem[]>(start)
  const moves: unknown[] = []
  const resizes: unknown[] = []
  const board = () =>
    h(
      Board,
      {
        layout: layout.value,
        'onUpdate:layout': (next: BoardLayoutItem[]) => {
          layout.value = next
        },
        onItemMove: (payload: unknown) => moves.push(payload),
        onItemResize: (payload: unknown) => resizes.push(payload),
        style: 'width: 1200px',
        ...props
      },
      {
        default: () =>
          layout.value.map((item) =>
            h(
              BoardItem,
              { key: item.id, itemId: item.id, label: titles[item.id] },
              {
                default: () =>
                  h(ChartCard, null, {
                    default: () => [
                      h(ChartCardHeader, null, {
                        default: () => [
                          h(ChartCardDragHandle, { 'data-testid': `drag-${item.id}` }),
                          h(ChartCardTitle, null, { default: () => titles[item.id] })
                        ]
                      }),
                      h(ChartCardContent, null, { default: () => 'Plot' }),
                      h(ChartCardResizeHandle, { 'data-testid': `resize-${item.id}` })
                    ]
                  })
              }
            )
          )
      }
    )
  const view = render({ render: board })
  return { view, layout, moves, resizes }
}

const order = (layout: { value: BoardLayoutItem[] }) => layout.value.map((item) => item.id)

describe('Board', () => {
  it('attaches Item to the root for dot notation', () => {
    expect(Board.Item).toBe(BoardItem)
  })

  it('renders a named list with one item per entry and the fallback test ids', () => {
    const { view } = mount()
    const grid = view.getByTestId('layout-board__grid')
    expect(grid.tagName).toBe('UL')
    expect(grid.getAttribute('aria-label')).toBe('Dashboard')
    expect(view.getAllByTestId('layout-board-item')).toHaveLength(3)
    expect(view.getByTestId('layout-board').className).toContain('@container/board')
  })

  it('hides the handles until editing', async () => {
    const { view } = mount()
    expect(view.queryByTestId('drag-requests')).toBeNull()
    expect(view.queryByTestId('resize-requests')).toBeNull()
    view.unmount()
    const editing = mount({ editing: true })
    expect(editing.view.getByTestId('drag-requests')).toBeTruthy()
    expect(editing.view.getByTestId('layout-board').hasAttribute('data-editing')).toBe(true)
  })

  it('sizes each item from its layout entry', () => {
    const { view } = mount()
    const [first, , third] = view.getAllByTestId('layout-board-item')
    expect(first?.style.getPropertyValue('--board-item-span')).toBe('8')
    expect(third?.style.getPropertyValue('--board-item-height')).toBe('400px')
    expect(first?.offsetWidth).toBeGreaterThan(700)
  })

  it('moves an item from the keyboard, keeps focus on its handle and announces it', async () => {
    const { view, layout, moves } = mount({ editing: true })
    const handle = view.getByTestId('drag-requests')
    handle.focus()
    await fireEvent.keyDown(handle, { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    expect(order(layout)).toEqual(['regions', 'requests', 'errors'])
    expect(document.activeElement).toBe(view.getByTestId('drag-requests'))
    expect(view.getByTestId('layout-board__live').textContent?.trim()).toBe(
      'Requests moved to position 2 of 3.'
    )
    expect(moves).toEqual([{ id: 'requests', from: 0, to: 1 }])
    await fireEvent.keyDown(view.getByTestId('drag-requests'), { key: 'ArrowUp' })
    await fireEvent.keyDown(view.getByTestId('drag-requests'), { key: 'ArrowUp' })
    expect(order(layout)).toEqual(['requests', 'regions', 'errors'])
  })

  it('mirrors the arrow keys under rtl', async () => {
    const layout = ref<BoardLayoutItem[]>(initial())
    const view = render({
      render: () =>
        h(
          WebkitProvider,
          { dir: 'rtl' },
          {
            default: () =>
              h(
                Board,
                {
                  editing: true,
                  layout: layout.value,
                  'onUpdate:layout': (next: BoardLayoutItem[]) => {
                    layout.value = next
                  }
                },
                {
                  default: () =>
                    layout.value.map((item) =>
                      h(
                        BoardItem,
                        { key: item.id, itemId: item.id, label: titles[item.id] },
                        {
                          default: () =>
                            h(ChartCard, null, {
                              default: () => [
                                h(ChartCardHeader, null, {
                                  default: () => [
                                    h(ChartCardDragHandle, { 'data-testid': `drag-${item.id}` }),
                                    h(ChartCardTitle, null, { default: () => titles[item.id] })
                                  ]
                                })
                              ]
                            })
                        }
                      )
                    )
                }
              )
          }
        )
    })
    await fireEvent.keyDown(view.getByTestId('drag-requests'), { key: 'ArrowLeft' })
    expect(order(layout)).toEqual(['regions', 'requests', 'errors'])
  })

  it('resizes from the corner within the board bounds and announces it', async () => {
    const { view, layout, resizes } = mount({ editing: true, maxSpan: 10, minHeight: 280 })
    const corner = view.getByTestId('resize-requests')
    await fireEvent.keyDown(corner, { key: 'ArrowRight' })
    expect(layout.value[0]?.span).toBe(9)
    await fireEvent.keyDown(corner, { key: 'End' })
    await fireEvent.keyDown(corner, { key: 'ArrowRight' })
    expect(layout.value[0]?.span).toBe(10)
    expect(corner.getAttribute('aria-valuemax')).toBe('10')
    await fireEvent.keyDown(corner, { key: 'Home' })
    expect(layout.value[0]?.span).toBe(3)
    expect(view.getByTestId('layout-board__live').textContent?.trim()).toBe(
      'Requests resized to 3 of 12 columns.'
    )
    const errors = view.getByTestId('resize-errors')
    await fireEvent.keyDown(errors, { key: 'ArrowUp' })
    await fireEvent.keyDown(errors, { key: 'ArrowUp' })
    await fireEvent.keyDown(errors, { key: 'ArrowUp' })
    await fireEvent.keyDown(errors, { key: 'ArrowUp' })
    await fireEvent.keyDown(errors, { key: 'ArrowUp' })
    await fireEvent.keyDown(errors, { key: 'ArrowUp' })
    expect(layout.value[2]?.height).toBe(280)
    expect(view.getByTestId('layout-board__live').textContent?.trim()).toBe(
      'Errors resized to 6 of 12 columns, 280 pixels tall.'
    )
    expect(resizes.at(-1)).toEqual({ id: 'errors', span: 6, height: 280 })
  })

  it('reorders when a dragged card is dropped on another item', async () => {
    const { view, layout } = mount({ editing: true })
    const [first, , third] = view.getAllByTestId('layout-board-item')
    await fireEvent.pointerDown(view.getByTestId('drag-requests'))
    const card = first?.querySelector('section') as HTMLElement
    await fireEvent.dragStart(card)
    await fireEvent.dragOver(third as HTMLElement)
    expect(third?.hasAttribute('data-over')).toBe(true)
    expect(first?.hasAttribute('data-over')).toBe(false)
    await fireEvent.drop(third as HTMLElement)
    await fireEvent.dragEnd(card)
    expect(order(layout)).toEqual(['regions', 'errors', 'requests'])
  })

  it('ignores a drop when nothing is being dragged', async () => {
    const { view, layout } = mount({ editing: true })
    const [, second] = view.getAllByTestId('layout-board-item')
    await fireEvent.drop(second as HTMLElement)
    expect(order(layout)).toEqual(['requests', 'regions', 'errors'])
  })

  it('collapses to one column in a narrow container', () => {
    const { view } = mount({ style: 'width: 360px' })
    const grid = view.getByTestId('layout-board__grid')
    expect(getComputedStyle(grid).gridTemplateColumns.split(' ')).toHaveLength(1)
  })

  it('throws when an item renders outside a board', () => {
    expect(() => render(BoardItem, { props: { itemId: 'x' } })).toThrow(
      'Board.* sub-components must be used inside <Board>.'
    )
  })

  it('has no a11y violations, read-only and editing', async () => {
    for (const props of [{}, { editing: true }]) {
      const { view } = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
