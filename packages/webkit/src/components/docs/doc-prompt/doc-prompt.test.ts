import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import Bare from '../../../../examples/doc-prompt/bare.vue'
import Default from '../../../../examples/doc-prompt/default.vue'
import Kinds from '../../../../examples/doc-prompt/variants.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocPrompt from './doc-prompt.vue'

// Browser mode loads no Tailwind, so the height cap and its overflow do not exist
// here (scrollHeight === clientHeight, `capped` always false) — the cap, fade and
// disclosure are asserted through the visual gate, not this suite.

const PROMPT = 'Deploy this repository to Azion and show me the edge URL when it is live.'

// The real Clipboard API rejects in headless Chromium ("Document is not focused"),
// so writeText is stubbed; under test is which string the component hands it.
afterEach(() => {
  vi.restoreAllMocks()
})

describe('DocPrompt', () => {
  it('starts and ends a block prompt at its first and last character', () => {
    const { container } = render(Default)
    const prompt = container.querySelector('p[data-variant="block"]') as HTMLElement
    expect(prompt.textContent).toBe(PROMPT)
  })

  it('trims the edges of a slot that opens and closes with whitespace', () => {
    const { container } = render(DocPrompt, {
      props: { variant: 'block' },
      slots: { default: `\n   ${PROMPT}\n  ` }
    })
    expect(container.querySelector('p')!.textContent).toBe(PROMPT)
  })

  describe('capped block disclosure', () => {
    it('ties Show more to the prompt with aria-expanded and aria-controls', async () => {
      const style = document.createElement('style')
      style.textContent =
        '[data-testid="doc-prompt"] p[data-variant="block"][data-state="closed"] { max-height: 2rem; overflow: hidden; }'
      document.head.append(style)
      try {
        const { getByRole, container } = render(DocPrompt, {
          props: { variant: 'block' },
          slots: { default: Array.from({ length: 12 }, () => PROMPT).join(' ') }
        })
        const button = await waitFor(() => getByRole('button', { name: /show more/i }))
        const prompt = container.querySelector('p[data-variant="block"]') as HTMLElement
        expect(prompt.id).not.toBe('')
        expect(button.getAttribute('aria-controls')).toBe(prompt.id)
        expect(button.getAttribute('aria-expanded')).toBe('false')

        const copy = getByRole('button', { name: /copy/i })
        expect(copy.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

        await fireEvent.click(button)
        await waitFor(() => expect(button.getAttribute('aria-expanded')).toBe('true'))
      } finally {
        style.remove()
      }
    })
  })

  describe('rendering & testid', () => {
    it('renders the prompt text with the derived testid', () => {
      const { getByTestId, getByText } = render(DocPrompt, { slots: { default: PROMPT } })
      expect(getByTestId('doc-prompt')).toBeTruthy()
      expect(getByText(PROMPT)).toBeTruthy()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocPrompt, {
        attrs: { 'data-testid': 'first-deploy-prompt' },
        slots: { default: PROMPT }
      })
      expect(getByTestId('first-deploy-prompt')).toBeTruthy()
      expect(queryByTestId('doc-prompt')).toBeNull()
    })

    it('forwards consumer attributes to the root', () => {
      const { getByTestId } = render(DocPrompt, {
        attrs: { id: 'agent-prompt' },
        slots: { default: PROMPT }
      })
      expect(getByTestId('doc-prompt').getAttribute('id')).toBe('agent-prompt')
    })

    it('carries the DocProse contract markers on the root', () => {
      const root = render(DocPrompt, { slots: { default: PROMPT } }).getByTestId('doc-prompt')
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

  describe('variant', () => {
    it('defaults to block and mirrors it onto data-variant', () => {
      const { getByTestId } = render(DocPrompt, { slots: { default: PROMPT } })
      const text = getByTestId('doc-prompt').querySelector('[data-variant]')
      expect(text?.getAttribute('data-variant')).toBe('block')
      expect(text?.getAttribute('data-state')).toBe('closed')
      expect(text?.hasAttribute('data-expanded')).toBe(false)
    })

    it('carries no disclosure state on the line shape', () => {
      const { getByTestId } = render(DocPrompt, {
        props: { variant: 'line' },
        slots: { default: PROMPT }
      })
      const text = getByTestId('doc-prompt').querySelector('[data-variant]')
      expect(text?.hasAttribute('data-state')).toBe(false)
    })

    it('mirrors variant="line" onto data-variant', () => {
      const { getByTestId } = render(DocPrompt, {
        props: { variant: 'line' },
        slots: { default: PROMPT }
      })
      const text = getByTestId('doc-prompt').querySelector('[data-variant]')
      expect(text?.getAttribute('data-variant')).toBe('line')
    })

    it('isolates the prompt direction so an English prompt runs left to right in a right-to-left page', () => {
      const { getByTestId } = render(DocPrompt, {
        props: { variant: 'line' },
        slots: { default: PROMPT },
        attrs: { dir: 'rtl' }
      })
      const text = getByTestId('doc-prompt').querySelector('p[data-variant]') as HTMLElement
      expect(text.getAttribute('dir')).toBe('auto')
      expect(getComputedStyle(text).direction).toBe('ltr')
    })

    it('places the line fades on the sides of the resolved prompt direction', async () => {
      const style = document.createElement('style')
      style.textContent =
        '[data-testid="doc-prompt"] p[data-variant="line"] { width: 8rem; overflow-x: auto; white-space: nowrap; }'
      document.head.append(style)
      try {
        const { getByTestId } = render(DocPrompt, {
          props: { variant: 'line' },
          slots: { default: PROMPT },
          attrs: { dir: 'rtl' }
        })
        const fade = await waitFor(() => getByTestId('doc-prompt__fade-end'))
        expect(fade.getAttribute('data-direction')).toBe('ltr')
      } finally {
        style.remove()
      }
    })

    it('gives the line shape a tab stop and the block shape none', () => {
      // A scroll container with no focusable child is unreachable by keyboard
      // (axe: scrollable-region-focusable). Only `line` scrolls.
      const line = render(DocPrompt, { props: { variant: 'line' }, slots: { default: PROMPT } })
      expect(
        line.getByTestId('doc-prompt').querySelector('[data-variant]')?.getAttribute('tabindex')
      ).toBe('0')
      line.unmount()

      const block = render(DocPrompt, { props: { variant: 'block' }, slots: { default: PROMPT } })
      expect(
        block.getByTestId('doc-prompt').querySelector('[data-variant]')?.getAttribute('tabindex')
      ).toBeNull()
    })
  })

  describe('title row', () => {
    it('renders no title row by default', () => {
      const { getByTestId, queryByText } = render(DocPrompt, {
        props: { title: '' },
        slots: { default: PROMPT }
      })
      expect(getByTestId('doc-prompt').querySelector('[data-title-row]')).toBeNull()
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
      expect(getByTestId('doc-prompt').querySelector('i.az-sparkles')).toBeTruthy()
    })

    it('renders the icon glyph only alongside a title, and hides it from AT', () => {
      const withTitle = render(DocPrompt, {
        props: { title: 'AI Assistant', icon: 'az az-bolt' },
        slots: { default: PROMPT }
      })
      const glyph = withTitle.getByTestId('doc-prompt').querySelector('i.az-bolt')
      expect(glyph).toBeTruthy()
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
      withTitle.unmount()

      const withoutTitle = render(DocPrompt, {
        props: { icon: 'az az-bolt' },
        slots: { default: PROMPT }
      })
      expect(withoutTitle.getByTestId('doc-prompt').querySelector('i.az-bolt')).toBeNull()
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

    // The copied value is read off the rendered element and settles one render
    // after mount — the nextTick is that render, not a timer wait.
    it('copies the rendered sentence, whitespace collapsed', async () => {
      const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      // Indented like consumer-authored template lines; indentation must not be copied.
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
      // A value captured once at setup would still hand out 'first prompt' here.
      await waitFor(() => expect(write).toHaveBeenCalledWith('second prompt'))
      expect(write).not.toHaveBeenCalledWith('first prompt')
    })
  })

  describe('a11y', () => {
    it('has no violations on the default story', async () => {
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations across both variants', async () => {
      const { container } = render(Kinds)
      await expectNoA11yViolations(container)
    })

    it('has no violations in the bare shape', async () => {
      const { container } = render(Bare)
      await expectNoA11yViolations(container)
    })
  })

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId } = render({
        components: { DocPrompt },
        setup: () => ({ shown }),
        template: `<DocPrompt><template v-if="shown" #default><span data-testid="probe">Slotted</span></template></DocPrompt>`
      })
      expect(queryByTestId('copy-button')).toBeNull()

      shown.value = true
      await nextTick()
      expect(queryByTestId('copy-button')).not.toBeNull()
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(queryByTestId('copy-button')).toBeNull()
      expect(queryByTestId('probe')).toBeNull()
    })
  })
})
