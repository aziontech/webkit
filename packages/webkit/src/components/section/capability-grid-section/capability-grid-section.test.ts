import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/capability-grid-section/default.vue'
import Links from '../../../../examples/capability-grid-section/links.vue'
import Points from '../../../../examples/capability-grid-section/points.vue'
import TitleStart from '../../../../examples/capability-grid-section/title-start.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CapabilityGridSection from './capability-grid-section.vue'

const items = [
  { title: 'Functions', description: 'Run code.' },
  { title: 'Storage', description: 'Keep files.' }
]

describe('CapabilityGridSection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('warns in development when only some items carry an icon', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(CapabilityGridSection, {
      props: { items: [{ ...items[0], icon: 'ai ai-bolt' }, items[1], items[1]] }
    })
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]?.[0]).toContain('2 of 3 items have no icon')
  })

  it.each([
    ['every item', items.map((item) => ({ ...item, icon: 'ai ai-bolt' }))],
    ['no item', items]
  ])('does not warn when %s carries an icon', (_label, list) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(CapabilityGridSection, { props: { items: list } })
    expect(warn).not.toHaveBeenCalled()
  })

  it('links the primary and secondary actions, secondary then outlined', () => {
    const { getByRole } = render(CapabilityGridSection, {
      props: {
        items,
        title: 'T',
        primaryAction: { label: 'Start now', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs' }
      }
    })
    expect(getByRole('link', { name: 'Start now' })).toHaveAttribute('href', '/signup')
    expect(getByRole('link', { name: 'Start now' })).toHaveAttribute('data-variant', 'secondary')
    expect(getByRole('link', { name: 'Docs' })).toHaveAttribute('data-variant', 'outline')
  })

  it('draws no button from the removed actions array', () => {
    const { queryByRole } = render(CapabilityGridSection, {
      props: { items, title: 'T', actions: [{ label: 'Docs', href: '/docs' }] } as never
    })
    expect(queryByRole('link', { name: 'Docs' })).toBeNull()
  })

  it('renders nothing without items', () => {
    const { queryByTestId } = render(CapabilityGridSection, { props: { title: 'T' } })
    expect(queryByTestId('capability-grid-section')).toBeNull()
  })

  it('names the band by its title and nests capability headings under it', () => {
    const { getByRole, getAllByRole } = render(Default)
    expect(
      getByRole('region', { name: 'Everything an application needs, in one place' })
    ).toBeInTheDocument()
    expect(getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('centers the title by default and sets it at the start edge with titleAlign start', () => {
    const { getByTestId, unmount } = render(Default)
    expect(getByTestId('section-title')).toHaveAttribute('data-align', 'center')
    unmount()

    const left = render(TitleStart)
    expect(left.getByTestId('section-title')).toHaveAttribute('data-align', 'start')
    expect(left.getByRole('heading', { level: 2 }).textContent?.trim()).toBe(
      'Why you should be a partner'
    )
    expect(left.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('raises capability headings to h2 in a bare grid', () => {
    const { getAllByRole } = render(CapabilityGridSection, { props: { items } })
    expect(getAllByRole('heading', { level: 2 }).map((el) => el.textContent?.trim())).toEqual([
      'Functions',
      'Storage'
    ])
  })

  it('renders points as a list and the action as a link', () => {
    const { getAllByRole, unmount } = render(Points)
    expect(getAllByRole('list').length).toBeGreaterThanOrEqual(4)
    unmount()
    const withAction = render(Default)
    expect(withAction.getByRole('link', { name: /Explore the platform/ })).toHaveAttribute(
      'href',
      '/platform'
    )
  })

  it('links each item with an href by its heading and leaves the rest plain', () => {
    const { getByRole, queryByRole } = render(CapabilityGridSection, {
      props: {
        items: [
          { title: 'Functions', description: 'Run code.', href: '/functions' },
          { title: 'Storage', description: 'Keep files.' }
        ]
      }
    })
    expect(getByRole('link', { name: /Functions/ })).toHaveAttribute('href', '/functions')
    expect(queryByRole('link', { name: /Storage/ })).toBeNull()
  })

  it('draws a cell without an icon when the item has none', () => {
    const { container } = render(CapabilityGridSection, { props: { items } })
    expect(container.querySelector('i, [class*="ai ai-"]')).toBeNull()
  })

  it('renders the links example as six linked use cases with no axe violations', async () => {
    const { getAllByRole, container } = render(Links)
    expect(getAllByRole('link')).toHaveLength(6)
    await expectNoA11yViolations(container)
  })

  it('sets the anchor and lets a consumer testid win', () => {
    const { getByTestId } = render(CapabilityGridSection, {
      props: { items, anchor: 'caps' },
      attrs: { 'data-testid': 'caps-band' }
    })
    expect(getByTestId('caps-band')).toHaveAttribute('id', 'caps')
  })

  it('renders under rtl with logical list padding', () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Points)]) })
    expect(container.querySelector('ul.list-disc')?.className).toContain('ps-')
  })

  it('has no axe violations', async () => {
    const { container } = render(Points)
    await expectNoA11yViolations(container)
  })
})
