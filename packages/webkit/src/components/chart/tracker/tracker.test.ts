import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Tracker, { type TrackerItem } from './tracker.vue'

const week: TrackerItem[] = [
  { severity: 'success', label: 'Nov 4 · Operational' },
  { severity: 'warning', label: 'Nov 5 · Degraded performance' },
  { severity: 'danger', label: 'Nov 6 · Partial outage' },
  { label: 'Nov 7 · No data' }
]

const mount = (props: Record<string, unknown> = {}) =>
  render(Tracker, {
    props: { items: week, ariaLabel: 'Edge Application uptime, last 4 days', ...props }
  })

const activeIndexOf = (view: ReturnType<typeof mount>) =>
  view
    .getAllByTestId('chart-tracker__block')
    .findIndex((block) => block.hasAttribute('data-active'))

describe('Tracker', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('chart-tracker')).toBeTruthy()
    fallback.unmount()
    expect(mount({ 'data-testid': 'uptime' }).getByTestId('uptime')).toBeTruthy()
  })

  it('is one named tab stop with a status history role description', () => {
    const root = mount().getByTestId('chart-tracker')
    expect(root.getAttribute('role')).toBe('group')
    expect(root.getAttribute('aria-roledescription')).toBe('status history')
    expect(root.getAttribute('aria-label')).toBe('Edge Application uptime, last 4 days')
    expect(root.getAttribute('tabindex')).toBe('0')
  })

  it('renders one block per item and marks missing severity as none', () => {
    const blocks = mount().getAllByTestId('chart-tracker__block')
    expect(blocks).toHaveLength(4)
    expect(blocks.map((block) => block.getAttribute('data-severity'))).toEqual([
      'success',
      'warning',
      'danger',
      'none'
    ])
  })

  it('walks the blocks from the keyboard and announces the active label', async () => {
    const view = mount()
    const root = view.getByTestId('chart-tracker')
    const live = view.getByTestId('chart-tracker__live')
    root.focus()

    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(activeIndexOf(view)).toBe(0)
    expect(live.textContent?.trim()).toBe('Nov 4 · Operational')

    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(activeIndexOf(view)).toBe(1)

    await fireEvent.keyDown(root, { key: 'ArrowLeft' })
    expect(activeIndexOf(view)).toBe(0)

    await fireEvent.keyDown(root, { key: 'ArrowLeft' })
    expect(activeIndexOf(view)).toBe(0)

    await fireEvent.keyDown(root, { key: 'End' })
    expect(activeIndexOf(view)).toBe(3)
    expect(live.textContent?.trim()).toBe('Nov 7 · No data')

    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(activeIndexOf(view)).toBe(3)

    await fireEvent.keyDown(root, { key: 'Home' })
    expect(activeIndexOf(view)).toBe(0)

    await fireEvent.keyDown(root, { key: 'Escape' })
    expect(activeIndexOf(view)).toBe(-1)
    expect(live.textContent?.trim()).toBe('')

    await fireEvent.keyDown(root, { key: 'ArrowLeft' })
    expect(activeIndexOf(view)).toBe(3)
  })

  it('dims every block except the active one', async () => {
    const view = mount()
    const root = view.getByTestId('chart-tracker')
    expect(
      view.getAllByTestId('chart-tracker__block').some((block) => block.hasAttribute('data-dimmed'))
    ).toBe(false)
    await fireEvent.keyDown(root, { key: 'Home' })
    const dimmed = view
      .getAllByTestId('chart-tracker__block')
      .map((block) => block.hasAttribute('data-dimmed'))
    expect(dimmed).toEqual([false, true, true, true])
  })

  it('activates the block under the pointer and clears on leave', async () => {
    const view = mount()
    const strip = view.getByTestId('chart-tracker__strip')
    const rect = strip.getBoundingClientRect()

    await fireEvent.pointerMove(strip, { clientX: rect.left + rect.width * 0.9, clientY: rect.top })
    expect(activeIndexOf(view)).toBe(3)

    await fireEvent.pointerMove(strip, { clientX: rect.left + 1, clientY: rect.top })
    expect(activeIndexOf(view)).toBe(0)

    await fireEvent.pointerLeave(strip)
    expect(activeIndexOf(view)).toBe(-1)
  })

  it('shows the active label in an aria-hidden readout', async () => {
    const view = mount()
    const root = view.getByTestId('chart-tracker')
    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    const readout = view.getByTestId('chart-tracker__readout')
    expect(readout.getAttribute('aria-hidden')).toBe('true')
    expect(readout.hasAttribute('data-visible')).toBe(true)
    expect(readout.textContent?.trim()).toBe('Nov 5 · Degraded performance')

    await fireEvent.keyDown(root, { key: 'Escape' })
    expect(view.getByTestId('chart-tracker__readout').hasAttribute('data-visible')).toBe(false)
  })

  it('renders a Skeleton strip while loading and suppresses the blocks', async () => {
    const view = mount({ loading: true })
    const root = view.getByTestId('chart-tracker')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(view.getByTestId('chart-tracker__skeleton')).toBeTruthy()
    expect(view.queryAllByTestId('chart-tracker__block')).toHaveLength(0)

    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(view.getByTestId('chart-tracker__live').textContent?.trim()).toBe('')
  })

  it('renders one neutral block and announces No data when empty', async () => {
    const view = mount({ items: [] })
    const blocks = view.getAllByTestId('chart-tracker__block')
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.getAttribute('data-severity')).toBe('none')
    expect(view.getByTestId('chart-tracker__live').textContent?.trim()).toBe('No data')

    await fireEvent.keyDown(view.getByTestId('chart-tracker'), { key: 'ArrowRight' })
    expect(blocks[0]?.hasAttribute('data-active')).toBe(false)
  })

  it('has no axe violations on the default, loading and empty renders', async () => {
    const defaultView = mount()
    await fireEvent.keyDown(defaultView.getByTestId('chart-tracker'), { key: 'Home' })
    await expectNoA11yViolations(defaultView.container)
    defaultView.unmount()

    const loadingView = mount({ loading: true })
    await expectNoA11yViolations(loadingView.container)
    loadingView.unmount()

    const emptyView = mount({ items: [] })
    await expectNoA11yViolations(emptyView.container)
  })
})
