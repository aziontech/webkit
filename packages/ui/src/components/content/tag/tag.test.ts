import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/tag/default.vue'
import Severities from '../../../../examples/tag/severities.vue'
import Variants from '../../../../examples/tag/variants.vue'
import WithIcon from '../../../../examples/tag/with-icon.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Tag from './tag.vue'

const SEVERITIES = ['neutral', 'success', 'info', 'warning', 'danger'] as const
const VARIANTS = ['primary', 'accent', 'contrast'] as const

const SIZES = ['small', 'medium'] as const

describe('Tag', () => {
  it('renders with the default testid, default variant and default size', () => {
    const { getByTestId } = render(Tag, { props: { label: 'Label' } })

    const root = getByTestId('tag')
    expect(root).toBeTruthy()
    expect(root.getAttribute('data-variant')).toBe('primary')
    expect(root.hasAttribute('data-severity')).toBe(false)
    expect(root.getAttribute('data-size')).toBe('medium')
  })

  it('honors a consumer-supplied data-testid', () => {
    const { getByTestId } = render(Tag, {
      props: { label: 'Label' },
      attrs: { 'data-testid': 'my-tag' }
    })

    expect(getByTestId('my-tag')).toBeTruthy()
  })

  it('renders the value prop inside the value span when no slot is provided', () => {
    const { getByTestId } = render(Tag, { props: { label: 'Online' } })

    const valueEl = getByTestId('tag__label')
    expect(valueEl.textContent?.trim()).toBe('Online')
  })

  it('renders default slot content and lets the slot take precedence over value', () => {
    const { getByTestId, queryByTestId } = render(Tag, {
      props: { label: 'ignored' },
      slots: { default: 'Slotted' }
    })

    const root = getByTestId('tag')
    expect(root.textContent).toContain('Slotted')
    // With a slot present the value fallback span is not rendered (v-if/v-else-if).
    expect(queryByTestId('tag__label')).toBeNull()
    expect(root.textContent).not.toContain('ignored')
  })

  it('reflects the severity prop on data-severity for every option', () => {
    for (const severity of SEVERITIES) {
      const { getByTestId, unmount } = render(Tag, {
        props: { label: 'Label', severity }
      })
      expect(getByTestId('tag').getAttribute('data-severity')).toBe(severity)
      unmount()
    }
  })

  it('reflects the variant prop on data-variant for every brand look', () => {
    for (const variant of VARIANTS) {
      const { getByTestId, unmount } = render(Tag, { props: { label: 'Label', variant } })
      expect(getByTestId('tag').getAttribute('data-variant')).toBe(variant)
      unmount()
    }
  })

  it('lets severity win over variant when both are set', () => {
    const { getByTestId } = render(Tag, {
      props: { label: 'Label', variant: 'accent', severity: 'danger' }
    })

    const root = getByTestId('tag')
    expect(root.getAttribute('data-severity')).toBe('danger')
    expect(root.hasAttribute('data-variant')).toBe(false)
  })

  it('reflects the size prop on data-size for every option', () => {
    for (const size of SIZES) {
      const { getByTestId, unmount } = render(Tag, {
        props: { label: 'Label', size }
      })
      expect(getByTestId('tag').getAttribute('data-size')).toBe(size)
      unmount()
    }
  })

  it('renders the leading icon element with the provided class and hides it from a11y', () => {
    const { getByTestId } = render(Tag, {
      props: { label: 'Label', icon: 'az az-box' }
    })

    const iconEl = getByTestId('tag__icon')
    expect(iconEl.getAttribute('aria-hidden')).toBe('true')
    expect(iconEl.classList.contains('az')).toBe(true)
    expect(iconEl.classList.contains('az-box')).toBe(true)
  })

  it('treats an empty icon string as no icon and keeps the tag out of the tab order', () => {
    const { queryByTestId, getByTestId } = render(Tag, { props: { label: 'Label', icon: '' } })
    expect(queryByTestId('tag__icon')).toBeNull()
    expect(getByTestId('tag')).not.toHaveAttribute('tabindex')
  })

  it('does not render an icon element when no icon prop is given', () => {
    const { queryByTestId } = render(Tag, { props: { label: 'Label' } })

    expect(queryByTestId('tag__icon')).toBeNull()
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(Tag, {
      props: { label: 'Label' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('tag').classList.contains('consumer-class')).toBe(true)
  })

  it.each([...SEVERITIES])('has no a11y violations for severity "%s"', async (severity) => {
    const { container } = render(Tag, {
      props: { label: 'Label', severity }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an icon at the small size', async () => {
    const { container } = render(Tag, {
      props: { label: 'Label', icon: 'az az-box', size: 'small' }
    })

    await expectNoA11yViolations(container)
  })

  it('falls back to the primary variant for a severity outside the scale', () => {
    for (const severity of ['bogus', 'primary', 'secondary']) {
      const { getByTestId, unmount } = render(Tag, {
        props: { label: 'Inactive', severity: severity as never }
      })
      const root = getByTestId('tag')
      expect(root.hasAttribute('data-severity')).toBe(false)
      expect(root.getAttribute('data-variant')).toBe('primary')
      unmount()
    }
  })

  it.each([
    ['Severities', Severities, SEVERITIES],
    ['Variants', Variants, VARIANTS]
  ])('renders every look of its set once in the %s example', (_, example, set) => {
    const looks = render(example)
      .getAllByTestId('tag')
      .map((tag) => tag.getAttribute('data-severity') ?? tag.getAttribute('data-variant'))

    expect([...looks].sort()).toEqual([...set].sort())
  })

  it.each([['WithIcon', WithIcon]])(
    'names each look in words in the %s example, never by colour alone',
    (_, example) => {
      const tags = render(example).getAllByTestId('tag')
      const words = tags.map((tag) => tag.textContent?.trim().toLowerCase())
      const looks = tags.map(
        (tag) => tag.getAttribute('data-severity') ?? tag.getAttribute('data-variant')
      )

      expect(words).toEqual(looks)
    }
  )

  it('gives each severity its own glyph in the WithIcon example', () => {
    const glyphs = render(WithIcon)
      .getAllByTestId('tag__icon')
      .map((icon) => icon.className)

    expect(new Set(glyphs).size).toBe(glyphs.length)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { getByTestId, container } = render(Default)

    expect(getByTestId('tag')).toBeTruthy()
    await expectNoA11yViolations(container)
  })
})
