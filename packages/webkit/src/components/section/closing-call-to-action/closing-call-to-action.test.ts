import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ClosingCallToAction, {
  type ClosingCallToActionAudience,
  type ClosingCallToActionProps
} from './closing-call-to-action.vue'
import ClosingCallToActionAudiences from './parts/closing-call-to-action-audiences.vue'

const TESTID = 'closing-call-to-action'
const TITLE = 'Build once.'
const TITLE_MUTED = 'Run everywhere.'
const DESCRIPTION = 'Get a faster path to launch, lower latency, and less infrastructure overhead.'
const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Talk to a specialist', href: '/contact', trailing: true }

const band = (props: Record<string, unknown> = {}) =>
  render(ClosingCallToAction, {
    props: {
      eyebrow: 'Build',
      title: TITLE,
      titleMuted: TITLE_MUTED,
      description: DESCRIPTION,
      primaryAction,
      secondaryAction,
      ...props
    }
  })

describe('ClosingCallToAction', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClosingCallToAction, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'closing' }
    })

    expect(getByTestId('closing')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['split', 'panel'] as const)(
    'mirrors variant=%s on the band and its call to action',
    (variant) => {
      const { getByTestId } = band({ variant })

      expect(getByTestId(TESTID).getAttribute('data-variant')).toBe(variant)
      expect(getByTestId('call-to-action').getAttribute('data-variant')).toBe(variant)
    }
  )

  it('defaults to the split variant', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe('split')
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'contact' })

    expect(getByTestId(TESTID).id).toBe('contact')
  })

  it('renders no id when the anchor is empty', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('names the call-to-action region by its title, keeping the root a plain div', () => {
    const { getByRole, getByTestId } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
    expect(getByRole('heading', { level: 2 }).textContent).toContain(TITLE)
    expect(getByTestId(TESTID).tagName).toBe('DIV')
  })

  it('draws the muted line in split and not in panel', () => {
    const { getByRole, unmount } = band()

    expect(getByRole('heading', { level: 2 }).textContent).toContain(TITLE_MUTED)
    unmount()

    const panel = band({ variant: 'panel' })
    expect(panel.getByRole('heading', { level: 2 }).textContent).not.toContain(TITLE_MUTED)
  })

  it.each(['split', 'panel', 'primary'] as const)('renders both actions in %s', (variant) => {
    const { getByRole } = band({ variant })

    expect(getByRole('link', { name: primaryAction.label }).getAttribute('href')).toBe(
      primaryAction.href
    )
    expect(getByRole('link', { name: secondaryAction.label }).getAttribute('href')).toBe(
      secondaryAction.href
    )
  })

  it('mirrors variant=primary on data-variant and draws neither the eyebrow nor the muted line', () => {
    const { getByTestId, getByRole, queryByText } = band({ variant: 'primary' })

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe('primary')
    expect(getByRole('heading', { level: 2 }).textContent).toContain(TITLE)
    expect(getByRole('heading', { level: 2 }).textContent).not.toContain(TITLE_MUTED)
    expect(queryByText('Build')).toBeNull()
  })

  it('paints the pixelated texture behind the copy only in primary', () => {
    const primary = band({ variant: 'primary' })
    const textures = primary.getByTestId(TESTID).querySelectorAll('[data-variant="pixelate"]')
    expect(textures.length).toBeGreaterThan(0)
    primary.unmount()

    const panel = band({ variant: 'panel' })
    expect(panel.getByTestId(TESTID).querySelectorAll('[data-variant="pixelate"]')).toHaveLength(0)
  })

  it('renders no action when none is given', () => {
    const { queryByRole } = band({ primaryAction: undefined, secondaryAction: undefined })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders the closing frame under the band', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).not.toBeNull()
  })

  it('renders only the root when no title is set', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).toBeNull()
  })

  it('drops the closing frame when hatch is off, keeping the band', () => {
    const { getByTestId, getByRole } = band({ hatch: false })

    expect(getByRole('heading', { name: new RegExp(TITLE) })).toBeInTheDocument()
    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).toBeNull()
  })

  it('draws only the closing frame in frame, with no copy or action', () => {
    const { getByTestId, queryByRole } = band({ variant: 'frame' })

    expect(getByTestId(TESTID)).toHaveAttribute('data-variant', 'frame')
    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).not.toBeNull()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('draws the frame in frame even with no title and hatch off', () => {
    const { getByTestId } = render(ClosingCallToAction, {
      props: { variant: 'frame', hatch: false }
    })

    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).not.toBeNull()
  })

  it.each(['split', 'panel', 'primary'] as const)(
    'renders the command as a copyable shell line before the actions in %s',
    async (variant) => {
      const { findByRole, getByRole, getAllByRole } = band({
        variant,
        command: 'npm create azion@latest'
      })

      const field = await findByRole('textbox', { name: 'Command' })
      expect(field).toHaveValue('npm create azion@latest')
      expect(getByRole('button', { name: 'Copy command' })).toBeInTheDocument()
      const first = getAllByRole('link')[0]!
      expect(field.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  )

  it('renders no command line without a command', () => {
    const { queryByRole } = band()

    expect(queryByRole('textbox')).toBeNull()
  })

  it('has no a11y violations with a command line', async () => {
    const { container, findByRole } = band({
      variant: 'primary',
      command: 'npm create azion@latest'
    })

    await findByRole('textbox', { name: 'Command' })
    await expectNoA11yViolations(container)
  })

  it.each(['split', 'panel', 'primary'] as const)(
    'has no a11y violations in %s',
    async (variant) => {
      const { container } = band({ variant })

      await expectNoA11yViolations(container)
    }
  )

  const PROMPT = 'Connect Azion MCP: https://mcp.azion.com'
  const SENTENCE = 'A person and an agent ship the same way.'

  const audiences: ClosingCallToActionAudience[] = [
    {
      value: 'humans',
      label: 'For humans',
      actions: [
        { label: 'Start for free', href: '/signup', variant: 'secondary', trailing: true },
        { label: 'Talk to a specialist', href: '/site/contact', variant: 'outline', trailing: true }
      ]
    },
    {
      value: 'agents',
      label: 'For agents',
      copy: { label: 'Copy prompt', text: PROMPT },
      actions: [{ label: 'Read the agent docs', href: '/site/docs/agent-setup', trailing: true }]
    }
  ]

  const audienceProps: ClosingCallToActionProps = {
    variant: 'primary',
    anchor: 'contact',
    title: 'Built by you, or your agents.',
    typedLead: 'Drive one platform from the',
    typedWords: ['Console', 'CLI', 'MCP server'],
    description: SENTENCE,
    audiences,
    audiencesAriaLabel: 'Audience',
    lineAriaLabel: 'Prompt'
  }

  const audienceBand = (props: Record<string, unknown> = {}) =>
    render(ClosingCallToAction, { props: { ...audienceProps, ...props } })

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

  describe('audiences', () => {
    afterEach(() => {
      vi.restoreAllMocks()
      vi.useRealTimers()
    })

    it('opens the primary close on the first audience in place of the command and actions', async () => {
      const { findByRole, getByRole, queryByRole } = audienceBand({
        command: 'npm create azion@latest',
        primaryAction: { label: 'Sign up', href: '/sign-up' }
      })

      expect(await findByRole('radiogroup', { name: 'Audience' })).toBeInTheDocument()
      expect(getByRole('radio', { name: 'For humans' }).getAttribute('aria-checked')).toBe('true')
      expect(getByRole('link', { name: 'Start for free' }).getAttribute('href')).toBe('/signup')
      expect(queryByRole('link', { name: 'Sign up' })).toBeNull()
      expect(queryByRole('textbox', { name: 'Prompt' })).toBeNull()
    })

    it('moves the description under the typed line', async () => {
      const { findByText, getAllByText } = audienceBand()

      const sentence = await findByText(SENTENCE)
      expect(getAllByText(SENTENCE)).toHaveLength(1)
      expect(sentence.closest('p')?.textContent).toContain(
        'Drive one platform from the Console, CLI, MCP server.'
      )
    })

    it('swaps the copyable line and the actions when the audience changes', async () => {
      const { findByRole, getByRole, queryByRole } = audienceBand()

      await userEvent.click(await findByRole('radio', { name: 'For agents' }))

      expect((getByRole('textbox', { name: 'Prompt' }) as HTMLInputElement).value).toBe(PROMPT)
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
      const { findByRole, getByRole } = audienceBand()

      await userEvent.click(await findByRole('radio', { name: 'For agents' }))
      await userEvent.click(getByRole('button', { name: 'Copy prompt' }))

      expect(writeText).toHaveBeenCalledWith(PROMPT)
    })

    it('draws the shell prompt only on a line marked shell', async () => {
      const shellAudiences = [
        {
          ...audiences[1],
          value: 'cli',
          label: 'CLI',
          copy: { label: 'Copy command', text: 'npm i -g azion', shell: true }
        },
        audiences[1]
      ]
      const { findByRole, getByTestId } = audienceBand({ audiences: shellAudiences })

      expect(((await findByRole('textbox', { name: 'Prompt' })) as HTMLInputElement).value).toBe(
        'npm i -g azion'
      )
      const prompt = () =>
        Array.from(getByTestId(TESTID).querySelectorAll('[aria-hidden="true"]')).some(
          (el) => el.textContent?.trim() === '$'
        )
      expect(prompt()).toBe(true)
    })

    it('ignores audiences outside the primary close', () => {
      const { queryByRole, getByRole } = audienceBand({
        variant: 'panel',
        primaryAction: { label: 'Sign up', href: '/sign-up' }
      })

      expect(queryByRole('radiogroup')).toBeNull()
      expect(getByRole('link', { name: 'Sign up' })).toBeInTheDocument()
    })

    it('has no a11y violations on each audience', async () => {
      const { container, findByRole } = audienceBand()
      const agents = await findByRole('radio', { name: 'For agents' })
      await expectNoA11yViolations(container)

      await userEvent.click(agents)
      await expectNoA11yViolations(container)
    })

    it('types the first word one character at a time', async () => {
      reduceMotion(false)
      vi.useFakeTimers()
      const { container } = render(ClosingCallToActionAudiences, { props: audienceProps })
      const typed = () =>
        container.querySelector('[aria-hidden="true"] .text-\\(--text-default\\)')?.textContent ??
        ''

      vi.advanceTimersByTime(90)
      await nextTick()
      expect(typed()).toBe('C')

      vi.advanceTimersByTime(90 * 6)
      await nextTick()
      expect(typed()).toBe('Console')
    })

    it('shows the full word list at once under reduced motion', async () => {
      reduceMotion(true)
      const { getByText } = render(ClosingCallToActionAudiences, { props: audienceProps })
      await nextTick()

      const visible = getByText(
        'Drive one platform from the Console, CLI, MCP server.'
      ).nextElementSibling
      expect(visible?.getAttribute('aria-hidden')).toBe('true')
      expect(visible?.textContent).toContain('Console, CLI, MCP server')
    })

    it('clears its timer when unmounted', () => {
      reduceMotion(false)
      vi.useFakeTimers()
      const { unmount } = render(ClosingCallToActionAudiences, { props: audienceProps })

      expect(vi.getTimerCount()).toBeGreaterThan(0)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
