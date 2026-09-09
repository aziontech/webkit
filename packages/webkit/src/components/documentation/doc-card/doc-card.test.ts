import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-card/DocCard.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCard from './doc-card.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// cell ring, the hover fill and the glyph travel emit nothing here. Those belong to the
// visual gate. What is real without CSS is the part that decides the card's semantics: which
// ROOT ELEMENT it renders (anchor vs block, driven by `href`), the link attributes, the
// external-destination affordance, and the testid contract.

const { Default, Variants } = composeStories(stories)

describe('DocCard', () => {
  describe('rendering & testid', () => {
    it('renders the title and copy with the derived testid', () => {
      const { getByTestId, getByText } = render(DocCard, {
        props: { title: 'Edge Application' },
        slots: { default: 'Serve at the edge.' }
      })
      expect(getByTestId('documentation-doc-card')).toBeInTheDocument()
      expect(getByText('Edge Application')).toBeInTheDocument()
      expect(getByText('Serve at the edge.')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocCard, {
        attrs: { 'data-testid': 'products-edge-app' },
        props: { title: 'T' }
      })
      expect(getByTestId('products-edge-app')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-card')).not.toBeInTheDocument()
    })

    it('falls back to the label prop when the slot is empty', () => {
      const { getByText } = render(DocCard, { props: { title: 'T', label: 'Fallback copy.' } })
      expect(getByText('Fallback copy.')).toBeInTheDocument()
    })

    it('renders the overline only when one is given', () => {
      const without = render(DocCard, { props: { title: 'T' } })
      expect(without.queryByText('Azion CLI')).not.toBeInTheDocument()
      const withOverline = render(DocCard, { props: { title: 'T', overline: 'Azion CLI' } })
      expect(withOverline.getByText('Azion CLI')).toBeInTheDocument()
    })
  })

  describe('the root element switches on href', () => {
    it('is an anchor carrying the destination when href is set', () => {
      const { getByTestId } = render(DocCard, {
        props: { title: 'T', href: '/docs/edge-application' }
      })
      const root = getByTestId('documentation-doc-card')
      expect(root.tagName).toBe('A')
      expect(root.getAttribute('href')).toBe('/docs/edge-application')
    })

    it('is a non-interactive block when href is empty', () => {
      const { getByTestId } = render(DocCard, { props: { title: 'T' } })
      const root = getByTestId('documentation-doc-card')
      expect(root.tagName).not.toBe('A')
      expect(root.hasAttribute('href')).toBe(false)
    })
  })

  describe('leaving the documentation', () => {
    it('adds rel=noreferrer for an explicit new tab', () => {
      const { getByTestId } = render(DocCard, {
        props: { title: 'T', href: 'https://github.com/aziontech', target: '_blank' }
      })
      const root = getByTestId('documentation-doc-card')
      expect(root.getAttribute('target')).toBe('_blank')
      expect(root.getAttribute('rel')).toBe('noreferrer')
    })

    it('does not add rel for an in-site destination', () => {
      const { getByTestId } = render(DocCard, { props: { title: 'T', href: '/docs/x' } })
      expect(getByTestId('documentation-doc-card').hasAttribute('rel')).toBe(false)
    })
  })

  describe('call to action', () => {
    it('renders the link row only when link is set', () => {
      const without = render(DocCard, { props: { title: 'T', href: '/x' } })
      expect(without.queryByText('Read the guide')).not.toBeInTheDocument()
      const withLink = render(DocCard, {
        props: { title: 'T', href: '/x', link: 'Read the guide' }
      })
      expect(withLink.getByText('Read the guide')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default render', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across the anatomy variants', async () => {
      const { container } = render(Variants())
      await expectNoA11yViolations(container)
    })
  })
})
