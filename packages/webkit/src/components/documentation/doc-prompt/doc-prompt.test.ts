import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-prompt/DocPrompt.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocPrompt from './doc-prompt.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium), no Tailwind.
// Every utility class emits nothing here, so the cap (`max-h-[3.5lh]`) and the
// overflow it creates DO NOT EXIST in this environment: scrollHeight always
// equals clientHeight, `capped` is always false, and no fade or disclosure ever
// renders. Anything that depends on those measurements is therefore asserted
// through the visual gate and Storybook, not here — an assertion that reads the
// unstyled geometry passes identically in the broken and the fixed state.

const { Default, Kinds, Bare } = composeStories(stories)

const PROMPT = 'Deploy this repository to Azion and show me the edge URL when it is live.'

// The real Clipboard API rejects in headless Chromium ("Document is not focused"),
// so writeText is stubbed to resolve. This substitutes an external side effect, not
// layout/focus/Teleport — what is under test is WHICH string the component hands it.
afterEach(() => {
  vi.restoreAllMocks()
})

describe('DocPrompt', () => {
  describe('rendering & testid', () => {
    it('renders the prompt text with the derived testid', () => {
      const { getByTestId, getByText } = render(DocPrompt, { slots: { default: PROMPT } })
      expect(getByTestId('documentation-doc-prompt')).toBeTruthy()
      expect(getByText(PROMPT)).toBeTruthy()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocPrompt, {
        attrs: { 'data-testid': 'first-deploy-prompt' },
        slots: { default: PROMPT }
      })
      expect(getByTestId('first-deploy-prompt')).toBeTruthy()
      expect(queryByTestId('documentation-doc-prompt')).toBeNull()
    })

    it('forwards consumer attributes to the root', () => {
      const { getByTestId } = render(DocPrompt, {
        attrs: { id: 'agent-prompt' },
        slots: { default: PROMPT }
      })
      expect(getByTestId('documentation-doc-prompt').getAttribute('id')).toBe('agent-prompt')
    })

    it('carries the DocProse contract markers on the root', () => {
      const root = render(DocPrompt, { slots: { default: PROMPT } }).getByTestId(
        'documentation-doc-prompt'
      )
      expect(root.hasAttribute('data-doc-block')).toBe(true)
      expect(root.hasAttribute('data-doc-chrome')).toBe(true)
    })
  })

  describe('label fallback', () => {
    it('renders label when the default slot is empty', () => {
      const { getByText } = render(DocPrompt, { props: { label: PROMPT } })
      expect(getByText(PROMPT)).toBeTruthy()
    })

    it('prefers the slot over label when both are given', () => {
      const { getByText, queryByText } = render(DocPrompt, {
        props: { label: 'fallback' },
        slots: { default: PROMPT }
      })
      expect(getByText(PROMPT)).toBeTruthy()
      expect(queryByText('fallback')).toBeNull()
    })
  })

  describe('kind', () => {
    it('defaults to block and mirrors it onto data-kind', () => {
      const { getByTestId } = render(DocPrompt, { slots: { default: PROMPT } })
      const text = getByTestId('documentation-doc-prompt').querySelector('[data-kind]')
      expect(text?.getAttribute('data-kind')).toBe('block')
    })

    it('mirrors kind="line" onto data-kind', () => {
      const { getByTestId } = render(DocPrompt, {
        props: { kind: 'line' },
        slots: { default: PROMPT }
      })
      const text = getByTestId('documentation-doc-prompt').querySelector('[data-kind]')
      expect(text?.getAttribute('data-kind')).toBe('line')
    })

    it('gives the line shape a tab stop and the block shape none', () => {
      // A scroll container with no focusable child is unreachable by keyboard
      // (axe: scrollable-region-focusable). Only `line` scrolls.
      const line = render(DocPrompt, { props: { kind: 'line' }, slots: { default: PROMPT } })
      expect(
        line
          .getByTestId('documentation-doc-prompt')
          .querySelector('[data-kind]')
          ?.getAttribute('tabindex')
      ).toBe('0')
      line.unmount()

      const block = render(DocPrompt, { props: { kind: 'block' }, slots: { default: PROMPT } })
      expect(
        block
          .getByTestId('documentation-doc-prompt')
          .querySelector('[data-kind]')
          ?.getAttribute('tabindex')
      ).toBeNull()
    })
  })

  describe('title row', () => {
    it('renders no title row by default', () => {
      const { getByTestId, queryByText } = render(DocPrompt, {
        props: { title: '' },
        slots: { default: PROMPT }
      })
      // The row is what carries the surface split, so its absence is what makes
      // the bare shape a single unbroken block rather than a box in a box.
      expect(getByTestId('documentation-doc-prompt').querySelector('[data-title-row]')).toBeNull()
      expect(queryByText('AI Assistant')).toBeNull()
    })

    it('renders the title when given', () => {
      const { getByText } = render(DocPrompt, {
        props: { title: 'AI Assistant' },
        slots: { default: PROMPT }
      })
      expect(getByText('AI Assistant')).toBeTruthy()
    })

    it('renders the default sparkles glyph beside a title without an explicit icon', () => {
      const { getByTestId } = render(DocPrompt, {
        props: { title: 'AI Assistant' },
        slots: { default: PROMPT }
      })
      expect(getByTestId('documentation-doc-prompt').querySelector('i.pi-sparkles')).toBeTruthy()
    })

    it('renders the icon glyph only alongside a title, and hides it from AT', () => {
      const withTitle = render(DocPrompt, {
        props: { title: 'AI Assistant', icon: 'pi pi-bolt' },
        slots: { default: PROMPT }
      })
      const glyph = withTitle.getByTestId('documentation-doc-prompt').querySelector('i.pi-bolt')
      expect(glyph).toBeTruthy()
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
      withTitle.unmount()

      // No title means no title row, so the glyph has nowhere to sit.
      const withoutTitle = render(DocPrompt, {
        props: { icon: 'pi pi-bolt' },
        slots: { default: PROMPT }
      })
      expect(
        withoutTitle.getByTestId('documentation-doc-prompt').querySelector('i.pi-bolt')
      ).toBeNull()
    })
  })

  describe('copy control', () => {
    it('renders a copy control named for the prompt', () => {
      const { getByRole } = render(DocPrompt, { slots: { default: PROMPT } })
      expect(getByRole('button', { name: 'Copy prompt' }).tagName).toBe('BUTTON')
    })

    it('renders no copy control when there is nothing to copy', () => {
      const { queryByRole } = render(DocPrompt, {})
      expect(queryByRole('button', { name: 'Copy prompt' })).toBeNull()
    })

    // The value is read off the rendered element, so it is settled one render after
    // mount — `nextTick` is that render. Not a wait for a timer or an animation: without
    // it the assertion would be testing whether a pointer can outrun a microtask.
    it('copies the rendered sentence, whitespace collapsed', async () => {
      const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      // Authored across indented template lines, the way a consumer writes it — the
      // indentation is formatting, not part of the string.
      const { getByRole } = render(DocPrompt, {
        slots: { default: `\n        ${PROMPT}\n      ` }
      })
      await nextTick()
      await fireEvent.click(getByRole('button', { name: 'Copy prompt' }))
      await waitFor(() => expect(write).toHaveBeenCalledWith(PROMPT))
    })

    it('copies the label when it is the fallback in use', async () => {
      const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      const { getByRole } = render(DocPrompt, { props: { label: PROMPT } })
      await nextTick()
      await fireEvent.click(getByRole('button', { name: 'Copy prompt' }))
      await waitFor(() => expect(write).toHaveBeenCalledWith(PROMPT))
    })

    it('keeps the clipboard in step with a prompt that changes', async () => {
      const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      const { getByRole, rerender } = render(DocPrompt, { props: { label: 'first prompt' } })
      await nextTick()
      await rerender({ label: 'second prompt' })
      await nextTick()
      await fireEvent.click(getByRole('button', { name: 'Copy prompt' }))
      // Reading the rendered element is what makes this true: a value captured once at
      // setup would still be handing out 'first prompt' here.
      await waitFor(() => expect(write).toHaveBeenCalledWith('second prompt'))
      expect(write).not.toHaveBeenCalledWith('first prompt')
    })
  })

  describe('a11y', () => {
    it('has no violations on the default story', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across both kinds', async () => {
      const { container } = render(Kinds())
      await expectNoA11yViolations(container)
    })

    it('has no violations in the bare shape', async () => {
      const { container } = render(Bare())
      await expectNoA11yViolations(container)
    })
  })
})
