import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClientMosaicColumns from './client-mosaic-columns.vue'

const TESTID = 'sections-client-mosaic-columns'
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
  render(ClientMosaicColumns, {
    props: { ariaLabel: ARIA_LABEL, linkLabel: LINK_LABEL, cells, ...props }
  })

describe('ClientMosaicColumns', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = columns()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClientMosaicColumns, {
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

  it('renders one mark per cell by its client name, with its treatment', () => {
    const { getByAltText } = columns()

    expect(getByAltText('Magalu').getAttribute('data-treatment')).toBe('as-is')
    expect(getByAltText('Dafiti').getAttribute('data-treatment')).toBe('knockout')
    expect(getByAltText('MadeiraMadeira').getAttribute('data-treatment')).toBe('as-is')
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

  it('paints the mark face with the brand base colour', () => {
    const { getByAltText } = columns()

    const wall = getByAltText('Magalu').closest('section') as HTMLElement

    expect(wall.style.getPropertyValue('--wall-face')).toContain(cells[0].brand.base)
  })

  it('renders only the section when cells is empty', () => {
    const { getByTestId, queryByRole } = render(ClientMosaicColumns, {
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
    const { container } = render(ClientMosaicColumns, { props: { cells: [] } })

    await expectNoA11yViolations(container)
  })
})
