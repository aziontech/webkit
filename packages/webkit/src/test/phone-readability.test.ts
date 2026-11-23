import './reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h, nextTick } from 'vue'

import ChartDefault from '../../examples/chart/default.vue'
import SparkCards from '../../examples/spark-chart/cards.vue'

const settle = async (): Promise<void> => {
  await nextTick()
  await new Promise((done) => requestAnimationFrame(() => done(null)))
}

const inBox = (view: Component, width: number) =>
  render(
    defineComponent({
      setup: () => () => h('div', { style: { width: `${width}px` } }, [h(view)])
    })
  )

describe('content stays readable in a phone-width box', () => {
  it.each([320, 390])('spark-chart cards keep every metric name whole at %ipx', async (width) => {
    const { container } = inBox(SparkCards as Component, width)
    await settle()
    const labels = Array.from(container.querySelectorAll<HTMLElement>('li .truncate'))
    expect(labels.length).toBeGreaterThan(0)
    for (const label of labels) {
      expect(label.scrollWidth, label.textContent ?? '').toBeLessThanOrEqual(label.clientWidth)
    }
  })

  it.each(['ltr', 'rtl'] as const)(
    'keeps the chart tooltip inside the chart at 390px (%s)',
    async (dir) => {
      const { container } = render(
        defineComponent({
          setup: () => () =>
            h('div', { dir, style: { width: '390px' } }, [h(ChartDefault as Component)])
        })
      )
      await settle()
      const stage = container.querySelector<HTMLElement>('[tabindex="0"]')!
      stage.focus()
      const host = container.querySelector<HTMLElement>('[data-testid="chart-tooltip"]')!
      for (let step = 0; step < 12; step += 1) {
        await fireEvent.keyDown(stage, { key: dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight' })
        await settle()
        await new Promise((done) => setTimeout(done, 250))
        const panel = host.querySelector<HTMLElement>('[data-side]')
        if (!panel) continue
        const box = panel.getBoundingClientRect()
        const frame = host.getBoundingClientRect()
        expect(box.left, `step ${step}`).toBeGreaterThanOrEqual(frame.left - 1)
        expect(box.right, `step ${step}`).toBeLessThanOrEqual(frame.right + 1)
      }
    }
  )
})
