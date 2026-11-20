import '../../../test/reflow.css'
import '../../../../../../assets/fonts/proto-mono/proto-mono-woff2.css'

import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Stats from './stats.vue'

const TESTID = 'stats'

const items = [
  { value: '120', suffix: '+', label: 'Points of presence' },
  { value: '99.99', suffix: '%', label: 'Availability' },
  { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' }
]

const LONG_FIGURES = [
  { value: '99.999', suffix: '%', label: 'Availability' },
  { value: '4.5', suffix: 'Tbps', label: 'Network capacity' },
  { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
  { value: '120', suffix: '+', label: 'Points of presence' }
]

const WIDTHS = [320, 390, 768, 1024, 1280, 1600] as const
const COUNTS = [2, 3, 4] as const
const SIZES = ['small', 'medium', 'large'] as const

async function renderAt(width: number, count: number, size: 'small' | 'medium' | 'large') {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.matchMedia(`(width: ${width}px)`).matches).toBe(true))
  await document.fonts.load('400 32px "Proto Mono"', '0')
  const host = document.createElement('div')
  document.body.appendChild(host)
  const view = render(Stats, {
    container: host,
    props: { items: LONG_FIGURES.slice(0, count), size }
  })
  await nextTick()
  await document.fonts.ready
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  return view
}

describe('Stats', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(Stats, { props: { items } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Stats, {
      props: { items },
      attrs: { 'data-testid': 'proof-band' }
    })

    expect(getByTestId('proof-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one cell per item', () => {
    const { container } = render(Stats, { props: { items } })

    expect(container.querySelectorAll('figure')).toHaveLength(items.length)
  })

  it('renders the value and the caption of every item', () => {
    const { getByText } = render(Stats, { props: { items } })

    for (const item of items) {
      expect(getByText(item.value)).toBeInTheDocument()
      expect(getByText(item.label)).toBeInTheDocument()
    }
  })

  it('captions each figure with its own figcaption', () => {
    const { container } = render(Stats, { props: { items } })
    const captions = [...container.querySelectorAll('figure figcaption')].map((el) =>
      el.textContent?.trim()
    )

    expect(captions).toEqual(items.map((item) => item.label))
  })

  it('renders the prefix before and the suffix after the figure', () => {
    const { container } = render(Stats, { props: { items } })
    const latency = container.querySelectorAll('figure')[2]

    expect([...latency.querySelectorAll('span')].map((el) => el.textContent)).toEqual([
      '<',
      '15',
      'ms'
    ])
  })

  it('omits the prefix and the suffix when the item carries neither', () => {
    const { container } = render(Stats, {
      props: { items: [{ value: '42', label: 'Regions' }] }
    })

    expect([...container.querySelectorAll('figure span')].map((el) => el.textContent)).toEqual([
      '42'
    ])
    expect(container.querySelector('figcaption')).toHaveTextContent('Regions')
  })

  it('defaults the size to medium', () => {
    const { getByTestId } = render(Stats, { props: { items } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', 'medium')
  })

  it.each(['small', 'medium', 'large'] as const)('mirrors the %s size on the root', (size) => {
    const { getByTestId } = render(Stats, { props: { items, size } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
  })

  it('renders no cell when items is empty', () => {
    const { getByTestId, container } = render(Stats, { props: { items: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelectorAll('figure')).toHaveLength(0)
  })

  it('renders no cell when items is omitted', () => {
    const { container } = render(Stats)

    expect(container.querySelectorAll('figure')).toHaveLength(0)
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(Stats, {
      props: { items },
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    const root = getByTestId(TESTID)
    expect(root.tagName).toBe('SECTION')
    expect(root.className).toContain('max-w-(--container-4xl)')
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = render(Stats, { props: { items } })

    await expectNoA11yViolations(container)
  })

  it('counts the longest figure, its parts and the gaps between them', () => {
    const { getByTestId } = render(Stats, { props: { items } })

    const root = getByTestId(TESTID)
    expect(root.style.getPropertyValue('--text-big-number-characters')).toBe('6')
    expect(root.style.getPropertyValue('--text-big-number-inset')).toBe(
      'calc(2 * var(--spacing-2xs))'
    )
  })

  describe('figure fit (styled)', () => {
    it('sets the figures in Proto Mono', async () => {
      await renderAt(1280, 4, 'medium')

      expect(document.fonts.check('400 32px "Proto Mono"')).toBe(true)
    })

    describe.each(SIZES)('size %s', (size) => {
      it.each(WIDTHS.flatMap((width) => COUNTS.map((count) => [width, count] as const)))(
        'keeps every figure on one line inside its cell at %ipx with %i figures',
        async (width, count) => {
          const { getAllByTestId } = await renderAt(width, count, size)
          const figures = getAllByTestId('stats__figure')

          expect(figures).toHaveLength(count)
          expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width)

          const sizes = figures.map((figure) => parseFloat(getComputedStyle(figure).fontSize))
          expect(Math.max(...sizes) - Math.min(...sizes), sizes.join(' ')).toBeLessThanOrEqual(0.05)

          const rows = new Map<number, number[]>()
          for (const figure of figures) {
            const style = getComputedStyle(figure)
            const box = figure.getBoundingClientRect()
            const cell = figure.parentElement as HTMLElement
            const cellBox = cell.getBoundingClientRect()
            const cellStyle = getComputedStyle(cell)
            const contentStart = cellBox.left + parseFloat(cellStyle.paddingLeft)
            const contentEnd = cellBox.right - parseFloat(cellStyle.paddingRight)

            expect(style.whiteSpace).toBe('nowrap')
            expect(box.height).toBeLessThanOrEqual(parseFloat(style.lineHeight) + 1)
            for (const part of figure.querySelectorAll('span')) {
              const partBox = part.getBoundingClientRect()
              expect(partBox.left).toBeGreaterThanOrEqual(contentStart - 0.5)
              expect(partBox.right).toBeLessThanOrEqual(contentEnd + 0.5)
              expect(Math.abs(partBox.top - box.top)).toBeLessThanOrEqual(1)
            }

            const row = Math.round(cellBox.top)
            rows.set(row, [...(rows.get(row) ?? []), box.top])
          }
          for (const tops of rows.values()) {
            expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(0.5)
          }
        }
      )
    })
  })
})
