import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
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
      expect(getByTestId('actions-copy-button')).toBe(node)
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
      expect(getByTestId('copy-token').tagName).toBe('BUTTON')
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
