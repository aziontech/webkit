import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-item/DocItem.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocItem from './doc-item.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the row
// hover fill, the ring, the stretched after-pseudo hit area and the glyph travel emit nothing
// here. Those belong to the visual gate. What is real without CSS is the part that decides the
// row's semantics: the listitem role on the shell, the anchor that wraps ONLY the title (its
// accessible name), the link attributes, the external-destination glyph swap, and the testid
// contract. The axe checks run on the composed FrameBox and ItemList stories, because the
// listitem role is only valid under a list-role parent.

const { Default, Variants } = composeStories(stories)

describe('DocItem', () => {
  describe('rendering & testid', () => {
    it('renders the title and copy with the derived testid', () => {
      const { getByTestId, getByText } = render(DocItem, {
        props: { title: 'Edge Functions' },
        slots: { default: 'Build serverless applications.' }
      })
      expect(getByTestId('documentation-doc-item')).toBeInTheDocument()
      expect(getByText('Edge Functions')).toBeInTheDocument()
      expect(getByText('Build serverless applications.')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocItem, {
        attrs: { 'data-testid': 'related-edge-functions' },
        props: { title: 'T' }
      })
      expect(getByTestId('related-edge-functions')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-item')).not.toBeInTheDocument()
    })

    it('falls back to the label prop when the slot is empty', () => {
      const { getByText } = render(DocItem, { props: { title: 'T', label: 'Fallback copy.' } })
      expect(getByText('Fallback copy.')).toBeInTheDocument()
    })

    it('renders the leading glyph only when icon is set', () => {
      const { container } = render(DocItem, { props: { title: 'T', icon: 'pi pi-code' } })
      const glyph = container.querySelector('.pi-code')
      expect(glyph).not.toBeNull()
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
      const without = render(DocItem, { props: { title: 'T' } })
      expect(without.container.querySelector('.pi-code')).toBeNull()
    })
  })

  describe('list semantics', () => {
    it('keeps the listitem role on the shell, never on the anchor', () => {
      const { getByRole, getByTestId } = render(DocItem, {
        props: { title: 'T', href: '/docs/x' }
      })
      const shell = getByRole('listitem')
      expect(shell).toBe(getByTestId('documentation-doc-item'))
      const anchor = shell.querySelector('a')
      expect(anchor).not.toBeNull()
      expect(anchor?.getAttribute('role')).toBeNull()
    })
  })

  describe('the whole row is the link, named by its title', () => {
    it('wraps only the title in the anchor, carrying the destination', () => {
      const { container } = render(DocItem, {
        props: { title: 'Edge SQL', href: '/docs/edge-sql' },
        slots: { default: 'Store relational data across the network.' }
      })
      const anchor = container.querySelector('a')
      expect(anchor).not.toBeNull()
      expect(anchor?.getAttribute('href')).toBe('/docs/edge-sql')
      expect(anchor?.textContent?.trim()).toBe('Edge SQL')
      expect(anchor?.textContent).not.toContain('Store relational data')
    })

    it('renders no anchor and no trailing glyph when href is empty', () => {
      const { container, getByText } = render(DocItem, { props: { title: 'Rule' } })
      expect(getByText('Rule')).toBeInTheDocument()
      expect(container.querySelector('a')).toBeNull()
      expect(container.querySelector('.pi-chevron-right')).toBeNull()
      expect(container.querySelector('.pi-arrow-up-right')).toBeNull()
    })
  })

  describe('leaving the documentation', () => {
    it('draws the chevron for an in-documentation destination', () => {
      const { container } = render(DocItem, { props: { title: 'T', href: '/docs/x' } })
      const glyph = container.querySelector('.pi-chevron-right')
      expect(glyph).not.toBeNull()
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
      expect(container.querySelector('.pi-arrow-up-right')).toBeNull()
    })

    it('swaps to the diagonal arrow and adds rel=noreferrer for an explicit new tab', () => {
      const { container } = render(DocItem, {
        props: { title: 'T', href: 'https://github.com/aziontech', target: '_blank' }
      })
      expect(container.querySelector('.pi-arrow-up-right')).not.toBeNull()
      expect(container.querySelector('.pi-chevron-right')).toBeNull()
      const anchor = container.querySelector('a')
      expect(anchor?.getAttribute('target')).toBe('_blank')
      expect(anchor?.getAttribute('rel')).toBe('noreferrer')
    })

    it('treats an absolute URL as external even in the same tab, without rel', () => {
      const { container } = render(DocItem, {
        props: { title: 'T', href: 'https://azion.com/docs' }
      })
      expect(container.querySelector('.pi-arrow-up-right')).not.toBeNull()
      const anchor = container.querySelector('a')
      expect(anchor?.hasAttribute('rel')).toBe(false)
    })

    it('does not add rel for an in-site destination', () => {
      const { container } = render(DocItem, { props: { title: 'T', href: '/docs/x' } })
      expect(container.querySelector('a')?.hasAttribute('rel')).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('has no violations on the composed default list', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across the anatomy variants', async () => {
      const { container } = render(Variants())
      await expectNoA11yViolations(container)
    })
  })
})
