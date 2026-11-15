import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureTabs from './feature-tabs.vue'

const TESTID = 'feature-tabs'
const EYEBROW = 'Observability'
const TITLE = 'Inspect every run end-to-end'
const DESCRIPTION = 'Every invocation of a function is traced on the platform itself.'
const primaryAction = { label: 'Open an invocation', href: '/docs/traces', trailing: true }

const tabs = [
  {
    title: 'Trace',
    description: 'The run as a waterfall.',
    illustration: 'live-debugging',
    illustrationLabel: 'A trace waterfall of one invocation'
  },
  {
    title: 'Logs',
    description: 'Structured output on the same clock as the trace.',
    illustration: 'traffic-and-cost-bar-chart',
    illustrationLabel: 'Structured logs filtered by level'
  },
  {
    title: 'Request path',
    description: 'The workload, application, function and connector it travelled.',
    illustration: 'distributed-apis'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(FeatureTabs, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      tabs,
      primaryAction,
      ...props
    }
  })

const tabButtons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>('li h3 button'))

describe('FeatureTabs', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureTabs, {
      props: { title: TITLE, tabs },
      attrs: { 'data-testid': 'observability' }
    })

    expect(getByTestId('observability')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section by its title and renders it as the h2', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders no header and leaves the section unnamed when no title is set', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one tab per entry, in order', () => {
    const { container } = band()

    expect(tabButtons(container).map((button) => button.textContent?.trim())).toEqual(
      tabs.map((tab) => tab.title)
    )
  })

  it('moves the active tab on click', async () => {
    const { container } = band()

    expect(tabButtons(container)[0]?.getAttribute('aria-current')).toBe('true')
    await fireEvent.click(tabButtons(container)[2] as HTMLButtonElement)
    expect(tabButtons(container)[2]?.getAttribute('aria-current')).toBe('true')
  })

  it('links the primary action from the section title', () => {
    const { getByRole, getByTestId } = band()

    const link = getByRole('link', { name: primaryAction.label })
    expect(link.getAttribute('href')).toBe(primaryAction.href)
    expect(getByTestId('section-title').contains(link)).toBe(true)
  })

  it('links the primary action under the frame when there is no title', () => {
    const { getByRole, queryByTestId } = band({ title: '' })

    expect(queryByTestId('section-title')).toBeNull()
    expect(getByRole('link', { name: primaryAction.label }).getAttribute('href')).toBe(
      primaryAction.href
    )
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'observability' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'observability')
  })

  it('opens a tab code file as its media, with line numbers and a named copy button', () => {
    const { getAllByRole, getAllByText, getByTestId } = band({
      copyAriaLabel: 'Copy the handler',
      tabs: [
        {
          title: 'Handler',
          description: 'One function per route.',
          code: {
            label: 'handler.js',
            value: 'handler',
            language: 'javascript',
            fileName: 'handler.js',
            code: 'export default { fetch: () => new Response("ok") }'
          }
        },
        tabs[1]
      ]
    })

    expect(getByTestId(TESTID).querySelector('[data-code]')).not.toBeNull()
    expect(getAllByText('handler.js').length).toBeGreaterThanOrEqual(1)
    expect(getAllByRole('button', { name: 'Copy the handler' }).length).toBeGreaterThanOrEqual(1)
  })

  it('marks no code stage when no tab carries code', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).querySelector('[data-code]')).toBeNull()
  })

  it('draws the band scene as the media of every tab', async () => {
    const { findAllByTestId } = band({
      scene: { component: 'ConsoleMockup', props: { name: 'functions-start' } },
      tabs: [
        { title: 'Agents', description: 'Ask an agent.', value: 'agents' },
        { title: 'Console', description: 'Click through.', value: 'console' }
      ]
    })

    const widgets = await findAllByTestId('console-mockup')
    expect(widgets.length).toBeGreaterThanOrEqual(2)
    widgets.forEach((widget) => expect(widget).toHaveAttribute('data-name', 'functions-start'))
  })

  it('renders no link when no action is set', () => {
    const { queryByRole } = band({ primaryAction: undefined })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when tabs is empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ tabs: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByTestId('media-tabs')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  describe('autoplay timing', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    const activeAfter = async (props: Record<string, unknown>, ms: number) => {
      vi.useFakeTimers()
      const { container } = band(props)
      vi.advanceTimersByTime(ms)
      await nextTick()
      return tabButtons(container).findIndex((button) => button.getAttribute('aria-current'))
    }

    it('holds each tab for autoplayInterval', async () => {
      expect(await activeAfter({ autoplayInterval: 1000 }, 1000)).toBe(1)
    })

    it('ignores the removed interval prop', async () => {
      expect(await activeAfter({ interval: 1000 }, 1000)).toBe(0)
    })

    it('stays on the first tab with autoplay off', async () => {
      expect(await activeAfter({ autoplay: false, autoplayInterval: 1000 }, 3000)).toBe(0)
    })

    it('carries the composed pause control', () => {
      const { getByRole } = band()
      expect(getByRole('button', { name: 'Pause rotation' })).toBeInTheDocument()
    })
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
