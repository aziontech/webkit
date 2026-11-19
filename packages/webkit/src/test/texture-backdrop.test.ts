import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import CardPageEntry from '../../examples/card/page-entry.vue'
import ChartPageEntry from '../../examples/chart/page-entry.vue'
import CodeBlockPageEntry from '../../examples/code-block/page-entry.vue'
import EmbedPageEntry from '../../examples/embed/page-entry.vue'
import FlowDiagramPageEntry from '../../examples/flow-diagram/page-entry.vue'
import KeyValueListPageEntry from '../../examples/key-value-list/page-entry.vue'
import StatTileGroupPageEntry from '../../examples/stat-tile-group/page-entry.vue'
import Chart from '../components/chart/chart/chart.vue'
import ChartLine from '../components/chart/chart/chart-line/chart-line.vue'
import Texture from '../components/content/texture/texture.vue'
import SitePage from '../components/marketing/site-page/site-page.vue'
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

const SCENE_PROPS: Record<string, Record<string, unknown>> = {
  PlanFeatureList: { items: [{ label: 'Unlimited Applications' }] }
}

describe('Texture is a backdrop for text only', () => {
  it('paints behind text', () => {
    const { container } = band(() => h('h2', 'Watch every threat as it happens'))
    expect(painted(container.querySelector('[data-slot="texture"]'))).toBe(true)
  })

  it('drops itself when the content beside it holds a chart', () => {
    const { container } = band(chart)
    expect(container.querySelector('[data-plain-ground]')).not.toBeNull()
    expect(painted(container.querySelector('[data-slot="texture"]'))).toBe(false)
  })

  it('stays under a graphic that sits on its own opaque ground', () => {
    const { container } = band(() => h('div', { 'data-opaque': '' }, [chart()]))
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
    await expect.poll(() => container.querySelector('[data-plain-ground]')).not.toBeNull()
    const texture = container.querySelector('[data-slot="texture"]')
    expect(texture).not.toBeNull()
    expect(painted(texture)).toBe(false)
  })

  it.each([
    ['Chart', ChartPageEntry],
    ['FlowDiagram', FlowDiagramPageEntry],
    ['StatTileGroup', StatTileGroupPageEntry],
    ['Card', CardPageEntry],
    ['CodeBlock', CodeBlockPageEntry],
    ['Embed', EmbedPageEntry],
    ['KeyValueList', KeyValueListPageEntry]
  ])('paints no texture under the %s page JSON scene', async (_name, Example) => {
    const { container } = render(Example)
    await settle()
    await expect.poll(() => container.querySelector('[data-plain-ground]')).not.toBeNull()
    const graphic = container.querySelector('[data-plain-ground]')!.getBoundingClientRect()
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

  it('marks a page JSON content scene for a plain ground and drops the band texture under it', async () => {
    const { container } = render(SitePage, {
      props: {
        sections: [
          {
            _id: 'console-showcase-section',
            props: { title: 'Workloads', texture: 'pixelate' },
            scenes: {
              scene: {
                component: 'Card',
                props: { title: 'Production' },
                children: ['Serves shop.example.com.']
              }
            }
          }
        ]
      }
    })
    await expect.poll(() => container.querySelector('[data-plain-ground]')).not.toBeNull()
    const band = container.querySelector('[data-testid="console-showcase-section"]')!
    const texture = band.querySelector('[data-slot="texture"]')
    expect(texture).not.toBeNull()
    expect(painted(texture)).toBe(false)
  })

  it('keeps the band texture under a console window scene', async () => {
    const { container } = render(SitePage, {
      props: {
        sections: [
          {
            _id: 'console-showcase-section',
            props: { title: 'Console' },
            scenes: { scene: { component: 'ConsoleMockup' } }
          }
        ]
      }
    })
    await expect
      .poll(() =>
        container.querySelector('[data-testid="console-showcase-section"] [data-slot="texture"]')
      )
      .not.toBeNull()
    const texture = container.querySelector(
      '[data-testid="console-showcase-section"] [data-slot="texture"]'
    )
    expect(
      container.querySelector('[data-testid="console-showcase-section"] [data-plain-ground]')
    ).toBeNull()
    expect(painted(texture)).toBe(true)
  })

  it.each([
    'Accordion',
    'BarList',
    'Card',
    'Chart',
    'CodeBlock',
    'DonutChart',
    'Embed',
    'FlowDiagram',
    'GaugeChart',
    'IntegrationCard',
    'KeyValueList',
    'MapChart',
    'PlanFeatureList',
    'SparkChart',
    'StatTile',
    'StatTileGroup',
    'Tracker'
  ])('carries the plain-ground mark onto the root of a %s scene', async (component) => {
    const { container } = render(SitePage, {
      props: {
        sections: [
          {
            _id: 'console-showcase-section',
            props: { variant: 'diagram', title: 'Scene' },
            scenes: { scene: { component, props: SCENE_PROPS[component] ?? {} } }
          }
        ]
      }
    })
    await expect.poll(() => container.querySelector('[data-plain-ground]')).not.toBeNull()
  })
})
