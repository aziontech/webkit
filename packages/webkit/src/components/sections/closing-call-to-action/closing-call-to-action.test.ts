import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClosingCallToAction from './closing-call-to-action.vue'

const TESTID = 'sections-closing-call-to-action'
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
    'mirrors kind=%s on the band and its call to action',
    (kind) => {
      const { getByTestId } = band({ kind })

      expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
      expect(getByTestId('marketing-call-to-action').getAttribute('data-kind')).toBe(kind)
    }
  )

  it('defaults to the split kind', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('split')
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

    const panel = band({ kind: 'panel' })
    expect(panel.getByRole('heading', { level: 2 }).textContent).not.toContain(TITLE_MUTED)
  })

  it.each(['split', 'panel', 'primary'] as const)('renders both actions in %s', (kind) => {
    const { getByRole } = band({ kind })

    expect(getByRole('link', { name: primaryAction.label }).getAttribute('href')).toBe(
      primaryAction.href
    )
    expect(getByRole('link', { name: secondaryAction.label }).getAttribute('href')).toBe(
      secondaryAction.href
    )
  })

  it('mirrors kind=primary on data-kind and draws neither the eyebrow nor the muted line', () => {
    const { getByTestId, getByRole, queryByText } = band({ kind: 'primary' })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('primary')
    expect(getByRole('heading', { level: 2 }).textContent).toContain(TITLE)
    expect(getByRole('heading', { level: 2 }).textContent).not.toContain(TITLE_MUTED)
    expect(queryByText('Build')).toBeNull()
  })

  it('paints the pixelated texture behind the copy only in primary', () => {
    const primary = band({ kind: 'primary' })
    const textures = primary.getByTestId(TESTID).querySelectorAll('[data-kind="pixelate"]')
    expect(textures.length).toBeGreaterThan(0)
    primary.unmount()

    const panel = band({ kind: 'panel' })
    expect(panel.getByTestId(TESTID).querySelectorAll('[data-kind="pixelate"]')).toHaveLength(0)
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
    const { getByTestId, queryByRole } = band({ kind: 'frame' })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'frame')
    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).not.toBeNull()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('draws the frame in frame even with no title and hatch off', () => {
    const { getByTestId } = render(ClosingCallToAction, { props: { kind: 'frame', hatch: false } })

    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).not.toBeNull()
  })

  it.each(['split', 'panel', 'primary'] as const)(
    'renders the command as a copyable shell line before the actions in %s',
    async (kind) => {
      const { findByRole, getByRole, getAllByRole } = band({
        kind,
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
    const { container, findByRole } = band({ kind: 'primary', command: 'npm create azion@latest' })

    await findByRole('textbox', { name: 'Command' })
    await expectNoA11yViolations(container)
  })

  it.each(['split', 'panel', 'primary'] as const)('has no a11y violations in %s', async (kind) => {
    const { container } = band({ kind })

    await expectNoA11yViolations(container)
  })
})
