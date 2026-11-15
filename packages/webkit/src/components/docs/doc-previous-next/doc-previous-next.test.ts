import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/doc-previous-next/default.vue'
import Ends from '../../../../examples/doc-previous-next/ends.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocPreviousNext from './doc-previous-next.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// edge-anchoring and the chevron's hover travel emit nothing here — a computed-style or
// position assertion would read the same value whether the layout is right or absent.
// Those belong to the visual gate. What is real without CSS: which sides render, the
// anchor semantics, the landmark, and the event payload order.

const PREV = { label: 'Deploy an application', href: '/docs/deploy' }
const NEXT = { label: 'Bind a domain', href: '/docs/domains' }

describe('DocPreviousNext', () => {
  describe('rendering & testid', () => {
    it('renders both neighbours with the derived testids', () => {
      const { getByTestId } = render(DocPreviousNext, { props: { previous: PREV, next: NEXT } })
      expect(getByTestId('doc-previous-next')).toBeInTheDocument()
      expect(getByTestId('doc-previous-next__previous')).toBeInTheDocument()
      expect(getByTestId('doc-previous-next__next')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win, and the sub-testids derive from it', () => {
      const { getByTestId, queryByTestId } = render(DocPreviousNext, {
        attrs: { 'data-testid': 'guide-footer' },
        props: { previous: PREV, next: NEXT }
      })
      expect(getByTestId('guide-footer')).toBeInTheDocument()
      expect(getByTestId('guide-footer__previous')).toBeInTheDocument()
      expect(getByTestId('guide-footer__next')).toBeInTheDocument()
      expect(queryByTestId('doc-previous-next')).not.toBeInTheDocument()
    })

    it('shows the destination titles and the eyebrows', () => {
      const { getByText } = render(DocPreviousNext, { props: { previous: PREV, next: NEXT } })
      expect(getByText('Deploy an application')).toBeInTheDocument()
      expect(getByText('Bind a domain')).toBeInTheDocument()
      expect(getByText('Previous')).toBeInTheDocument()
      expect(getByText('Next')).toBeInTheDocument()
    })

    it('takes custom eyebrows', () => {
      const { getByText } = render(DocPreviousNext, {
        props: { previous: PREV, next: NEXT, previousLabel: 'Back', nextLabel: 'Onward' }
      })
      expect(getByText('Back')).toBeInTheDocument()
      expect(getByText('Onward')).toBeInTheDocument()
    })
  })

  describe('the ends of a series', () => {
    it('renders only the next side on the first page', () => {
      const { queryByTestId } = render(DocPreviousNext, { props: { next: NEXT } })
      expect(queryByTestId('doc-previous-next__next')).toBeInTheDocument()
      expect(queryByTestId('doc-previous-next__previous')).not.toBeInTheDocument()
    })

    it('renders only the previous side on the last page', () => {
      const { queryByTestId } = render(DocPreviousNext, { props: { previous: PREV } })
      expect(queryByTestId('doc-previous-next__previous')).toBeInTheDocument()
      expect(queryByTestId('doc-previous-next__next')).not.toBeInTheDocument()
    })

    it('renders the landmark even with no neighbours at all', () => {
      const { getByTestId, queryByTestId } = render(DocPreviousNext)
      expect(getByTestId('doc-previous-next')).toBeInTheDocument()
      expect(queryByTestId('doc-previous-next__previous')).not.toBeInTheDocument()
      expect(queryByTestId('doc-previous-next__next')).not.toBeInTheDocument()
    })
  })

  describe('link semantics', () => {
    it('each side is a real anchor carrying its destination', () => {
      const { getByTestId } = render(DocPreviousNext, { props: { previous: PREV, next: NEXT } })
      const prev = getByTestId('doc-previous-next__previous')
      const next = getByTestId('doc-previous-next__next')
      expect(prev.tagName).toBe('A')
      expect(next.tagName).toBe('A')
      expect(prev.getAttribute('href')).toBe('/docs/deploy')
      expect(next.getAttribute('href')).toBe('/docs/domains')
    })

    it('is a labelled nav landmark, and the chevrons are decorative', () => {
      const { getByTestId } = render(DocPreviousNext, { props: { previous: PREV, next: NEXT } })
      const root = getByTestId('doc-previous-next')
      expect(root.tagName).toBe('NAV')
      expect(root.getAttribute('aria-label')).toBe('Page navigation')
      for (const glyph of root.querySelectorAll('i')) {
        expect(glyph.getAttribute('aria-hidden')).toBe('true')
      }
    })

    it('lets a consumer rename the landmark', () => {
      // Two nav landmarks may not share an accessible name (axe landmark-unique), so
      // a page carrying two paginations has to be able to tell them apart.
      const { getByTestId } = render(DocPreviousNext, {
        attrs: { 'aria-label': 'Last page navigation' },
        props: { previous: PREV }
      })
      expect(getByTestId('doc-previous-next').getAttribute('aria-label')).toBe(
        'Last page navigation'
      )
    })
  })

  describe('the navigate event', () => {
    it('emits (event, page) with the side that was activated', async () => {
      const { getByTestId, emitted } = render(DocPreviousNext, {
        props: { previous: PREV, next: NEXT }
      })

      await fireEvent.click(getByTestId('doc-previous-next__next'))
      let calls = emitted().navigate as unknown[][]
      expect(calls).toHaveLength(1)
      // event-payloads.md: the DOM event is always first, the subject second.
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toEqual(NEXT)

      await fireEvent.click(getByTestId('doc-previous-next__previous'))
      calls = emitted().navigate as unknown[][]
      expect(calls).toHaveLength(2)
      expect(calls[1][1]).toEqual(PREV)
    })

    it('does not emit when a side is absent', async () => {
      const { getByTestId, emitted } = render(DocPreviousNext, { props: { next: NEXT } })
      await fireEvent.click(getByTestId('doc-previous-next'))
      expect(emitted().navigate).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('has no violations with both neighbours', async () => {
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations at the ends of a series', async () => {
      const { container } = render(Ends)
      await expectNoA11yViolations(container)
    })
  })
})
