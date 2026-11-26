import './reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h, nextTick } from 'vue'

import ChartDefault from '../../examples/chart/default.vue'
import CodeBlockDiff from '../../examples/code-block/computed-diff.vue'
import CodeEditorDiff from '../../examples/code-editor/diff.vue'
import LogViewerLevels from '../../examples/log-viewer/levels.vue'
import MapView from '../../examples/map-chart/view.vue'
import SparkCards from '../../examples/spark-chart/cards.vue'
import TraceDefault from '../../examples/trace/default.vue'
import TrackerDefault from '../../examples/tracker/default.vue'

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

describe('content stays readable at phone and desktop widths', () => {
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

  it('caps a tall map region at the 60dvh stage, so its key stays near the map', async () => {
    const { container } = inBox(MapView as Component, 1280)
    await settle()
    const plot = container.querySelector<HTMLElement>('[data-testid="map-chart__plot"]')!
    expect(plot.getBoundingClientRect().width).toBeGreaterThan(1200)
    expect(plot.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight * 0.6 + 1)
  })

  it.each([320, 390])(
    'merges tracker days into readable blocks at %ipx, worst state first',
    async (width) => {
      const { container } = inBox(TrackerDefault as Component, width)
      await settle()
      await settle()
      const blocks = Array.from(
        container.querySelectorAll<HTMLElement>('[data-testid="tracker__block"]')
      )
      expect(blocks.length).toBeLessThan(90)
      for (const block of blocks)
        expect(block.getBoundingClientRect().width).toBeGreaterThanOrEqual(5.5)
      const severities = blocks.map((block) => block.dataset['severity'])
      expect(severities).toContain('danger')
      expect(severities).toContain('warning')
    }
  )

  it.each([
    [390, 0],
    [1280, 1]
  ])('draws a split diff side by side only when it fits (%ipx)', async (width, splits) => {
    const { container } = inBox(CodeBlockDiff as Component, width)
    await settle()
    await settle()
    expect(container.querySelectorAll('[data-testid="code-block__split"]').length).toBe(splits)
  })

  it('gives each stacked code editor diff pane the full editor height at 390px', async () => {
    const { container } = inBox(CodeEditorDiff as Component, 390)
    await settle()
    await settle()
    const area = container.querySelector<HTMLElement>('[data-testid="code-editor__area"]')!
    const height = Number.parseFloat(
      getComputedStyle(area).getPropertyValue('--code-editor-height')
    )
    const panes = Array.from(area.children).filter((el) => el.getBoundingClientRect().height > 0)
    expect(panes.length).toBe(2)
    for (const pane of panes) {
      expect(pane.getBoundingClientRect().height).toBeGreaterThanOrEqual(height * 16 - 1)
    }
  })

  it.each(['ltr', 'rtl'] as const)(
    'puts each trace span name on its own line at 390px (%s)',
    async (dir) => {
      const { container } = render(
        defineComponent({
          setup: () => () =>
            h('div', { dir, style: { width: '390px' } }, [h(TraceDefault as Component)])
        })
      )
      await settle()
      await settle()
      const names = Array.from(
        container.querySelectorAll<HTMLElement>('[data-testid="trace__name"]')
      )
      expect(names.length).toBeGreaterThan(2)
      for (const name of names) {
        expect(name.scrollWidth, name.textContent ?? '').toBeLessThanOrEqual(name.clientWidth)
      }
      const duration = container.querySelector<HTMLElement>('[data-testid="trace__bar"] bdi')
      expect(duration?.textContent).toMatch(/^\d[\d.,]*\s?m?s$/)
    }
  )

  it('starts every log line at the left edge in right-to-left', async () => {
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h('div', { dir: 'rtl', style: { width: '390px' } }, [h(LogViewerLevels as Component)])
      })
    )
    await settle()
    await settle()
    const body = container.querySelector<HTMLElement>('[data-testid$="__body"]')!
    const frame = body.getBoundingClientRect()
    const lines = Array.from(
      container.querySelectorAll<HTMLElement>('[data-testid="log-viewer__line"]')
    )
    expect(lines.length).toBeGreaterThan(0)
    for (const line of lines)
      expect(line.getBoundingClientRect().left).toBeGreaterThanOrEqual(frame.left - 1)
  })
})
