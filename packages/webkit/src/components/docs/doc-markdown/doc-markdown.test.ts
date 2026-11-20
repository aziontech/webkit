import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import BarListMarkdown from '../../../../examples/bar-list/markdown.vue'
import CarouselMarkdown from '../../../../examples/carousel/markdown.vue'
import ChartMarkdown from '../../../../examples/chart/markdown.vue'
import ConsoleMockupMarkdown from '../../../../examples/console-mockup/markdown.vue'
import DiagramMarkdown from '../../../../examples/diagram/markdown.vue'
import DocAgentCardMarkdown from '../../../../examples/doc-agent-card/markdown.vue'
import DocCallToActionMarkdown from '../../../../examples/doc-call-to-action/markdown.vue'
import Components from '../../../../examples/doc-markdown/components.vue'
import Default from '../../../../examples/doc-markdown/default.vue'
import DonutChartMarkdown from '../../../../examples/donut-chart/markdown.vue'
import EmbedMarkdown from '../../../../examples/embed/markdown.vue'
import FaqMarkdown from '../../../../examples/faq/markdown.vue'
import FlowDiagramMarkdown from '../../../../examples/flow-diagram/markdown.vue'
import GaugeChartMarkdown from '../../../../examples/gauge-chart/markdown.vue'
import IllustrationMarkdown from '../../../../examples/illustration/markdown.vue'
import IntegrationCardMarkdown from '../../../../examples/integration-card/markdown.vue'
import KeyValueListMarkdown from '../../../../examples/key-value-list/markdown.vue'
import MapChartMarkdown from '../../../../examples/map-chart/markdown.vue'
import NetworkMapMarkdown from '../../../../examples/network-map/markdown.vue'
import PlanFeatureListMarkdown from '../../../../examples/plan-feature-list/markdown.vue'
import PricingCardMarkdown from '../../../../examples/pricing-card/markdown.vue'
import QuoteMarkdown from '../../../../examples/quote/markdown.vue'
import SparkChartMarkdown from '../../../../examples/spark-chart/markdown.vue'
import StatTileMarkdown from '../../../../examples/stat-tile/markdown.vue'
import StatTileGroupMarkdown from '../../../../examples/stat-tile-group/markdown.vue'
import StatsMarkdown from '../../../../examples/stats/markdown.vue'
import ThirdPartyLogoMarkdown from '../../../../examples/third-party-logo/markdown.vue'
import TrackerMarkdown from '../../../../examples/tracker/markdown.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocMarkdown, { parseDocMarkdown } from './doc-markdown.vue'
import { parseAttributes } from './parse-doc-markdown'

const mount = (source: string, extra: Record<string, unknown> = {}, options = {}) =>
  render(DocMarkdown, { props: { source, ...extra }, ...options })

describe('DocMarkdown', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(mount('Hello').getByTestId('doc-markdown')).toBeTruthy()
    expect(mount('Hello', { 'data-testid': 'page-body' }).getByTestId('page-body')).toBeTruthy()
  })

  it('renders headings as DocHeading with unique slug ids and drops the frontmatter', () => {
    const { container, getByRole, queryByText } = mount(
      '---\ntitle: First deploy\n---\n\n## Test it\n\nOne.\n\n## Test it\n\n### Use `acme deploy`'
    )
    expect(queryByText('title: First deploy')).toBeNull()
    const ids = [...container.querySelectorAll('h2, h3')].map((el) => el.id)
    expect(ids).toEqual(['test-it', 'test-it-2', 'use-acme-deploy'])
    expect(getByRole('heading', { level: 3 }).querySelector('code')?.textContent).toBe(
      'acme deploy'
    )
  })

  it('renders paragraphs, inline markup, lists, quotes, rules and tables', async () => {
    const { container, findByRole, findAllByRole, findByTestId } = mount(
      [
        'Run **only** the *first* step with `acme login`.',
        '',
        '- One',
        '  - Nested',
        '- Two',
        '',
        '1. First',
        '2. Second',
        '',
        '> Quoted',
        '',
        '---',
        '',
        '| Name | Size |',
        '| :--- | ---: |',
        '| site-assets | 12 MB |'
      ].join('\n')
    )
    expect(container.querySelector('strong')?.textContent).toBe('only')
    expect(container.querySelector('em')?.textContent).toBe('first')
    expect(container.querySelector('p code')?.textContent).toBe('acme login')
    expect(container.querySelector('ul ul li')?.textContent).toBe('Nested')
    expect(container.querySelectorAll('ol li')).toHaveLength(2)
    expect(container.querySelector('blockquote')?.textContent).toContain('Quoted')
    expect(container.querySelector('hr')).toBeTruthy()
    expect(await findByRole('table')).toBeTruthy()
    expect((await findByTestId('table')).hasAttribute('data-doc-chrome')).toBe(true)
    const headers = await findAllByRole('columnheader')
    expect(headers.map((cell) => cell.textContent?.trim())).toEqual(['Name', 'Size'])
    expect(headers[1]!.getAttribute('data-align')).toBe('end')
    expect(await findByRole('cell', { name: 'site-assets' })).toBeTruthy()
  })

  it('mounts the documentation components for the MDX tags', async () => {
    const { getByTestId, getAllByTestId, getByText, findByText } = mount(
      [
        '<Warning>Deleting a bucket removes its objects.</Warning>',
        '',
        '<Steps>',
        '  <Step title="Install">Run the installer.</Step>',
        '  <Step title="Log in">Use your token.</Step>',
        '</Steps>',
        '',
        '<CardGroup cols={2}>',
        '  <Card title="Domains" href="/docs/domains">Point a domain.</Card>',
        '  <Card title="Cache" href="/docs/cache">Cache assets.</Card>',
        '</CardGroup>',
        '',
        '<ItemGroup>',
        '  <Item title="SQL" icon="az az-database">Store relational data.</Item>',
        '</ItemGroup>',
        '',
        '<AccordionGroup>',
        '  <Accordion title="Is there a free tier?">Yes.</Accordion>',
        '</AccordionGroup>',
        '',
        '<Update label="March 2, 2026" tags={["CLI", "API"]}>Faster deploys.</Update>'
      ].join('\n')
    )
    expect(getByTestId('doc-callout').getAttribute('data-variant')).toBe('warning')
    expect(getAllByTestId('doc-steps-step')).toHaveLength(2)
    expect(getByText('Domains')).toBeTruthy()
    expect(await findByText('Store relational data.')).toBeTruthy()
    expect(await findByText('Is there a free tier?')).toBeTruthy()
    expect(getByTestId('doc-changelog-entry').id).toBe('march-2-2026')
    expect(getByText('CLI')).toBeTruthy()
  })

  it('renders an AccordionGroup tag as DocAccordionGroup whose items open and close', async () => {
    const user = userEvent.setup()
    const { container, findByRole, findByTestId } = mount(
      [
        '<AccordionGroup>',
        '  <Accordion title="Is there a free tier?">Yes, with every product.</Accordion>',
        '  <Accordion title="Can I purge one path?">Purge by URL.</Accordion>',
        '</AccordionGroup>'
      ].join('\n')
    )
    expect(await findByTestId('doc-accordion-group')).toBeTruthy()
    const trigger = await findByRole('button', { name: 'Is there a free tier?' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(await findByRole('region', { name: 'Is there a free tier?' })).toBeTruthy()
    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await expectNoA11yViolations(container)
  })

  it('renders a Tabs tag as Tabs with one tab and panel per Tab title', async () => {
    const user = userEvent.setup()
    const { container, findByRole, getByRole } = mount(
      [
        '<Tabs>',
        '  <Tab title="Console">Open Settings, then Domains.</Tab>',
        '  <Tab title="CLI">Run the link command.</Tab>',
        '</Tabs>'
      ].join('\n')
    )
    const consoleTab = await findByRole('tab', { name: 'Console' })
    expect(consoleTab.getAttribute('aria-selected')).toBe('true')
    expect(container.querySelector('[data-testid="tabs"]')?.hasAttribute('data-doc-block')).toBe(
      true
    )
    expect(getByRole('tabpanel').textContent).toContain('Open Settings, then Domains.')
    await user.click(getByRole('tab', { name: 'CLI' }))
    expect(getByRole('tab', { name: 'CLI' }).getAttribute('aria-selected')).toBe('true')
    expect(getByRole('tabpanel').textContent).toContain('Run the link command.')
    await expectNoA11yViolations(container)
  })

  it('collapses a CodeGroup into one tabbed block labelled from each fence', async () => {
    const { findAllByRole } = mount(
      [
        '<CodeGroup>',
        '```bash npm',
        'npm i acme',
        '```',
        '```bash pnpm',
        'pnpm add acme',
        '```',
        '</CodeGroup>'
      ].join('\n')
    )
    const tabs = (await findAllByRole('tab')).map((tab) => tab.textContent?.trim())
    expect(tabs).toEqual(['npm', 'pnpm'])
  })

  it('renders an inline Tooltip inside a sentence and keeps the rest of the line', () => {
    const { container } = mount(
      'An <Tooltip tip="Application programming interface">API</Tooltip> key is required.'
    )
    expect(container.querySelector('p')?.textContent).toContain('API')
    expect(container.querySelector('p')?.textContent).toContain('key is required.')
  })

  it('opens the inline Tooltip as a HoverCard with its title, definition and link on focus', async () => {
    const { getByRole } = mount(
      'An <Tooltip title="API" tip="Application programming interface" linkLabel="Read more" href="/docs/api">API</Tooltip> key.'
    )
    const term = getByRole('button', { name: 'API' })
    await userEvent.tab()
    expect(document.activeElement).toBe(term)
    await vi.waitFor(() => {
      const card = document.body.querySelector('[data-testid="hover-card-content"]')
      expect(card?.textContent).toContain('Application programming interface')
      expect(term.getAttribute('aria-describedby')).toBe(card?.id)
    })
    const card = document.body.querySelector('[data-testid="hover-card-content"]') as HTMLElement
    expect(
      within(card)
        .getByRole('link', { name: /Read more/ })
        .getAttribute('href')
    ).toBe('/docs/api')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() =>
      expect(document.body.querySelector('[data-testid="hover-card-content"]')).toBeNull()
    )
  })

  it('maps the Markdown CardGroup cols attribute to DocCardGroup columns', () => {
    const { getByTestId } = mount(
      [
        '<CardGroup cols={3}>',
        '  <Card title="Domains">Point a domain.</Card>',
        '</CardGroup>'
      ].join('\n')
    )
    expect(getByTestId('doc-card-group').getAttribute('data-columns')).toBe('3')
  })

  it('keeps unknown tags and unsafe links as text', () => {
    const { container, queryByRole, getByText } = mount(
      '<Banner>Hi</Banner>\n\nA [bad link](javascript:alert(1)) here.'
    )
    expect(getByText(/<Banner>Hi<\/Banner>/)).toBeTruthy()
    expect(queryByRole('link')).toBeNull()
    expect(container.textContent).toContain('bad link')
  })

  it('announces an external link that opens a new tab', () => {
    const { getByRole } = mount('Read the [guide](https://example.com/docs).')
    const link = getByRole('link', { name: /guide/ })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.textContent).toContain('(opens in a new tab)')
  })

  it('follows an in-app link with the router', async () => {
    const router = { push: vi.fn(), currentRoute: ref({ path: '/docs' }) }
    const { getByRole } = mount(
      'See [domains](/docs/domains).',
      {},
      {
        global: { config: { globalProperties: { $router: router } } }
      }
    )
    await userEvent.click(getByRole('link', { name: 'domains' }))
    expect(router.push).toHaveBeenCalledWith('/docs/domains')
  })

  it('mounts a tag through the components override and adds a custom block tag', () => {
    const Badge = defineComponent({
      props: { label: { type: String, default: '' } },
      setup:
        (props, { slots }) =>
        () =>
          h('mark', { 'data-label': props.label }, slots['default']?.())
    })
    const { container } = mount('<Card title="Plain" />\n\n<Badge label="New">Fresh</Badge>', {
      components: { Card: Badge, Badge }
    })
    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(2)
    expect(marks[1]!.getAttribute('data-label')).toBe('New')
    expect(marks[1]!.textContent).toBe('Fresh')
  })

  it('reads braced JSON arrays and objects as data, and keeps the loose list form', () => {
    expect(
      parseAttributes(
        'nodes={[{ "id": "a", "title": "Say {hi}" }, { id: \'b\', metrics: [{ label: "p95", value: "9 ms" }], }]} options={{ "open": true }} tags={[CLI, API]} uniform'
      )
    ).toEqual({
      nodes: [
        { id: 'a', title: 'Say {hi}' },
        { id: 'b', metrics: [{ label: 'p95', value: '9 ms' }] }
      ],
      options: { open: true },
      tags: ['CLI', 'API'],
      uniform: true
    })
  })

  it('renders a FlowDiagram tag with JSON nodes and edges as a real FlowDiagram', async () => {
    const { container, findByRole, findByText } = render(FlowDiagramMarkdown)
    const diagram = await findByRole('group', { name: 'Request path' })
    expect(diagram.hasAttribute('data-doc-chrome')).toBe(true)
    expect(await findByText('api.example.com')).toBeTruthy()
    expect(within(diagram).getAllByRole('listitem').length).toBeGreaterThanOrEqual(3)
    expect(within(diagram).getByText('Azion')).toBeTruthy()
    await expectNoA11yViolations(container)
  })

  it.each([
    ['bar-list', BarListMarkdown],
    ['chart', ChartMarkdown],
    ['donut-chart', DonutChartMarkdown],
    ['gauge-chart', GaugeChartMarkdown],
    ['key-value-list', KeyValueListMarkdown],
    ['embed', EmbedMarkdown],
    ['integration-card', IntegrationCardMarkdown],
    ['plan-feature-list', PlanFeatureListMarkdown],
    ['carousel', CarouselMarkdown],
    ['console-mockup', ConsoleMockupMarkdown],
    ['diagram', DiagramMarkdown],
    ['doc-agent-card', DocAgentCardMarkdown],
    ['doc-call-to-action', DocCallToActionMarkdown],
    ['faq', FaqMarkdown],
    ['illustration', IllustrationMarkdown],
    ['network-map', NetworkMapMarkdown],
    ['pricing-card', PricingCardMarkdown],
    ['quote', QuoteMarkdown],
    ['stats', StatsMarkdown],
    ['third-party-logo', ThirdPartyLogoMarkdown],
    ['map-chart', MapChartMarkdown],
    ['spark-chart', SparkChartMarkdown],
    ['stat-tile', StatTileMarkdown],
    ['stat-tile-group', StatTileGroupMarkdown],
    ['tracker', TrackerMarkdown]
  ])(
    'renders the %s tag of its Markdown example as the real component',
    async (testId, example) => {
      const { container, findByTestId } = render(example)
      const root = await findByTestId(testId)
      expect(root.closest('[data-doc-chrome]')).toBeTruthy()
      expect(root.closest('[data-doc-block]')).toBeTruthy()
      await expectNoA11yViolations(container)
    }
  )

  it('renders the text between part tags as the part value, with inline Markdown', async () => {
    const { findByTestId, getByRole } = render(KeyValueListMarkdown)
    const list = await findByTestId('key-value-list')
    await waitFor(() => expect(within(list).getAllByTestId('key-value-list-item')).toHaveLength(6))
    const items = within(list).getAllByTestId('key-value-list-item')
    expect(items[3]!.querySelector('dd')!.textContent).toBe('US East (Virginia)')
    expect(items[0]!.querySelector('dd code')!.textContent).toBe('1752167890')
    expect(items[1]!.querySelector('dd strong')!.textContent).toBe('Active')
    const link = getByRole('link', { name: /shop\.example\.com/ })
    expect(link.getAttribute('href')).toBe('https://shop.example.com')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(items[5]!.querySelector('dd')!.textContent).toContain('—')
  })

  it('renders the slides of a Carousel tag with its controls, and tags inside a slide', async () => {
    const { findByTestId, findAllByTestId } = render(CarouselMarkdown)
    const carousel = await findByTestId('carousel')
    await waitFor(() => expect(within(carousel).getAllByTestId('quote')).toHaveLength(3))
    expect(await findAllByTestId('carousel-previous')).toHaveLength(1)
    expect(await findAllByTestId('carousel-next')).toHaveLength(1)
  })

  it('frames a background layer and a mockup so they have a size to fill', async () => {
    const map = render(NetworkMapMarkdown)
    const layer = await map.findByTestId('network-map')
    expect(layer.parentElement!.hasAttribute('data-doc-block')).toBe(true)
    map.unmount()
    const mockup = render(ConsoleMockupMarkdown)
    const shell = await mockup.findByTestId('console-mockup')
    expect(shell.parentElement!.hasAttribute('data-doc-chrome')).toBe(true)
  })

  it('renders the part tags inside a Chart or StatTileGroup tag as its parts', async () => {
    const chart = render(ChartMarkdown)
    expect((await chart.findAllByText('WAF requests allowed')).length).toBeGreaterThan(0)
    expect(await chart.findByTestId('chart__plot')).toBeTruthy()
    await waitFor(() =>
      expect(
        chart.container.querySelectorAll('[data-testid="chart"] svg path').length
      ).toBeGreaterThan(0)
    )
    chart.unmount()
    const group = render(StatTileGroupMarkdown)
    const strip = await group.findByTestId('stat-tile-group')
    await waitFor(() => expect(within(strip).getAllByTestId('stat-tile')).toHaveLength(4))
    expect(within(strip).getAllByTestId('stat-tile')[0]!.hasAttribute('data-doc-block')).toBe(false)
  })

  it('parseDocMarkdown returns the frontmatter and the outline headings', () => {
    const { frontmatter, headings } = parseDocMarkdown(
      '---\ntitle: Release notes\ndescription: What shipped\n---\n\n# Page\n\n## One\n\n### Two\n\n#### Deep\n\n<Update label="May 1, 2026">Notes.</Update>'
    )
    expect(frontmatter).toEqual({ title: 'Release notes', description: 'What shipped' })
    expect(headings).toEqual([
      { id: 'one', text: 'One', depth: 2 },
      { id: 'two', text: 'Two', depth: 3 },
      { id: 'may-1-2026', text: 'May 1, 2026', depth: 2 }
    ])
  })

  it('renders an empty root for an empty source', () => {
    expect(mount('').getByTestId('doc-markdown').childElementCount).toBe(0)
  })

  it('renders the examples without axe violations', async () => {
    const first = render(Default)
    expect(within(first.container as HTMLElement).getAllByRole('heading').length).toBeGreaterThan(1)
    expect((await within(first.container as HTMLElement).findAllByRole('tab')).length).toBe(2)
    await expectNoA11yViolations(first.container)
    const second = render(Components)
    await expectNoA11yViolations(second.container)
  })

  it('renders right-to-left without violations', async () => {
    const { container } = render(
      defineComponent({
        render: () => h('div', { dir: 'rtl' }, [h(DocMarkdown, { source: '## Title\n\nBody.' })])
      })
    )
    await expectNoA11yViolations(container)
  })
})
