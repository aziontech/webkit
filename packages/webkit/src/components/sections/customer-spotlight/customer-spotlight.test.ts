import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/customer-spotlight/default.vue'
import { CLIENT_BRANDS } from '../../../assets/logos/clients/brands'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import CustomerSpotlight from './customer-spotlight.vue'

describe('CustomerSpotlight', () => {
  it('renders nothing without cards', () => {
    const { queryByTestId } = render(CustomerSpotlight)
    expect(queryByTestId('sections-customer-spotlight')).toBeNull()
  })

  it('is a named list of story links', () => {
    const { getByRole, getAllByRole } = render(Default)
    expect(getByRole('list', { name: 'Customer stories' })).toBeInTheDocument()
    const links = getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAccessibleName(
      'Read story, Agibank: Agibank moved its digital bank to a platform that scales with every campaign.'
    )
    expect(links[0]).toHaveAttribute('href', '/customers/agibank')
  })

  it('keeps the logo image decorative', () => {
    const { container } = render(Default)
    for (const img of container.querySelectorAll('img')) expect(img).toHaveAttribute('alt', '')
  })

  it('opens the card under focus and closes it when focus leaves', async () => {
    const { getAllByRole } = render(Default)
    const items = getAllByRole('listitem')
    await userEvent.tab()
    expect(items[0]).toHaveAttribute('data-state', 'open')
    await userEvent.tab()
    expect(items[1]).toHaveAttribute('data-state', 'open')
    expect(items[0]).toHaveAttribute('data-state', 'closed')
  })

  it('opens the card under the pointer', async () => {
    const { getAllByRole } = render(Default)
    const items = getAllByRole('listitem')
    await fireEvent.mouseEnter(items[2])
    expect(items[2]).toHaveAttribute('data-state', 'open')
  })

  it('translates the built-in labels', () => {
    const { getByRole, getAllByRole } = render({
      render: () =>
        h(WebkitProvider, { locale: 'pt-BR', catalogs: LOCALES }, { default: () => h(Default) })
    })
    expect(getByRole('list', { name: 'Histórias de clientes' })).toBeInTheDocument()
    expect(getAllByRole('link')[0].getAttribute('aria-label')).toMatch(/^Ler a história, Agibank/)
  })

  it('mirrors the arrow glyph under rtl', () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(container.querySelector('.pi-arrow-up-right')?.className).toContain('rtl:-scale-x-100')
  })

  it('paints a card left without brand in the client registry colours for its name', () => {
    const card = { name: 'Agibank', logo: '/agibank.svg', href: '/a', description: 'Story.' }
    const faceOf = (cards: object[]) => {
      const { getByRole, unmount } = render(CustomerSpotlight, { props: { cards } })
      const style = getByRole('link')
        .querySelector('div[aria-hidden="true"]')
        ?.getAttribute('style')
      unmount()
      return style
    }
    const fromRegistry = faceOf([card])
    expect(fromRegistry).toBeTruthy()
    expect(fromRegistry).toBe(faceOf([{ ...card, brand: CLIENT_BRANDS['agibank'] }]))
    expect(faceOf([{ ...card, name: 'Northwind' }])).toBe(
      faceOf([
        {
          ...card,
          name: 'Northwind',
          brand: { base: 'var(--color-base-black)', glow: 'var(--color-base-black)' }
        }
      ])
    )
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
