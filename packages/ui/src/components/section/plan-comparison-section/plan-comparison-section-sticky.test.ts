import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'

import DefaultExample from '../../../../examples/plan-comparison-section/default.vue'

const settle = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const headOf = (root: HTMLElement) => {
  const cells = [...root.querySelectorAll<HTMLElement>('thead th')].filter(
    (cell) => cell.getClientRects().length > 0
  )
  return Math.max(...cells.map((cell) => cell.getBoundingClientRect().bottom))
}

const bandOf = (root: HTMLElement) => {
  const band = root.querySelector<HTMLElement>('tbody th[scope="rowgroup"]')
  const eyebrow = band?.querySelector<HTMLElement>('[data-testid="eyebrow"]')
  const title = band?.querySelector<HTMLElement>('.text-heading-lg')
  return {
    eyebrowTop: eyebrow?.getBoundingClientRect().top ?? Number.NaN,
    titleTop: title?.getBoundingClientRect().top ?? Number.NaN
  }
}

const inCard = () =>
  render({
    render: () =>
      h(
        'div',
        {
          'data-testid': 'card',
          class: 'overflow-auto p-(--spacing-lg) [--layout-sticky-top:0]'
        },
        [h(DefaultExample)]
      )
  })

const underSiteHeader = () =>
  render({
    render: () =>
      h('div', [
        h('header', {
          'data-testid': 'bar',
          class: 'sticky top-0 z-40 h-(--layout-header-height) bg-(--bg-surface)'
        }),
        h(DefaultExample)
      ])
  })

afterEach(async () => {
  window.scrollTo(0, 0)
  await page.viewport(414, 896)
})

describe('PlanComparisonSection', () => {
  describe('the sticky plan header (styled)', () => {
    for (const [width, height] of [
      [1280, 900],
      [390, 844]
    ] as const) {
      it(`leaves the first band eyebrow and title clear at rest inside a scroller at ${width}px`, async () => {
        await page.viewport(width, height)
        const { getByTestId } = inCard()
        await settle()

        const root = getByTestId('plan-comparison-section')
        const headBottom = headOf(root)
        const { eyebrowTop, titleTop } = bandOf(root)
        expect(eyebrowTop).toBeGreaterThanOrEqual(headBottom)
        expect(titleTop).toBeGreaterThan(eyebrowTop)
      })

      it(`leaves the first band clear at rest under a sticky site header at ${width}px`, async () => {
        await page.viewport(width, height)
        const { getByTestId } = underSiteHeader()
        await settle()

        const root = getByTestId('plan-comparison-section')
        expect(bandOf(root).eyebrowTop).toBeGreaterThanOrEqual(headOf(root))
      })
    }

    it('sticks the plan row right under the sticky site header while the bands scroll', async () => {
      await page.viewport(1280, 900)
      const { getByTestId } = underSiteHeader()
      await settle()

      const root = getByTestId('plan-comparison-section')
      window.scrollTo(0, root.getBoundingClientRect().top + window.scrollY + 600)
      await settle()

      const barBottom = getByTestId('bar').getBoundingClientRect().bottom
      const headTop = root.querySelector('thead th')?.getBoundingClientRect().top ?? Number.NaN
      expect(headTop).toBeCloseTo(barBottom, 0)
    })
  })
})
