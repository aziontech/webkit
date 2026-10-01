import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import LogoWall from './logo-wall.vue'

const TESTID = 'marketing-logo-wall'

const items = [
  { src: '/logos/northwind.svg', alt: 'Northwind' },
  { src: '/logos/contoso.svg', alt: 'Contoso', href: '/customers/contoso' },
  { src: '/logos/fabrikam.svg', alt: 'Fabrikam', shape: 'compact' as const }
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
    const { getByRole, getAllByRole } = render(LogoWall, { props: { items } })

    expect(getByRole('list')).toBeInTheDocument()
    expect(getAllByRole('listitem')).toHaveLength(items.length)
  })

  it('sets a compact mark apart from the wide default through data-shape', () => {
    const { getByAltText } = render(LogoWall, { props: { items } })

    expect(getByAltText('Fabrikam')).toHaveAttribute('data-shape', 'compact')
    expect(getByAltText('Northwind')).toHaveAttribute('data-shape', 'wide')
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

  it('names a linked cell with the link label and the company', () => {
    const { getByRole } = render(LogoWall, { props: { items } })

    expect(getByRole('link', { name: 'Read story, Contoso' })).toHaveAttribute(
      'href',
      '/customers/contoso'
    )
  })

  it('uses a consumer linkLabel for the revealed words and the link name', () => {
    const { getByRole, getByText } = render(LogoWall, {
      props: { items, linkLabel: 'Ver caso' }
    })

    expect(getByRole('link', { name: 'Ver caso, Contoso' })).toBeInTheDocument()
    expect(getByText('Ver caso').closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('emits item-click with the event first and the matched item second', async () => {
    const { getByRole, emitted } = render(LogoWall, { props: { items } })
    const link = getByRole('link', { name: 'Read story, Contoso' })
    link.addEventListener('click', (event) => event.preventDefault())

    await fireEvent.click(link)

    const calls = emitted('item-click') as [MouseEvent, (typeof items)[number]][]
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toBeInstanceOf(MouseEvent)
    expect(calls[0][1]).toEqual(items[1])
  })

  it('renders no anchor for a mark without an href', () => {
    const { getByAltText, getAllByText, container } = render(LogoWall, { props: { items } })

    expect(getByAltText('Northwind').closest('a')).toBeNull()
    expect(container.querySelectorAll('a')).toHaveLength(1)
    expect(getAllByText('Read story')).toHaveLength(1)
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
    expect(container.querySelector('[role="list"]')).toBeNull()
  })

  it('renders no list when items is omitted', () => {
    const { container } = render(LogoWall)

    expect(container.querySelector('[role="list"]')).toBeNull()
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

  it('marks the wall square by default through data-kind', () => {
    const { getByTestId } = render(LogoWall, { props: { items } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'square')
  })

  it('marks a rectangle wall through data-kind', () => {
    const { getByTestId } = render(LogoWall, { props: { items, kind: 'rectangle' } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'rectangle')
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
    expect(root.querySelector('[role="list"]')).not.toBeNull()
  })

  it('frames the aside with a mark in every corner and a seam beside the wall', () => {
    const { getByText } = render(LogoWall, {
      props: { items },
      slots: { aside: '<blockquote>Azion transformed our operations.</blockquote>' }
    })

    const panel = getByText('Azion transformed our operations.').closest('[data-marks]')
    expect(panel).toHaveAttribute('data-marks', 'top-left top-right bottom-left bottom-right')
    expect(panel).toHaveAttribute('data-seam', 'true')
  })

  it('draws no seam on an aside that stands alone', () => {
    const { getByText } = render(LogoWall, {
      props: { items: [] },
      slots: { aside: '<blockquote>One customer still speaks.</blockquote>' }
    })

    const panel = getByText('One customer still speaks.').closest('[data-marks]')
    expect(panel).toHaveAttribute('data-marks', 'top-left top-right bottom-left bottom-right')
    expect(panel).not.toHaveAttribute('data-seam')
  })

  it('renders the aside even when there are no marks to show', () => {
    const { getByTestId, getByText } = render(LogoWall, {
      props: { items: [] },
      slots: { aside: '<blockquote>One customer still speaks.</blockquote>' }
    })

    expect(getByTestId(TESTID).querySelector('[role="list"]')).toBeNull()
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
