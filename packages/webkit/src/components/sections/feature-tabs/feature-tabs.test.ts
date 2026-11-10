import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureTabs from './feature-tabs.vue'

const TESTID = 'sections-feature-tabs'
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
    illustration: 'stay-in-control',
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

  it('links the primary action under the frame', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label }).getAttribute('href')).toBe(
      primaryAction.href
    )
  })

  it('renders no link when no action is set', () => {
    const { queryByRole } = band({ primaryAction: undefined })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when tabs is empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ tabs: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByTestId('marketing-media-tabs')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
