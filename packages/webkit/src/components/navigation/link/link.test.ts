import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/navigation/Link.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Link from './link.vue'

const { Default, Sizes, Disabled } = composeStories(stories)

describe('Link', () => {
  it('renders as an anchor with the default testid and label', () => {
    const { getByTestId } = render(Link, { props: { label: 'Learn More' } })
    const root = getByTestId('navigation-link')

    expect(root.tagName).toBe('A')
    expect(getByTestId('navigation-link__label').textContent?.trim()).toBe('Learn More')
  })

  it('honors a consumer-provided data-testid across sub-elements', () => {
    const { getByTestId } = render(Link, {
      props: { label: 'Docs' },
      attrs: { 'data-testid': 'custom-link' }
    })

    expect(getByTestId('custom-link').tagName).toBe('A')
    expect(getByTestId('custom-link__content')).toBeTruthy()
    expect(getByTestId('custom-link__label').textContent?.trim()).toBe('Docs')
    expect(getByTestId('custom-link__ghost')).toBeTruthy()
  })

  it('applies href and defaults target to _self with no rel', () => {
    const { getByTestId } = render(Link, {
      props: { href: 'https://example.com', target: '_self' }
    })
    const root = getByTestId('navigation-link')

    expect(root.getAttribute('href')).toBe('https://example.com')
    expect(root.getAttribute('target')).toBe('_self')
    expect(root.getAttribute('rel')).toBeNull()
  })

  it('adds rel="noopener noreferrer" when target is _blank', () => {
    const { getByTestId } = render(Link, {
      props: { href: 'https://example.com', target: '_blank' }
    })
    const root = getByTestId('navigation-link')

    expect(root.getAttribute('target')).toBe('_blank')
    expect(root.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders the trailing icon when showIcon is true', () => {
    const { getByTestId } = render(Link, {
      props: { showIcon: true, icon: 'pi pi-external-link' }
    })
    const icon = getByTestId('navigation-link__icon')

    expect(icon.className).toContain('pi')
    expect(icon.className).toContain('pi-external-link')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
  })

  it('omits the trailing icon when showIcon is false', () => {
    const { queryByTestId } = render(Link, { props: { showIcon: false } })

    expect(queryByTestId('navigation-link__icon')).toBeNull()
  })

  it('emits click with the MouseEvent when enabled', async () => {
    const { getByTestId, emitted } = render(Link, { props: { disabled: false } })

    await fireEvent.click(getByTestId('navigation-link'))

    const clicks = emitted().click
    expect(clicks).toHaveLength(1)
    expect(clicks[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('does not emit click and exposes disabled a11y state when disabled', async () => {
    const { getByTestId, emitted } = render(Link, { props: { disabled: true } })
    const root = getByTestId('navigation-link')

    expect(root.getAttribute('aria-disabled')).toBe('true')
    expect(root.getAttribute('tabindex')).toBe('-1')
    expect(root.getAttribute('data-disabled')).toBe('true')

    await fireEvent.click(root)

    expect(emitted().click).toBeUndefined()
  })

  it('reflects the size prop on data-size and has no disabled attrs when enabled', () => {
    const { getByTestId } = render(Link, { props: { size: 'medium', disabled: false } })
    const root = getByTestId('navigation-link')

    expect(root.getAttribute('data-size')).toBe('medium')
    expect(root.getAttribute('aria-disabled')).toBeNull()
    expect(root.getAttribute('data-disabled')).toBeNull()
    expect(root.getAttribute('tabindex')).toBeNull()
  })

  it.each(['large', 'medium'] as const)('renders size variant %s', (size) => {
    const { getByTestId } = render(Link, { props: { size } })
    expect(getByTestId('navigation-link').getAttribute('data-size')).toBe(size)
  })

  it('has no a11y violations in the default render', async () => {
    const { container } = render(Link, { props: { label: 'Learn More' } })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled render', async () => {
    const { container } = render(Link, { props: { label: 'Learn More', disabled: true } })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('navigation-link').tagName).toBe('A')
  })

  it('renders the composed Sizes story', () => {
    const { getAllByTestId } = render(Sizes)
    const sizes = getAllByTestId('navigation-link').map((el) => el.getAttribute('data-size'))
    expect(sizes).toContain('large')
    expect(sizes).toContain('medium')
  })

  it('renders the composed Disabled story with disabled a11y state', () => {
    const { getByTestId } = render(Disabled)
    expect(getByTestId('navigation-link').getAttribute('aria-disabled')).toBe('true')
  })
})
