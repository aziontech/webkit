import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import Default from '../../../../examples/doc-callout/default.vue'
import Kinds from '../../../../examples/doc-callout/variants.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCallout from './doc-callout.vue'

// Browser mode loads no Tailwind, so per-kind colours are unverifiable here;
// asserted instead: the severity/glyph each variant resolves to, testid, and copy.

const VARIANTS = [
  { variant: 'note', severity: 'info', icon: 'ai ai-circle-info', neutral: false },
  { variant: 'info', severity: 'info', icon: 'ai ai-circle-info', neutral: false },
  { variant: 'tip', severity: 'info', icon: 'ai ai-lightbulb', neutral: true },
  { variant: 'check', severity: 'success', icon: 'ai ai-circle-check', neutral: false },
  { variant: 'warning', severity: 'warning', icon: 'ai ai-triangle-alert', neutral: false },
  { variant: 'danger', severity: 'danger', icon: 'ai ai-circle-x', neutral: false }
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

    it('marks only the tip variant as neutral', () => {
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
      expect(container.querySelector('i.ai.ai-circle-info')).toBeInTheDocument()
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
