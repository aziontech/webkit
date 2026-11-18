import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ChartPageEntry from '../../examples/chart/page-entry.vue'
import FlowDiagramPageEntry from '../../examples/flow-diagram/page-entry.vue'
import StatTileGroupPageEntry from '../../examples/stat-tile-group/page-entry.vue'
import Chart from '../components/chart/chart/chart.vue'
import ChartLine from '../components/chart/chart/chart-line/chart-line.vue'
import Texture from '../components/content/texture/texture.vue'
import MediaSplitSection from '../components/section/media-split-section/media-split-section.vue'

const chart = () =>
  h(
    Chart,
    {
      ariaLabel: 'Requests',
      labels: ['13:00', '13:05', '13:10'],
      series: [{ id: 'requests', name: 'Requests', values: [3, 5, 4] }]
    },
    () => h(ChartLine)
  )

const band = (content: () => unknown) =>
  render({
    render: () =>
      h('div', { class: 'relative h-64 w-[40rem]' }, [
        h(Texture, { variant: 'pixelate' }),
        h('div', { class: 'relative z-10' }, [content()])
      ])
  })

const painted = (element: Element | null) =>
  element !== null && getComputedStyle(element).display !== 'none'

const settle = () => new Promise((done) => requestAnimationFrame(() => setTimeout(done, 50)))

describe('Texture is a backdrop for text only', () => {
  it('paints behind text', () => {
    const { container } = band(() => h('h2', 'Watch every threat as it happens'))
    expect(painted(container.querySelector('[data-slot="texture"]'))).toBe(true)
  })

  it('drops itself when the content beside it holds a chart', () => {
    const { container } = band(chart)
    expect(container.querySelector('[data-graphic]')).not.toBeNull()
    expect(painted(container.querySelector('[data-slot="texture"]'))).toBe(false)
  })

  it('stays under a graphic that sits on its own opaque ground', () => {
    const { container } = band(() => h('div', { 'data-ground': '' }, [chart()]))
    expect(painted(container.querySelector('[data-slot="texture"]'))).toBe(true)
  })

  it('drops the band texture under a chart scene in the media cell', async () => {
    const { container } = render(MediaSplitSection, {
      props: {
        title: 'Requests',
        texture: 'pixelate',
        scene: {
          component: 'Chart',
          props: {
            ariaLabel: 'Requests',
            labels: ['13:00', '13:05'],
            series: [{ id: 'requests', name: 'Requests', values: [3, 5] }]
          }
        }
      }
    })
    await expect.poll(() => container.querySelector('[data-graphic]')).not.toBeNull()
    const texture = container.querySelector('[data-slot="texture"]')
    expect(texture).not.toBeNull()
    expect(painted(texture)).toBe(false)
  })

  it.each([
    ['Chart', ChartPageEntry],
    ['FlowDiagram', FlowDiagramPageEntry],
    ['StatTileGroup', StatTileGroupPageEntry]
  ])('paints no texture under the %s page JSON scene', async (_name, Example) => {
    const { container } = render(Example)
    await settle()
    await expect.poll(() => container.querySelector('[data-graphic]')).not.toBeNull()
    const graphic = container.querySelector('[data-graphic]')!.getBoundingClientRect()
    const under = [...container.querySelectorAll('[data-slot="texture"]')]
      .filter(painted)
      .map((texture) => texture.getBoundingClientRect())
      .filter(
        (box) =>
          box.width > 0 &&
          box.height > 0 &&
          Math.min(box.right, graphic.right) > Math.max(box.left, graphic.left) &&
          Math.min(box.bottom, graphic.bottom) > Math.max(box.top, graphic.top)
      )
    expect(under).toEqual([])
  })
})
