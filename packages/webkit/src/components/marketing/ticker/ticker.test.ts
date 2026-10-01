import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Ticker from './ticker.vue'

const TESTID = 'marketing-ticker'

const MARKS = ['itau', 'magalu', 'netshoes', 'caixa']

// Marks are dynamic imports, so artwork lands a microtask-and-a-tick after mount.
const markFor = (container: Element, name: string) =>
  waitFor(() => {
    const art = container.querySelector(`svg[data-mark="${name}"]`)
    expect(art).not.toBeNull()
    return art as SVGElement
  })

describe('Ticker', () => {
  it('renders the strip under the default testid', () => {
    const { getByTestId } = render(Ticker, { props: { marks: MARKS } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it.each(['plain', 'band'] as const)('carries the %s fill on data-kind', (kind) => {
    const { getByTestId } = render(Ticker, { props: { kind, marks: MARKS } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', kind)
  })

  it('paints no surface of its own by default', () => {
    const { getByTestId } = render(Ticker, { props: { marks: MARKS } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'plain')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Ticker, {
      props: { marks: MARKS },
      attrs: { 'data-testid': 'trust-strip' }
    })

    expect(getByTestId('trust-strip')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the row twice so the loop can travel a whole copy', () => {
    const { container } = render(Ticker, { props: { marks: MARKS } })

    expect(container.querySelectorAll('ul')).toHaveLength(2)
    expect(container.querySelectorAll('li')).toHaveLength(MARKS.length * 2)
  })

  it('hides the duplicate row from assistive tech so each mark is announced once', () => {
    const { container } = render(Ticker, { props: { marks: MARKS } })
    const [first, second] = [...container.querySelectorAll('ul')]

    expect(first).not.toHaveAttribute('aria-hidden')
    expect(second).toHaveAttribute('aria-hidden', 'true')
    expect(second).toHaveAttribute('data-duplicate')
  })

  it('names only the announced row with ariaLabel', () => {
    const { container } = render(Ticker, {
      props: { marks: MARKS, ariaLabel: 'Companies running on Azion' }
    })
    const [first, second] = [...container.querySelectorAll('ul')]

    expect(first).toHaveAttribute('aria-label', 'Companies running on Azion')
    expect(second).not.toHaveAttribute('aria-label')
  })

  it('resolves a registered name to its artwork', async () => {
    const { container } = render(Ticker, { props: { marks: MARKS } })

    for (const name of MARKS) {
      await markFor(container, name)
    }
  })

  it('holds the loop until every mark has resolved, so the row starts complete', async () => {
    const { container } = render(Ticker, { props: { marks: MARKS } })
    const track = container.querySelector('.animate-brand-marquee')

    expect(track).toHaveAttribute('data-loading')

    await waitFor(() => expect(track).not.toHaveAttribute('data-loading'))
    for (const name of MARKS) {
      expect(container.querySelector(`svg[data-mark="${name}"]`)).not.toBeNull()
    }
  })

  it('falls back to the name itself when nothing is registered under it', async () => {
    const { container, getAllByText } = render(Ticker, {
      props: { marks: ['magalu', 'Contabilizei'] }
    })
    await markFor(container, 'magalu')

    expect(container.querySelector('svg[data-mark="Contabilizei"]')).toBeNull()
    expect(getAllByText('Contabilizei').length).toBeGreaterThan(0)
  })

  it('renders the label as an overline and omits it when empty', () => {
    const { getAllByText, rerender, queryByText } = render(Ticker, {
      props: { marks: MARKS, label: 'Trusted by mission-critical workloads' }
    })

    expect(getAllByText(/Trusted by mission-critical workloads/).length).toBeGreaterThan(0)

    return rerender({ marks: MARKS, label: '' }).then(() => {
      expect(queryByText(/Trusted by mission-critical workloads/)).toBeNull()
    })
  })

  it.each(['small', 'medium'] as const)('mirrors size=%s onto data-size', (size) => {
    const { getByTestId, container } = render(Ticker, { props: { marks: MARKS, size } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
    for (const row of container.querySelectorAll('ul')) {
      expect(row).toHaveAttribute('data-size', size)
    }
  })

  it('derives the pass from the mark count, so speed is constant across strips', () => {
    const { container } = render(Ticker, { props: { marks: MARKS } })
    const track = container.querySelector('.animate-brand-marquee')

    expect(track?.getAttribute('style')).toContain(
      `animation-duration: ${Math.round(MARKS.length * 3.2)}s`
    )
  })

  it('lets duration override the derived pass', () => {
    const { container } = render(Ticker, { props: { marks: MARKS, duration: 12 } })
    const track = container.querySelector('.animate-brand-marquee')

    expect(track?.getAttribute('style')).toContain('animation-duration: 12s')
  })

  it('renders no row at all when there are no marks', () => {
    const { getByTestId, container } = render(Ticker, { props: { marks: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('ul')).toHaveLength(0)
  })

  it('has no a11y violations', async () => {
    const { container } = render(Ticker, {
      props: { marks: MARKS, label: 'Trusted by mission-critical workloads', ariaLabel: 'Clients' }
    })
    await markFor(container, 'itau')

    await expectNoA11yViolations(container)
  })
})
