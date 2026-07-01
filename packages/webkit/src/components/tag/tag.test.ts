import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../apps/storybook/src/stories/components/content/tag/Tag.stories'
import { expectNoA11yViolations } from '../../test/axe'
import Tag from './tag.vue'

const { Default } = composeStories(stories)

const SEVERITIES = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'accent',
  'contrast'
] as const

const SIZES = ['small', 'medium'] as const

describe('Tag', () => {
  it('renders with the default testid, default severity and default size', () => {
    const { getByTestId } = render(Tag, { props: { value: 'Label' } })

    const root = getByTestId('content-tag')
    expect(root).toBeTruthy()
    // Defaults from withDefaults: severity primary, size medium.
    expect(root.getAttribute('data-severity')).toBe('primary')
    expect(root.getAttribute('data-size')).toBe('medium')
    // rounded defaults to false → attribute is null (rendered via `rounded || null`).
    expect(root.getAttribute('data-rounded')).toBeNull()
  })

  it('honors a consumer-supplied data-testid', () => {
    const { getByTestId } = render(Tag, {
      props: { value: 'Label' },
      attrs: { 'data-testid': 'my-tag' }
    })

    expect(getByTestId('my-tag')).toBeTruthy()
  })

  it('renders the value prop inside the value span when no slot is provided', () => {
    const { getByTestId } = render(Tag, { props: { value: 'Online' } })

    const valueEl = getByTestId('content-tag__value')
    expect(valueEl.textContent?.trim()).toBe('Online')
  })

  it('renders default slot content and lets the slot take precedence over value', () => {
    const { getByTestId, queryByTestId } = render(Tag, {
      props: { value: 'ignored' },
      slots: { default: 'Slotted' }
    })

    const root = getByTestId('content-tag')
    expect(root.textContent).toContain('Slotted')
    // With a slot present the value fallback span is not rendered (v-if/v-else-if).
    expect(queryByTestId('content-tag__value')).toBeNull()
    expect(root.textContent).not.toContain('ignored')
  })

  it('reflects the severity prop on data-severity for every option', () => {
    for (const severity of SEVERITIES) {
      const { getByTestId, unmount } = render(Tag, {
        props: { value: 'Label', severity }
      })
      expect(getByTestId('content-tag').getAttribute('data-severity')).toBe(severity)
      unmount()
    }
  })

  it('falls back to primary when severity is undefined', () => {
    const { getByTestId } = render(Tag, {
      props: { value: 'Label', severity: undefined }
    })

    expect(getByTestId('content-tag').getAttribute('data-severity')).toBe('primary')
  })

  it('reflects the size prop on data-size for every option', () => {
    for (const size of SIZES) {
      const { getByTestId, unmount } = render(Tag, {
        props: { value: 'Label', size }
      })
      expect(getByTestId('content-tag').getAttribute('data-size')).toBe(size)
      unmount()
    }
  })

  it('sets data-rounded only when rounded is true', () => {
    const roundedOn = render(Tag, { props: { value: 'Label', rounded: true } })
    // Rendered as :data-rounded="rounded || null" → present (empty string) when true.
    expect(roundedOn.getByTestId('content-tag').hasAttribute('data-rounded')).toBe(true)
    roundedOn.unmount()

    const roundedOff = render(Tag, { props: { value: 'Label', rounded: false } })
    expect(roundedOff.getByTestId('content-tag').getAttribute('data-rounded')).toBeNull()
  })

  it('renders the leading icon element with the provided class and hides it from a11y', () => {
    const { getByTestId } = render(Tag, {
      props: { value: 'Label', icon: 'pi pi-box' }
    })

    const iconEl = getByTestId('content-tag__icon')
    expect(iconEl.getAttribute('aria-hidden')).toBe('true')
    expect(iconEl.classList.contains('pi')).toBe(true)
    expect(iconEl.classList.contains('pi-box')).toBe(true)
  })

  it('does not render an icon element when no icon prop is given', () => {
    const { queryByTestId } = render(Tag, { props: { value: 'Label' } })

    expect(queryByTestId('content-tag__icon')).toBeNull()
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(Tag, {
      props: { value: 'Label' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('content-tag').classList.contains('consumer-class')).toBe(true)
  })

  it.each([...SEVERITIES])('has no a11y violations for severity "%s"', async (severity) => {
    const { container } = render(Tag, {
      props: { value: 'Label', severity }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an icon and pill shape', async () => {
    const { container } = render(Tag, {
      props: { value: 'Label', icon: 'pi pi-box', rounded: true, size: 'small' }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { getByTestId, container } = render(Default())

    expect(getByTestId('content-tag')).toBeTruthy()
    await expectNoA11yViolations(container)
  })
})
