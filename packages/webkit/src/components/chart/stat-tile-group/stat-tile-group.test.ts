import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import KindsExample from '../../../../examples/stat-tile/kinds.vue'
import BesideCardExample from '../../../../examples/stat-tile-group/beside-card.vue'
import DefaultExample from '../../../../examples/stat-tile-group/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import StatTile from '../stat-tile/stat-tile.vue'
import StatTileGroup from './stat-tile-group.vue'

const Strip = (props: Record<string, unknown> = {}) =>
  defineComponent({
    setup: () => () =>
      h(StatTileGroup, props, {
        default: () => [
          h(StatTile, { label: 'Data transferred', value: 842, unit: 'GB', delta: 12.4 }),
          h(StatTile, { label: 'Requests / second', value: 1240, unit: '/s', delta: 3.8 })
        ]
      })
  })

describe('StatTileGroup', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = render(Strip())
    expect(fallback.getByTestId('chart-stat-tile-group')).toBeTruthy()
    expect(fallback.getByTestId('chart-stat-tile-group__cells')).toBeTruthy()
    fallback.unmount()
    const custom = render(Strip({ 'data-testid': 'usage' }))
    expect(custom.getByTestId('usage')).toBeTruthy()
    expect(custom.getByTestId('usage__cells')).toBeTruthy()
  })

  it('is a group, named by ariaLabel when set', () => {
    const unnamed = render(Strip())
    const root = unnamed.getByRole('group')
    expect(root).not.toHaveAttribute('aria-label')
    unnamed.unmount()
    const named = render(Strip({ ariaLabel: 'Usage' }))
    expect(named.getByRole('group', { name: 'Usage' })).toBeTruthy()
  })

  it('turns every StatTile inside it into a grouped cell, in slot order', () => {
    const view = render(Strip())
    const cells = view.getAllByTestId('chart-stat-tile')
    expect(cells).toHaveLength(2)
    for (const cell of cells) expect(cell).toHaveAttribute('data-grouped')
    expect(
      view.getAllByRole('region').map((region) => region.getAttribute('aria-labelledby'))
    ).toHaveLength(2)
    expect(cells[0].textContent).toContain('Data transferred')
    expect(cells[1].textContent).toContain('Requests / second')
  })

  it('keeps each cell named and its delta readable', () => {
    const view = render(Strip())
    const [first] = view.getAllByTestId('chart-stat-tile__delta-tag')
    expect(first.textContent).toContain('+12.4%')
    expect(view.getByRole('region', { name: 'Data transferred' })).toBeTruthy()
  })

  it('renders the Default example as four grouped cells under dir="rtl"', () => {
    const InRtl = defineComponent({
      setup: () => () => h('div', { dir: 'rtl' }, [h(DefaultExample)])
    })
    const view = render(InRtl)
    expect(view.getByRole('group', { name: 'Usage' })).toBeTruthy()
    const cells = view.getAllByTestId('chart-stat-tile')
    expect(cells).toHaveLength(4)
    for (const cell of cells) expect(cell).toHaveAttribute('data-grouped')
  })

  it('has no axe violations in the Default example and the StatTile Kinds example', async () => {
    const strip = render(DefaultExample)
    await expectNoA11yViolations(strip.container)
    strip.unmount()
    const kinds = render(KindsExample)
    await expectNoA11yViolations(kinds.container)
  })

  it('renders the BesideCard example: the strip and its neighbour card share one row', async () => {
    const view = render(BesideCardExample)
    const group = view.getByRole('group', { name: 'Usage' })
    expect(group.parentElement).toBe(view.getByTestId('content-card').parentElement)
    expect(view.getAllByTestId('chart-stat-tile')).toHaveLength(4)
    await expectNoA11yViolations(view.container)
  })
})
