import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-pagination/DocPagination.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocPagination from './doc-pagination.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// edge-anchoring and the chevron's hover travel emit nothing here — a computed-style or
// position assertion would read the same value whether the layout is right or absent.
// Those belong to the visual gate. What is real without CSS: which sides render, the
// anchor semantics, the landmark, and the event payload order.

const { Default, Ends } = composeStories(stories)

const PREV = { title: 'Deploy an application', href: '/docs/deploy' }
const NEXT = { title: 'Bind a domain', href: '/docs/domains' }

describe('DocPagination', () => {
  describe('rendering & testid', () => {
    it('renders both neighbours with the derived testids', () => {
      const { getByTestId } = render(DocPagination, { props: { previous: PREV, next: NEXT } })
      expect(getByTestId('documentation-doc-pagination')).toBeInTheDocument()
      expect(getByTestId('documentation-doc-pagination__previous')).toBeInTheDocument()
      expect(getByTestId('documentation-doc-pagination__next')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win, and the sub-testids derive from it', () => {
      const { getByTestId, queryByTestId } = render(DocPagination, {
        attrs: { 'data-testid': 'guide-footer' },
        props: { previous: PREV, next: NEXT }
      })
      expect(getByTestId('guide-footer')).toBeInTheDocument()
      expect(getByTestId('guide-footer__previous')).toBeInTheDocument()
      expect(getByTestId('guide-footer__next')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-pagination')).not.toBeInTheDocument()
    })

    it('shows the destination titles and the eyebrows', () => {
      const { getByText } = render(DocPagination, { props: { previous: PREV, next: NEXT } })
      expect(getByText('Deploy an application')).toBeInTheDocument()
      expect(getByText('Bind a domain')).toBeInTheDocument()
      expect(getByText('Previous')).toBeInTheDocument()
      expect(getByText('Next')).toBeInTheDocument()
    })

    it('takes custom eyebrows', () => {
      const { getByText } = render(DocPagination, {
        props: { previous: PREV, next: NEXT, previousLabel: 'Back', nextLabel: 'Onward' }
      })
      expect(getByText('Back')).toBeInTheDocument()
      expect(getByText('Onward')).toBeInTheDocument()
    })
  })

  describe('the ends of a series', () => {
    it('renders only the next side on the first page', () => {
      const { queryByTestId } = render(DocPagination, { props: { next: NEXT } })
      expect(queryByTestId('documentation-doc-pagination__next')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-pagination__previous')).not.toBeInTheDocument()
    })

    it('renders only the previous side on the last page', () => {
      const { queryByTestId } = render(DocPagination, { props: { previous: PREV } })
      expect(queryByTestId('documentation-doc-pagination__previous')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-pagination__next')).not.toBeInTheDocument()
    })

    it('renders the landmark even with no neighbours at all', () => {
      const { getByTestId, queryByTestId } = render(DocPagination)
      expect(getByTestId('documentation-doc-pagination')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-pagination__previous')).not.toBeInTheDocument()
      expect(queryByTestId('documentation-doc-pagination__next')).not.toBeInTheDocument()
    })
  })

  describe('link semantics', () => {
    it('each side is a real anchor carrying its destination', () => {
      const { getByTestId } = render(DocPagination, { props: { previous: PREV, next: NEXT } })
      const prev = getByTestId('documentation-doc-pagination__previous')
      const next = getByTestId('documentation-doc-pagination__next')
      expect(prev.tagName).toBe('A')
      expect(next.tagName).toBe('A')
      expect(prev.getAttribute('href')).toBe('/docs/deploy')
      expect(next.getAttribute('href')).toBe('/docs/domains')
    })

    it('is a labelled nav landmark, and the chevrons are decorative', () => {
      const { getByTestId } = render(DocPagination, { props: { previous: PREV, next: NEXT } })
      const root = getByTestId('documentation-doc-pagination')
      expect(root.tagName).toBe('NAV')
      expect(root.getAttribute('aria-label')).toBe('Page navigation')
      for (const glyph of root.querySelectorAll('i')) {
        expect(glyph.getAttribute('aria-hidden')).toBe('true')
      }
    })

    it('lets a consumer rename the landmark', () => {
      // Two nav landmarks may not share an accessible name (axe landmark-unique), so
      // a page carrying two paginations has to be able to tell them apart.
      const { getByTestId } = render(DocPagination, {
        attrs: { 'aria-label': 'Last page navigation' },
        props: { previous: PREV }
      })
      expect(getByTestId('documentation-doc-pagination').getAttribute('aria-label')).toBe(
        'Last page navigation'
      )
    })
  })

  describe('the navigate event', () => {
    it('emits (event, page) with the side that was activated', async () => {
      const { getByTestId, emitted } = render(DocPagination, {
        props: { previous: PREV, next: NEXT }
      })

      await fireEvent.click(getByTestId('documentation-doc-pagination__next'))
      let calls = emitted().navigate as unknown[][]
      expect(calls).toHaveLength(1)
      // event-payloads.md: the DOM event is always first, the subject second.
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toEqual(NEXT)

      await fireEvent.click(getByTestId('documentation-doc-pagination__previous'))
      calls = emitted().navigate as unknown[][]
      expect(calls).toHaveLength(2)
      expect(calls[1][1]).toEqual(PREV)
    })

    it('does not emit when a side is absent', async () => {
      const { getByTestId, emitted } = render(DocPagination, { props: { next: NEXT } })
      await fireEvent.click(getByTestId('documentation-doc-pagination'))
      expect(emitted().navigate).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('has no violations with both neighbours', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations at the ends of a series', async () => {
      const { container } = render(Ends())
      await expectNoA11yViolations(container)
    })
  })
})
