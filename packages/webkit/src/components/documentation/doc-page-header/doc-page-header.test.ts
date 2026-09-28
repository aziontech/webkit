import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-page-header/DocPageHeader.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocPageHeader from './doc-page-header.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// closing rule, the column layout and the meta line's left compensation emit nothing here —
// the visual gate owns those. What is real without CSS: which regions render, the heading
// level, the date formatting (pure JS), the time element's machine-readable value, which
// element each meta entry becomes (anchor vs button), and the event payload.

const { Default, Actions, Regions, Slots } = composeStories(stories)

const CRUMBS = [{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]

const META_ACTIONS = [
  { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy the page.' },
  { value: 'agent', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup' },
  { value: 'source', label: 'Edit this page', href: 'https://example.test/edit', target: '_blank' }
]

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

    it('renders no meta line without a date or an entry', () => {
      const { getByTestId } = render(DocPageHeader, { props: { title: 'T' } })
      const root = getByTestId('documentation-doc-page-header')
      expect(root.querySelector('time')).toBeNull()
      expect(root.querySelector('[data-testid="actions-button"]')).toBeNull()
    })

    it('marks the meta line undated when the entries stand alone', () => {
      const { getByTestId } = render(DocPageHeader, {
        props: { title: 'T', metaActions: META_ACTIONS }
      })
      const line = getByTestId('documentation-doc-page-header').querySelector('[data-undated]')
      // The attribute is what the left compensation hangs off; the offset itself is CSS,
      // which this environment does not load.
      expect(line).not.toBeNull()
      expect(line?.querySelector('time')).toBeNull()
    })

    it('drops the undated flag once there is a date', () => {
      const { getByTestId } = render(DocPageHeader, {
        props: { title: 'T', lastUpdated: '2026-06-30', metaActions: META_ACTIONS }
      })
      const root = getByTestId('documentation-doc-page-header')
      expect(root.querySelector('[data-undated]')).toBeNull()
      expect(root.querySelector('time')).not.toBeNull()
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

  describe('the meta line', () => {
    it('renders one control per entry, in reading order', () => {
      const { getByTestId } = render(DocPageHeader, {
        props: { title: 'T', lastUpdated: '2026-06-30', metaActions: META_ACTIONS }
      })
      const labels = [
        ...getByTestId('documentation-doc-page-header').querySelectorAll(
          '[data-testid="actions-button"]'
        )
      ].map((control) => control.textContent?.trim())
      expect(labels).toEqual(['Copy as Markdown', 'Agent setup', 'Edit this page'])
    })

    it('makes an entry with an href a real anchor and one without a button', () => {
      const { getByText } = render(DocPageHeader, {
        props: { title: 'T', metaActions: META_ACTIONS }
      })
      // A link the reader can middle-click, copy and open in a tab — not a button that
      // navigates, which none of those gestures reach.
      const link = getByText('Agent setup').closest('a')
      expect(link?.getAttribute('href')).toBe('/docs/agent-setup')
      expect(getByText('Copy as Markdown').closest('a')).toBeNull()
      expect(getByText('Copy as Markdown').closest('button')).not.toBeNull()
    })

    it('opens an external entry in a new tab with a safe rel', () => {
      const { getByText } = render(DocPageHeader, {
        props: { title: 'T', metaActions: META_ACTIONS }
      })
      const link = getByText('Edit this page').closest('a')
      expect(link?.getAttribute('target')).toBe('_blank')
      expect(link?.getAttribute('rel')).toContain('noopener')
    })

    it('emits (event, item) when an entry is activated', async () => {
      const { getByText, emitted } = render(DocPageHeader, {
        props: { title: 'T', metaActions: META_ACTIONS }
      })

      await fireEvent.click(getByText('Copy as Markdown'))

      const calls = emitted()['meta-action'] as unknown[][]
      expect(calls).toHaveLength(1)
      // event-payloads.md: the DOM event is always first, the subject second.
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toMatchObject({ value: 'copy', label: 'Copy as Markdown' })
    })

    it('emits for a link too, so an app can route in-page', async () => {
      const { getByText, emitted } = render(DocPageHeader, {
        props: { title: 'T', metaActions: META_ACTIONS }
      })

      await fireEvent.click(getByText('Agent setup'))

      const calls = emitted()['meta-action'] as unknown[][]
      expect(calls[0][1]).toMatchObject({ value: 'agent', href: '/docs/agent-setup' })
    })

    it('hides the separators from the accessibility tree', () => {
      const { getByTestId } = render(DocPageHeader, {
        props: { title: 'T', lastUpdated: '2026-06-30', metaActions: META_ACTIONS }
      })
      const separators = getByTestId('documentation-doc-page-header').querySelectorAll(
        '[data-testid="layout-divider"]'
      )
      expect(separators.length).toBeGreaterThan(0)
      // Three announced separators on the way to three controls is noise, not structure.
      separators.forEach((rule) => expect(rule.closest('[aria-hidden="true"]')).not.toBeNull())
    })
  })

  describe('every region is a slot over its built-in', () => {
    it('replaces the built-in breadcrumb with a passed trail', () => {
      const { getByText, queryByText } = render(DocPageHeader, {
        props: { title: 'T', breadcrumb: CRUMBS },
        slots: { breadcrumb: '<nav aria-label="Trail"><a href="/home">Home</a></nav>' }
      })
      expect(getByText('Home')).toBeInTheDocument()
      // The prop-fed fallback is the slot's content, so passing one replaces it.
      expect(queryByText('Docs')).not.toBeInTheDocument()
    })

    it('replaces the built-in h1 with a passed title', () => {
      const { getByText, queryByText } = render(DocPageHeader, {
        props: { title: 'Deploy an application' },
        slots: { title: '<h1>Claude Code + Azion</h1>' }
      })
      expect(getByText('Claude Code + Azion')).toBeInTheDocument()
      expect(queryByText('Deploy an application')).not.toBeInTheDocument()
    })

    it('ships nothing on the title line and keeps a passed control on it', () => {
      const { getByText, getByTestId } = render(DocPageHeader, {
        props: { title: 'Deploy an application' },
        slots: { actions: '<button type="button">Ask an agent</button>' }
      })
      const row = getByTestId('documentation-doc-page-header').querySelector('h1')?.parentElement
      expect(row?.contains(getByText('Ask an agent'))).toBe(true)
    })

    it('puts details between the deck and the meta line', () => {
      const { getByTestId, getByText } = render(DocPageHeader, {
        props: { title: 'T', description: 'The deck.', lastUpdated: '2026-06-30' },
        slots: { details: '<div data-testid="facts">Terminal</div>' }
      })
      const rows = [...getByTestId('documentation-doc-page-header').children]
      const deck = rows.findIndex((row) => row.textContent?.trim() === 'The deck.')
      const facts = rows.indexOf(getByText('Terminal'))
      const meta = rows.findIndex((row) => row.querySelector('time'))
      expect(deck).toBeLessThan(facts)
      expect(facts).toBeLessThan(meta)
    })
  })

  describe('accessibility', () => {
    it('has no violations across every region this component owns', async () => {
      const { container } = render(DocPageHeader, {
        props: {
          title: 'Deploy an application',
          description: 'Go from a template to a live edge application.',
          breadcrumb: CRUMBS,
          lastUpdated: '2026-06-30',
          metaActions: META_ACTIONS
        }
      })
      await expectNoA11yViolations(container)
    })

    // The masthead's own control used to be a SplitButton, whose Dropdown.Trigger nests a
    // real IconButton inside a span[role=button] — axe's nested-interactive, which forced
    // these three to be skipped. The meta line is plain buttons and anchors, so they run.
    it('has no violations on the default story', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across the belt', async () => {
      const { container } = render(Actions())
      await expectNoA11yViolations(container)
    })

    // The Regions story is deliberately a GALLERY — four mastheads stacked so the optional
    // regions can be compared — and four `header`s in one container is four `banner`
    // landmarks, which axe rightly flags. That is the story's shape, not the component's:
    // a page has one masthead, and each variant it shows is covered by the prop-driven
    // renders above. Asserting here would be asserting the gallery.
    it('renders every region variant', () => {
      const { container } = render(Regions())
      expect(container.querySelectorAll('header')).toHaveLength(4)
    })

    it('has no violations with the title and details slots filled', async () => {
      const { container } = render(Slots())
      await expectNoA11yViolations(container)
    })
  })
})
