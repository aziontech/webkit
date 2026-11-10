import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureWidgets from './feature-widgets.vue'

const TESTID = 'sections-feature-widgets'
const ANCHOR = 'get-started'
const EYEBROW = 'Get started'
const TITLE = 'Start where you already work'
const DESCRIPTION = 'The same function, three ways to ship it.'
const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Docs', href: '/site/docs', trailing: true }

const copy = {
  label: 'Copy prompt',
  text: 'Create a function that answers 401 when a request has no Authorization header.'
}

const consoleItem = {
  title: 'Build it in the Console',
  description: 'Write the handler in the editor and create it.',
  illustration: 'build-applications',
  action: { label: 'Console docs', href: '/site/docs/console' }
}

const terminalItem = {
  title: 'Ship it from the terminal',
  description: 'azion deploy puts it on a live domain.',
  illustration: 'quick-start-with-templates',
  action: { label: 'CLI docs', href: '/site/docs/cli' }
}

const items = [
  {
    title: 'Ask your coding agent',
    description: 'Connect the Azion MCP servers to your agent.',
    illustration: 'deploy-secure-mcp-server',
    copy
  },
  consoleItem,
  terminalItem
]

const band = (props: Record<string, unknown> = {}) =>
  render(FeatureWidgets, {
    props: {
      anchor: ANCHOR,
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      primaryAction,
      secondaryAction,
      items,
      ...props
    }
  })

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

const stubClipboard = () => {
  const writeText = vi.fn(() => Promise.resolve())
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true
  })
  return writeText
}

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, 'clipboard', originalClipboard)
  } else {
    delete (navigator as { clipboard?: unknown }).clipboard
  }
})

describe('FeatureWidgets', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureWidgets, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'start-widgets' }
    })

    expect(getByTestId('start-widgets')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the id of the band', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).id).toBe(ANCHOR)
  })

  it('leaves the band without an id when no anchor is set', () => {
    const { getByTestId } = render(FeatureWidgets, { props: { title: TITLE, items } })

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('names the band by its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders the title as the h2 of the band', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders no header and no name when no title is set', () => {
    const { getByTestId, queryByRole } = render(FeatureWidgets, { props: { items } })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
    expect(queryByRole('link', { name: primaryAction.label })).toBeNull()
  })

  it('renders the two header actions as links to their hrefs', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
    expect(getByRole('link', { name: secondaryAction.label })).toHaveAttribute(
      'href',
      secondaryAction.href
    )
  })

  it('renders one cell per item, in order', () => {
    const { getAllByTestId } = band()

    expect(
      getAllByTestId('marketing-bento-grid-cell').map((cell) =>
        cell.querySelector('strong')?.textContent?.trim()
      )
    ).toEqual(items.map((item) => item.title))
  })

  it('renders a copy button for an item with copy and writes its text to the clipboard', async () => {
    const writeText = stubClipboard()
    const { getByRole } = band()

    const button = getByRole('button', { name: copy.label })
    await fireEvent.click(button)

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText).toHaveBeenCalledWith(copy.text)
  })

  it('renders a link for an item with an action', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: consoleItem.action.label })).toHaveAttribute(
      'href',
      consoleItem.action.href
    )
    expect(getByRole('link', { name: terminalItem.action.label })).toHaveAttribute(
      'href',
      terminalItem.action.href
    )
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByRole('link')).toBeNull()
    expect(queryByTestId('layout-frame-box')).toBeNull()
    expect(queryByTestId('marketing-bento-grid')).toBeNull()
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(FeatureWidgets)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = band({ items: [] })

    await expectNoA11yViolations(container)
  })
})
