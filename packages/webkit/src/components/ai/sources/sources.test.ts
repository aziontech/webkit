import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { UNSAFE_URLS } from '../../../test/unsafe-urls'
import SourcesMark from './parts/sources-mark.vue'
import Sources from './sources.vue'
import { sourceHue } from './types'

const items = [
  {
    title: 'Real-Time Purge',
    href: 'https://www.azion.com/en/documentation/',
    description: 'Removes cached objects from every data center.',
    site: 'Azion',
    publisher: 'Acme Inc.',
    publishedAt: '2026-03-02'
  },
  { title: 'Cache settings', href: '/cache' }
]

const panel = () => document.body.querySelector<HTMLElement>('[data-testid="sources__menu__panel"]')
const menuItems = () =>
  Array.from(panel()?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

describe('Sources', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Sources, { props: { items } }).getByTestId('sources')).toBeTruthy()
    expect(
      render(Sources, { props: { items }, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('renders nothing without items', () => {
    expect(render(Sources).queryByTestId('sources')).toBeNull()
  })

  it('titles the pill with the count and starts closed', () => {
    const { getByRole } = render(Sources, { props: { items } })
    const trigger = getByRole('button', { name: /2 sources/ })
    expect(trigger).toHaveTextContent('Sources')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(panel()).toBeNull()
  })

  it('names the pill by its title when one is given', () => {
    const { getByRole } = render(Sources, { props: { items, title: 'References' } })
    expect(getByRole('button', { name: 'References' })).toBeTruthy()
  })

  it('draws up to three marks of the cited sources', () => {
    const { getAllByTestId } = render(Sources, {
      props: {
        items: [
          { title: 'Searched only', href: 'https://www.npmjs.com/', cited: false },
          ...items,
          { title: 'CLI', href: 'https://github.com/aziontech/azion', icon: 'az az-github' },
          { title: 'Fourth', href: 'https://www.w3.org/' }
        ]
      }
    })
    const marks = getAllByTestId('sources__mark')
    expect(marks).toHaveLength(3)
    expect(marks[0]).toHaveTextContent('A')
    expect(marks[1]).toHaveTextContent('C')
    expect(marks[2]?.querySelector('i')).toHaveClass('az-github')
    expect(marks[0]?.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('opens a DropdownMenu in place, never a drawer, and closes on Escape', async () => {
    const { getByRole, emitted } = render(Sources, { props: { items } })
    const trigger = getByRole('button')
    await userEvent.click(trigger)
    expect(emitted('update:open')?.[0]).toEqual([true])
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(panel()!.querySelector('[role="menu"]')).not.toBeNull()
    expect(panel()).toHaveAttribute('data-side')
    expect(document.body.querySelector('[data-testid*="drawer"]')).toBeNull()
    expect(document.body.querySelector('[aria-modal="true"]')).toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it('moves between the sources with the arrow keys', async () => {
    const { getByRole } = render(Sources, { props: { items } })
    getByRole('button').focus()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(menuItems()).toHaveLength(2))
    await waitFor(() => expect(document.activeElement).toBe(menuItems()[0]))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(menuItems()[1])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(menuItems()[0])
  })

  it('lists each source as a menu link with its mark, title and site, publisher and date', async () => {
    const { getByRole } = render(Sources, { props: { items } })
    await userEvent.click(getByRole('button'))
    await waitFor(() => expect(menuItems()).toHaveLength(2))
    const [first, second] = menuItems() as [HTMLElement, HTMLElement]
    expect(first.tagName).toBe('A')
    expect(first).toHaveAttribute('data-testid', 'sources__item')
    expect(
      first.querySelector('[data-testid="sources__item__leading"] [data-size="medium"]')
    ).not.toBeNull()
    expect(first).toHaveAccessibleName('Real-Time Purge (opens in a new tab)')
    expect(first).toHaveAccessibleDescription('Azion · Acme Inc. · Mar 2, 2026')
    expect(first).not.toHaveTextContent('Removes cached objects')
    expect(first).toHaveAttribute('target', '_blank')
    expect(first).toHaveAttribute('rel', 'noopener noreferrer')
    expect(first.querySelector('.az-external-link')).toHaveAttribute('aria-hidden', 'true')
    expect(second).not.toHaveAttribute('target')
    expect(second.querySelector('.az-external-link')).toBeNull()
    expect(second.querySelector('[data-testid="sources__item__description"]')).toBeNull()
    expect(second).toHaveAccessibleName('Cache settings')
  })

  it('takes the hover fill from the menu row and never underlines the title', async () => {
    render(Sources, { props: { items, defaultOpen: true } })
    await waitFor(() => expect(menuItems()).toHaveLength(2))
    const row = menuItems()[0]!
    expect(row.className).toContain('hover:bg-(--bg-hover)')
    expect(row.className).toContain('bg-clip-padding')
    expect(panel()!.innerHTML).not.toContain('hover:underline')
    expect(panel()!.innerHTML).not.toContain('has-[a:hover]')
  })

  it('groups cited sources under Citations and the rest under More', async () => {
    render(Sources, {
      props: {
        items: [...items, { title: 'Searched', href: 'https://www.w3.org/', cited: false }],
        defaultOpen: true
      }
    })
    await waitFor(() => expect(panel()).not.toBeNull())
    const groups = panel()!.querySelectorAll('[data-testid="sources__group"]')
    expect(groups).toHaveLength(2)
    expect(groups[0]).toHaveAccessibleName('Citations')
    expect(groups[0]!.querySelectorAll('[role="menuitem"]')).toHaveLength(2)
    expect(groups[1]).toHaveAccessibleName('More')
    expect(groups[1]).toHaveTextContent('Searched')
  })

  it('shows no group headings when every source is cited', async () => {
    render(Sources, { props: { items, defaultOpen: true } })
    await waitFor(() => expect(panel()).not.toBeNull())
    const group = panel()!.querySelector('[data-testid="sources__group"]')
    expect(group).not.toHaveAttribute('aria-labelledby')
    expect(panel()!.querySelector('[data-testid="sources__group__label"]')).toBeNull()
  })

  it.each(UNSAFE_URLS)('renders the title as plain text for the unsafe href %j', async (href) => {
    render(Sources, { props: { items: [{ title: 'Poisoned', href }], defaultOpen: true } })
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(panel()!.querySelector('a')).toBeNull()
    expect(panel()).toHaveTextContent('Poisoned')
  })

  it('follows a bound v-model:open and does not open itself while controlled', async () => {
    const { getByTestId, emitted, rerender } = render(Sources, {
      props: { items, open: false, 'onUpdate:open': () => undefined }
    })
    const trigger = getByTestId('sources__trigger')
    await userEvent.click(trigger)
    expect(emitted('update:open')?.[0]).toEqual([true])
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await rerender({ items, open: true, 'onUpdate:open': () => undefined })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('has no axe violations, closed and open', async () => {
    const { container } = render(Sources, { props: { items } })
    await expectNoA11yViolations(container)
    render(Sources, { props: { items, defaultOpen: true } })
    await waitFor(() => expect(panel()).not.toBeNull())
    await expectNoA11yViolations(panel()!)
  })

  describe('mark', () => {
    it('draws the favicon and falls back to the letter when it fails to load', async () => {
      const { getByTestId } = render(SourcesMark, {
        props: { item: { title: 'Broken', href: 'https://example.com/', image: '/missing.ico' } }
      })
      const mark = getByTestId('sources-mark')
      expect(mark).toHaveAttribute('data-type', 'image')
      expect(mark.querySelector('img')).toHaveAttribute('alt', '')
      await waitFor(() => expect(mark).toHaveAttribute('data-type', 'letter'))
      expect(mark).toHaveTextContent('E')
      expect(mark).toHaveAttribute('data-hue')
    })

    it('falls back to the letter when the favicon failed before hydration', async () => {
      const item = { title: 'Broken', href: 'https://example.com/', image: '/missing-ssr.ico' }
      const first = render(SourcesMark, { props: { item } })
      const markup = first.container.innerHTML
      first.unmount()
      const host = document.createElement('div')
      host.innerHTML = markup
      document.body.append(host)
      const img = host.querySelector('img')!
      await waitFor(() => expect(img.complete).toBe(true))
      const app = createSSRApp(SourcesMark, { item })
      app.mount(host)
      await waitFor(() =>
        expect(host.querySelector('[data-testid="sources-mark"]')).toHaveAttribute(
          'data-type',
          'letter'
        )
      )
      app.unmount()
      host.remove()
    })

    it('drops an unsafe favicon URL', () => {
      const { getByTestId } = render(SourcesMark, {
        props: { item: { title: 'Poisoned', image: 'javascript:alert(1)' } }
      })
      expect(getByTestId('sources-mark')).toHaveAttribute('data-type', 'letter')
    })

    it('gives sites their own colour, the same on every render', () => {
      const azion = { title: 'A', href: 'https://www.azion.com/' }
      const w3 = { title: 'W', href: 'https://www.w3.org/' }
      const npm = { title: 'N', href: 'https://www.npmjs.com/' }
      expect(sourceHue(azion)).toBe(sourceHue({ title: 'Other page', href: 'https://azion.com/x' }))
      expect(new Set([sourceHue(azion), sourceHue(w3), sourceHue(npm)]).size).toBe(3)
    })
  })
})
