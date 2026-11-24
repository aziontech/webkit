import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import CliTerminalSection from './cli-terminal-section.vue'

const TESTID = 'cli-terminal-section'
const EYEBROW = 'Azion CLI'
const TITLE = 'Deploy your first function in two commands'
const DESCRIPTION = 'Link a project, deploy it, and curl the domain the CLI hands back.'
const COPY_LABEL = 'Copy the deploy session'
const session = 'azion deploy --auto\n# Hello World'
const primaryAction = {
  label: 'Install the CLI',
  href: '/docs/cli',
  trailing: true,
  target: '_blank' as const
}

const band = (props: Record<string, unknown> = {}) =>
  render(CliTerminalSection, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      session,
      copyAriaLabel: COPY_LABEL,
      primaryAction,
      ...props
    }
  })

describe('CliTerminalSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(CliTerminalSection, {
      props: { title: TITLE, session },
      attrs: { 'data-testid': 'cli-band' }
    })

    expect(getByTestId('cli-band')).toBeInTheDocument()
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
    expect(getByTestId('code-block')).toBeInTheDocument()
  })

  it('renders the session as one block with no tab strip', () => {
    const { getByTestId, queryByRole } = band()

    expect(queryByRole('tab')).toBeNull()
    expect(getByTestId('code-block').textContent).toContain('azion deploy --auto')
  })

  it('names the copy button by copyAriaLabel', () => {
    const { getByRole } = band()

    expect(getByRole('button', { name: COPY_LABEL })).toBeInTheDocument()
  })

  it('links the primary action with its target', () => {
    const { getByRole } = band()

    const link = getByRole('link', { name: primaryAction.label })
    expect(link.getAttribute('href')).toBe(primaryAction.href)
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('renders no button when no action is set', () => {
    const { queryByRole } = band({ primaryAction: undefined })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when the session is empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ session: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByTestId('code-block')).toBeNull()
  })

  it('renders only the section when the session is omitted', () => {
    const { getByTestId, queryByTestId } = render(CliTerminalSection, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId('code-block')).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'cli' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'cli')
  })

  it.each([
    ['start', 'cli-terminal-start'],
    ['deploy', 'cli-terminal-deploy']
  ] as const)(
    'types the %s script with its product widget instead of the session',
    async (script, name) => {
      const { findByTestId, queryByTestId } = band({ script })

      expect(await findByTestId('console-mockup')).toHaveAttribute('data-name', name)
      expect(queryByTestId('code-block')).toBeNull()
    }
  )

  it('renders the band from a script alone, with no session', async () => {
    const { findByTestId, getByRole } = band({ script: 'deploy', session: '' })

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(await findByTestId('console-mockup')).toBeInTheDocument()
  })

  it('marks the script stage entered once it scrolls into view', async () => {
    const { findByTestId } = band({ script: 'deploy' })

    const widget = await findByTestId('console-mockup')
    await expect.poll(() => widget.parentElement?.hasAttribute('data-entered')).toBe(true)
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('puts the copy button in the label strip, off the first command line', () => {
    const { getByTestId, queryByTestId } = render(CliTerminalSection, {
      props: { session: 'azion link --preset javascript\nazion deploy --auto' }
    })

    const copy = getByTestId('code-block__copy')
    expect(queryByTestId('code-block__copy-anchor')).toBeNull()
    expect(getByTestId('code-block__content').contains(copy)).toBe(false)
    expect(getByTestId('code-block').textContent).toContain('Shell')
  })
})
