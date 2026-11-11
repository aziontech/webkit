import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import CopyButton from './copy-button.vue'

// The real Clipboard API rejects in headless Chromium ("Document is not
// focused"), so writeText is stubbed to resolve. This is NOT a layout/focus
// mock — it substitutes the external clipboard side effect so the component's
// own logic (await write -> emit 'copy' -> flip state) can be exercised.
function stubClipboardResolved() {
  return vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CopyButton', () => {
  describe('rendering & testid', () => {
    it('renders a <button> with the idle aria-label and the default testid', () => {
      const { getByRole, getByTestId } = render(CopyButton, {
        props: { value: 'npm i @aziontech/webkit' }
      })
      const node = getByRole('button', { name: 'Copy' })
      expect(node.tagName).toBe('BUTTON')
      // CopyButton wraps IconButton in a <span> that carries the testid; the button is inside it.
      const root = getByTestId('actions-copy-button')
      expect(root.tagName).toBe('SPAN')
      expect(root.contains(node)).toBe(true)
    })

    it('is in the idle state before any interaction (no copied label present)', () => {
      const { getByRole, queryByRole } = render(CopyButton, { props: { value: 'token' } })
      expect(getByRole('button', { name: 'Copy' }).tagName).toBe('BUTTON')
      expect(queryByRole('button', { name: 'Copied' })).toBeNull()
    })

    it('uses a custom ariaLabel when provided', () => {
      const { getByRole } = render(CopyButton, {
        props: { value: 'token', ariaLabel: 'Copy token' }
      })
      expect(getByRole('button', { name: 'Copy token' }).tagName).toBe('BUTTON')
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(CopyButton, {
        props: { value: 'token' },
        attrs: { 'data-testid': 'copy-token' }
      })
      const root = getByTestId('copy-token')
      expect(root.tagName).toBe('SPAN')
      expect(root.querySelector('button')).toBeTruthy()
    })
  })

  describe('copy emission', () => {
    it('writes the value to the clipboard and emits copy with that value', async () => {
      const writeText = stubClipboardResolved()
      const { getByRole, emitted } = render(CopyButton, {
        props: { value: 'secret-value' }
      })

      await fireEvent.click(getByRole('button', { name: 'Copy' }))

      await waitFor(() => {
        expect(emitted().copy).toBeTruthy()
      })
      expect(writeText).toHaveBeenCalledWith('secret-value')
      const events = emitted().copy as string[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBe('secret-value')
    })

    it('swaps the accessible name to the copied label after a successful copy', async () => {
      stubClipboardResolved()
      const { getByRole } = render(CopyButton, {
        props: { value: 'secret-value', ariaLabel: 'Copy', copiedLabel: 'Copied' }
      })

      await fireEvent.click(getByRole('button', { name: 'Copy' }))

      await waitFor(() => {
        expect(getByRole('button', { name: 'Copied' }).tagName).toBe('BUTTON')
      })
    })

    it('honors a custom copiedLabel', async () => {
      stubClipboardResolved()
      const { getByRole } = render(CopyButton, {
        props: { value: 'secret-value', copiedLabel: 'Done!' }
      })

      await fireEvent.click(getByRole('button', { name: 'Copy' }))

      await waitFor(() => {
        expect(getByRole('button', { name: 'Done!' }).tagName).toBe('BUTTON')
      })
    })
  })

  describe('disabled', () => {
    it('renders a natively disabled button and does not emit copy on click', async () => {
      const writeText = stubClipboardResolved()
      const { getByRole, emitted } = render(CopyButton, {
        props: { value: 'secret-value', disabled: true }
      })

      const node = getByRole('button', { name: 'Copy' }) as HTMLButtonElement
      expect(node.disabled).toBe(true)

      await fireEvent.click(node)

      expect(emitted().copy).toBeUndefined()
      expect(writeText).not.toHaveBeenCalled()
    })
  })

  describe('empty value', () => {
    it('does not write to the clipboard or emit copy when value is empty', async () => {
      const writeText = stubClipboardResolved()
      const { getByRole, emitted } = render(CopyButton, {
        props: { value: '' }
      })

      await fireEvent.click(getByRole('button', { name: 'Copy' }))

      expect(writeText).not.toHaveBeenCalled()
      expect(emitted().copy).toBeUndefined()
    })
  })

  describe('clipboard blocked', () => {
    it('opens the manual-copy popover with the value selected and does not emit copy', async () => {
      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new DOMException('denied'))
      const { getByRole, emitted, unmount } = render(CopyButton, {
        props: { value: 'azion-token-123' }
      })
      const button = getByRole('button', { name: 'Copy' })
      await fireEvent.click(button)

      const dialog = await waitFor(() => {
        const node = document.body.querySelector<HTMLElement>('[role="dialog"]')
        expect(node).toBeTruthy()
        return node!
      })
      expect(dialog).toHaveAccessibleName('Copy manually')
      expect(dialog).toHaveAccessibleDescription(/Press (Ctrl\+C|⌘C) to copy\./)
      const field = document.body.querySelector<HTMLInputElement>(
        'input[data-testid="actions-copy-button__fallback-input"]'
      )!
      expect(field).toHaveAccessibleName('Value to copy')
      expect(field.value).toBe('azion-token-123')
      expect(field.readOnly).toBe(true)
      await waitFor(() => expect(document.activeElement).toBe(field))
      expect([field.selectionStart, field.selectionEnd]).toEqual([0, 'azion-token-123'.length])
      expect(emitted().copy).toBeUndefined()
      await expectNoA11yViolations(dialog)

      await fireEvent.keyDown(document, { key: 'Escape' })
      await waitFor(() => expect(document.body.querySelector('[role="dialog"]')).toBeNull())
      expect(document.activeElement).toBe(button)
      unmount()
    })

    it('reads the fallback strings from the locale catalog', async () => {
      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new DOMException('denied'))
      const view = render(WebkitProvider, {
        props: { locale: 'pt-BR', catalogs: LOCALES },
        slots: { default: () => h(CopyButton, { value: 'x' }) }
      })
      await fireEvent.click(view.getByRole('button', { name: 'Copiar' }))
      await waitFor(() =>
        expect(document.body.querySelector('[role="dialog"]')).toHaveAccessibleName(
          'Copie manualmente'
        )
      )
      view.unmount()
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('idle state has no violations', async () => {
      const { container } = render(CopyButton, { props: { value: 'token' } })
      await expectNoA11yViolations(container)
    })

    it('copied state has no violations', async () => {
      stubClipboardResolved()
      const { container, getByRole } = render(CopyButton, { props: { value: 'token' } })
      await fireEvent.click(getByRole('button', { name: 'Copy' }))
      await waitFor(() => {
        expect(getByRole('button', { name: 'Copied' })).toBeTruthy()
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('variant smoke (kind/size forwarded to IconButton)', () => {
    const kinds = ['primary', 'secondary', 'outlined', 'transparent', 'danger'] as const
    it.each(kinds)('renders an accessible button for kind=%s', (kind) => {
      const { getByRole } = render(CopyButton, { props: { value: 'token', kind } })
      expect(getByRole('button', { name: 'Copy' }).tagName).toBe('BUTTON')
    })

    const sizes = ['small', 'medium', 'large'] as const
    it.each(sizes)('renders an accessible button for size=%s', (size) => {
      const { getByRole } = render(CopyButton, { props: { value: 'token', size } })
      expect(getByRole('button', { name: 'Copy' }).tagName).toBe('BUTTON')
    })
  })
})
