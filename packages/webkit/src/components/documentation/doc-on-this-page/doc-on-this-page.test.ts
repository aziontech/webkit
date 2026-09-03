import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-on-this-page/DocOnThisPage.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocOnThisPage from './doc-on-this-page.vue'

// Browser mode loads no Tailwind. Rail geometry (path lengths, dash offsets) is also
// deliberately unasserted: pinning live-SVG probe numbers would trap any curve refit
// while proving nothing — both belong to the visual gate. Asserted here: entries,
// list structure, aria-current, landmark-per-group, and event payload order.

const { Default, Nesting } = composeStories(stories)

const ITEMS = [
  { id: 'deploy', text: 'Deploy an application', depth: 2 },
  { id: 'what-you-get', text: 'What you get', depth: 3 },
  { id: 'bind-a-domain', text: 'Bind a domain', depth: 2 }
]

const GROUPS = [
  {
    label: 'Repository',
    links: [{ label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }]
  },
  { label: 'Community', links: [{ label: 'Discord', href: 'https://discord.gg' }] }
]

describe('DocOnThisPage', () => {
  describe('rendering & testid', () => {
    it('renders every heading with the derived testid', () => {
      const { getByTestId, getByText } = render(DocOnThisPage, { props: { items: ITEMS } })
      expect(getByTestId('documentation-doc-on-this-page')).toBeInTheDocument()
      for (const item of ITEMS) expect(getByText(item.text)).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win, and sub-testids derive from it', () => {
      const { getByTestId, queryByTestId } = render(DocOnThisPage, {
        attrs: { 'data-testid': 'guide-rail' },
        props: { items: ITEMS, activeId: 'deploy', groups: GROUPS }
      })
      expect(getByTestId('guide-rail')).toBeInTheDocument()
      expect(getByTestId('guide-rail__marker')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-on-this-page')).not.toBeInTheDocument()
    })

    it('renders its own title, and takes an override', () => {
      const dflt = render(DocOnThisPage, { props: { items: ITEMS } })
      expect(dflt.getByText('On this page')).toBeInTheDocument()

      const custom = render(DocOnThisPage, { props: { items: ITEMS, title: 'Contents' } })
      expect(custom.getByText('Contents')).toBeInTheDocument()
    })

    it('renders nothing to navigate when there are no headings', () => {
      const { container } = render(DocOnThisPage)
      expect(container.querySelectorAll('li')).toHaveLength(0)
    })
  })

  describe('the active heading', () => {
    it('marks only the active entry with aria-current=location', () => {
      const { getByText } = render(DocOnThisPage, {
        props: { items: ITEMS, activeId: 'what-you-get' }
      })
      const active = getByText('What you get').closest('a')
      const other = getByText('Deploy an application').closest('a')
      // The marker is a visual affordance; the state must not depend on seeing it.
      expect(active?.getAttribute('aria-current')).toBe('location')
      expect(other?.hasAttribute('aria-current')).toBe(false)
    })

    it('moves aria-current when the active heading changes', async () => {
      const view = render(DocOnThisPage, { props: { items: ITEMS, activeId: 'deploy' } })
      expect(
        view.getByText('Deploy an application').closest('a')?.getAttribute('aria-current')
      ).toBe('location')

      await view.rerender({ items: ITEMS, activeId: 'bind-a-domain' })

      expect(
        view.getByText('Deploy an application').closest('a')?.hasAttribute('aria-current')
      ).toBe(false)
      expect(view.getByText('Bind a domain').closest('a')?.getAttribute('aria-current')).toBe(
        'location'
      )
    })
  })

  describe('structure and landmarks', () => {
    it('puts the entries in a real list, as the axe list rule requires', () => {
      const { getByTestId } = render(DocOnThisPage, { props: { items: ITEMS } })
      const list = getByTestId('documentation-doc-on-this-page').querySelector('ul')
      expect(list).not.toBeNull()
      expect(list?.querySelectorAll(':scope > li')).toHaveLength(ITEMS.length)
    })

    it('gives the outline and each complementary group its own named landmark', () => {
      const { getByTestId } = render(DocOnThisPage, {
        props: { items: ITEMS, groups: GROUPS, title: 'On this page' }
      })
      const navs = [...getByTestId('documentation-doc-on-this-page').querySelectorAll('nav')]
      // Three landmarks, not one long list: a reader must never read "Discord" as a
      // section of the page they are on.
      expect(navs).toHaveLength(3)
      expect(navs.map((n) => n.getAttribute('aria-label'))).toEqual([
        'On this page',
        'Repository',
        'Community'
      ])
    })

    it('renders each group link as a real anchor', () => {
      const { getByText } = render(DocOnThisPage, { props: { items: ITEMS, groups: GROUPS } })
      const link = getByText('View source').closest('a')
      expect(link?.getAttribute('href')).toBe('https://github.com/aziontech')
    })
  })

  describe('the select event', () => {
    it('emits (event, item) for the entry that was activated', async () => {
      const { getByText, emitted } = render(DocOnThisPage, {
        props: { items: ITEMS, activeId: 'deploy' }
      })

      await fireEvent.click(getByText('What you get'))

      const calls = emitted().select as unknown[][]
      expect(calls).toHaveLength(1)
      // event-payloads.md: the DOM event is always first, the subject second.
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toEqual(ITEMS[1])
    })

    it('does not emit for a complementary group link', async () => {
      const { getByText, emitted } = render(DocOnThisPage, {
        props: { items: ITEMS, groups: GROUPS }
      })
      await fireEvent.click(getByText('View source'))
      // The groups are peers of the outline, not entries in it.
      expect(emitted().select).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default rail', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations with a nested outline and two groups', async () => {
      const { container } = render(Nesting())
      await expectNoA11yViolations(container)
    })
  })
})
