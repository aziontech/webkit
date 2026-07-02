import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/Sidebar.stories'

import { expectNoA11yViolations } from '../../../test/axe'
import { SidebarInjectionKey } from './injection-key'
import SidebarHeader from './sidebar-header.vue'

// The Sidebar story is the fixture that exercises the whole Sidebar composition.
// No story render function mounts <SidebarHeader> directly (the #header slot uses
// InputText), so composeStories is used only to prove the fixture loads and the
// Sidebar root renders — SidebarHeader itself is tested directly below.
const { Default } = composeStories(stories)

describe('SidebarHeader', () => {
  describe('rendering (structure grounded in the template)', () => {
    it('renders a <div> root carrying the default header-region data-testid when rendered without a Sidebar context', () => {
      // ctx = inject(SidebarInjectionKey) is undefined standalone, so the fallback
      // testId is `${'layout-sidebar'}__header-region`.
      const { getByTestId } = render(SidebarHeader)

      const root = getByTestId('layout-sidebar__header-region')
      expect(root.tagName).toBe('DIV')
    })

    it('applies the base w-full and shrink-0 utilities to the root', () => {
      // Template root class is cn('w-full shrink-0', attrs.class).
      const { getByTestId } = render(SidebarHeader)

      const root = getByTestId('layout-sidebar__header-region')
      expect(root.classList.contains('w-full')).toBe(true)
      expect(root.classList.contains('shrink-0')).toBe(true)
    })
  })

  describe('data-testid derivation', () => {
    it('derives the header-region testid from the injected Sidebar context testId', () => {
      // Template: `${ctx?.testId ?? 'layout-sidebar'}__header-region`.
      const { getByTestId, queryByTestId } = render(SidebarHeader, {
        global: {
          provide: {
            [SidebarInjectionKey as symbol]: { testId: 'my-sidebar' }
          }
        }
      })

      expect(getByTestId('my-sidebar__header-region').tagName).toBe('DIV')
      // Fallback derivation must no longer apply once the context supplies a testId.
      expect(queryByTestId('layout-sidebar__header-region')).toBeNull()
    })

    it('lets a consumer-supplied data-testid override the derived one', () => {
      // Template reads attrs['data-testid'] first, before the ctx fallback.
      const { getByTestId, queryByTestId } = render(SidebarHeader, {
        attrs: { 'data-testid': 'explicit-header' },
        global: {
          provide: {
            [SidebarInjectionKey as symbol]: { testId: 'my-sidebar' }
          }
        }
      })

      expect(getByTestId('explicit-header').tagName).toBe('DIV')
      expect(queryByTestId('my-sidebar__header-region')).toBeNull()
      expect(queryByTestId('layout-sidebar__header-region')).toBeNull()
    })
  })

  describe('slots', () => {
    it('renders default slot content inside the root region', () => {
      const { getByTestId } = render(SidebarHeader, {
        slots: { default: '<span data-testid="header-content">Branding</span>' }
      })

      const root = getByTestId('layout-sidebar__header-region')
      const content = getByTestId('header-content')
      expect(root.contains(content)).toBe(true)
    })
  })

  describe('attrs.class merges onto the root', () => {
    it('applies a consumer-supplied class to the root element', () => {
      const { getByTestId } = render(SidebarHeader, {
        attrs: { class: 'my-custom-class' }
      })

      const root = getByTestId('layout-sidebar__header-region')
      expect(root.classList.contains('my-custom-class')).toBe(true)
      // Base utilities survive the merge.
      expect(root.classList.contains('w-full')).toBe(true)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('header with interactive content has no violations', async () => {
      const { container } = render(SidebarHeader, {
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the Sidebar fixture loads and renders its root)', () => {
    it('Default story renders the Sidebar root region', () => {
      // The Default story mounts <Sidebar> with its default testId ("layout-sidebar");
      // no <SidebarHeader> is composed in this story, so only the Sidebar root is asserted.
      const { getByTestId } = render(Default)
      expect(getByTestId('layout-sidebar').tagName).toBe('ASIDE')
    })
  })
})
