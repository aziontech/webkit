import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import * as stories from '../../../../../../apps/storybook/src/stories/components/navigation/BreadcrumbItem.stories'
import BreadcrumbItem from './breadcrumb-item.vue'

const { Default, Current, WithIcon, Disabled } = composeStories(stories)

const TESTID = 'navigation-breadcrumb-item'

describe('BreadcrumbItem', () => {
  describe('rendering', () => {
    it('renders the label prop inside the label sub-element', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Dashboard' }
      })

      const root = getByTestId(TESTID)
      const label = getByTestId(`${TESTID}__label`)

      expect(root).toBeTruthy()
      expect(label.textContent?.trim()).toBe('Dashboard')
    })

    it('renders as an anchor with the href when not current', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home', href: '/home' }
      })

      const root = getByTestId(TESTID)

      expect(root.tagName).toBe('A')
      expect(root.getAttribute('href')).toBe('/home')
      // Non-current, enabled link is naturally focusable (no forced tabindex).
      expect(root.getAttribute('tabindex')).toBeNull()
    })

    it('does not render the leading icon by default', () => {
      const { queryByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home' }
      })

      expect(queryByTestId(`${TESTID}__icon`)).toBeNull()
    })

    it('renders the leading icon when showIcon is true', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home', showIcon: true, icon: 'pi pi-cog' }
      })

      const icon = getByTestId(`${TESTID}__icon`)

      expect(icon).toBeTruthy()
      expect(icon.getAttribute('aria-hidden')).toBe('true')
      expect(icon.className).toContain('pi pi-cog')
    })

    it('honours a consumer-provided data-testid', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home' },
        attrs: { 'data-testid': 'crumb-1' }
      })

      expect(getByTestId('crumb-1')).toBeTruthy()
      expect(getByTestId('crumb-1__label').textContent?.trim()).toBe('Home')
    })
  })

  describe('current page semantics', () => {
    it('renders a span with aria-current="page" and tabindex -1 when current', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Current', current: true }
      })

      const root = getByTestId(TESTID)

      expect(root.tagName).toBe('SPAN')
      expect(root.getAttribute('aria-current')).toBe('page')
      expect(root.getAttribute('data-current')).toBe('true')
      expect(root.getAttribute('tabindex')).toBe('-1')
      // A current segment is a span, so it has no href.
      expect(root.getAttribute('href')).toBeNull()
    })

    it('does not set aria-current or data-current when not current', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home' }
      })

      const root = getByTestId(TESTID)

      expect(root.getAttribute('aria-current')).toBeNull()
      expect(root.getAttribute('data-current')).toBeNull()
    })
  })

  describe('disabled semantics', () => {
    it('applies aria-disabled, data-disabled and tabindex -1 when disabled', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home', disabled: true }
      })

      const root = getByTestId(TESTID)

      expect(root.getAttribute('aria-disabled')).toBe('true')
      expect(root.getAttribute('data-disabled')).toBe('')
      expect(root.getAttribute('tabindex')).toBe('-1')
    })

    it('does not set aria-disabled or data-disabled when enabled', () => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Home' }
      })

      const root = getByTestId(TESTID)

      expect(root.getAttribute('aria-disabled')).toBeNull()
      expect(root.getAttribute('data-disabled')).toBeNull()
    })
  })

  describe('click event', () => {
    it('emits click with the MouseEvent when activated', async () => {
      const { getByTestId, emitted } = render(BreadcrumbItem, {
        props: { label: 'Home' }
      })

      await fireEvent.click(getByTestId(TESTID))

      const events = emitted().click
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('emits a separate click for each activation', async () => {
      const { getByTestId, emitted } = render(BreadcrumbItem, {
        props: { label: 'Home' }
      })

      await fireEvent.click(getByTestId(TESTID))
      await fireEvent.click(getByTestId(TESTID))

      expect(emitted().click).toHaveLength(2)
    })

    it('does NOT emit click when disabled', async () => {
      const { getByTestId, emitted } = render(BreadcrumbItem, {
        props: { label: 'Home', disabled: true }
      })

      await fireEvent.click(getByTestId(TESTID))

      expect(emitted().click).toBeUndefined()
    })

    it('still emits click for the current segment (span)', async () => {
      const { getByTestId, emitted } = render(BreadcrumbItem, {
        props: { label: 'Current', current: true }
      })

      await fireEvent.click(getByTestId(TESTID))

      expect(emitted().click).toHaveLength(1)
    })
  })

  describe('variant smoke', () => {
    it.each([
      { current: false, disabled: false },
      { current: true, disabled: false },
      { current: false, disabled: true }
    ])('renders with current=$current disabled=$disabled', ({ current, disabled }) => {
      const { getByTestId } = render(BreadcrumbItem, {
        props: { label: 'Segment', current, disabled }
      })

      expect(getByTestId(TESTID)).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for a default link segment', async () => {
      const { container } = render(BreadcrumbItem, {
        props: { label: 'Home', href: '/home' }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for the current-page segment', async () => {
      const { container } = render(BreadcrumbItem, {
        props: { label: 'Current', current: true }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for a disabled segment', async () => {
      const { container } = render(BreadcrumbItem, {
        props: { label: 'Home', disabled: true }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations with a leading icon', async () => {
      const { container } = render(BreadcrumbItem, {
        props: { label: 'Home', showIcon: true, icon: 'pi pi-box' }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures', () => {
    it('composes the Default story', () => {
      const { getByTestId } = render(Default())

      expect(getByTestId(TESTID)).toBeTruthy()
      expect(getByTestId(`${TESTID}__label`).textContent?.trim()).toBe('Page Name')
    })

    it('composes the Current story as a current-page span', () => {
      const { getByTestId } = render(Current())

      const root = getByTestId(TESTID)
      expect(root.tagName).toBe('SPAN')
      expect(root.getAttribute('aria-current')).toBe('page')
    })

    it('composes the WithIcon story rendering the leading icon', () => {
      const { getByTestId } = render(WithIcon())

      expect(getByTestId(`${TESTID}__icon`)).toBeTruthy()
    })

    it('composes the Disabled story with disabled semantics', () => {
      const { getByTestId } = render(Disabled())

      const root = getByTestId(TESTID)
      expect(root.getAttribute('aria-disabled')).toBe('true')
      expect(root.getAttribute('data-disabled')).toBe('')
    })
  })
})
