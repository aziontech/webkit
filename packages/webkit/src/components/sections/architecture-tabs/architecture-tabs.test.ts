import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArchitectureTabs from './architecture-tabs.vue'

const TESTID = 'sections-architecture-tabs'
const EYEBROW = 'Routing'
const TITLE = 'Every AI request through one control point'
const DESCRIPTION = 'Every client calls one endpoint.'
const primaryAction = { label: 'Docs', href: '/docs', trailing: true }

const tabs = [
  {
    value: 'request-path',
    title: 'Request path',
    description: 'A call crosses Firewall before it reaches a model.',
    diagram: 'ai-gateway'
  },
  {
    value: 'failover',
    title: 'Provider failover',
    description: 'The gateway moves to the next model on the alias.',
    diagram: 'ai-gateway-provider-failover'
  },
  {
    value: 'cache',
    title: 'Response cache',
    description: 'A repeated prompt is answered from cache.',
    diagram: 'ai-gateway-response-cache'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArchitectureTabs, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      position: 'bottom',
      tabs,
      primaryAction,
      ...props
    }
  })

const tabButtons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>('li h3 button'))

describe('ArchitectureTabs', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArchitectureTabs, {
      props: { title: TITLE, tabs },
      attrs: { 'data-testid': 'routing-band' }
    })

    expect(getByTestId('routing-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section by its title and renders it as the h2', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'platform-architecture' })

    expect(getByTestId(TESTID).id).toBe('platform-architecture')
  })

  it('renders no id when the anchor is empty', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
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

  it('forwards the position to the tab row', () => {
    const { getByTestId } = band({ position: 'left' })

    expect(getByTestId('marketing-media-tabs').getAttribute('data-position')).toBe('left')
  })

  it('draws the named diagram of every tab', () => {
    const { container } = band()

    const names = Array.from(container.querySelectorAll('[data-testid="marketing-diagram"]')).map(
      (diagram) => diagram.getAttribute('data-name')
    )
    tabs.forEach((tab) => expect(names).toContain(tab.diagram))
  })

  it('moves the active tab on click', async () => {
    const { container } = band()

    const buttons = tabButtons(container)
    expect(buttons[0]?.getAttribute('aria-current')).toBe('true')
    await fireEvent.click(buttons[1] as HTMLButtonElement)
    expect(tabButtons(container)[1]?.getAttribute('aria-current')).toBe('true')
    expect(tabButtons(container)[0]?.hasAttribute('aria-current')).toBe(false)
  })

  it('links the primary action', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label }).getAttribute('href')).toBe(
      primaryAction.href
    )
  })

  it('renders no button when no action is set', () => {
    const { queryByRole } = band({ primaryAction: undefined })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when tabs is empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ tabs: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByTestId('marketing-media-tabs')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
