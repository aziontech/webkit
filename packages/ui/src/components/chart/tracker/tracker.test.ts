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
    props: { items: week, ariaLabel: 'Application uptime, last 4 days', ...props }
  })

const activeIndexOf = (view: ReturnType<typeof mount>) =>
  view.getAllByTestId('tracker__block').findIndex((block) => block.hasAttribute('data-active'))

describe('Tracker', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('tracker')).toBeTruthy()
    fallback.unmount()
    expect(mount({ 'data-testid': 'uptime' }).getByTestId('uptime')).toBeTruthy()
  })

  it('is one named tab stop with a status history role description', () => {
    const root = mount().getByTestId('tracker')
    expect(root.getAttribute('role')).toBe('group')
    expect(root.getAttribute('aria-roledescription')).toBe('status history')
    expect(root.getAttribute('aria-label')).toBe('Application uptime, last 4 days')
    expect(root.getAttribute('tabindex')).toBe('0')
  })

  it('renders one block per item and marks missing severity as none', () => {
    const blocks = mount().getAllByTestId('tracker__block')
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
    const root = view.getByTestId('tracker')
    const live = view.getByTestId('tracker__live')
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
    const root = view.getByTestId('tracker')
    expect(
      view.getAllByTestId('tracker__block').some((block) => block.hasAttribute('data-dimmed'))
    ).toBe(false)
    await fireEvent.keyDown(root, { key: 'Home' })
    const dimmed = view
      .getAllByTestId('tracker__block')
      .map((block) => block.hasAttribute('data-dimmed'))
    expect(dimmed).toEqual([false, true, true, true])
  })

  it('activates the block under the pointer and clears on leave', async () => {
    const view = mount()
    const strip = view.getByTestId('tracker__strip')
    const rect = strip.getBoundingClientRect()

    await fireEvent.pointerMove(strip, { clientX: rect.left + rect.width * 0.9, clientY: rect.top })
    expect(activeIndexOf(view)).toBe(3)

    await fireEvent.pointerMove(strip, { clientX: rect.left + 1, clientY: rect.top })
    expect(activeIndexOf(view)).toBe(0)

    await fireEvent.pointerLeave(strip)
    expect(activeIndexOf(view)).toBe(-1)
  })

  it('opens the readout on a touch tap and keeps it until a tap outside', async () => {
    const view = mount()
    const strip = view.getByTestId('tracker__strip')
    const rect = strip.getBoundingClientRect()
    const at = { clientX: rect.left + rect.width * 0.9, clientY: rect.top, pointerType: 'touch' }
    await fireEvent.pointerDown(strip, at)
    await fireEvent.pointerUp(strip, at)
    await fireEvent.pointerLeave(strip, at)
    expect(activeIndexOf(view)).toBe(3)
    expect(view.getByTestId('tracker__readout').getAttribute('data-state')).toBe('open')
    await fireEvent.pointerDown(document.body, { pointerType: 'touch' })
    await fireEvent.click(document.body)
    expect(activeIndexOf(view)).toBe(-1)
  })

  it('offers Try again in the Error example and draws the strip once it is pressed', async () => {
    const { default: ErrorExample } = await import('../../../../examples/tracker/error.vue')
    const view = render(ErrorExample)
    expect(view.getByRole('alert').textContent).toContain('Uptime could not be loaded.')
    await fireEvent.click(view.getByRole('button', { name: 'Try again' }))
    expect(view.queryByRole('alert')).toBeNull()
    expect(view.getAllByTestId('tracker__block').length).toBeGreaterThan(1)
  })

  it('shows the active label in an aria-hidden readout', async () => {
    const view = mount()
    const root = view.getByTestId('tracker')
    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    const readout = view.getByTestId('tracker__readout')
    expect(readout.getAttribute('aria-hidden')).toBe('true')
    expect(readout.getAttribute('data-state')).toBe('open')
    expect(readout.textContent?.trim()).toBe('Nov 5 · Degraded performance')

    await fireEvent.keyDown(root, { key: 'Escape' })
    expect(view.getByTestId('tracker__readout').getAttribute('data-state')).toBe('closed')
  })

  it('renders a Skeleton strip while loading and suppresses the blocks', async () => {
    const view = mount({ loading: true })
    const root = view.getByTestId('tracker')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(view.getByTestId('tracker__loading')).toBeTruthy()
    expect(view.queryAllByTestId('tracker__block')).toHaveLength(0)

    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(view.getByTestId('tracker__live').textContent?.trim()).toBe('')
  })

  it('renders one neutral block and announces No data when empty', async () => {
    const view = mount({ items: [] })
    const blocks = view.getAllByTestId('tracker__block')
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.getAttribute('data-severity')).toBe('none')
    expect(view.getByTestId('tracker__live').textContent?.trim()).toBe('No data')
    expect(blocks[0]?.textContent?.trim()).toBe('No data')

    await fireEvent.keyDown(view.getByTestId('tracker'), { key: 'ArrowRight' })
    expect(blocks[0]?.hasAttribute('data-active')).toBe(false)
  })

  it('reads the data in browse mode: a summary with the worst state and one entry per period', () => {
    const view = mount()
    const root = view.getByTestId('tracker')
    const summary = view.getByTestId('tracker__summary')
    expect(root.getAttribute('aria-describedby')).toBe(summary.id)
    expect(summary.textContent?.trim()).toBe('4 periods. Worst: Nov 6 · Partial outage')
    expect(
      Array.from(view.getByTestId('tracker__list').querySelectorAll('li')).map((li) =>
        li.textContent?.trim()
      )
    ).toEqual(week.map((item) => item.label))
  })

  it('colors each block by its severity field, and a missing severity as no data', () => {
    const view = render(Tracker, {
      props: {
        items: [
          { severity: 'danger', label: 'A' },
          { label: 'B' },
          { severity: 'success', label: 'C' }
        ]
      }
    })
    expect(view.getAllByTestId('tracker__block').map((block) => block.dataset['severity'])).toEqual(
      ['danger', 'none', 'success']
    )
  })

  it('syncs the active block through v-model:active-index', async () => {
    const view = mount({ activeIndex: 2 })
    expect(activeIndexOf(view)).toBe(2)
    const strip = view.getByTestId('tracker')
    await fireEvent.keyDown(strip, { key: 'ArrowRight' })
    expect(view.emitted()['update:activeIndex']?.at(-1)).toEqual([3])
  })

  it('shows the error inline in place of the blocks', () => {
    const view = mount({ error: 'Uptime could not be loaded.' })
    expect(view.getByRole('alert').textContent).toContain('Uptime could not be loaded.')
    expect(view.queryAllByTestId('tracker__block')).toHaveLength(0)
    expect(view.queryByTestId('tracker__summary')).toBeNull()
  })

  it('has no axe violations on the default, loading and empty renders', async () => {
    const defaultView = mount()
    await fireEvent.keyDown(defaultView.getByTestId('tracker'), { key: 'Home' })
    await expectNoA11yViolations(defaultView.container)
    defaultView.unmount()

    const loadingView = mount({ loading: true })
    await expectNoA11yViolations(loadingView.container)
    loadingView.unmount()

    const emptyView = mount({ items: [] })
    await expectNoA11yViolations(emptyView.container)
  })
})
