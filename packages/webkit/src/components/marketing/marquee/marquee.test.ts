import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Marquee from './marquee.vue'

const TESTID = 'marquee'

const MARKS = ['itau', 'magalu', 'netshoes', 'caixa']

const ITEMS = [
  { label: 'Deploy to 330+ cities instantly', icon: 'az az-globe' },
  { label: 'Predictable pricing without surprises' }
]

const markFor = (container: Element, name: string) =>
  waitFor(() => {
    const art = container.querySelector(`svg[data-mark="${name}"]`)
    expect(art).not.toBeNull()
    return art as SVGElement
  })

describe('Marquee', () => {
  it('renders the strip under the default testid', () => {
    const { getByTestId } = render(Marquee, { props: { marks: MARKS } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it.each(['plain', 'band'] as const)('carries the %s fill on data-variant', (variant) => {
    const { getByTestId } = render(Marquee, { props: { variant: variant, marks: MARKS } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-variant', variant)
  })

  it('paints no surface of its own by default', () => {
    const { getByTestId } = render(Marquee, { props: { marks: MARKS } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-variant', 'plain')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Marquee, {
      props: { marks: MARKS },
      attrs: { 'data-testid': 'trust-strip' }
    })

    expect(getByTestId('trust-strip')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('offers a pause control that holds the loop and resumes it', async () => {
    const { container, getByRole } = render(Marquee, { props: { marks: MARKS } })
    const track = container.querySelector('ul')?.parentElement as HTMLElement

    const control = getByRole('button', { name: 'Pause scrolling' })
    expect(track).not.toHaveAttribute('data-paused')
    await fireEvent.click(control)
    expect(track).toHaveAttribute('data-paused')
    expect(getByRole('button', { name: 'Resume scrolling' })).toBe(control)
    await fireEvent.click(control)
    expect(track).not.toHaveAttribute('data-paused')
  })

  it('renders no pause control without marks or items', () => {
    const { queryByRole } = render(Marquee)
    expect(queryByRole('button')).toBeNull()
  })

  it('renders the row twice so the loop can travel a whole copy', () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })

    expect(container.querySelectorAll('ul')).toHaveLength(2)
    expect(container.querySelectorAll('li')).toHaveLength(MARKS.length * 2)
  })

  it('hides the duplicate row from assistive tech so each mark is announced once', () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })
    const [first, second] = [...container.querySelectorAll('ul')]

    expect(first).not.toHaveAttribute('aria-hidden')
    expect(second).toHaveAttribute('aria-hidden', 'true')
    expect(second).toHaveAttribute('data-duplicate')
  })

  it('names only the announced row with ariaLabel', () => {
    const { container } = render(Marquee, {
      props: { marks: MARKS, ariaLabel: 'Companies running on Azion' }
    })
    const [first, second] = [...container.querySelectorAll('ul')]

    expect(first).toHaveAttribute('aria-label', 'Companies running on Azion')
    expect(second).not.toHaveAttribute('aria-label')
  })

  it('resolves a registered name to its artwork', async () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })

    for (const name of MARKS) {
      await markFor(container, name)
    }
  })

  it('draws each mark once and points every copy of the row at it, so a long strip stays light', async () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })
    await waitFor(() =>
      expect(container.querySelector('.animate-brand-marquee')).not.toHaveAttribute('data-loading')
    )
    const symbols = container.querySelectorAll('[data-slot="marquee-symbols"] symbol')
    const copies = container.querySelectorAll('svg[data-mark="itau"]')

    expect(symbols).toHaveLength(MARKS.length)
    expect(copies.length).toBeGreaterThan(1)
    for (const copy of copies) {
      expect(copy.querySelector('path')).toBeNull()
      expect(copy.querySelector('use')?.getAttribute('href')).toBe(`#${symbols[0].id}`)
      expect(copy.getAttribute('viewBox')).toBe('0 0 600 600')
    }
  })

  it('keeps the rendered artwork size flat as the row repeats', async () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })
    await waitFor(() =>
      expect(container.querySelector('.animate-brand-marquee')).not.toHaveAttribute('data-loading')
    )
    const drawn = container.querySelectorAll('[data-slot="marquee-symbols"] *').length
    const total = container.querySelectorAll('svg *').length
    const references = container.querySelectorAll('svg[data-mark]').length

    expect(total).toBe(drawn + references)
  })

  it('holds the loop until every mark has resolved, so the row starts complete', async () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })
    const track = container.querySelector('.animate-brand-marquee')

    expect(track).toHaveAttribute('data-loading')

    await waitFor(() => expect(track).not.toHaveAttribute('data-loading'))
    for (const name of MARKS) {
      expect(container.querySelector(`svg[data-mark="${name}"]`)).not.toBeNull()
    }
  })

  it('falls back to the name itself when nothing is registered under it', async () => {
    const { container, getAllByText } = render(Marquee, {
      props: { marks: ['magalu', 'Contabilizei'] }
    })
    await markFor(container, 'magalu')

    expect(container.querySelector('svg[data-mark="Contabilizei"]')).toBeNull()
    expect(getAllByText('Contabilizei').length).toBeGreaterThan(0)
  })

  it.each([
    ['splunk', 'Splunk'],
    ['bigquery', 'Google BigQuery'],
    ['amazon-s3', 'Amazon S3'],
    ['amazon-kinesis', 'Amazon Kinesis'],
    ['zoop', 'Zoop'],
    ['g2-leader', 'G2 Leader'],
    ['rust', 'Rust'],
    ['datadog', 'Datadog']
  ])('writes the %s wordmark as its brand name in text, with no artwork', async (name, label) => {
    const { container, getAllByText } = render(Marquee, { props: { marks: ['magalu', name] } })
    await markFor(container, 'magalu')

    expect(container.querySelector(`[data-mark="${name}"]`)).toBeNull()
    expect(container.querySelector(`li[title="${label}"] svg, li[title="${label}"] img`)).toBeNull()
    expect(getAllByText(label).length).toBeGreaterThan(0)
    expect(container.textContent).not.toContain(name)
  })

  it('renders the label as an overline and omits it when empty', () => {
    const { getAllByText, rerender, queryByText } = render(Marquee, {
      props: { marks: MARKS, label: 'Trusted by mission-critical workloads' }
    })

    expect(getAllByText(/Trusted by mission-critical workloads/).length).toBeGreaterThan(0)

    return rerender({ marks: MARKS, label: '' }).then(() => {
      expect(queryByText(/Trusted by mission-critical workloads/)).toBeNull()
    })
  })

  it.each(['small', 'medium'] as const)('mirrors size=%s onto data-size', (size) => {
    const { getByTestId, container } = render(Marquee, { props: { marks: MARKS, size } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
    for (const row of container.querySelectorAll('ul')) {
      expect(row).toHaveAttribute('data-size', size)
    }
  })

  it('derives the pass from the mark count, so speed is constant across strips', () => {
    const { container } = render(Marquee, { props: { marks: MARKS } })
    const track = container.querySelector('.animate-brand-marquee')

    expect(track?.getAttribute('style')).toContain(
      `animation-duration: ${Math.round(MARKS.length * 2)}s`
    )
  })

  it('lets duration override the derived pass', () => {
    const { container } = render(Marquee, { props: { marks: MARKS, duration: 12 } })
    const track = container.querySelector('.animate-brand-marquee')

    expect(track?.getAttribute('style')).toContain('animation-duration: 12s')
  })

  it('repeats a short row until half the track covers the strip, at the same speed', async () => {
    const layout = document.createElement('style')
    layout.textContent = `
      .animate-brand-marquee { overflow: hidden }
      .animate-brand-marquee, .animate-brand-marquee > ul { display: flex; width: max-content; margin: 0; padding: 0 }
      .animate-brand-marquee li { width: 100px; height: 24px; flex-shrink: 0; overflow: hidden }
    `
    document.head.append(layout)
    const strip = document.body.appendChild(document.createElement('div'))
    strip.style.width = '1000px'

    const marks = ['itau', 'magalu']
    const { container, unmount } = render(Marquee, { props: { marks }, container: strip })

    try {
      const track = container.querySelector('.animate-brand-marquee') as globalThis.HTMLElement

      await waitFor(() => expect(track.children.length).toBeGreaterThan(2))

      const rows = [...track.querySelectorAll('ul')]
      const half = rows.length / 2
      expect(Number.isInteger(half)).toBe(true)
      expect(half * rows[0].offsetWidth).toBeGreaterThanOrEqual(1000)
      expect(rows[0]).not.toHaveAttribute('aria-hidden')
      for (const row of rows.slice(1)) {
        expect(row).toHaveAttribute('aria-hidden', 'true')
        expect(row).toHaveAttribute('data-duplicate')
      }
      expect(track.getAttribute('style')).toContain(
        `animation-duration: ${marks.length * 2 * half}s`
      )
    } finally {
      unmount()
      layout.remove()
      strip.remove()
    }
  })

  it('renders no row at all when there are no marks', () => {
    const { getByTestId, container } = render(Marquee, { props: { marks: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('ul')).toHaveLength(0)
  })

  describe('items', () => {
    it('prints each claim as text in both copies of the row', () => {
      const { container, getAllByText } = render(Marquee, { props: { items: ITEMS } })

      expect(getAllByText('Deploy to 330+ cities instantly')).toHaveLength(2)
      expect(container.querySelectorAll('ul')).toHaveLength(2)
      expect(container.querySelectorAll('li')).toHaveLength(ITEMS.length * 2)
    })

    it('draws a leading icon only for an item that names one', () => {
      const { container } = render(Marquee, { props: { items: ITEMS } })
      const [first] = [...container.querySelectorAll('ul')]
      const [withIcon, withoutIcon] = [...first.querySelectorAll('li')]

      expect(withIcon.querySelector('span.az-globe')).toHaveAttribute('aria-hidden', 'true')
      expect(withoutIcon.querySelector('span')).toBeNull()
    })

    it('mirrors the content onto data-content', () => {
      const items = render(Marquee, { props: { items: ITEMS } })
      expect(items.getByTestId(TESTID)).toHaveAttribute('data-content', 'items')
      items.unmount()

      const marks = render(Marquee, { props: { marks: MARKS } })
      expect(marks.getByTestId(TESTID)).toHaveAttribute('data-content', 'marks')
    })

    it('does not render marks while items are set', () => {
      const { container } = render(Marquee, { props: { items: ITEMS, marks: MARKS } })

      expect(container.querySelector('svg[data-mark]')).toBeNull()
      expect(container.querySelectorAll('li')).toHaveLength(ITEMS.length * 2)
    })

    it('derives a slower pass from the item count, since a claim is read and a mark is not', () => {
      const { container } = render(Marquee, { props: { items: ITEMS } })
      const track = container.querySelector('.animate-brand-marquee')

      expect(track?.getAttribute('style')).toContain(
        `animation-duration: ${Math.round(ITEMS.length * 6)}s`
      )
    })

    it('starts the loop without waiting on any artwork', () => {
      const { container } = render(Marquee, { props: { items: ITEMS } })

      expect(container.querySelector('.animate-brand-marquee')).not.toHaveAttribute('data-loading')
    })

    it('has no a11y violations', async () => {
      const { container } = render(Marquee, {
        props: { items: ITEMS, ariaLabel: 'Why teams choose Azion' }
      })

      await expectNoA11yViolations(container)
    })
  })

  it('has no a11y violations', async () => {
    const { container } = render(Marquee, {
      props: { marks: MARKS, label: 'Trusted by mission-critical workloads', ariaLabel: 'Clients' }
    })
    await markFor(container, 'itau')

    await expectNoA11yViolations(container)
  })
})
