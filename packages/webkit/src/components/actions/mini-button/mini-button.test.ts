import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/actions/mini-button/MiniButton.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import MiniButton from './mini-button.vue'

const { Default, Sizes } = composeStories(stories)

describe('MiniButton', () => {
  describe('rendering', () => {
    it('renders an <a> carrying the label and the default testid', () => {
      const { getByRole, getByTestId } = render(MiniButton, { props: { label: 'Learn More' } })
      const link = getByRole('link', { name: 'Learn More' })
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('data-testid')).toBe('actions-mini-button')
      expect(getByTestId('actions-mini-button__label').textContent?.trim()).toBe('Learn More')
    })

    it('defaults href to "#" and target to "_self", omitting rel for a same-tab link', () => {
      const { getByRole } = render(MiniButton, { props: { label: 'Learn More' } })
      const link = getByRole('link', { name: 'Learn More' })
      expect(link.getAttribute('href')).toBe('#')
      expect(link.getAttribute('target')).toBe('_self')
      expect(link.getAttribute('rel')).toBeNull()
    })

    it('adds rel="noopener noreferrer" only when target is _blank', () => {
      const { getByRole } = render(MiniButton, {
        props: { label: 'Docs', href: 'https://example.com', target: '_blank' }
      })
      const link = getByRole('link', { name: 'Docs' })
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(MiniButton, {
        props: { label: 'Learn More' },
        attrs: { 'data-testid': 'cta-mini' }
      })
      expect(getByTestId('cta-mini').tagName).toBe('A')
    })
  })

  describe('trailing icon (showIcon)', () => {
    it('renders the icon by default with the given prime class', () => {
      const { getByTestId } = render(MiniButton, { props: { label: 'Learn More' } })
      const icon = getByTestId('actions-mini-button__icon')
      expect(icon.tagName).toBe('I')
      expect(icon.className).toContain('pi')
      expect(icon.className).toContain('pi-external-link')
    })

    it('applies a custom icon class', () => {
      const { getByTestId } = render(MiniButton, {
        props: { label: 'Learn More', icon: 'pi pi-arrow-right' }
      })
      expect(getByTestId('actions-mini-button__icon').className).toContain('pi-arrow-right')
    })

    it('omits the icon when showIcon is false', () => {
      const { queryByTestId } = render(MiniButton, {
        props: { label: 'Learn More', showIcon: false }
      })
      expect(queryByTestId('actions-mini-button__icon')).toBeNull()
    })
  })

  describe('click emission', () => {
    it('emits click with a MouseEvent when active', async () => {
      const { getByRole, emitted } = render(MiniButton, { props: { label: 'Learn More' } })
      await fireEvent.click(getByRole('link', { name: 'Learn More' }))
      const events = emitted().click as MouseEvent[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('disabled', () => {
    it('reflects aria-disabled, data-disabled and tabindex=-1', () => {
      const { getByTestId } = render(MiniButton, {
        props: { label: 'Learn More', disabled: true }
      })
      const link = getByTestId('actions-mini-button')
      expect(link.getAttribute('aria-disabled')).toBe('true')
      expect(link.getAttribute('data-disabled')).toBe('')
      expect(link.getAttribute('tabindex')).toBe('-1')
    })

    it('suppresses the click event when disabled', async () => {
      const { getByTestId, emitted } = render(MiniButton, {
        props: { label: 'Learn More', disabled: true }
      })
      await fireEvent.click(getByTestId('actions-mini-button'))
      expect(emitted().click).toBeUndefined()
    })

    it('omits disabled-only attributes when enabled', () => {
      const { getByTestId } = render(MiniButton, { props: { label: 'Learn More' } })
      const link = getByTestId('actions-mini-button')
      expect(link.getAttribute('aria-disabled')).toBeNull()
      expect(link.getAttribute('data-disabled')).toBeNull()
      expect(link.getAttribute('tabindex')).toBeNull()
    })
  })

  describe('size variants', () => {
    it.each(['large', 'medium'] as const)('exposes data-size=%s on the root', (size) => {
      const { getByTestId } = render(MiniButton, { props: { label: 'Learn More', size } })
      expect(getByTestId('actions-mini-button').getAttribute('data-size')).toBe(size)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('Default (large, same-tab) has no violations', async () => {
      const { container } = render(MiniButton, { props: { label: 'Learn More' } })
      await expectNoA11yViolations(container)
    })

    it('external-link variant has no violations', async () => {
      const { container } = render(MiniButton, {
        props: { label: 'Docs', href: 'https://example.com', target: '_blank' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixture runs in-test)', () => {
    it('Default story mounts a large mini button with its label', () => {
      const { getByRole } = render(Default)
      const link = getByRole('link', { name: 'Learn More' })
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('data-size')).toBe('large')
    })

    it('Sizes story renders both a medium and a large mini button', () => {
      const { getAllByRole } = render(Sizes)
      const sizes = getAllByRole('link').map((el) => el.getAttribute('data-size'))
      expect(sizes).toContain('medium')
      expect(sizes).toContain('large')
    })
  })
})
