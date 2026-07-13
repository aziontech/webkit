import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/utils/spinner/Spinner.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Spinner from './spinner.vue'

const { Sizes } = composeStories(stories)

describe('Spinner', () => {
  it('renders an svg root', () => {
    const { container } = render(Spinner)

    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('marks the svg as decorative with aria-hidden', () => {
    const { container } = render(Spinner)

    // The template hard-codes aria-hidden="true": the spinner is a purely
    // decorative loading glyph and must not be announced by screen readers.
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('forwards consumer attributes onto the svg root (inheritAttrs: false + v-bind="$attrs")', () => {
    const { container } = render(Spinner, {
      attrs: {
        class: 'size-4',
        'data-testid': 'my-spinner'
      }
    })

    const svg = container.querySelector('svg')
    // v-bind="$attrs" on the root svg: the class the consumer passes lands there.
    expect(svg?.getAttribute('class')).toContain('size-4')
    // Arbitrary consumer attributes fall through to the same root.
    expect(svg?.getAttribute('data-testid')).toBe('my-spinner')
  })

  it('does not let a forwarded aria-hidden create a duplicate attribute', () => {
    const { container } = render(Spinner)

    const svg = container.querySelector('svg')
    // Exactly one aria-hidden value — a real DOM attribute, not two.
    expect(svg?.getAttributeNames().filter((n) => n === 'aria-hidden')).toHaveLength(1)
  })

  it('renders the two-part glyph (track circle + arc path) with currentColor stroke', () => {
    const { container } = render(Spinner)

    // The glyph the template actually draws: a faint full-circle track and the
    // sweeping arc, both stroked with currentColor so it inherits parent color.
    const circle = container.querySelector('svg circle')
    const path = container.querySelector('svg path')
    expect(circle?.getAttribute('stroke')).toBe('currentColor')
    expect(path?.getAttribute('stroke')).toBe('currentColor')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Spinner)

    await expectNoA11yViolations(container)
  })

  it('renders the Sizes story fixture without a11y violations', async () => {
    const { container } = render(Sizes())

    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    // Story wraps it with a sizing class; the decorative semantics still hold.
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    await expectNoA11yViolations(container)
  })
})
