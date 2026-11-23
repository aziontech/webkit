import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Cursor from '../../../../examples/eyebrow/cursor.vue'
import Default from '../../../../examples/eyebrow/default.vue'
import Prefixes from '../../../../examples/eyebrow/prefixes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Eyebrow from './eyebrow.vue'

describe('Eyebrow', () => {
  it('renders the default slot content', () => {
    const { getByText } = render(Eyebrow, { slots: { default: 'SECTION LABEL' } })
    expect(getByText('SECTION LABEL')).toBeInTheDocument()
  })

  it('does not render a prefix span when prefix is the empty default', () => {
    const { container, queryByText } = render(Eyebrow, { slots: { default: 'NO PREFIX' } })
    const spans = container.querySelectorAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0]?.getAttribute('aria-hidden')).toBe('true')
    expect(queryByText('//')).not.toBeInTheDocument()
  })

  it('marks the label with a test id derived from the root, including an override', () => {
    const view = render(Eyebrow, { slots: { default: 'DERIVED' } })
    expect(view.getByTestId('eyebrow__label').textContent).toBe('DERIVED')

    const custom = render(Eyebrow, {
      attrs: { 'data-testid': 'hero-eyebrow' },
      slots: { default: 'CUSTOM' }
    })
    expect(custom.getByTestId('hero-eyebrow__label').textContent).toBe('CUSTOM')
  })

  it('renders the prefix text when a prefix is provided', () => {
    const { getByText } = render(Eyebrow, {
      props: { prefix: '//' },
      slots: { default: 'COMMENT STYLE' }
    })
    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('COMMENT STYLE')).toBeInTheDocument()
  })

  it('hides the decorative prefix from assistive tech and keeps the label exposed', () => {
    const { getByText } = render(Eyebrow, {
      props: { prefix: '//' },
      slots: { default: 'COMMENT STYLE' }
    })
    expect(getByText('//').getAttribute('aria-hidden')).toBe('true')
    expect(getByText('COMMENT STYLE').closest('[aria-hidden]')).toBeNull()
  })

  it('spaces the prefix, label and cursor with the --spacing-2xs token', () => {
    const { getByTestId } = render(Eyebrow, { slots: { default: 'TOKENS' } })
    const root = getByTestId('eyebrow')
    expect(root.className).toContain('gap-(--spacing-2xs)')
    expect(root.className).toContain('ps-(--spacing-2xs)')
    expect(root.className).toContain('pe-(--spacing-2xs)')
  })

  it('renders angle-bracket and closing-tag prefixes verbatim', () => {
    const angle = render(Eyebrow, { props: { prefix: '<>' }, slots: { default: 'CODE' } })
    expect(angle.getByText('<>')).toBeInTheDocument()

    const closing = render(Eyebrow, { props: { prefix: '</>' }, slots: { default: 'TAG' } })
    expect(closing.getByText('</>')).toBeInTheDocument()
  })

  it('does not render the cursor span by default (cursor=false)', () => {
    const { container } = render(Eyebrow, { slots: { default: 'NO CURSOR' } })
    // The cursor is the only span carrying the blink animation utility.
    expect(container.querySelector('.animate-blink-settle')).toBeNull()
  })

  it('renders the cursor span when cursor is true', () => {
    const { container } = render(Eyebrow, {
      props: { cursor: true },
      slots: { default: 'WITH CURSOR' }
    })
    expect(container.querySelector('.animate-blink-settle')).not.toBeNull()
  })

  it('hides the cursor from assistive tech and mirrors it and singleLine on data attributes', () => {
    const { getByTestId, container } = render(Eyebrow, {
      props: { cursor: true },
      slots: { default: 'MIRRORED' }
    })
    const root = getByTestId('eyebrow')
    expect(root).toHaveAttribute('data-cursor')
    expect(root).toHaveAttribute('data-single-line')
    expect(container.querySelector('.animate-blink-settle')).toHaveAttribute('aria-hidden', 'true')
  })

  it('sets the cursor inline at the end of the label, so a wrapped label keeps it on its last line', () => {
    const { getByTestId } = render(Eyebrow, {
      props: { cursor: true },
      slots: { default: 'TRUSTED BY TEAMS RUNNING IN PRODUCTION' }
    })
    const label = getByTestId('eyebrow__label')
    const cursor = getByTestId('eyebrow__cursor')
    expect(label.contains(cursor)).toBe(true)
    expect(label.lastElementChild).toBe(cursor)
    expect(label).toHaveTextContent(/^TRUSTED BY TEAMS RUNNING IN PRODUCTION$/)
  })

  it('renders prefix and cursor together', () => {
    const { getByText, container } = render(Eyebrow, {
      props: { prefix: '//', cursor: true },
      slots: { default: 'TERMINAL OUTPUT' }
    })
    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('TERMINAL OUTPUT')).toBeInTheDocument()
    expect(container.querySelector('.animate-blink-settle')).not.toBeNull()
  })

  it.each([
    ['', 'PLAIN'],
    ['//', 'DOUBLE SLASH'],
    ['<>', 'ANGLE'],
    ['</>', 'CLOSING']
  ] as const)('renders the slot content for prefix %j', (prefix, label) => {
    const { getByText } = render(Eyebrow, {
      props: { prefix },
      slots: { default: label }
    })
    expect(getByText(label)).toBeInTheDocument()
  })

  it('has no accessibility violations in its default form', async () => {
    const { container } = render(Eyebrow, { slots: { default: 'ACCESSIBLE LABEL' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a prefix and cursor', async () => {
    const { container } = render(Eyebrow, {
      props: { prefix: '</>', cursor: true },
      slots: { default: 'ACCESSIBLE TERMINAL' }
    })
    await expectNoA11yViolations(container)
  })

  it('composes and renders the Default story', () => {
    const { getByText } = render(Default)
    expect(getByText('OVERLINE TEXT')).toBeInTheDocument()
  })

  it('composes the Cursor story: blinking cursor with and without a prefix', () => {
    const { getByText, container } = render(Cursor)

    // First instance: prefix + text; second: text only, still with its cursor.
    expect(getByText('OVERLINE TEXT')).toBeInTheDocument()
    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('NO PREFIX')).toBeInTheDocument()
    expect(container.querySelectorAll('.animate-blink-settle')).toHaveLength(2)
  })

  it('composes the Prefixes story with all three preset prefixes rendered', () => {
    const { getByText } = render(Prefixes)

    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('COMMENT STYLE')).toBeInTheDocument()
    expect(getByText('<>')).toBeInTheDocument()
    expect(getByText('CODE LABEL')).toBeInTheDocument()
    expect(getByText('</>')).toBeInTheDocument()
    expect(getByText('CLOSING TAG')).toBeInTheDocument()
  })

  describe('on phones', () => {
    it('lets a single-line label wrap at any width or zoom so it never overflows', () => {
      const view = render(Eyebrow, { slots: { default: 'Trusted by mission-critical workloads' } })

      expect(view.getByText('Trusted by mission-critical workloads').className).not.toContain(
        'whitespace-nowrap'
      )
      expect(view.getByTestId('eyebrow').className).toContain('max-w-full')
    })
  })

  describe('colors', () => {
    it('paints the label and the prefix through real token utilities', () => {
      const view = render(Eyebrow, { props: { prefix: '//' }, slots: { default: 'LABEL' } })

      expect(view.getByText('LABEL').className).toContain('text-(--text-default)')
      expect(view.getByTestId('eyebrow__mark').className).toContain('bg-(--primary)')
      expect(view.getByTestId('eyebrow__mark').getAttribute('aria-hidden')).toBe('true')
      expect(view.getByText('LABEL').className).not.toContain('text-(--primary)')
      expect(view.getByText('//').className).toContain('text-(--text-default)')
      expect(view.getByText('LABEL').className).not.toMatch(/(^|\s)text-primary(\s|$)/)
    })

    it('draws the cursor in the brand blue', () => {
      const { container } = render(Eyebrow, {
        props: { cursor: true },
        slots: { default: 'LABEL' }
      })

      expect(container.querySelector('.animate-blink-settle')?.className).toContain(
        'bg-(--brand-blue)'
      )
    })
  })
})
