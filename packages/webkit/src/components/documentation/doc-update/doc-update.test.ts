import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-update/DocUpdate.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocUpdate from './doc-update.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// sticky label column, the inter-entry rule and the chain-glyph fade emit nothing here —
// those belong to the visual gate. What is real without CSS is what decides the entry's
// semantics: the section/heading/anchor structure, the id derivation (explicit anchor prop
// over the slugified label), the aria-labelledby wiring, the Tag chips, the no-op
// heading-nav degradation outside a provider, and the testid contract.

const { Default, Changelog } = composeStories(stories)

describe('DocUpdate', () => {
  describe('rendering & testid', () => {
    it('renders the label, description and notes with the derived testid', () => {
      const { getByTestId, getByText } = render(DocUpdate, {
        props: { label: 'August 19, 2026', description: 'v2.4.0' },
        slots: { default: '<p>Header matching shipped.</p>' }
      })
      const root = getByTestId('documentation-doc-update')
      expect(root).toBeInTheDocument()
      expect(root.tagName).toBe('SECTION')
      expect(root.hasAttribute('data-doc-update')).toBe(true)
      expect(getByText('August 19, 2026')).toBeInTheDocument()
      expect(getByText('v2.4.0')).toBeInTheDocument()
      expect(getByText('Header matching shipped.')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocUpdate, {
        attrs: { 'data-testid': 'changelog-entry' },
        props: { label: 'August 19, 2026' }
      })
      expect(getByTestId('changelog-entry')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-update')).not.toBeInTheDocument()
    })

    it('renders one Tag chip per entry in tags', () => {
      const { getAllByTestId, getByText } = render(DocUpdate, {
        props: { label: 'August 19, 2026', tags: ['Console', 'Edge Functions'] }
      })
      expect(getAllByTestId('content-tag')).toHaveLength(2)
      expect(getByText('Console')).toBeInTheDocument()
      expect(getByText('Edge Functions')).toBeInTheDocument()
    })

    it('renders no description line and no tag row when they are empty', () => {
      const { getByTestId, queryAllByTestId } = render(DocUpdate, {
        props: { label: 'August 19, 2026' }
      })
      expect(queryAllByTestId('content-tag')).toHaveLength(0)
      // The description is the only direct span child of the label column; with no
      // description the column holds nothing but the heading.
      const column = getByTestId('documentation-doc-update').querySelector('[data-doc-chrome]')
      expect(column?.querySelector(':scope > span')).toBeNull()
      expect(column?.children).toHaveLength(1)
    })
  })

  describe('the anchor id', () => {
    it('derives the id from the label via slugify', () => {
      const { getByTestId, getByRole } = render(DocUpdate, {
        props: { label: 'August 19, 2026' }
      })
      const root = getByTestId('documentation-doc-update')
      expect(root.id).toBe('august-19-2026')
      expect(root.getAttribute('aria-labelledby')).toBe('august-19-2026-label')
      const heading = getByRole('heading', { level: 2 })
      expect(heading.id).toBe('august-19-2026-label')
      expect(getByRole('link').getAttribute('href')).toBe('#august-19-2026')
    })

    it('strips inline markup from the label before slugifying', () => {
      const { getByTestId } = render(DocUpdate, {
        props: { label: '**v2.4** `edge` release!' }
      })
      expect(getByTestId('documentation-doc-update').id).toBe('v24-edge-release')
    })

    it('prefers an explicit anchor prop over the label slug', () => {
      const { getByTestId, getByRole } = render(DocUpdate, {
        props: { label: 'August 19, 2026', anchor: 'release-2' }
      })
      const root = getByTestId('documentation-doc-update')
      expect(root.id).toBe('release-2')
      expect(root.getAttribute('aria-labelledby')).toBe('release-2-label')
      expect(getByRole('link').getAttribute('href')).toBe('#release-2')
    })
  })

  describe('heading navigation', () => {
    it('does not crash when the label anchor is activated outside a provider', async () => {
      const { getByRole } = render(DocUpdate, {
        props: { label: 'August 19, 2026' }
      })
      const link = getByRole('link', { name: 'August 19, 2026' })
      await fireEvent.click(link)
      // The injected default is a no-op, so activation neither throws nor
      // removes the entry; native hash navigation owns the jump.
      expect(link).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('keeps the chain glyph decorative', () => {
      const { getByRole } = render(DocUpdate, { props: { label: 'August 19, 2026' } })
      const glyph = getByRole('link').querySelector('i')
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
    })

    it('has no violations on the default render', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across a changelog of entries', async () => {
      const { container } = render(Changelog())
      await expectNoA11yViolations(container)
    })
  })
})
