import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/card-carousel/default.vue'
import Plain from '../../../../examples/card-carousel/plain.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CardCarousel from './card-carousel.vue'

const TESTID = 'sections-card-carousel'

const items = [
  {
    eyebrow: 'E-commerce',
    title: 'E-commerce product image optimization',
    description: 'Serve product images at the right size and format for each device.',
    href: '/docs/ecommerce',
    linkLabel: 'See example'
  },
  {
    title: 'News and media site responsive images',
    description: 'Deliver article images that load instantly on any device.'
  },
  {
    title: 'User-generated content optimization',
    description: 'Resize uploaded images on the fly from your storage.',
    linkLabel: 'See example'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(CardCarousel, { props: { title: 'See how to use', items, ...props } })

describe('CardCarousel', () => {
  it('renders under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = band({ 'data-testid': 'use-cases' })

    expect(getByTestId('use-cases')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders nothing without items', () => {
    const { container } = band({ items: [] })

    expect(container.querySelector(`[data-testid="${TESTID}"]`)).toBeNull()
    expect(container.querySelector('h2')).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'use-cases' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'use-cases')
  })

  it('puts the title, its eyebrow and description on the row the controls end', () => {
    const { getByRole, getByText, getByTestId } = band({
      eyebrow: 'Use cases',
      description: 'Where teams start.'
    })

    const heading = getByRole('heading', { level: 2, name: 'See how to use' })
    expect(getByText('Use cases')).toBeInTheDocument()
    expect(getByText('Where teams start.')).toBeInTheDocument()
    const row = heading.closest('[data-header]') as globalThis.HTMLElement
    expect(row.contains(getByTestId('marketing-carousel-previous'))).toBe(true)
    expect(row.contains(getByTestId('marketing-carousel-next'))).toBe(true)
  })

  it('renders no title without one, and keeps the controls', () => {
    const { container, getByTestId } = band({ title: '', ariaLabel: 'Use cases' })

    expect(container.querySelector('h2')).toBeNull()
    expect(container.querySelector('[data-header]')).toBeNull()
    expect(getByTestId('marketing-carousel-next')).toBeInTheDocument()
  })

  it('lays the cards out as standalone medium cards', () => {
    const { getByTestId, getAllByTestId } = band()

    expect(getByTestId('marketing-carousel')).toHaveAttribute('data-kind', 'cards')
    const cards = getAllByTestId('marketing-carousel-item')
    expect(cards).toHaveLength(3)
    for (const card of cards) expect(card).toHaveAttribute('data-size', 'medium')
  })

  it('renders one h3 per card, in order', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
  })

  it('shows the card eyebrow only where one is set', () => {
    const { getAllByTestId } = band()

    const cards = getAllByTestId('marketing-carousel-item')
    expect(cards[0].querySelector('[data-testid="content-overline"]')).toHaveTextContent(
      'E-commerce'
    )
    expect(cards[1].querySelector('[data-testid="content-overline"]')).toBeNull()
  })

  it('makes the heading of a card with href its link, named by the title', () => {
    const { getByRole, getAllByRole } = band()

    const link = getByRole('link', { name: 'E-commerce product image optimization' })
    expect(link).toHaveAttribute('href', '/docs/ecommerce')
    expect(link.closest('h3')).not.toBeNull()
    expect(getAllByRole('link')).toHaveLength(1)
  })

  it('draws the link label only on a linked card, hidden from assistive technology', () => {
    const { getAllByTestId } = band()

    const cards = getAllByTestId('marketing-carousel-item')
    const label = Array.from(cards[0].querySelectorAll('[aria-hidden="true"]')).find((node) =>
      node.textContent?.includes('See example')
    )
    expect(label).toBeDefined()
    expect(cards[2].textContent).not.toContain('See example')
  })

  it('names the row after the title, or after ariaLabel when set', () => {
    const { getByTestId, unmount } = band()
    expect(getByTestId('marketing-carousel')).toHaveAttribute('aria-label', 'See how to use')
    unmount()

    const { getByTestId: get } = band({ ariaLabel: 'Image Processor use cases' })
    expect(get('marketing-carousel')).toHaveAttribute('aria-label', 'Image Processor use cases')
  })

  it('renders the examples', () => {
    const linked = render(Default)
    expect(linked.getAllByRole('link')).toHaveLength(6)
    linked.unmount()

    const plain = render(Plain)
    expect(plain.queryAllByRole('link')).toHaveLength(0)
    expect(plain.getAllByRole('heading', { level: 3 })).toHaveLength(5)
  })

  it('renders under rtl with the controls and every card', () => {
    const { getAllByTestId, getByTestId } = render({
      render: () => h('div', { dir: 'rtl' }, [h(Default)])
    })

    expect(getAllByTestId('marketing-carousel-item')).toHaveLength(6)
    expect(getByTestId('marketing-carousel-previous')).toBeInTheDocument()
  })

  it('has no axe violations, linked or plain', async () => {
    const linked = render(Default)
    await expectNoA11yViolations(linked.container)
    linked.unmount()

    const plain = render(Plain)
    await expectNoA11yViolations(plain.container)
  })

  it('has no axe violations under rtl', async () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })

    await expectNoA11yViolations(container)
  })
})
