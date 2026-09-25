import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import BigNumbers from './big-numbers.vue'

const TESTID = 'marketing-big-numbers'

const items = [
  { value: '120', suffix: '+', label: 'Points of presence' },
  { value: '99.99', suffix: '%', label: 'Availability' },
  { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' }
]

describe('BigNumbers', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(BigNumbers, { props: { items } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(BigNumbers, {
      props: { items },
      attrs: { 'data-testid': 'proof-band' }
    })

    expect(getByTestId('proof-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one cell per item', () => {
    const { container } = render(BigNumbers, { props: { items } })

    expect(container.querySelectorAll('figure')).toHaveLength(items.length)
  })

  it('renders the value and the caption of every item', () => {
    const { getByText } = render(BigNumbers, { props: { items } })

    for (const item of items) {
      expect(getByText(item.value)).toBeInTheDocument()
      expect(getByText(item.label)).toBeInTheDocument()
    }
  })

  it('captions each figure with its own figcaption', () => {
    const { container } = render(BigNumbers, { props: { items } })
    const captions = [...container.querySelectorAll('figure figcaption')].map((el) =>
      el.textContent?.trim()
    )

    expect(captions).toEqual(items.map((item) => item.label))
  })

  it('renders the prefix before and the suffix after the figure', () => {
    const { container } = render(BigNumbers, { props: { items } })
    const latency = container.querySelectorAll('figure')[2]

    expect([...latency.querySelectorAll('span')].map((el) => el.textContent)).toEqual([
      '<',
      '15',
      'ms'
    ])
  })

  it('omits the prefix and the suffix when the item carries neither', () => {
    const { container } = render(BigNumbers, {
      props: { items: [{ value: '42', label: 'Regions' }] }
    })

    expect([...container.querySelectorAll('figure span')].map((el) => el.textContent)).toEqual([
      '42'
    ])
    expect(container.querySelector('figcaption')).toHaveTextContent('Regions')
  })

  it('defaults the size to medium', () => {
    const { getByTestId } = render(BigNumbers, { props: { items } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', 'medium')
  })

  it.each(['small', 'medium', 'large'] as const)('mirrors the %s size on the root', (size) => {
    const { getByTestId } = render(BigNumbers, { props: { items, size } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
  })

  it('renders no cell when items is empty', () => {
    const { getByTestId, container } = render(BigNumbers, { props: { items: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('figure')).toHaveLength(0)
  })

  it('renders no cell when items is omitted', () => {
    const { container } = render(BigNumbers)

    expect(container.querySelectorAll('figure')).toHaveLength(0)
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(BigNumbers, {
      props: { items },
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    const root = getByTestId(TESTID)
    expect(root.tagName).toBe('SECTION')
    expect(root.className).toContain('max-w-(--container-4xl)')
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = render(BigNumbers, { props: { items } })

    await expectNoA11yViolations(container)
  })
})
