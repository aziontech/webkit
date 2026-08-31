import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

// The real Clipboard API rejects in headless Chromium ("Document is not focused"), so
// writeText is stubbed to resolve. That substitutes an external side effect, not layout
// or focus — what is under test is WHICH chips hand a string over and which are left
// alone. The rejecting stub exercises the other branch, which is a real path in the
// browser too (an insecure origin, or a denied permission).
const stubClipboard = (writeText = vi.fn().mockResolvedValue(undefined)) => {
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
  return writeText
}

// The tooltip Teleports to the body, so it is outside the render container by design.
const copyTip = () =>
  document.body.querySelector('[data-testid="documentation-doc-prose-copy-tip"]')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

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

  describe('the inline chip copies', () => {
    it('copies an authored chip on click and reports it in the tooltip', async () => {
      const writeText = stubClipboard()
      const { getByText } = render(DocProse, {
        slots: { default: '<p>Run <code>azion deploy</code> to publish.</p>' }
      })
      await fireEvent.click(getByText('azion deploy'))
      expect(writeText).toHaveBeenCalledWith('azion deploy')
      await waitFor(() => expect(copyTip()?.textContent).toBe('Copied'))
    })

    it('says what still works when the clipboard is refused', async () => {
      stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
      const { getByText } = render(DocProse, {
        slots: { default: '<p>Run <code>azion deploy</code> to publish.</p>' }
      })
      await fireEvent.click(getByText('azion deploy'))
      await waitFor(() => expect(copyTip()?.textContent).toContain('to copy'))
    })

    it('offers the copy on hover and withdraws it on leave', async () => {
      stubClipboard()
      const { getByText } = render(DocProse, {
        slots: { default: '<p>Run <code>azion deploy</code> to publish.</p>' }
      })
      const chip = getByText('azion deploy')
      await fireEvent.pointerOver(chip)
      await waitFor(() => expect(copyTip()?.textContent).toBe('Copy'))
      expect(copyTip()?.getAttribute('role')).toBe('tooltip')

      await fireEvent.pointerOut(chip, { relatedTarget: document.body })
      await waitFor(() => expect(copyTip()).toBeNull())
    })

    it('leaves a fenced block alone — it has its own copy control', async () => {
      const writeText = stubClipboard()
      const { getByText } = render(DocProse, {
        slots: { default: '<pre><code>azion deploy --auto</code></pre>' }
      })
      await fireEvent.click(getByText('azion deploy --auto'))
      expect(writeText).not.toHaveBeenCalled()
      expect(copyTip()).toBeNull()
    })

    it('leaves a component-generated chip alone', async () => {
      const writeText = stubClipboard()
      const { getByText, getByTestId } = render(DocProse, {
        slots: {
          default:
            '<p><code data-testid="code-block-line">generated</code> and <code><span>tokenized</span></code></p>'
        }
      })
      await fireEvent.click(getByTestId('code-block-line'))
      await fireEvent.click(getByText('tokenized'))
      expect(writeText).not.toHaveBeenCalled()
    })

    it('leaves the navigation to a chip inside a link', async () => {
      const writeText = stubClipboard()
      const { getByText } = render(DocProse, {
        slots: { default: '<p><a href="#cli"><code>azion</code></a></p>' }
      })
      await fireEvent.click(getByText('azion'))
      expect(writeText).not.toHaveBeenCalled()
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
