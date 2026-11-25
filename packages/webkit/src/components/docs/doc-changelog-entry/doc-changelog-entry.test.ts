import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Changelog from '../../../../examples/doc-changelog-entry/changelog.vue'
import Default from '../../../../examples/doc-changelog-entry/default.vue'
import Releases from '../../../../examples/doc-changelog-entry/releases.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocChangelogEntry from './doc-changelog-entry.vue'

// Browser mode loads no Tailwind — sticky column/rule/fade belong to the visual gate;
// asserted here: structure, id derivation, aria-labelledby wiring, chips, testids.

describe('DocChangelogEntry', () => {
  describe('rendering & testid', () => {
    it('renders the label, description and notes with the derived testid', () => {
      const { getByTestId, getByText } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026', description: 'v2.4.0' },
        slots: { default: '<p>Header matching shipped.</p>' }
      })
      const root = getByTestId('doc-changelog-entry')
      expect(root).toBeInTheDocument()
      expect(root.tagName).toBe('SECTION')
      expect(root.hasAttribute('data-doc-changelog-entry')).toBe(true)
      expect(getByText('August 19, 2026')).toBeInTheDocument()
      expect(getByText('v2.4.0')).toBeInTheDocument()
      expect(getByText('Header matching shipped.')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocChangelogEntry, {
        attrs: { 'data-testid': 'changelog-entry' },
        props: { label: 'August 19, 2026' }
      })
      expect(getByTestId('changelog-entry')).toBeInTheDocument()
      expect(queryByTestId('doc-changelog-entry')).not.toBeInTheDocument()
    })

    it('renders one Tag chip per entry in tags', () => {
      const { getAllByTestId, getByText } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026', tags: ['Console', 'Functions'] }
      })
      expect(getAllByTestId('tag')).toHaveLength(2)
      expect(getByText('Console')).toBeInTheDocument()
      expect(getByText('Functions')).toBeInTheDocument()
    })

    it('renders no description line and no tag row when they are empty', () => {
      const { getByTestId, queryAllByTestId } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026' }
      })
      expect(queryAllByTestId('tag')).toHaveLength(0)
      // The description is the only direct span child of the label column.
      const column = getByTestId('doc-changelog-entry').querySelector('[data-doc-chrome]')
      expect(column?.querySelector(':scope > span')).toBeNull()
      expect(column?.children).toHaveLength(1)
    })
  })

  describe('the anchor id', () => {
    it('derives the id from the label via slugify', () => {
      const { getByTestId, getByRole } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026' }
      })
      const root = getByTestId('doc-changelog-entry')
      expect(root.id).toBe('august-19-2026')
      expect(root.getAttribute('aria-labelledby')).toBe('august-19-2026-label')
      const heading = getByRole('heading', { level: 2 })
      expect(heading.id).toBe('august-19-2026-label')
      expect(getByRole('link').getAttribute('href')).toBe('#august-19-2026')
    })

    it('strips inline markup from the label before slugifying', () => {
      const { getByTestId } = render(DocChangelogEntry, {
        props: { label: '**v2.4** `edge` release!' }
      })
      expect(getByTestId('doc-changelog-entry').id).toBe('v24-edge-release')
    })

    it('prefers an explicit anchor prop over the label slug', () => {
      const { getByTestId, getByRole } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026', anchor: 'release-2' }
      })
      const root = getByTestId('doc-changelog-entry')
      expect(root.id).toBe('release-2')
      expect(root.getAttribute('aria-labelledby')).toBe('release-2-label')
      expect(getByRole('link').getAttribute('href')).toBe('#release-2')
    })
  })

  describe('a titled entry', () => {
    const titled = {
      label: 'September 2, 2026',
      title: 'Terraform Provider',
      description: 'Version 2.8.0',
      tags: ['Improvements', 'Bug fixes']
    }

    it('makes the title the heading and the label a plain date', () => {
      const { getByRole, getByText, getAllByRole } = render(DocChangelogEntry, { props: titled })
      const heading = getByRole('heading', { level: 2 })
      expect(heading.textContent?.trim()).toBe('Terraform Provider')
      expect(getAllByRole('heading')).toHaveLength(1)
      expect(getByText('September 2, 2026').closest('h2')).toBeNull()
      expect(getByText('Version 2.8.0')).toBeInTheDocument()
    })

    it('centres the node on the rule in both reading directions', () => {
      const { getByTestId } = render(DocChangelogEntry, { props: titled })
      const node = getByTestId('doc-changelog-entry__node')
      expect(node.className).toContain('-translate-x-1/2')
      expect(node.className).toContain('rtl:translate-x-1/2')
    })

    it('anchors on the label and title together', () => {
      const { getByTestId, getByRole } = render(DocChangelogEntry, { props: titled })
      const root = getByTestId('doc-changelog-entry')
      expect(root.id).toBe('september-2-2026-terraform-provider')
      expect(root.getAttribute('aria-labelledby')).toBe('september-2-2026-terraform-provider-label')
      expect(getByRole('heading', { level: 2 }).id).toBe(
        'september-2-2026-terraform-provider-label'
      )
      expect(getByRole('link', { name: 'Terraform Provider' }).getAttribute('href')).toBe(
        '#september-2-2026-terraform-provider'
      )
    })

    it('still prefers an explicit anchor prop', () => {
      const { getByTestId } = render(DocChangelogEntry, { props: { ...titled, anchor: 'tf-2-8' } })
      expect(getByTestId('doc-changelog-entry').id).toBe('tf-2-8')
    })

    it('renders the tags under the title at medium size, without the rounded shape', () => {
      const { getAllByTestId, getByRole } = render(DocChangelogEntry, { props: titled })
      const tags = getAllByTestId('tag')
      expect(tags).toHaveLength(2)
      for (const tag of tags) {
        expect(tag.getAttribute('data-size')).toBe('medium')
        expect(tag.hasAttribute('data-rounded')).toBe(false)
      }
      const heading = getByRole('heading', { level: 2 })
      expect(heading.parentElement?.contains(tags[0])).toBe(true)
    })

    it('marks the root titled and keeps the rule node decorative', () => {
      const { getByTestId } = render(DocChangelogEntry, { props: titled })
      expect(getByTestId('doc-changelog-entry').hasAttribute('data-titled')).toBe(true)
      expect(getByTestId('doc-changelog-entry__node').getAttribute('aria-hidden')).toBe('true')
    })

    it('renders no node and no titled marker without a title', () => {
      const { getByTestId, queryByTestId } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026' }
      })
      expect(getByTestId('doc-changelog-entry').hasAttribute('data-titled')).toBe(false)
      expect(queryByTestId('doc-changelog-entry__node')).not.toBeInTheDocument()
    })

    it('gives two titled entries on one date distinct ids', () => {
      const { getAllByTestId } = render(Releases)
      const ids = getAllByTestId('doc-changelog-entry').map((entry) => entry.id)
      expect(ids).toEqual([
        'september-2-2026-terraform-provider',
        'august-26-2026-azion-cli',
        'august-26-2026-azion-console'
      ])
    })
  })

  describe('heading navigation', () => {
    it('does not crash when the label anchor is activated outside a provider', async () => {
      const { getByRole } = render(DocChangelogEntry, {
        props: { label: 'August 19, 2026' }
      })
      const link = getByRole('link', { name: 'August 19, 2026' })
      await fireEvent.click(link)
      // The injected default is a no-op; native hash navigation owns the jump.
      expect(link).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('keeps the chain glyph decorative', () => {
      const { getByRole } = render(DocChangelogEntry, { props: { label: 'August 19, 2026' } })
      const glyph = getByRole('link').querySelector('i')
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
    })

    it('has no violations on the default render', async () => {
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations across a changelog of entries', async () => {
      const { container } = render(Changelog)
      await expectNoA11yViolations(container)
    })

    it('has no violations across titled releases', async () => {
      const { container } = render(Releases)
      await expectNoA11yViolations(container)
    })
  })
})
