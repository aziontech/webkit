import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import LogoWall from './logo-wall.vue'

const TESTID = 'marketing-logo-wall'

const items = [
  { src: '/logos/northwind.svg', alt: 'Northwind' },
  { src: '/logos/contoso.svg', alt: 'Contoso', href: '/customers/contoso' },
  { src: '/logos/fabrikam.svg', alt: 'Fabrikam' }
]

describe('LogoWall', () => {
  it('renders the wall under the default testid', () => {
    const { getByTestId } = render(LogoWall, { props: { items } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(LogoWall, {
      props: { items },
      attrs: { 'data-testid': 'customer-proof' }
    })

    expect(getByTestId('customer-proof')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one list item per mark', () => {
    const { container } = render(LogoWall, { props: { items } })

    expect(container.querySelectorAll('ul > li')).toHaveLength(items.length)
  })

  it('renders every mark as an image carrying its src and alt', () => {
    const { getByAltText, container } = render(LogoWall, { props: { items } })

    expect(container.querySelectorAll('img')).toHaveLength(items.length)

    for (const item of items) {
      expect(getByAltText(item.alt)).toHaveAttribute('src', item.src)
    }
  })

  it('wraps a mark that carries an href in an anchor to that destination', () => {
    const { getByAltText } = render(LogoWall, { props: { items } })
    const anchor = getByAltText('Contoso').closest('a')

    expect(anchor).not.toBeNull()
    expect(anchor).toHaveAttribute('href', '/customers/contoso')
  })

  it('renders no anchor for a mark without an href', () => {
    const { getByAltText, container } = render(LogoWall, { props: { items } })

    expect(getByAltText('Northwind').closest('a')).toBeNull()
    expect(container.querySelectorAll('a')).toHaveLength(1)
  })

  it('names the group with ariaLabel', () => {
    const { getByTestId, getByRole } = render(LogoWall, {
      props: { items, ariaLabel: 'Customers building on Azion' }
    })

    expect(getByTestId(TESTID)).toHaveAttribute('aria-label', 'Customers building on Azion')
    expect(getByRole('region', { name: 'Customers building on Azion' })).toBeInTheDocument()
  })

  it('carries no aria-label when ariaLabel is unset', () => {
    const { getByTestId } = render(LogoWall, { props: { items } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('aria-label')
  })

  it('renders no list when items is empty', () => {
    const { getByTestId, container } = render(LogoWall, { props: { items: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelector('ul')).toBeNull()
  })

  it('renders no list when items is omitted', () => {
    const { container } = render(LogoWall)

    expect(container.querySelector('ul')).toBeNull()
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(LogoWall, {
      props: { items },
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    const root = getByTestId(TESTID)
    expect(root.tagName).toBe('SECTION')
    expect(root.className).toContain('max-w-(--container-4xl)')
  })

  it('renders the mark slot in place of the image built from the item', () => {
    const { container, queryByAltText, getByAltText } = render(LogoWall, {
      props: { items },
      slots: { mark: '<img src="/registry/mark.svg" :alt="params.item.alt + \' mark\'" />' }
    })

    expect(container.querySelectorAll('img')).toHaveLength(items.length)
    expect(queryByAltText('Northwind')).toBeNull()
    expect(getByAltText('Northwind mark')).toHaveAttribute('src', '/registry/mark.svg')
  })

  it('keeps a slotted mark inside the anchor when the item carries an href', () => {
    const { getByAltText } = render(LogoWall, {
      props: { items },
      slots: { mark: '<img src="/registry/mark.svg" :alt="params.item.alt + \' mark\'" />' }
    })

    expect(getByAltText('Contoso mark').closest('a')).toHaveAttribute('href', '/customers/contoso')
  })

  it('carries no data-aside when the aside slot is empty', () => {
    const { getByTestId } = render(LogoWall, { props: { items } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-aside')
  })

  it('marks the band with data-aside and renders the slot beside the wall', () => {
    const { getByTestId, getByText } = render(LogoWall, {
      props: { items },
      slots: { aside: '<blockquote>Azion transformed our operations.</blockquote>' }
    })

    const root = getByTestId(TESTID)
    expect(root).toHaveAttribute('data-aside', 'true')
    expect(getByText('Azion transformed our operations.')).toBeInTheDocument()
    expect(root.querySelector('ul')).not.toBeNull()
  })

  it('renders the aside even when there are no marks to show', () => {
    const { getByTestId, getByText } = render(LogoWall, {
      props: { items: [] },
      slots: { aside: '<blockquote>One customer still speaks.</blockquote>' }
    })

    expect(getByTestId(TESTID).querySelector('ul')).toBeNull()
    expect(getByText('One customer still speaks.')).toBeInTheDocument()
  })

  it('has no a11y violations with a full wall', async () => {
    const { container } = render(LogoWall, {
      props: { items, ariaLabel: 'Customers building on Azion' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the aside filled', async () => {
    const { container } = render(LogoWall, {
      props: { items, ariaLabel: 'Customers building on Azion' },
      slots: {
        aside:
          '<figure><blockquote>Azion transformed our operations.</blockquote><figcaption>Mateus Leonardi, CTO at Contoso</figcaption></figure>'
      }
    })

    await expectNoA11yViolations(container)
  })
})
