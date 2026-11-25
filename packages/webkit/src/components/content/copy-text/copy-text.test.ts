import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/copy-text/default.vue'
import LongValue from '../../../../examples/copy-text/long-value.vue'
import Sizes from '../../../../examples/copy-text/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import CopyText from './copy-text.vue'

function stubClipboardResolved() {
  return vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CopyText', () => {
  describe('rendering & testid', () => {
    it('renders the value as left-to-right text with its full value in the title', () => {
      const { getByTestId } = render(Default)
      const root = getByTestId('copy-text')
      const value = getByTestId('copy-text__value')
      expect(root.contains(value)).toBe(true)
      expect(value.textContent).toBe('--spacing-2xl')
      expect(value.getAttribute('dir')).toBe('ltr')
      expect(value.getAttribute('title')).toBe('--spacing-2xl')
    })

    it('keeps the end of a long value visible and truncates its middle', () => {
      const { getByTestId } = render(LongValue)
      const value = getByTestId('copy-text__value')
      const [head, tail] = Array.from(value.children)
      expect(value.textContent).toBe('acme-store-production.example.com')
      expect(tail?.textContent).toBe('example.com')
      expect(tail?.classList.contains('shrink-0')).toBe(true)
      expect(head?.classList.contains('truncate')).toBe(true)
    })

    it('shows the whole value on more lines with wrapLines, never truncating it', () => {
      const value = 'acme-store-production-europe-west.example.com'
      const { getByTestId } = render(CopyText, { props: { value, wrapLines: true } })
      const root = getByTestId('copy-text')
      const shown = getByTestId('copy-text__value')
      expect(root.hasAttribute('data-wrap')).toBe(true)
      expect(shown.textContent).toBe(value)
      expect(shown.children).toHaveLength(0)
      expect(shown.classList.contains('wrap-anywhere')).toBe(true)
      expect(shown.getAttribute('dir')).toBe('ltr')
    })

    it('honors a consumer data-testid and derives the part testids from it', () => {
      const { getByTestId } = render(CopyText, {
        props: { value: 'p-(--spacing-2xl)' },
        attrs: { 'data-testid': 'token-class' }
      })
      expect(getByTestId('token-class').getAttribute('data-size')).toBe('medium')
      expect(getByTestId('token-class__value').textContent).toBe('p-(--spacing-2xl)')
      expect(getByTestId('token-class__copy').querySelector('button')).toBeTruthy()
    })

    it('lands consumer class and id on the root', () => {
      const { getByTestId } = render(CopyText, {
        props: { value: 'x' },
        attrs: { class: 'ms-auto', id: 'token' }
      })
      const root = getByTestId('copy-text')
      expect(root.id).toBe('token')
      expect(root.classList.contains('ms-auto')).toBe(true)
    })
  })

  describe('copy button', () => {
    it('is always rendered and named after the value by default', () => {
      const { getByRole } = render(Default)
      expect(getByRole('button', { name: 'Copy --spacing-2xl' }).tagName).toBe('BUTTON')
    })

    it('uses ariaLabel when provided', () => {
      const { getByRole } = render(LongValue)
      expect(getByRole('button', { name: 'Copy CNAME' }).tagName).toBe('BUTTON')
    })

    it('reads its default name from the locale catalog', () => {
      const view = render(ConfigProvider, {
        props: { locale: 'pt-BR', catalogs: LOCALES },
        slots: { default: () => h(CopyText, { value: '--spacing-2xl' }) }
      })
      expect(view.getByRole('button', { name: 'Copiar --spacing-2xl' }).tagName).toBe('BUTTON')
      view.unmount()
    })

    it('forwards size to the copy button', () => {
      const { getAllByRole } = render(Sizes)
      const sizes = getAllByRole('button').map((b) => b.getAttribute('data-size'))
      expect(sizes).toEqual(['small', 'medium'])
    })

    it('is the only tab stop', () => {
      const { container } = render(Default)
      const focusable = container.querySelectorAll('button, a[href], input, [tabindex]')
      expect(focusable).toHaveLength(1)
    })
  })

  describe('copy event', () => {
    it('writes the value and emits copy with the event first and the value second', async () => {
      const writeText = stubClipboardResolved()
      const { getByRole, emitted } = render(CopyText, { props: { value: '--spacing-2xl' } })

      await fireEvent.click(getByRole('button', { name: 'Copy --spacing-2xl' }))

      await waitFor(() => expect(emitted().copy).toBeTruthy())
      expect(writeText).toHaveBeenCalledWith('--spacing-2xl')
      const events = emitted().copy as [Event, string][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
      expect(events[0][1]).toBe('--spacing-2xl')
    })

    it('announces the copied state', async () => {
      stubClipboardResolved()
      const { getByRole, getByTestId } = render(CopyText, { props: { value: 'x' } })

      await fireEvent.click(getByRole('button', { name: 'Copy x' }))

      await waitFor(() => expect(getByRole('button', { name: 'Copied' })).toBeTruthy())
      const status = getByTestId('copy-text__copy__status')
      expect(status.getAttribute('role')).toBe('status')
      expect(status.textContent?.trim()).toBe('Copied')
    })

    it('does not write or emit when the value is empty', async () => {
      const writeText = stubClipboardResolved()
      const { getByRole, emitted } = render(CopyText, { props: { value: '' } })

      await fireEvent.click(getByRole('button'))

      expect(writeText).not.toHaveBeenCalled()
      expect(emitted().copy).toBeUndefined()
    })

    it('copies with the keyboard', async () => {
      const writeText = stubClipboardResolved()
      const { getByRole } = render(CopyText, { props: { value: 'acme' } })
      const button = getByRole('button', { name: 'Copy acme' })
      button.focus()
      expect(document.activeElement).toBe(button)

      button.click()

      await waitFor(() => expect(writeText).toHaveBeenCalledWith('acme'))
    })
  })

  describe('right-to-left', () => {
    it('keeps the value left-to-right inside a right-to-left subtree', () => {
      const view = render(ConfigProvider, {
        props: { dir: 'rtl' },
        slots: { default: () => h(CopyText, { value: 'p-(--spacing-2xl)' }) }
      })
      const value = view.getByTestId('copy-text__value')
      expect(value.closest('[dir="rtl"]')).toBeTruthy()
      expect(value.getAttribute('dir')).toBe('ltr')
      view.unmount()
    })
  })

  describe('a11y', () => {
    it.each([
      ['default', Default],
      ['sizes', Sizes],
      ['long value', LongValue]
    ])('%s example has no violations', async (_name, example) => {
      const { container } = render(example)
      await expectNoA11yViolations(container)
    })

    it('copied state has no violations', async () => {
      stubClipboardResolved()
      const { container, getByRole } = render(CopyText, { props: { value: 'x' } })
      await fireEvent.click(getByRole('button', { name: 'Copy x' }))
      await waitFor(() => expect(getByRole('button', { name: 'Copied' })).toBeTruthy())
      await expectNoA11yViolations(container)
    })
  })
})
