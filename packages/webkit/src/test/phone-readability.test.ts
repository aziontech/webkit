import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h, nextTick } from 'vue'

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
})
