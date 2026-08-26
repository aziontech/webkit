import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-prose/DocProse.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocProse from './doc-prose.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so
// every utility on this root emits nothing here. That rules out the whole ladder: the
// section rung, the tightened heading gaps, the `data-doc-chrome` exclusions and the ink
// are all CSS, and a computed-style assertion would read the user-agent default whether
// the class is correct, misspelled, or missing entirely — passing identically in the
// broken and the fixed state. The rhythm is therefore verified by the visual gate and in
// the browser; what is asserted here is the part that is real without CSS: that the
// container renders its slot as-is, adds no semantics of its own, and forwards attributes.

const { Default, ChromeBoundary } = composeStories(stories)

describe('DocProse', () => {
  describe('rendering & testid', () => {
    it('renders with the derived testid', () => {
      const { getByTestId } = render(DocProse, { slots: { default: '<p>Body copy.</p>' } })
      expect(getByTestId('documentation-doc-prose')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocProse, {
        attrs: { 'data-testid': 'first-deploy-prose' },
        slots: { default: '<p>Body copy.</p>' }
      })
      expect(getByTestId('first-deploy-prose')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-prose')).not.toBeInTheDocument()
    })
  })

  describe('the slot passes through untouched', () => {
    it('renders authored HTML as the same elements, adding no wrapper', () => {
      const { getByTestId } = render(DocProse, {
        slots: { default: '<h2>Heading</h2><p>Paragraph</p><ul><li>Item</li></ul>' }
      })
      const root = getByTestId('documentation-doc-prose')
      // The container styles descendants; it must not restructure them.
      expect(Array.from(root.children).map((el) => el.tagName)).toEqual(['H2', 'P', 'UL'])
      expect(root.querySelector('ul > li')).toBeInTheDocument()
    })

    it('adds no role or ARIA of its own — the semantics are the author HTML', () => {
      const { getByTestId } = render(DocProse, { slots: { default: '<p>Body copy.</p>' } })
      const root = getByTestId('documentation-doc-prose')
      expect(root.hasAttribute('role')).toBe(false)
      expect(root.getAttributeNames().filter((n) => n.startsWith('aria-'))).toEqual([])
    })

    it('leaves a data-doc-chrome subtree in the tree untouched', () => {
      const { getByTestId, getByText } = render(DocProse, {
        slots: { default: '<p>Prose</p><div data-doc-chrome><p>Component copy</p></div>' }
      })
      // The exclusion itself is a CSS selector and is unobservable here; what IS
      // observable is that marking a subtree does not change what renders.
      expect(
        getByTestId('documentation-doc-prose').querySelector('[data-doc-chrome] p')
      ).toBeInTheDocument()
      expect(getByText('Prose')).toBeInTheDocument()
      expect(getByText('Component copy')).toBeInTheDocument()
    })
  })

  describe('attribute forwarding', () => {
    it('forwards arbitrary attributes to the real root', () => {
      const { getByTestId } = render(DocProse, {
        attrs: { id: 'page-body', lang: 'en' },
        slots: { default: '<p>Body copy.</p>' }
      })
      const root = getByTestId('documentation-doc-prose')
      expect(root.id).toBe('page-body')
      expect(root.getAttribute('lang')).toBe('en')
    })
  })

  describe('accessibility', () => {
    it('has no violations over the full ladder', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations with a chrome subtree nested in prose', async () => {
      const { container } = render(ChromeBoundary())
      await expectNoA11yViolations(container)
    })
  })
})
