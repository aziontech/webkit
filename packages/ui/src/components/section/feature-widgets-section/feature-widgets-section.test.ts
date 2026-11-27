import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureWidgetsSection from './feature-widgets-section.vue'

const TESTID = 'feature-widgets-section'
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
  render(FeatureWidgetsSection, {
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
  vi.restoreAllMocks()
  if (originalClipboard) {
    Object.defineProperty(navigator, 'clipboard', originalClipboard)
  } else {
    delete (navigator as { clipboard?: unknown }).clipboard
  }
})

describe('FeatureWidgetsSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureWidgetsSection, {
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
    const { getByTestId } = render(FeatureWidgetsSection, { props: { title: TITLE, items } })

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
    const { getByTestId, queryByRole } = render(FeatureWidgetsSection, { props: { items } })

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
      getAllByTestId('bento-grid-cell').map((cell) =>
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

  it('shows the text the copy button copies, so the reader sees the prompt first', () => {
    const { container } = band()

    const shown = container.querySelector('[data-slot="copy-text"]')
    expect(shown?.textContent?.trim()).toBe(copy.text)
  })

  it('reads Copied for two seconds after a copy, then its label again', async () => {
    stubClipboard()
    vi.useFakeTimers()
    try {
      const { findByRole, getByRole } = band()

      await fireEvent.click(getByRole('button', { name: copy.label }))
      expect(await findByRole('button', { name: 'Copied' })).toBeInTheDocument()

      await vi.advanceTimersByTimeAsync(2000)
      expect(getByRole('button', { name: copy.label })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('reads the copiedLabel after a copy when one is set', async () => {
    stubClipboard()
    const { findByRole, getByRole } = band({ copiedLabel: 'Prompt copied' })

    await fireEvent.click(getByRole('button', { name: copy.label }))

    expect(await findByRole('button', { name: 'Prompt copied' })).toBeInTheDocument()
  })

  it('keeps the copy label when the clipboard write fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn(() => Promise.reject(new Error('denied'))) },
      configurable: true
    })
    vi.spyOn(document, 'execCommand').mockReturnValue(false)
    const { getByRole, queryByRole } = band()

    await fireEvent.click(getByRole('button', { name: copy.label }))
    await Promise.resolve()

    expect(queryByRole('button', { name: 'Copied' })).toBeNull()
  })

  it('renders the link and the copy button together when an item carries both', () => {
    const { getByRole } = band({
      items: [{ ...items[0], action: { label: 'Agent docs', href: '/site/docs/agents' } }]
    })

    expect(getByRole('link', { name: 'Agent docs' })).toHaveAttribute('href', '/site/docs/agents')
    expect(getByRole('button', { name: copy.label })).toBeInTheDocument()
  })

  it('lays the grid in two columns and centres the title by default', () => {
    const { getByTestId } = band()

    expect(getByTestId('bento-grid')).toHaveAttribute('data-columns', '2')
    expect(getByTestId('module-header')).toHaveAttribute('data-align', 'center')
  })

  it('passes columns and titleAlign through', () => {
    const { getByTestId } = band({ columns: 3, titleAlign: 'start' })

    expect(getByTestId('bento-grid')).toHaveAttribute('data-columns', '3')
    expect(getByTestId('module-header')).toHaveAttribute('data-align', 'start')
  })

  it('draws an item scene in place of its illustration', async () => {
    const { findByTestId } = band({
      items: [
        {
          ...consoleItem,
          scene: { component: 'ConsoleMockup', props: { name: 'kv-store-key' } }
        }
      ]
    })

    expect(await findByTestId('console-mockup')).toHaveAttribute('data-name', 'kv-store-key')
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
    expect(queryByTestId('registration-frame')).toBeNull()
    expect(queryByTestId('bento-grid')).toBeNull()
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(FeatureWidgetsSection)

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
