import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import QuoteCarousel from './quote-carousel.vue'

const TESTID = 'marketing-quote-carousel'

const ITEMS = [
  {
    text: 'With Azion, we scale proprietary AI models without managing infrastructure.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO',
    mark: 'axur'
  },
  {
    text: 'Filing season triples our traffic in a week, and Azion absorbs it.',
    name: 'Vitor Torres',
    jobTitle: 'CEO',
    mark: 'contabilizei'
  },
  {
    text: 'Magalu guarantees high availability for hundreds of global-scale applications.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology',
    mark: 'magalu'
  }
]

// Marks are dynamic imports, so artwork lands a microtask-and-a-tick after mount.
const markFor = (container: Element, name: string) =>
  waitFor(() => {
    const art = container.querySelector(`svg[data-mark="${name}"]`)
    expect(art).not.toBeNull()
    return art as SVGElement
  })

describe('QuoteCarousel', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(QuoteCarousel, { props: { items: ITEMS } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(QuoteCarousel, {
      props: { items: ITEMS },
      attrs: { 'data-testid': 'proof-band' }
    })

    expect(getByTestId('proof-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one card per item, in the order given', () => {
    const { container } = render(QuoteCarousel, { props: { items: ITEMS } })
    const cards = [...container.querySelectorAll('li')]

    expect(cards).toHaveLength(ITEMS.length)
    expect(cards.map((card) => card.querySelector('blockquote')?.textContent?.trim())).toEqual(
      ITEMS.map((item) => item.text)
    )
  })

  it('pairs every quotation with its own attribution inside one figure', () => {
    const { container } = render(QuoteCarousel, { props: { items: ITEMS } })
    const figure = container.querySelector('li figure')

    expect(figure?.querySelector('blockquote')).not.toBeNull()
    expect(figure?.querySelector('figcaption')?.textContent).toContain('Fabio Ramos')
    expect(figure?.querySelector('figcaption')?.textContent).toContain('CEO')
  })

  it('announces the track as a named carousel region', () => {
    const { getByTestId } = render(QuoteCarousel, {
      props: { items: ITEMS, ariaLabel: 'Customer testimonials' }
    })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('aria-roledescription', 'carousel')
    expect(root).toHaveAttribute('aria-label', 'Customer testimonials')
  })

  it('keeps the track reachable by keyboard', () => {
    const { container } = render(QuoteCarousel, { props: { items: ITEMS } })

    expect(container.querySelector('ul')).toHaveAttribute('tabindex', '0')
  })

  it('resolves a registered mark to its artwork', async () => {
    const { container } = render(QuoteCarousel, { props: { items: ITEMS } })

    await markFor(container, 'axur')
    await markFor(container, 'contabilizei')
  })

  it('writes an unregistered mark as its own wordmark', () => {
    const { getByText } = render(QuoteCarousel, {
      props: { items: [{ ...ITEMS[0], mark: 'Zoop' }] }
    })

    expect(getByText('Zoop')).toBeInTheDocument()
  })

  it('draws no likeness when the source is an institution rather than a person', () => {
    const { container } = render(QuoteCarousel, {
      props: {
        items: [
          {
            text: 'Named a Leader and Fast Mover.',
            jobTitle: 'GigaOm Radar for Full-Stack Edge Deployments v3',
            mark: 'gigaom'
          }
        ]
      }
    })

    expect(container.querySelector('[data-testid="content-avatar"]')).toBeNull()
    expect(container.querySelector('figcaption')?.textContent).toContain('GigaOm Radar')
  })

  it('draws the speaker initials when there is no photo', () => {
    const { getByText } = render(QuoteCarousel, { props: { items: [ITEMS[0]] } })

    expect(getByText('FR')).toBeInTheDocument()
  })

  it('draws the likeness when the item carries a photo', () => {
    const photo = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    const { container } = render(QuoteCarousel, {
      props: { items: [{ ...ITEMS[0], photo }] }
    })

    expect(container.querySelector('li img')).toHaveAttribute('src', photo)
  })

  it('hides the likeness from assistive tech, which the attribution already names', () => {
    const { container } = render(QuoteCarousel, { props: { items: [ITEMS[0]] } })
    const likeness = container.querySelector('li [aria-hidden="true"]')

    expect(likeness?.textContent).toContain('FR')
  })

  it('renders the named track with no cards when there are no testimonials', () => {
    const { getByTestId, container } = render(QuoteCarousel, {
      props: { ariaLabel: 'Customer testimonials' }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })

  it('has no a11y violations', async () => {
    const { container } = render(QuoteCarousel, {
      props: { items: ITEMS, ariaLabel: 'Customer testimonials' }
    })

    await markFor(container, 'axur')
    await expectNoA11yViolations(container)
  })
})
