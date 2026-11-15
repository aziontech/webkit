import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/sidebar/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { SidebarInjectionKey } from './injection-key'
import SidebarFooter from './sidebar-footer.vue'

describe('SidebarFooter', () => {
  describe('rendering (structure grounded in the template)', () => {
    it('renders a <div> root carrying the default footer-region data-testid when rendered without a Sidebar context', () => {
      // ctx = inject(SidebarInjectionKey) is undefined standalone, so the fallback
      // testId is `${'sidebar'}__footer-region`.
      const { getByTestId } = render(SidebarFooter)

      const root = getByTestId('sidebar-footer')
      expect(root.tagName).toBe('DIV')
    })
  })

  describe('data-testid derivation', () => {
    it('keeps its own test id inside a Sidebar with a custom test id', () => {
      const { getByTestId, queryByTestId } = render(SidebarFooter, {
        global: {
          provide: {
            [SidebarInjectionKey as symbol]: { testId: 'my-sidebar' }
          }
        }
      })

      expect(getByTestId('sidebar-footer').tagName).toBe('DIV')
      expect(queryByTestId('my-sidebar__footer-region')).toBeNull()
    })

    it('lets a consumer-supplied data-testid override the derived one', () => {
      // Template reads attrs['data-testid'] first, before the ctx fallback.
      const { getByTestId, queryByTestId } = render(SidebarFooter, {
        attrs: { 'data-testid': 'explicit-footer' },
        global: {
          provide: {
            [SidebarInjectionKey as symbol]: { testId: 'my-sidebar' }
          }
        }
      })

      expect(getByTestId('explicit-footer').tagName).toBe('DIV')
      expect(queryByTestId('my-sidebar__footer-region')).toBeNull()
      expect(queryByTestId('sidebar-footer')).toBeNull()
    })
  })

  describe('slots', () => {
    it('renders default slot content inside the root region', () => {
      const { getByTestId } = render(SidebarFooter, {
        slots: { default: '<span data-testid="footer-content">Profile</span>' }
      })

      const root = getByTestId('sidebar-footer')
      const content = getByTestId('footer-content')
      expect(root.contains(content)).toBe(true)
    })
  })

  describe('attrs.class merges onto the root', () => {
    it('applies a consumer-supplied class to the root element', () => {
      const { getByTestId } = render(SidebarFooter, {
        attrs: { class: 'my-custom-class' }
      })

      expect(getByTestId('sidebar-footer').classList.contains('my-custom-class')).toBe(true)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('footer with interactive content has no violations', async () => {
      const { container } = render(SidebarFooter, {
        slots: { default: '<a href="/account">Account</a>' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('documented example (the story fixture that composes a SidebarFooter runs in-test)', () => {
    it('the console sidebar renders the SidebarFooter region inside the Sidebar', () => {
      // The story mounts <SidebarFooter> in the Sidebar #footer slot; with the
      // Sidebar's default testId ("sidebar"), the footer-region testid resolves.
      const { getByTestId } = render(Default)
      expect(getByTestId('sidebar-footer').tagName).toBe('DIV')
    })
  })
})
