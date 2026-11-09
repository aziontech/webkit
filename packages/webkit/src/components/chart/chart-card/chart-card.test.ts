import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Chart, { ChartLine } from '../chart/index'
import ChartCard, {
  ChartCardContent,
  ChartCardControls,
  ChartCardDescription,
  ChartCardDragHandle,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardResizeHandle,
  ChartCardTitle
} from './index'

const card = (props: Record<string, unknown> = {}, content: () => unknown = () => 'Plot') =>
  h(ChartCard, props, {
    default: () => [
      h(ChartCardHeader, null, {
        default: () => [
          h(ChartCardDragHandle),
          h(ChartCardTitle, null, { default: () => 'Threats vs requests' }),
          h(ChartCardControls, null, { default: () => 'Sum' })
        ]
      }),
      h(ChartCardDescription, null, { default: () => 'Requests WAF analyzed.' }),
      h(ChartCardContent, null, { default: content }),
      h(ChartCardFooter, null, { default: () => 'Last 24 hours' }),
      h(ChartCardResizeHandle)
    ]
  })

describe('ChartCard', () => {
  it('attaches its parts to the root for dot notation', () => {
    expect(ChartCard).toBeTruthy()
    expect(ChartCard?.Header).toBe(ChartCardHeader)
    expect(ChartCard?.Title).toBe(ChartCardTitle)
    expect(ChartCard?.Description).toBe(ChartCardDescription)
    expect(ChartCard?.Controls).toBe(ChartCardControls)
    expect(ChartCard?.DragHandle).toBe(ChartCardDragHandle)
    expect(ChartCard?.Content).toBe(ChartCardContent)
    expect(ChartCard?.Footer).toBe(ChartCardFooter)
    expect(ChartCard?.ResizeHandle).toBe(ChartCardResizeHandle)
  })

  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = render(card())
    expect(fallback.getByTestId('chart-chart-card').tagName).toBe('SECTION')
    fallback.unmount()
    expect(render(card({ 'data-testid': 'threats-card' })).getByTestId('threats-card')).toBeTruthy()
  })

  it('is named by its title and described by its description', async () => {
    const view = render(card())
    await nextTick()
    const root = view.getByTestId('chart-chart-card')
    expect(document.getElementById(root.getAttribute('aria-labelledby') ?? '')?.textContent).toBe(
      'Threats vs requests'
    )
    expect(document.getElementById(root.getAttribute('aria-describedby') ?? '')?.textContent).toBe(
      'Requests WAF analyzed.'
    )
  })

  it('names the chart inside it after its title and description', () => {
    const view = render(
      card({}, () =>
        h(
          Chart,
          { series: [{ id: 'a', name: 'A', values: [1, 2] }], labels: ['a', 'b'] },
          {
            default: () => [h(ChartLine)]
          }
        )
      )
    )
    const plot = view.getByTestId('chart-chart__plot')
    expect(document.getElementById(plot.getAttribute('aria-labelledby') ?? '')?.textContent).toBe(
      'Threats vs requests'
    )
    expect(plot.getAttribute('aria-describedby')).toContain(
      view.getByTestId('chart-chart-card__description').id
    )
  })

  it('applies span and height through custom properties', () => {
    const view = render(card({ span: 12, height: 552 }))
    const root = view.getByTestId('chart-chart-card')
    expect(root.style.getPropertyValue('--chart-card-span')).toBe('12')
    expect(root.style.getPropertyValue('--chart-card-height')).toBe('552px')
  })

  it('renders the handles only when enabled', () => {
    const plain = render(card())
    expect(plain.queryByTestId('chart-chart-card__drag-handle')).toBeNull()
    expect(plain.queryByTestId('chart-chart-card__resize-handle')).toBeNull()
    plain.unmount()

    const both = render(card({ draggable: true, resizable: true }))
    expect(both.getByTestId('chart-chart-card__drag-handle').getAttribute('aria-label')).toBe(
      'Move card'
    )
    expect(both.getByTestId('chart-chart-card__resize-handle').getAttribute('role')).toBe(
      'separator'
    )
  })

  it('emits move with the event first and the direction second from the drag handle', async () => {
    const moves: unknown[][] = []
    const view = render(card({ draggable: true, onMove: (...args: unknown[]) => moves.push(args) }))
    const handle = view.getByTestId('chart-chart-card__drag-handle')
    await fireEvent.keyDown(handle, { key: 'ArrowRight' })
    await fireEvent.keyDown(handle, { key: 'ArrowUp' })
    await fireEvent.keyDown(handle, { key: 'Enter' })
    expect(moves.map((args) => args[1])).toEqual(['right', 'up'])
    expect(moves[0]?.[0]).toBeInstanceOf(KeyboardEvent)
  })

  it('arms native drag only while the handle is pressed', async () => {
    const view = render(card({ draggable: true }))
    const root = view.getByTestId('chart-chart-card')
    const handle = view.getByTestId('chart-chart-card__drag-handle')
    expect(root.getAttribute('draggable')).toBeNull()
    await fireEvent.pointerDown(handle)
    expect(root.getAttribute('draggable')).toBe('true')
    await fireEvent.dragStart(root)
    expect(root.hasAttribute('data-dragging')).toBe(true)
    expect(view.emitted('drag-start')).toHaveLength(1)
    await fireEvent.dragEnd(root)
    expect(root.hasAttribute('data-dragging')).toBe(false)
    expect(root.getAttribute('draggable')).toBeNull()
    expect(view.emitted('drag-end')).toHaveLength(1)
  })

  it('resizes from the keyboard within its bounds', async () => {
    const span = ref(6)
    const height = ref<number | undefined>(400)
    const ends: unknown[][] = []
    const view = render({
      render: () =>
        card({
          resizable: true,
          span: span.value,
          height: height.value,
          maxSpan: 8,
          'onUpdate:span': (next: number) => {
            span.value = next
          },
          'onUpdate:height': (next: number | undefined) => {
            height.value = next
          },
          onResizeEnd: (...args: unknown[]) => ends.push(args)
        })
    })
    const handle = view.getByTestId('chart-chart-card__resize-handle')
    await fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(span.value).toBe(7)
    await fireEvent.keyDown(handle, { key: 'End' })
    expect(span.value).toBe(8)
    await fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(span.value).toBe(8)
    await fireEvent.keyDown(handle, { key: 'ArrowDown' })
    expect(height.value).toBe(424)
    await fireEvent.keyDown(handle, { key: 'Home' })
    expect(span.value).toBe(3)
    expect(handle.getAttribute('aria-valuenow')).toBe('3')
    expect(handle.getAttribute('aria-valuetext')).toBe('3 of 8 columns, 424 pixels tall')
    expect(ends.length).toBeGreaterThan(0)
  })

  it('resizes the height by pointer drag and restores it on Escape', async () => {
    const height = ref<number | undefined>(400)
    const view = render({
      render: () =>
        h(
          'div',
          { style: 'display: grid; grid-template-columns: repeat(12, 1fr); width: 1200px' },
          [
            card({
              resizable: true,
              height: height.value,
              'onUpdate:height': (next: number | undefined) => {
                height.value = next
              }
            })
          ]
        )
    })
    const handle = view.getByTestId('chart-chart-card__resize-handle')
    const rendered = view.getByTestId('chart-chart-card').offsetHeight
    await fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientX: 100, clientY: 100 })
    await fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100, clientY: 160 })
    expect(height.value).toBe(Math.max(240, rendered + 60))
    await fireEvent.keyDown(handle, { key: 'Escape' })
    expect(height.value).toBe(400)
  })

  it('pads content unless flush', () => {
    const view = render(
      h(ChartCard, null, {
        default: () => [h(ChartCardContent, { flush: true }, { default: () => 'x' })]
      })
    )
    expect(view.getByTestId('chart-chart-card__content').hasAttribute('data-flush')).toBe(true)
  })

  it('throws when a part renders outside a card', () => {
    expect(() => render(ChartCardTitle)).toThrow(
      'ChartCard.* sub-components must be used inside <ChartCard>.'
    )
  })

  it('has no a11y violations with and without handles', async () => {
    for (const props of [{}, { draggable: true, resizable: true, height: 552 }]) {
      const view = render(card(props))
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
