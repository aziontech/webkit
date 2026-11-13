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

  it.each(['split', 'panel', 'primary'] as const)('has no a11y violations in %s', async (kind) => {
    const { container } = band({ kind })

    await expectNoA11yViolations(container)
  })
})
