import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, Teleport } from 'vue'

import {
  computePlacement,
  type ComputePlacementInput,
  getClippingBoundary,
  type Rect,
  usePlacement
} from './index'

const rect = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height
})

const VIEWPORT = rect(0, 0, 1000, 600)

const base = (overrides: Partial<ComputePlacementInput>): ComputePlacementInput => ({
  triggerRect: rect(100, 100, 200, 40),
  panelSize: { width: 240, height: 200 },
  boundary: VIEWPORT,
  placement: 'bottom-start',
  flip: true,
  offset: 4,
  collisionPadding: 8,
  ...overrides
})

describe('computePlacement (pure geometry)', () => {
  it('keeps the preferred side when it fits and reports no cap', () => {
    const r = computePlacement(base({}))
    expect(r.placement).toBe('bottom-start')
    expect(r.top).toBe(144)
    expect(r.left).toBe(100)
    expect(r.maxHeight).toBeNull()
    expect(r.maxWidth).toBeNull()
  })

  it('flips to the opposite side (alignment preserved) when only that side fits', () => {
    // Trigger 100px from the bottom edge: a 200px panel fits above, not below.
    const r = computePlacement(base({ triggerRect: rect(100, 460, 200, 40) }))
    expect(r.placement).toBe('top-start')
    expect(r.top).toBe(460 - 200 - 4)
    expect(r.maxHeight).toBeNull()
  })

  it('shrinks on the roomier side when neither side fits, never overlapping the trigger', () => {
    // 300 above, 260 below: a 400px panel fits nowhere, so it takes the roomier side.
    const trigger = rect(100, 300, 200, 40)
    const r = computePlacement(
      base({ triggerRect: trigger, panelSize: { width: 240, height: 400 } })
    )
    expect(r.placement).toBe('top-start')
    expect(r.maxHeight).toBe(300 - 4 - 8)
    expect(r.height).toBe(r.maxHeight)
    expect(r.top).toBe(8)
    expect(r.top + r.height).toBeLessThanOrEqual(trigger.top - 4)
  })

  it('caps to the free space below when below is the roomier side', () => {
    const trigger = rect(100, 60, 200, 40) // 60 above, 500 below
    const r = computePlacement(
      base({ triggerRect: trigger, panelSize: { width: 240, height: 900 } })
    )
    expect(r.placement).toBe('bottom-start')
    expect(r.top).toBe(104)
    expect(r.maxHeight).toBe(600 - 104 - 8)
    expect(r.top + r.height).toBe(600 - 8)
  })

  it('placement=auto picks the first candidate that fits, in preference order', () => {
    const r = computePlacement(
      base({
        placement: 'auto',
        autoPlacements: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
        triggerRect: rect(100, 460, 200, 40)
      })
    )
    expect(r.placement).toBe('top-start')
  })

  it('shifts the panel back inside a boundary narrower than the viewport', () => {
    const boundary = rect(0, 0, 300, 600)
    const r = computePlacement(base({ boundary, triggerRect: rect(200, 100, 80, 40) }))
    expect(r.left + r.width).toBeLessThanOrEqual(300 - 8)
    expect(r.left).toBeGreaterThanOrEqual(8)
  })

  it('bounds the main axis by the boundary, not the viewport', () => {
    const boundary = rect(0, 0, 1000, 300)
    const r = computePlacement(base({ boundary, triggerRect: rect(100, 200, 200, 40) }))
    // 200 above, 60 below inside the boundary: flips up and caps to the space above.
    expect(r.placement).toBe('top-start')
    expect(r.maxHeight).toBe(200 - 4 - 8)
    expect(r.top).toBe(8)
  })

  it('matchTriggerWidth keeps the panel exactly under the trigger, even at the edge', () => {
    const trigger = rect(0, 100, 1000, 40)
    const r = computePlacement(
      base({
        triggerRect: trigger,
        panelSize: { width: 1000, height: 100 },
        matchTriggerWidth: true
      })
    )
    expect(r.left).toBe(0)
    expect(r.width).toBe(1000)
    expect(r.maxWidth).toBeNull()
  })

  it('applies a per-axis collision padding to that axis only', () => {
    // A sheet pinned to a page column: 300px of horizontal inset, 8px vertically.
    const r = computePlacement(
      base({
        triggerRect: rect(320, 20, 120, 40),
        panelSize: { width: 400, height: 200 },
        collisionPadding: { x: 300, y: 8 }
      })
    )
    // Horizontal: shifted back to the column's leading edge.
    expect(r.left).toBe(300)
    // Vertical: still anchored to the trigger, not pushed down by the horizontal inset.
    expect(r.top).toBe(64)
    expect(r.maxHeight).toBeNull()
  })

  it('caps the panel across the axis its own padding leaves, not the other one', () => {
    const r = computePlacement(
      base({
        triggerRect: rect(320, 20, 120, 40),
        panelSize: { width: 900, height: 200 },
        collisionPadding: { x: 300, y: 8 }
      })
    )
    expect(r.width).toBe(VIEWPORT.width - 2 * 300)
    expect(r.maxWidth).toBe(VIEWPORT.width - 2 * 300)
    expect(r.height).toBe(200)
    expect(r.maxHeight).toBeNull()
  })

  it('a scalar collision padding still insets both axes', () => {
    const r = computePlacement(base({ triggerRect: rect(0, 20, 120, 40), collisionPadding: 24 }))
    expect(r.left).toBe(24)
    expect(r.top).toBe(64)
  })
})

describe('getClippingBoundary', () => {
  afterEach(() => {
    document.body.querySelectorAll('[data-fixture]').forEach((el) => el.remove())
  })

  const mount = (html: string) => {
    const host = document.createElement('div')
    host.setAttribute('data-fixture', '')
    host.innerHTML = html
    document.body.appendChild(host)
    return host.querySelector('button') as HTMLElement
  }
  const viewport = () => ({ width: window.innerWidth, height: window.innerHeight })

  it('is the scrolling ancestor intersected with the viewport, per overflowing axis', () => {
    const trigger = mount(`
      <div style="position:fixed;top:100px;left:50px;width:300px;height:200px;overflow:auto">
        <div style="height:1000px"><button type="button">t</button></div>
      </div>`)
    const scroller = trigger.parentElement!.parentElement as HTMLElement
    const b = getClippingBoundary(trigger, viewport())
    const s = scroller.getBoundingClientRect()
    expect(b.top).toBeCloseTo(s.top, 0)
    expect(b.bottom).toBeCloseTo(s.top + scroller.clientHeight, 0)
    // Only the vertical axis overflows, so horizontally the viewport still bounds.
    expect(b.left).toBe(0)
    expect(b.right).toBe(window.innerWidth)
  })

  it('ignores overflow:hidden ancestors', () => {
    const trigger = mount(`
      <div style="position:fixed;top:100px;left:50px;width:300px;height:40px;overflow:hidden">
        <div style="height:1000px"><button type="button">t</button></div>
      </div>`)
    const b = getClippingBoundary(trigger, viewport())
    expect(b).toEqual({ ...rect(0, 0, window.innerWidth, window.innerHeight) })
  })

  it('ignores an overflow:auto ancestor whose content does not overflow', () => {
    const trigger = mount(`
      <div style="position:fixed;top:100px;left:50px;width:300px;height:400px;overflow:auto">
        <div style="height:100px"><button type="button">t</button></div>
      </div>`)
    const b = getClippingBoundary(trigger, viewport())
    expect(b.height).toBe(window.innerHeight)
    expect(b.width).toBe(window.innerWidth)
  })
})

describe('usePlacement (composable, real layout)', () => {
  afterEach(() => {
    document.body.querySelectorAll('[data-testid="up-panel"]').forEach((el) => el.remove())
  })

  const Host = defineComponent({
    props: {
      rows: { type: Number, default: 100 },
      triggerStyle: {
        type: String,
        default: 'position:fixed;top:8px;left:8px;width:180px;height:32px'
      }
    },
    setup(props) {
      const triggerRef = ref<HTMLElement | null>(null)
      const panelRef = ref<HTMLElement | null>(null)
      const isOpen = ref(true)
      const placement = usePlacement({
        triggerRef,
        panelRef,
        isOpen,
        placement: 'bottom-start',
        matchTriggerWidth: true
      })
      return () => [
        h('button', { ref: triggerRef, type: 'button', style: props.triggerStyle }, 'trigger'),
        h(Teleport, { to: 'body' }, [
          h(
            'div',
            {
              ref: panelRef,
              'data-testid': 'up-panel',
              style: { ...placement.panelStyle.value, overflowY: 'auto' }
            },
            Array.from({ length: props.rows }, (_, i) =>
              h('div', { key: i, style: 'height:24px' }, `row ${i}`)
            )
          )
        ])
      ]
    }
  })

  const panel = () => document.body.querySelector<HTMLElement>('[data-testid="up-panel"]')!

  it('caps a panel taller than the space below and keeps it inside the viewport', async () => {
    const { getByText } = render(Host)
    await nextTick()
    await nextTick()
    const trigger = getByText('trigger')
    const p = panel()
    const pr = p.getBoundingClientRect()
    const tr = trigger.getBoundingClientRect()

    expect(p.style.maxHeight).not.toBe('')
    expect(pr.top).toBeGreaterThanOrEqual(tr.bottom)
    expect(pr.bottom).toBeLessThanOrEqual(window.innerHeight - 8 + 1)
    expect(Math.abs(pr.width - tr.width)).toBeLessThanOrEqual(1)
    expect(p.scrollHeight).toBeGreaterThan(p.clientHeight)
  })

  it('reaches the same cap on a repeated update (no drift from measuring the shrunk box)', async () => {
    render(Host)
    await nextTick()
    await nextTick()
    const first = panel().style.maxHeight
    // Drive a third pass the way a resize would.
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(panel().style.maxHeight).toBe(first)
    expect(first).not.toBe('')
  })

  it('flips above the trigger when only the top fits', async () => {
    render(Host, {
      props: { rows: 6, triggerStyle: 'position:fixed;bottom:8px;left:8px;width:180px;height:32px' }
    })
    await nextTick()
    await nextTick()
    const tr = document.querySelector('button')!.getBoundingClientRect()
    const pr = panel().getBoundingClientRect()
    expect(pr.bottom).toBeLessThanOrEqual(tr.top)
    expect(panel().style.maxHeight).toBe('')
  })
})
