import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import StatTile from '../components/chart/stat-tile/stat-tile.vue'

const mount = (width: number, value: number) =>
  render(() =>
    h('div', { style: { width: `${width}px` } }, [
      h(StatTile, {
        label: 'Requests',
        value,
        delta: 12.5,
        deltaLabel: 'vs previous 24 hours',
        trend: [1, 3, 2, 4]
      })
    ])
  )

const lines = (view: ReturnType<typeof mount>) => {
  const figure = view.getByTestId('stat-tile__value').getBoundingClientRect()
  const delta = view.getByTestId('stat-tile__delta').getBoundingClientRect()
  return { figure, delta, sameLine: delta.top < figure.bottom }
}

describe('the StatTile figure row (styled)', () => {
  it('keeps the delta on the figure line from --container-3xs, however wide the figure grows', async () => {
    for (const value of [12, 123456789012]) {
      const view = mount(320, value)
      await nextTick()
      expect(lines(view).sameLine, String(value)).toBe(true)
      const row = view.getByTestId('stat-tile__figure-row').getBoundingClientRect()
      expect(lines(view).delta.right).toBeLessThanOrEqual(row.right + 0.5)
      view.unmount()
    }
  })

  it('puts the delta under the figure in a tile narrower than --container-3xs, whatever the figure', async () => {
    for (const value of [12, 123456]) {
      const view = mount(200, value)
      await nextTick()
      expect(lines(view).sameLine, String(value)).toBe(false)
      view.unmount()
    }
  })
})
