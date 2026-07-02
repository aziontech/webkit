import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/Sidebar.stories'

import { expectNoA11yViolations } from '../../../test/axe'
import Sidebar from './sidebar.vue'

const { Default, WithHeaderSearch, WithHeaderAndProfileFooter } = composeStories(stories)

describe('Sidebar', () => {
  describe('rendering (structure grounded in the template)', () => {
    it('renders an <aside> root carrying the default data-testid and its nav/scroll regions', () => {
      const { getByTestId } = render(Sidebar)

      const root = getByTestId('layout-sidebar')
      expect(root.tagName).toBe('ASIDE')

      // Derived region testids from the template: `${testId}__nav`, `${testId}__scroll`.
      const nav = getByTestId('layout-sidebar__nav')
      expect(nav.tagName).toBe('NAV')
      expect(getByTestId('layout-sidebar__scroll')).toBeTruthy()
    })

    it('exposes a navigation landmark', () => {
      const { getByRole } = render(Sidebar)
      // <nav> is the only landmark role emitted by the template.
      expect(getByRole('navigation')).toBeTruthy()
    })

    it('does not render the header region when no header slot is provided', () => {
      const { queryByTestId } = render(Sidebar)
      // Template: <div v-if="$slots['header']" ...__header>. No slot => absent.
      expect(queryByTestId('layout-sidebar__header')).toBeNull()
    })

    it('does not render the footer region when no footer slot is provided', () => {
      const { queryByTestId } = render(Sidebar)
      // Template: <div v-if="$slots['footer']" ...__footer>. No slot => absent.
      expect(queryByTestId('layout-sidebar__footer')).toBeNull()
    })
  })

  describe('ariaLabel prop -> aria-label on the <aside> landmark', () => {
    it('defaults the aria-label to "Sidebar"', () => {
      const { getByTestId } = render(Sidebar)
      expect(getByTestId('layout-sidebar').getAttribute('aria-label')).toBe('Sidebar')
    })

    it('applies a custom ariaLabel to the root', () => {
      const { getByTestId, getByRole } = render(Sidebar, { props: { ariaLabel: 'Application' } })
      expect(getByTestId('layout-sidebar').getAttribute('aria-label')).toBe('Application')
      // The <aside> root carries aria-label -> it is a complementary landmark named "Application".
      expect(getByRole('complementary', { name: 'Application' })).toBe(getByTestId('layout-sidebar'))
    })
  })

  describe('data-testid fallback + override drives the region testids', () => {
    it('uses the consumer-supplied data-testid and derives region testids from it', () => {
      const { getByTestId, queryByTestId } = render(Sidebar, {
        attrs: { 'data-testid': 'my-sidebar' },
        slots: {
          header: '<span data-testid="hd">H</span>',
          footer: '<span data-testid="ft">F</span>'
        }
      })

      expect(getByTestId('my-sidebar').tagName).toBe('ASIDE')
      expect(getByTestId('my-sidebar__header')).toBeTruthy()
      expect(getByTestId('my-sidebar__nav')).toBeTruthy()
      expect(getByTestId('my-sidebar__scroll')).toBeTruthy()
      expect(getByTestId('my-sidebar__footer')).toBeTruthy()

      // The fallback testid must no longer be present once overridden.
      expect(queryByTestId('layout-sidebar')).toBeNull()
    })
  })

  describe('slots', () => {
    it('renders default slot content inside the scroll region', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { default: '<span data-testid="nav-item">Home</span>' }
      })
      const scroll = getByTestId('layout-sidebar__scroll')
      const item = getByTestId('nav-item')
      expect(scroll.contains(item)).toBe(true)
    })

    it('renders header slot content inside the header region when provided', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { header: '<span data-testid="hd">search</span>' }
      })
      const header = getByTestId('layout-sidebar__header')
      expect(header.contains(getByTestId('hd'))).toBe(true)
    })

    it('renders footer slot content inside the footer region when provided', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { footer: '<span data-testid="ft">profile</span>' }
      })
      const footer = getByTestId('layout-sidebar__footer')
      expect(footer.contains(getByTestId('ft'))).toBe(true)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('content-only sidebar has no violations', async () => {
      const { container } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(container)
    })

    it('sidebar with header and footer regions has no violations', async () => {
      const { container } = render(Sidebar, {
        props: { ariaLabel: 'Application' },
        slots: {
          header: '<label>Search<input aria-label="Search" /></label>',
          default: '<a href="/">Home</a>',
          footer: '<a href="/account">Account</a>'
        }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixtures run in-test)', () => {
    it('Default story renders a content-only sidebar (nav present, no header/footer)', () => {
      const { getByTestId, queryByTestId } = render(Default)
      expect(getByTestId('layout-sidebar').tagName).toBe('ASIDE')
      expect(getByTestId('layout-sidebar__nav')).toBeTruthy()
      expect(queryByTestId('layout-sidebar__header')).toBeNull()
      expect(queryByTestId('layout-sidebar__footer')).toBeNull()
    })

    it('Default story labels the landmark from its args (aria-label="Application")', () => {
      const { getByRole } = render(Default)
      // The story sets args.ariaLabel = 'Application', bound to the <aside> (complementary) root.
      expect(getByRole('complementary', { name: 'Application' })).toBeTruthy()
    })

    it('WithHeaderSearch story renders the header region', () => {
      const { getByTestId, queryByTestId } = render(WithHeaderSearch)
      expect(getByTestId('layout-sidebar__header')).toBeTruthy()
      expect(queryByTestId('layout-sidebar__footer')).toBeNull()
    })

    it('WithHeaderAndProfileFooter story renders both header and footer regions', () => {
      const { getByTestId } = render(WithHeaderAndProfileFooter)
      expect(getByTestId('layout-sidebar__header')).toBeTruthy()
      expect(getByTestId('layout-sidebar__footer')).toBeTruthy()
    })
  })
})
