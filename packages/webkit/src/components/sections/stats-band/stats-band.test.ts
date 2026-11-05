import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import StatsBand from './stats-band.vue'

const TESTID = 'sections-stats-band'

const items = [
  { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
  { prefix: '+', value: '3k', label: 'ASNs directly connected to Azion' },
  { value: '99.99', suffix: '%', label: 'Availability, contractual' }
]

const band = (props: Record<string, unknown> = {}) =>
  render(StatsBand, { props: { items, ...props } })

describe('StatsBand', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(StatsBand, {
      props: { items },
      attrs: { 'data-testid': 'network-stats' }
    })

    expect(getByTestId('network-stats')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one figure per item, in order, with its value and caption', () => {
    const { container } = band()

    const figures = Array.from(container.querySelectorAll('figure'))
    expect(figures).toHaveLength(items.length)
    figures.forEach((figure, index) => {
      const item = items[index]
      expect(figure.textContent).toContain(item.value)
      expect(figure.querySelector('figcaption')?.textContent?.trim()).toBe(item.label)
    })
  })

  it('renders the prefix and suffix beside the figure when set', () => {
    const { container } = band()

    const figures = Array.from(container.querySelectorAll('figure'))
    expect(figures[0].textContent).toContain('ms')
    expect(figures[1].textContent).toContain('+')
    expect(figures[2].textContent).toContain('%')
  })

  it('renders only the root when items is empty', () => {
    const { container, getByTestId, queryByTestId, queryByText } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId('layout-frame-box')).toBeNull()
    expect(container.querySelectorAll('figure')).toHaveLength(0)
    expect(queryByText(items[0].label)).toBeNull()
  })

  it('renders only the root when items is omitted', () => {
    const { container, getByTestId } = render(StatsBand)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('figure')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = band({ items: [] })

    await expectNoA11yViolations(container)
  })
})
