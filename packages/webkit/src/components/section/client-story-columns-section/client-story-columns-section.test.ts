import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import RevealHover from '../../../../examples/client-story-columns-section/reveal-hover.vue'
import { CLIENT_BRANDS } from '../../../assets/logos/clients/brands'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import ClientStoryColumnsSection from './client-story-columns-section.vue'

const TESTID = 'client-story-columns-section'
const ARIA_LABEL = 'Featured success stories'
const LINK_LABEL = 'Read story'

const cells = [
  {
    name: 'Magalu',
    logo: '/logos/magalu.svg',
    href: '/success-case/magalu',
    story: 'How Magalu enhances cybersecurity with Azion.',
    brand: { base: '#0e89ff', glow: '#0e89ff' }
  },
  {
    name: 'Dafiti',
    logo: '/logos/dafiti.svg',
    href: '/success-case/dafiti',
    story: 'Dafiti modernized its digital architecture.',
    brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' as const },
    logoTreatment: 'knockout' as const
  },
  {
    name: 'MadeiraMadeira',
    logo: '/logos/madeiramadeira.svg',
    href: '/success-case/madeiramadeira',
    story: 'Faster delivery let MadeiraMadeira scale through major campaigns.',
    brand: { base: '#ff9014', glow: '#ff9014' }
  }
]

const columns = (props: Record<string, unknown> = {}) =>
  render(ClientStoryColumnsSection, {
    props: { ariaLabel: ARIA_LABEL, linkLabel: LINK_LABEL, cells, ...props }
  })

describe('ClientStoryColumnsSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = columns()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = render(ClientStoryColumnsSection, {
      props: { cells, anchor: 'clients' }
    })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'clients')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClientStoryColumnsSection, {
      props: { cells },
      attrs: { 'data-testid': 'client-columns' }
    })

    expect(getByTestId('client-columns')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the list of stories by ariaLabel with one column per cell', () => {
    const { getByRole } = columns()

    const list = getByRole('list', { name: ARIA_LABEL })
    const columnItems = Array.from(list.children)

    expect(columnItems).toHaveLength(cells.length)
    columnItems.forEach((item) => expect(item.getAttribute('role')).toBe('listitem'))
  })

  it('lays the columns side by side from the medium breakpoint', () => {
    const { getByRole } = columns()

    expect(getByRole('list', { name: ARIA_LABEL }).classList.contains('md:grid-cols-3')).toBe(true)
  })

  it('renders one mark per cell by its client name, with its treatment', () => {
    const { getByAltText } = columns()

    expect(getByAltText('Magalu').getAttribute('data-treatment')).toBe('color')
    expect(getByAltText('Dafiti').getAttribute('data-treatment')).toBe('knockout')
    expect(getByAltText('MadeiraMadeira').getAttribute('data-treatment')).toBe('color')
  })

  it('renders the story text of every cell', () => {
    const { getByText } = columns()

    cells.forEach((cell) => expect(getByText(cell.story)).toBeInTheDocument())
  })

  it('hides the story anchor from assistive technology and the tab order', () => {
    const { getByText } = columns()

    const anchor = getByText(cells[0].story).closest('a')

    expect(anchor).not.toBeNull()
    expect(anchor?.getAttribute('aria-hidden')).toBe('true')
    expect(anchor?.getAttribute('tabindex')).toBe('-1')
    expect(anchor?.getAttribute('href')).toBe(cells[0].href)
  })

  it('names the one focusable link per column by the client and its story', () => {
    const { getAllByRole } = columns()

    const links = getAllByRole('link')
    expect(links).toHaveLength(cells.length)
    expect(links[0]).toHaveAccessibleName(`${LINK_LABEL}, Magalu: ${cells[0].story}`)
  })

  it('paints the mark face with the brand base colour', () => {
    const { getByAltText } = columns()

    const wall = getByAltText('Magalu').closest('section') as HTMLElement

    expect(wall.style.getPropertyValue('--client-story-columns-section-wall-face')).toContain(
      cells[0].brand.base
    )
  })

  it('reads the face from the client registry by name when brand is left out', () => {
    const { getByAltText } = render(ClientStoryColumnsSection, {
      props: { cells: cells.map(({ brand: _brand, ...cell }) => cell) }
    })

    const face = (name: string) => (getByAltText(name).closest('section') as HTMLElement).style
    expect(face('Magalu').getPropertyValue('--client-story-columns-section-wall-face')).toContain(
      CLIENT_BRANDS['magalu']?.base
    )
    expect(getByAltText('Dafiti').closest('section')).toHaveAttribute('data-theme', 'light')
  })

  it('paints a black face for a client the registry does not know and no brand', () => {
    const { getByAltText } = render(ClientStoryColumnsSection, {
      props: {
        cells: [{ name: 'Northwind', logo: '/logos/northwind.svg', href: '/n', story: 'Story.' }]
      }
    })

    const wall = getByAltText('Northwind').closest('section') as HTMLElement
    expect(wall.style.getPropertyValue('--client-story-columns-section-wall-face')).toContain(
      'var(--bg-canvas)'
    )
    expect(wall).toHaveAttribute('data-theme', 'dark')
  })

  it('renders only the section when cells is empty', () => {
    const { getByTestId, queryByRole } = render(ClientStoryColumnsSection, {
      props: { ariaLabel: ARIA_LABEL, cells: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('list')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = columns()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(ClientStoryColumnsSection, { props: { cells: [] } })

    await expectNoA11yViolations(container)
  })

  describe('reveal="hover"', () => {
    it('keeps the always layout by default', () => {
      const { container } = render(ClientStoryColumnsSection, { props: { cells } })
      expect(container.querySelector('[data-state]')).toBeNull()
    })

    it('is a named list of one story link per card', () => {
      const { getByRole, getAllByRole } = render(RevealHover)
      expect(getByRole('list', { name: 'Customer stories' })).toBeInTheDocument()
      const links = getAllByRole('link')
      expect(links).toHaveLength(3)
      expect(links[0]).toHaveAccessibleName(
        'Read story, Agibank: Agibank moved its digital bank to a platform that scales with every campaign.'
      )
      expect(links[0]).toHaveAttribute('href', '/customers/agibank')
    })

    it('reads ariaLabel and linkLabel, and keeps the logo decorative', () => {
      const { getByRole, container } = render(ClientStoryColumnsSection, {
        props: { cells: [cells[0]], reveal: 'hover', ariaLabel: ARIA_LABEL, linkLabel: 'Read it' }
      })
      expect(getByRole('list', { name: ARIA_LABEL })).toBeInTheDocument()
      expect(getByRole('link').getAttribute('aria-label')).toMatch(/^Read it, Magalu/)
      for (const img of container.querySelectorAll('img')) expect(img).toHaveAttribute('alt', '')
    })

    it('shows a hidden link cue on every card at rest, so a closed card says it holds a story', () => {
      const { container } = render(RevealHover)
      const cues = container.querySelectorAll('[data-slot="rest-cue"]')
      expect(cues).toHaveLength(3)
      cues.forEach((cue) => {
        expect(cue).toHaveAttribute('aria-hidden', 'true')
        expect(cue.textContent?.trim()).toBe('Read story')
        expect(cue.className).toContain('lg:group-data-[state=open]/spot:opacity-0')
      })
    })

    it('opens the card under focus and closes it when focus leaves', async () => {
      const { getAllByRole } = render(RevealHover)
      const items = getAllByRole('listitem')
      await userEvent.tab()
      expect(items[0]).toHaveAttribute('data-state', 'open')
      await userEvent.tab()
      expect(items[1]).toHaveAttribute('data-state', 'open')
      expect(items[0]).toHaveAttribute('data-state', 'closed')
    })

    it('opens the card under the pointer', async () => {
      const { getAllByRole } = render(RevealHover)
      const items = getAllByRole('listitem')
      await fireEvent.mouseEnter(within(items[2]).getByRole('link'))
      expect(items[2]).toHaveAttribute('data-state', 'open')
    })

    it('translates the built-in labels', () => {
      const { getByRole, getAllByRole } = render({
        render: () =>
          h(
            ConfigProvider,
            { locale: 'pt-BR', catalogs: LOCALES },
            { default: () => h(RevealHover) }
          )
      })
      expect(getByRole('list', { name: 'Histórias de clientes' })).toBeInTheDocument()
      expect(getAllByRole('link')[0].getAttribute('aria-label')).toMatch(/^Ler a história, Agibank/)
    })

    it('has no axe violations', async () => {
      const { container } = render(RevealHover)
      await expectNoA11yViolations(container)
    })
  })
})
