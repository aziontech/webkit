import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ContentColumns from './content-columns.vue'

const TESTID = 'marketing-content-columns'

const items = [
  { title: 'Routed', description: 'The request lands at the location closest to the user.' },
  { title: 'Executed', description: 'Your code runs there, with no cold region to warm up.' },
  { title: 'Cached', description: 'The response is held at that edge for the next request.' }
]

describe('ContentColumns', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(ContentColumns, { props: { items } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ContentColumns, {
      props: { items },
      attrs: { 'data-testid': 'how-it-works' }
    })

    expect(getByTestId('how-it-works')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one cell per item', () => {
    const { container } = render(ContentColumns, { props: { items } })

    expect(container.querySelectorAll('h3')).toHaveLength(items.length)
  })

  it('renders every column title as an h3 and its description alongside', () => {
    const { container, getByText } = render(ContentColumns, { props: { items } })
    const titles = [...container.querySelectorAll('h3')].map((el) => el.textContent?.trim())

    expect(titles).toEqual(items.map((item) => item.title))

    for (const item of items) {
      expect(getByText(item.description)).toBeInTheDocument()
    }
  })

  it('renders the title as an h2 that names the section', () => {
    const { container, getByTestId } = render(ContentColumns, {
      props: { items, title: 'Three things happen on every request.' }
    })

    const root = getByTestId(TESTID)
    const heading = container.querySelector('h2')

    expect(heading?.tagName).toBe('H2')
    expect(heading).toHaveTextContent('Three things happen on every request.')
    expect(root).toHaveAttribute('aria-label', 'Three things happen on every request.')
  })

  it('leaves the section unnamed when no title is set', () => {
    const { container, getByTestId } = render(ContentColumns, { props: { items } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('aria-label')
    expect(container.querySelector('h2')).toBeNull()
  })

  it('renders the eyebrow only when it is set', () => {
    const { queryByText } = render(ContentColumns, { props: { items } })

    expect(queryByText('How it works')).toBeNull()

    const { getByText } = render(ContentColumns, {
      props: { items, eyebrow: 'How it works' }
    })

    expect(getByText('How it works')).toBeInTheDocument()
  })

  it('renders the description only when it is set', () => {
    const { container } = render(ContentColumns, { props: { items } })

    expect(container.querySelectorAll('p')).toHaveLength(items.length)

    const band = render(ContentColumns, {
      props: { items, title: 'Every request', description: 'One sentence of support.' }
    })

    expect(band.getByText('One sentence of support.')).toBeInTheDocument()
  })

  it('defaults the column count to three', () => {
    const { getByTestId } = render(ContentColumns, { props: { items } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-columns', '3')
  })

  it.each([2, 3] as const)('mirrors the %i column count on the root', (columns) => {
    const { getByTestId } = render(ContentColumns, { props: { items, columns } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-columns', String(columns))
  })

  it('renders no cell when items is empty', () => {
    const { container, getByTestId } = render(ContentColumns, { props: { items: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('h3')).toHaveLength(0)
  })

  it('renders no cell when items is omitted', () => {
    const { container } = render(ContentColumns)

    expect(container.querySelectorAll('h3')).toHaveLength(0)
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(ContentColumns, {
      props: { items },
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('SECTION')
    expect(root.className).toContain('max-w-(--container-4xl)')
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = render(ContentColumns, {
      props: {
        items,
        eyebrow: 'How it works',
        title: 'Three things happen on every request.',
        description: 'One sentence of support.'
      }
    })

    await expectNoA11yViolations(container)
  })
})
