import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import Default from '../../../../examples/doc-callout/default.vue'
import Kinds from '../../../../examples/doc-callout/variants.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocProse from '../doc-prose/doc-prose.vue'
import DocCallout from './doc-callout.vue'

// Browser mode loads no Tailwind, so per-kind colours are unverifiable here;
// asserted instead: the severity/glyph each variant resolves to, testid, and copy.

const VARIANTS = [
  { variant: 'note', severity: 'info', icon: 'az az-circle-info', neutral: false },
  { variant: 'info', severity: 'info', icon: 'az az-circle-info', neutral: true },
  { variant: 'tip', severity: 'info', icon: 'az az-lightbulb', neutral: true },
  { variant: 'check', severity: 'success', icon: 'az az-circle-check', neutral: false },
  { variant: 'warning', severity: 'warning', icon: 'az az-triangle-alert', neutral: false },
  { variant: 'danger', severity: 'danger', icon: 'az az-circle-x', neutral: false }
] as const

describe('DocCallout', () => {
  describe('rendering & testid', () => {
    it('renders the copy with the derived testid', () => {
      const { getByTestId, getByText } = render(DocCallout, {
        slots: { default: 'Warm-up is per location.' }
      })
      expect(getByTestId('doc-callout')).toBeInTheDocument()
      expect(getByText('Warm-up is per location.')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocCallout, {
        attrs: { 'data-testid': 'first-deploy-caveat' },
        slots: { default: 'Copy.' }
      })
      expect(getByTestId('first-deploy-caveat')).toBeInTheDocument()
      expect(queryByTestId('doc-callout')).not.toBeInTheDocument()
    })

    it('falls back to the label prop when the slot is empty', () => {
      const { getByText } = render(DocCallout, { props: { label: 'Fallback copy.' } })
      expect(getByText('Fallback copy.')).toBeInTheDocument()
    })
  })

  describe('block content', () => {
    it('keeps a paragraph and a list inside the copy once the server markup is parsed as HTML', async () => {
      // MDX asides arrive as server-rendered markup; a copy region that is a p would be
      // closed by the parser at the ul, pushing the list beside the text (see Alert).
      const app = createSSRApp({
        render: () =>
          h(DocCallout, { variant: 'note' }, () => [
            h('p', 'It will be necessary to take the following actions:'),
            h('ul', [
              h('li', 'Migrate to the new chain.'),
              h('li', 'No action for other variants.')
            ])
          ])
      })
      const html = await renderToString(app)
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const content = doc.querySelector('[data-testid="doc-callout__content"]')

      expect(content).not.toBeNull()
      expect(content?.querySelector('p')).not.toBeNull()
      expect(content?.querySelector('ul')).not.toBeNull()
      expect(content?.querySelectorAll('li')).toHaveLength(2)
    })
  })

  describe('variants', () => {
    it.each(VARIANTS)('variant=$variant resolves severity $severity and its glyph', (entry) => {
      const { getByTestId, container } = render(DocCallout, {
        props: { variant: entry.variant },
        slots: { default: 'Copy.' }
      })
      const root = getByTestId('doc-callout')
      expect(root.getAttribute('data-variant')).toBe(entry.variant)
      expect(container.querySelector(`i.${entry.icon.split(' ').join('.')}`)).toBeInTheDocument()
    })

    it('draws no two variants alike', () => {
      const looks = VARIANTS.map((entry) => {
        const { getByTestId, container, unmount } = render(DocCallout, {
          props: { variant: entry.variant },
          slots: { default: 'Copy.' }
        })
        const root = getByTestId('doc-callout')
        const look = [
          root.getAttribute('data-severity') ??
            container.querySelector('[data-severity]')?.getAttribute('data-severity'),
          root.hasAttribute('data-neutral'),
          container.querySelector('i')?.className
        ].join('|')
        unmount()
        return look
      })
      expect(new Set(looks).size).toBe(VARIANTS.length)
    })

    it('marks only the info and tip variants as neutral', () => {
      for (const entry of VARIANTS) {
        const { getByTestId, unmount } = render(DocCallout, {
          props: { variant: entry.variant },
          slots: { default: 'Copy.' }
        })
        const root = getByTestId('doc-callout')
        expect(root.hasAttribute('data-neutral')).toBe(entry.neutral)
        unmount()
      }
    })

    it('falls back to note for an unknown variant', () => {
      const { getByTestId, container } = render(DocCallout, {
        // @ts-expect-error — deliberately out of the union, to pin the runtime fallback
        props: { variant: 'nonsense' },
        slots: { default: 'Copy.' }
      })
      expect(getByTestId('doc-callout').hasAttribute('data-neutral')).toBe(false)
      expect(container.querySelector('i.az.az-circle-info')).toBeInTheDocument()
    })
  })

  describe('the DocProse contract', () => {
    it('marks itself as a block and as chrome', () => {
      const { getByTestId } = render(DocCallout, { slots: { default: 'Copy.' } })
      const root = getByTestId('doc-callout')
      expect(root.hasAttribute('data-doc-block')).toBe(true)
      expect(root.hasAttribute('data-doc-chrome')).toBe(true)
    })
  })

  describe('the inline command copies', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    const stubClipboard = () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
      return writeText
    }
    const copyTip = () => document.body.querySelector('[data-testid="doc-callout__copy-tip"]')

    it('copies the whole command on click with a brief Copied', async () => {
      const writeText = stubClipboard()
      const { getByText } = render(Kinds)
      await fireEvent.click(getByText('azion deploy --local'))
      expect(writeText).toHaveBeenCalledWith('azion deploy --local')
      await waitFor(() => expect(copyTip()?.textContent).toBe('Copied'))
      const statuses = () =>
        [...document.body.querySelectorAll('[data-testid="doc-callout__copy-status"]')].map(
          (status) => status.textContent
        )
      expect(statuses().filter((text) => text === 'Copied')).toHaveLength(1)
      await waitFor(() => expect(statuses().every((text) => text === '')).toBe(true), {
        timeout: 3000
      })
    })

    it('reaches the command with Tab and copies it with Enter', async () => {
      const writeText = stubClipboard()
      const { getByRole } = render(Kinds)
      const chip = getByRole('button', { name: 'Copy azion deploy --local' })
      chip.focus()
      await fireEvent.keyDown(chip, { key: 'Enter' })
      expect(writeText).toHaveBeenCalledWith('azion deploy --local')
    })

    it('handles a callout chip once when the callout sits in DocProse', async () => {
      const writeText = stubClipboard()
      const { getByText } = render({
        components: { DocProse, DocCallout },
        template:
          '<DocProse><p>Intro.</p><DocCallout variant="tip">Run <code>azion link</code>.</DocCallout></DocProse>'
      })
      await fireEvent.click(getByText('azion link'))
      expect(writeText).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(document.body.querySelectorAll('[role="tooltip"]').length).toBe(1))
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default render', async () => {
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations across all six variants', async () => {
      const { container } = render(Kinds)
      await expectNoA11yViolations(container)
    })
  })
})
