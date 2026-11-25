import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ChromeBoundary from '../../../../examples/doc-prose/chrome-boundary.vue'
import Default from '../../../../examples/doc-prose/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocProse from './doc-prose.vue'

// Browser mode loads no Tailwind, so the typographic ladder and the chrome exclusions
// (all CSS) are verified by the visual gate; asserted here: the container renders its
// slot as-is, adds no semantics of its own, and forwards attributes.

// The real Clipboard API rejects in headless Chromium ("Document is not focused"), so
// writeText is stubbed; under test is which chips hand a string over. The rejecting
// stub exercises a real browser path too (insecure origin, denied permission).
const stubClipboard = (writeText = vi.fn().mockResolvedValue(undefined)) => {
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
  return writeText
}

// The tooltip Teleports to the body, so it is outside the render container by design.
const copyTip = () => document.body.querySelector('[data-testid="doc-prose__copy-tip"]')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('DocProse', () => {
  describe('rendering & testid', () => {
    it('renders with the derived testid', () => {
      const { getByTestId } = render(DocProse, { slots: { default: '<p>Body copy.</p>' } })
      expect(getByTestId('doc-prose')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocProse, {
        attrs: { 'data-testid': 'first-deploy-prose' },
        slots: { default: '<p>Body copy.</p>' }
      })
      expect(getByTestId('first-deploy-prose')).toBeInTheDocument()
      expect(queryByTestId('doc-prose')).not.toBeInTheDocument()
    })
  })

  describe('the slot passes through untouched', () => {
    it('renders authored HTML as the same elements, adding no wrapper', () => {
      const { getByTestId } = render(DocProse, {
        slots: { default: '<h2>Heading</h2><p>Paragraph</p><ul><li>Item</li></ul>' }
      })
      const root = getByTestId('doc-prose')
      expect(Array.from(root.children).map((el) => el.tagName)).toEqual(['H2', 'P', 'UL'])
      expect(root.querySelector('ul > li')).toBeInTheDocument()
    })

    it('adds no role or ARIA of its own — the semantics are the author HTML', () => {
      const { getByTestId } = render(DocProse, { slots: { default: '<p>Body copy.</p>' } })
      const root = getByTestId('doc-prose')
      expect(root.hasAttribute('role')).toBe(false)
      expect(root.getAttributeNames().filter((n) => n.startsWith('aria-'))).toEqual([])
    })

    it('leaves a data-doc-chrome subtree in the tree untouched', () => {
      const { getByTestId, getByText } = render(DocProse, {
        slots: { default: '<p>Prose</p><div data-doc-chrome><p>Component copy</p></div>' }
      })
      // The CSS exclusion is unobservable here; marking a subtree must not change what renders.
      expect(getByTestId('doc-prose').querySelector('[data-doc-chrome] p')).toBeInTheDocument()
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
      const root = getByTestId('doc-prose')
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
      vi.spyOn(document, 'execCommand').mockReturnValue(false)
      const { getByText } = render(DocProse, {
        slots: { default: '<p>Run <code>azion deploy</code> to publish.</p>' }
      })
      await fireEvent.click(getByText('azion deploy'))
      await waitFor(() => expect(copyTip()?.textContent).toContain('to copy'))
    })

    it('names the copy shortcut of the platform when the clipboard is refused', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'))
      vi.spyOn(document, 'execCommand').mockReturnValue(false)
      vi.stubGlobal('navigator', {
        platform: 'Win32',
        userAgent: 'Windows',
        clipboard: { writeText }
      })
      const windows = render(DocProse, {
        slots: { default: '<p>Run <code>azion deploy</code> to publish.</p>' }
      })
      await fireEvent.click(windows.getByText('azion deploy'))
      await waitFor(() => expect(copyTip()?.textContent).toContain('Press Ctrl+C to copy'))
      windows.unmount()

      vi.stubGlobal('navigator', {
        platform: 'MacIntel',
        userAgent: 'Macintosh',
        clipboard: { writeText }
      })
      const mac = render(DocProse, {
        slots: { default: '<p>Run <code>azion deploy</code> to publish.</p>' }
      })
      await fireEvent.click(mac.getByText('azion deploy'))
      await waitFor(() => expect(copyTip()?.textContent).toContain('Press ⌘C to copy'))
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

    it('offers no copy tooltip on a chip inside a link', async () => {
      stubClipboard()
      const { getByText } = render(DocProse, {
        slots: { default: '<p><a href="#cli"><code>azion</code></a></p>' }
      })
      await fireEvent.pointerOver(getByText('azion'))
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(copyTip()).toBeNull()
    })
  })

  describe('a command chip', () => {
    const command =
      '<p>Run <code data-command>azion deploy --local</code> or read <code>azion.config.js</code>.</p>'

    it('is a button that names the copy, and plain chips stay text', async () => {
      const { getByText } = render(DocProse, { slots: { default: command } })
      const chip = getByText('azion deploy --local')
      await waitFor(() => expect(chip.getAttribute('role')).toBe('button'))
      expect(chip.getAttribute('tabindex')).toBe('0')
      expect(chip.getAttribute('aria-label')).toBe('Copy azion deploy --local')
      const plain = getByText('azion.config.js')
      expect(plain.hasAttribute('role')).toBe(false)
      expect(plain.hasAttribute('tabindex')).toBe(false)
    })

    it('copies the whole command from the keyboard, selects it and announces it politely', async () => {
      const writeText = stubClipboard()
      const { getByText } = render(DocProse, { slots: { default: command } })
      const chip = getByText('azion deploy --local')
      await waitFor(() => expect(chip.getAttribute('tabindex')).toBe('0'))
      chip.focus()
      await waitFor(() => expect(copyTip()?.textContent).toBe('Copy'))
      await fireEvent.keyDown(chip, { key: 'Enter' })
      expect(writeText).toHaveBeenCalledWith('azion deploy --local')
      await waitFor(() => expect(copyTip()?.textContent).toBe('Copied'))
      expect(globalThis.getSelection()?.toString()).toBe('azion deploy --local')
      const status = document.body.querySelector('[data-testid="doc-prose__copy-status"]')
      expect(status?.getAttribute('aria-live')).toBe('polite')
      expect(status?.textContent).toBe('Copied')

      await fireEvent.keyDown(chip, { key: ' ' })
      expect(writeText).toHaveBeenCalledTimes(2)
    })

    it('ignores Enter on a plain chip, which is not a stop', async () => {
      const writeText = stubClipboard()
      const { getByText } = render(DocProse, { slots: { default: command } })
      await fireEvent.keyDown(getByText('azion.config.js'), { key: 'Enter' })
      expect(writeText).not.toHaveBeenCalled()
    })

    it('has no violations with a command chip', async () => {
      const { container, getByText } = render(DocProse, { slots: { default: command } })
      await waitFor(() =>
        expect(getByText('azion deploy --local').getAttribute('role')).toBe('button')
      )
      await expectNoA11yViolations(container)
    })
  })

  describe('accessibility', () => {
    it('has no violations over the full ladder', async () => {
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations with a chrome subtree nested in prose', async () => {
      const { container } = render(ChromeBoundary)
      await expectNoA11yViolations(container)
    })
  })

  describe('the first-block reset stops at chrome', () => {
    // Pixels belong to the visual gate; this asserts the contract in the class list.
    const firstChildRules = (root: HTMLElement) =>
      root.className.split(/\s+/).filter((cls) => cls.startsWith('[&>*:first-child'))

    it('zeroes the margin of the first block at both levels, chrome included', () => {
      const { getByTestId } = render(DocProse, { slots: { default: '<p>Body copy.</p>' } })
      const rules = firstChildRules(getByTestId('doc-prose'))
      expect(rules).toContain('[&>*:first-child]:mt-0!')
      expect(rules).toContain('[&>*:first-child>*:first-child]:mt-0!')
    })

    it('zeroes the padding of the first block only when it is not chrome', () => {
      const { getByTestId } = render(DocProse, { slots: { default: '<p>Body copy.</p>' } })
      const rules = firstChildRules(getByTestId('doc-prose'))
      expect(rules).toContain('[&>*:first-child:not([data-doc-chrome])]:pt-0!')
      expect(rules).toContain('[&>*:first-child>*:first-child:not([data-doc-chrome])]:pt-0!')
      expect(rules.filter((cls) => cls.endsWith(':pt-0!'))).toHaveLength(2)
    })
  })

  describe('tables', () => {
    it('puts a prose table in the tab order, so a wide table scrolls from the keyboard', async () => {
      const { container } = render(DocProse, {
        slots: {
          default:
            '<table><thead><tr><th>Token</th></tr></thead><tbody><tr><td>--primary</td></tr></tbody></table>' +
            '<div data-doc-chrome><table><tbody><tr><td>Chrome</td></tr></tbody></table></div>'
        }
      })
      const [prose, chrome] = container.querySelectorAll('table')
      await waitFor(() => expect(prose).toHaveAttribute('tabindex', '0'))
      expect(chrome).not.toHaveAttribute('tabindex')
      prose.focus()
      expect(document.activeElement).toBe(prose)
      await expectNoA11yViolations(container)
    })
  })
})
