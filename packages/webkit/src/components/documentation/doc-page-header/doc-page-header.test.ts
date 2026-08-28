import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-page-header/DocPageHeader.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocPageHeader from './doc-page-header.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// closing rule and the column layout emit nothing here — the visual gate owns those. What
// is real without CSS: which regions render, the heading level, the date formatting (pure
// JS), the time element's machine-readable value, and the two event payloads.
//
// The real Clipboard API rejects in headless Chromium ("Document is not focused"), so
// writeText is stubbed to resolve. That substitutes an external side effect, not layout or
// focus — what is under test is WHICH string the component hands over, and that the event
// still fires when the clipboard is unavailable.

const { Default, Regions } = composeStories(stories)

const CRUMBS = [{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]
const SOURCE = '# Deploy an application\n\nTemplates are ready-made projects.'

const stubClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
  return writeText
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('DocPageHeader', () => {
  describe('rendering & testid', () => {
    it('renders the title as the page h1 with the derived testid', () => {
      const { getByTestId } = render(DocPageHeader, { props: { title: 'Deploy an application' } })
      const root = getByTestId('documentation-doc-page-header')
      expect(root).toBeInTheDocument()
      expect(root.tagName).toBe('HEADER')
      const heading = root.querySelector('h1')
      expect(heading?.textContent?.trim()).toBe('Deploy an application')
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocPageHeader, {
        attrs: { 'data-testid': 'deploy-masthead' },
        props: { title: 'T' }
      })
      expect(getByTestId('deploy-masthead')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-page-header')).not.toBeInTheDocument()
    })

    it('renders the deck and the breadcrumb trail', () => {
      const { getByText } = render(DocPageHeader, {
        props: { title: 'T', description: 'The deck.', breadcrumb: CRUMBS }
      })
      expect(getByText('The deck.')).toBeInTheDocument()
      expect(getByText('Docs')).toBeInTheDocument()
    })
  })

  describe('optional regions close up rather than render empty', () => {
    it('omits the breadcrumb when the trail is empty', () => {
      const { queryByText } = render(DocPageHeader, { props: { title: 'T' } })
      expect(queryByText('Docs')).not.toBeInTheDocument()
    })

    it('omits the deck when there is none', () => {
      const { getByTestId } = render(DocPageHeader, { props: { title: 'T' } })
      expect(getByTestId('documentation-doc-page-header').querySelector('p')).toBeNull()
    })

    it('omits the last-updated line when there is no date', () => {
      const { getByTestId } = render(DocPageHeader, { props: { title: 'T' } })
      expect(getByTestId('documentation-doc-page-header').querySelector('time')).toBeNull()
    })

    it('shows the Copy Page control by default', () => {
      const { getByText } = render(DocPageHeader, { props: { title: 'T' } })
      expect(getByText('Copy Page')).toBeInTheDocument()
    })

    it('removes the Copy Page control entirely when copyable is false', () => {
      // Scoped to this render's own container: two renders share one document, so a
      // document-wide query would find the other one's control.
      const { container } = render(DocPageHeader, { props: { title: 'T', copyable: false } })
      // Removed, not disabled: a page with nothing to copy should not advertise it.
      expect(container.textContent).not.toContain('Copy Page')
    })
  })

  describe('last updated is the authors claim, formatted in UTC', () => {
    it('formats an ISO date for reading and keeps the machine value', () => {
      const { getByTestId } = render(DocPageHeader, {
        props: { title: 'T', lastUpdated: '2026-06-30' }
      })
      const time = getByTestId('documentation-doc-page-header').querySelector('time')
      // Parsed as UTC on purpose: read as local time a bare date slips to the 29th
      // for every reader west of Greenwich.
      expect(time?.textContent?.trim()).toBe('Jun 30, 2026')
      expect(time?.getAttribute('datetime')).toBe('2026-06-30')
    })

    it('prints a non-date string verbatim', () => {
      const { getByTestId } = render(DocPageHeader, {
        props: { title: 'T', lastUpdated: 'Updated this morning' }
      })
      const time = getByTestId('documentation-doc-page-header').querySelector('time')
      expect(time?.textContent?.trim()).toBe('Updated this morning')
    })
  })

  describe('the copy event', () => {
    it('hands the source to the clipboard and emits (event, source)', async () => {
      const writeText = stubClipboard()
      const { getByText, emitted } = render(DocPageHeader, {
        props: { title: 'T', source: SOURCE }
      })

      await fireEvent.click(getByText('Copy Page'))
      await waitFor(() => expect(emitted().copy).toBeTruthy())

      expect(writeText).toHaveBeenCalledWith(SOURCE)
      const calls = emitted().copy as unknown[][]
      // event-payloads.md: the DOM event is always first, the subject second.
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toBe(SOURCE)
    })

    it('still emits when the clipboard is unavailable', async () => {
      vi.stubGlobal('navigator', {
        ...navigator,
        clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }
      })
      const { getByText, emitted } = render(DocPageHeader, {
        props: { title: 'T', source: SOURCE }
      })

      await fireEvent.click(getByText('Copy Page'))
      // The rejection is swallowed on purpose: an embedded context with no clipboard
      // must not break the page, and the consumer still learns the action ran.
      await waitFor(() => expect(emitted().copy).toBeTruthy())
      expect((emitted().copy as unknown[][])[0][1]).toBe(SOURCE)
    })
  })

  describe('the trail and the action are slots over the built-ins', () => {
    it('replaces the built-in breadcrumb with a passed trail', () => {
      const { getByText, queryByText } = render(DocPageHeader, {
        props: { title: 'T', breadcrumb: CRUMBS },
        slots: { breadcrumb: '<nav aria-label="Trail"><a href="/home">Home</a></nav>' }
      })
      expect(getByText('Home')).toBeInTheDocument()
      // The prop-fed fallback is the slot's content, so passing one replaces it.
      expect(queryByText('Docs')).not.toBeInTheDocument()
    })

    it('replaces the built-in Copy Page control with passed actions', () => {
      const { getByText, queryByText } = render(DocPageHeader, {
        props: { title: 'T', source: SOURCE },
        slots: { actions: '<button type="button">Ask an agent</button>' }
      })
      expect(getByText('Ask an agent')).toBeInTheDocument()
      expect(queryByText('Copy Page')).not.toBeInTheDocument()
    })

    it('keeps the passed action on the title row', () => {
      const { getByText, getByTestId } = render(DocPageHeader, {
        props: { title: 'Deploy an application' },
        slots: { actions: '<button type="button">Ask an agent</button>' }
      })
      const row = getByTestId('documentation-doc-page-header').querySelector('h1')?.parentElement
      expect(row?.contains(getByText('Ask an agent'))).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('has no violations across every region this component owns', async () => {
      // copyable: false, so the masthead is entirely DocPageHeader's own markup —
      // breadcrumb, h1, deck and the dated line. See the skip below for why the
      // Copy Page control cannot be included yet.
      const { container } = render(DocPageHeader, {
        props: {
          title: 'Deploy an application',
          description: 'Go from a template to a live edge application.',
          breadcrumb: CRUMBS,
          lastUpdated: '2026-06-30',
          copyable: false
        }
      })
      await expectNoA11yViolations(container)
    })

    // Blocked by a pre-existing defect in SplitButton, not in this component:
    // Dropdown.Trigger renders a span[role=button][tabindex=0] and SplitButton nests a
    // real IconButton inside it, which axe flags as nested-interactive (serious).
    // Reproducible from main; needs fixing in Dropdown.Trigger / SplitButton.
    it.skip('has no violations with the Copy Page control (SplitButton nested-interactive)', async () => {
      stubClipboard()
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it.skip('has no violations across the region variants (same SplitButton defect)', async () => {
      stubClipboard()
      const { container } = render(Regions())
      await expectNoA11yViolations(container)
    })
  })
})
