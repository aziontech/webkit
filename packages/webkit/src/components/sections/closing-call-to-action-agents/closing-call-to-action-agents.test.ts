import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ClosingCallToActionAgents from './closing-call-to-action-agents.vue'

const TESTID = 'sections-closing-call-to-action-agents'
const TITLE = 'Built by you, or your agents.'
const PROMPT = 'Connect Azion MCP: https://mcp.azion.com'

const audiences = [
  {
    value: 'humans',
    label: 'For humans',
    actions: [
      { label: 'Start for free', href: '/signup', kind: 'secondary', trailing: true },
      { label: 'Talk to a specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ]
  },
  {
    value: 'agents',
    label: 'For agents',
    copy: { label: 'Copy prompt', text: PROMPT },
    actions: [{ label: 'Read the agent docs', href: '/site/docs/agent-setup', trailing: true }]
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ClosingCallToActionAgents, {
    props: {
      anchor: 'contact',
      title: TITLE,
      typedLead: 'Drive one platform from the',
      typedWords: ['Console', 'CLI', 'MCP server'],
      description: 'A person and an agent ship the same way.',
      audiences,
      audiencesAriaLabel: 'Audience',
      lineAriaLabel: 'Prompt',
      ...props
    }
  })

const reduceMotion = (matches: boolean) =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false
      }) as MediaQueryList
  )

describe('ClosingCallToActionAgents', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders the band under the default testid with the anchor as its id', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).id).toBe('contact')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClosingCallToActionAgents, {
      props: { title: TITLE, audiences },
      attrs: { 'data-testid': 'agents' }
    })

    expect(getByTestId('agents')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 and only the root without a title', () => {
    const { getByRole, unmount } = band()
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    unmount()

    const empty = band({ title: '' })
    expect(empty.getByTestId(TESTID).children).toHaveLength(0)
  })

  it('opens on the first audience with its actions and no copy field', () => {
    const { getByRole, queryByRole } = band()

    expect(getByRole('radiogroup', { name: 'Audience' })).toBeInTheDocument()
    expect(getByRole('radio', { name: 'For humans' }).getAttribute('aria-checked')).toBe('true')
    expect(getByRole('link', { name: 'Start for free' }).getAttribute('href')).toBe('/signup')
    expect(getByRole('link', { name: 'Talk to a specialist' }).getAttribute('href')).toBe(
      '/site/contact'
    )
    expect(queryByRole('textbox', { name: 'Prompt' })).toBeNull()
  })

  it('swaps the copyable line and the actions when the audience changes', async () => {
    const { getByRole, queryByRole } = band()

    await userEvent.click(getByRole('radio', { name: 'For agents' }))

    expect((getByRole('textbox', { name: 'Prompt' }) as HTMLInputElement).value).toBe(PROMPT)
    expect(getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
    expect(getByRole('link', { name: 'Read the agent docs' }).getAttribute('href')).toBe(
      '/site/docs/agent-setup'
    )
    expect(queryByRole('link', { name: 'Start for free' })).toBeNull()
  })

  it('copies exactly the line it shows', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue({
      writeText
    } as unknown as Clipboard)
    const { getByRole } = band()

    await userEvent.click(getByRole('radio', { name: 'For agents' }))
    await userEvent.click(getByRole('button', { name: 'Copy prompt' }))

    expect(writeText).toHaveBeenCalledWith(PROMPT)
  })

  it('reads the whole typed sentence to assistive tech', () => {
    const { getByText } = band()

    expect(getByText('Drive one platform from the Console, CLI, MCP server.')).toBeInTheDocument()
  })

  it('types the first word one character at a time', async () => {
    reduceMotion(false)
    vi.useFakeTimers()
    const { getByTestId } = band()
    const typed = () =>
      getByTestId(TESTID).querySelector('[aria-hidden="true"] .text-\\(--text-default\\)')
        ?.textContent ?? ''

    vi.advanceTimersByTime(90)
    await nextTick()
    expect(typed()).toBe('C')

    vi.advanceTimersByTime(90 * 6)
    await nextTick()
    expect(typed()).toBe('Console')
  })

  it('shows the full word list at once under reduced motion', async () => {
    reduceMotion(true)
    const { getByText } = band()
    await nextTick()

    const visible = getByText(
      'Drive one platform from the Console, CLI, MCP server.'
    ).nextElementSibling
    expect(visible?.getAttribute('aria-hidden')).toBe('true')
    expect(visible?.textContent).toContain('Console, CLI, MCP server')
  })

  it('omits the typed line when there are no words', () => {
    const { queryByText } = band({ typedWords: [] })

    expect(queryByText(/Drive one platform/)).toBeNull()
    expect(queryByText('A person and an agent ship the same way.')).toBeInTheDocument()
  })

  it('clears its timer when unmounted', () => {
    reduceMotion(false)
    vi.useFakeTimers()
    const { unmount } = band()

    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('has no a11y violations on each audience', async () => {
    const { container, getByRole } = band()
    await expectNoA11yViolations(container)

    await userEvent.click(getByRole('radio', { name: 'For agents' }))
    await expectNoA11yViolations(container)
  })
})
