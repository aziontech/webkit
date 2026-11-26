import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import StatTile from '../components/chart/stat-tile/stat-tile.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

describe('StatTile while its figure counts up', () => {
  it('keeps the figure box at its final width, so the row never rewraps', async () => {
    const value = ref<number | null>(null)
    const screen = render({
      render: () =>
        h('div', { style: { width: '280px' } }, [
          h(StatTile, {
            label: 'Requests',
            value: value.value,
            delta: 12.4,
            deltaLabel: 'vs previous period',
            trend: [1, 3, 2, 5]
          })
        ])
    })
    await nextTick()
    value.value = 1_284_903_221
    await nextTick()
    const box = screen.getByTestId('stat-tile__value').parentElement as HTMLElement
    const tile = screen.getByTestId('stat-tile')
    const widths = new Set<number>()
    const heights = new Set<number>()
    for (let step = 0; step < 40; step += 1) {
      await frame()
      widths.add(Math.round(box.getBoundingClientRect().width))
      heights.add(Math.round(tile.getBoundingClientRect().height))
    }
    expect([...widths]).toHaveLength(1)
    expect([...heights]).toHaveLength(1)
  })
})
