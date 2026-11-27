import './reflow.css'

import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { type Component, defineComponent, h, nextTick } from 'vue'

import DatePickerWithTime from '../../examples/date-picker/with-time.vue'
import AutoRefresh from '../../examples/date-range-picker/auto-refresh.vue'
import RelativeOnly from '../../examples/date-range-picker/relative-only.vue'
import TimeZone from '../../examples/date-range-picker/time-zone.vue'
import UntilNow from '../../examples/date-range-picker/until-now.vue'
import WithStep from '../../examples/date-range-picker/with-step.vue'
import ConfigProvider from '../components/layout/config-provider/config-provider.vue'
import { LOCALES } from './locales'

const NOW = new Date('2026-11-10T16:00:00.000Z')
const WIDTHS = [320, 390, 1280] as const

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const atWidth = async (width: number): Promise<void> => {
  await page.viewport(width, 800)
  await vi.waitFor(() => expect(window.innerWidth).toBe(width))
  await frame()
}

const mount = (example: Component, locale = 'en-US') =>
  render(
    defineComponent({
      setup: () => () =>
        h(
          ConfigProvider,
          { now: NOW, timeZone: 'UTC', locale, catalogs: LOCALES },
          { default: () => h(example) }
        )
    })
  )

const cutOff = (root: Element): string[] => {
  const offenders: string[] = []
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const style = getComputedStyle(el)
    const clips =
      el instanceof HTMLInputElement ||
      style.textOverflow === 'ellipsis' ||
      ['hidden', 'clip'].includes(style.overflowX)
    if (!clips || el.clientWidth === 0 || el.scrollWidth <= el.clientWidth + 1) continue
    if (!(el instanceof HTMLInputElement) && !el.textContent?.trim()) continue
    if (el.closest('[role="grid"]')) continue
    const label = el instanceof HTMLInputElement ? el.value : el.textContent?.trim()
    offenders.push(`${el.tagName.toLowerCase()} "${label?.slice(0, 40)}"`)
  }
  return offenders
}

const outside = (root: Element, width: number): string[] =>
  [...root.querySelectorAll<HTMLElement>('*')]
    .filter((el) => {
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && (rect.left < -1 || rect.right > width + 1)
    })
    .map((el) => el.dataset['testid'] ?? el.tagName.toLowerCase())

const openPanel = async (view: ReturnType<typeof render>, testId: string) => {
  await fireEvent.click(view.getByTestId(`${testId}__trigger`))
  const panel = await waitFor(() => {
    const found = document.body.querySelector<HTMLElement>(`[data-testid="${testId}__popover"]`)
    expect(found).toBeTruthy()
    return found as HTMLElement
  })
  await nextTick()
  await frame()
  await frame()
  return panel
}

afterEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1280, 800)
})

describe('date pickers stay readable at every width', () => {
  describe.each(WIDTHS)('%ipx', (width) => {
    it.each(['en-US', 'pt-BR'])(
      'DateRangePicker with step: trigger, both tabs and footer show every word (%s)',
      async (locale) => {
        await atWidth(width)
        const view = mount(WithStep, locale)
        const trigger = view.getByTestId('date-range-picker')
        expect(cutOff(trigger)).toEqual([])
        expect(outside(trigger, width)).toEqual([])
        expect(view.getByTestId('date-range-picker__value').textContent).toContain('13:00')

        const panel = await openPanel(view, 'date-range-picker')
        expect(cutOff(panel)).toEqual([])
        expect(outside(panel, width)).toEqual([])

        await fireEvent.click(within(panel).getByRole('radio', { name: /^Relativ/ }))
        await nextTick()
        await frame()
        expect(within(panel).getByTestId('date-range-picker__relative')).toBeTruthy()
        expect(cutOff(panel)).toEqual([])
        expect(outside(panel, width)).toEqual([])
      }
    )

    it('DateRangePicker: the sheet on a phone, the popover on a desktop', async () => {
      await atWidth(width)
      const view = mount(AutoRefresh)
      const panel = await openPanel(view, 'date-range-picker')
      const rect = panel.getBoundingClientRect()
      const backdrop = document.body.querySelector('[data-testid="date-range-picker__backdrop"]')
      if (width < 640) {
        expect(Math.round(rect.left)).toBe(0)
        expect(Math.round(rect.right)).toBe(width)
        for (const part of ['relative', 'absolute']) {
          const body = panel.querySelector(`[data-testid="date-range-picker__${part}"]`)
          if (body) expect(Math.round(body.getBoundingClientRect().width)).toBe(width)
        }
        expect(Math.round(rect.bottom)).toBe(window.innerHeight)
        expect(rect.height).toBeLessThanOrEqual(window.innerHeight * 0.85 + 1)
        expect(getComputedStyle(backdrop as Element).display).not.toBe('none')
        const apply = within(panel).getByRole('button', { name: 'Apply' }).getBoundingClientRect()
        expect(apply.right).toBeLessThanOrEqual(width)
        expect(apply.right).toBeGreaterThan(width - 40)
      } else {
        expect(rect.width).toBeLessThan(width / 2)
        expect(getComputedStyle(backdrop as Element).display).toBe('none')
      }
      expect(cutOff(panel)).toEqual([])
      expect(outside(panel, width)).toEqual([])
    })

    it('DateRangePicker: both tabs are as thin as the calendar', async () => {
      if (width < 640) return
      await atWidth(width)
      const view = mount(WithStep)
      const panel = await openPanel(view, 'date-range-picker')
      const grid = within(panel).getByRole('grid').getBoundingClientRect().width
      const gutter = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 2
      const thin = grid + gutter + 4
      expect(panel.getBoundingClientRect().width).toBeLessThanOrEqual(thin)
      await fireEvent.click(within(panel).getByRole('radio', { name: 'Relative' }))
      await nextTick()
      await frame()
      expect(within(panel).getByTestId('date-range-picker__relative')).toBeTruthy()
      expect(panel.getBoundingClientRect().width).toBeLessThanOrEqual(thin)
    })

    it.each(['en-US', 'pt-BR'])(
      'DateRangePicker relative only: two columns of quick ranges, read down each, the custom duration below and Apply in view (%s)',
      async (locale) => {
        await atWidth(width)
        const view = mount(RelativeOnly, locale)
        const panel = await openPanel(view, 'date-range-picker')
        expect(cutOff(panel)).toEqual([])
        expect(outside(panel, width)).toEqual([])
        const options = within(panel).getAllByTestId('date-range-picker__option')
        expect(options).toHaveLength(12)
        const boxes = options.map((option) => option.getBoundingClientRect())
        const first = boxes.slice(0, 6)
        const second = boxes.slice(6)
        for (const column of [first, second]) {
          for (const box of column)
            expect(Math.abs(box.left - (column[0] as DOMRect).left)).toBeLessThanOrEqual(1)
          for (let i = 1; i < column.length; i += 1) {
            expect((column[i] as DOMRect).top).toBeGreaterThan((column[i - 1] as DOMRect).top)
          }
        }
        expect((second[0] as DOMRect).left).toBeGreaterThan((first[0] as DOMRect).right - 1)
        for (const option of options) {
          const label = option.querySelector('span') as HTMLElement
          const range = document.createRange()
          range.selectNodeContents(label)
          expect(range.getBoundingClientRect().right).toBeLessThanOrEqual(
            option.getBoundingClientRect().right + 1
          )
        }
        const quick = within(panel).getByTestId('date-range-picker__quick').getBoundingClientRect()
        const custom = within(panel)
          .getByTestId('date-range-picker__custom-range')
          .getBoundingClientRect()
        expect(custom.top).toBeGreaterThanOrEqual(quick.bottom - 1)
        const apply = within(panel)
          .getByRole('button', { name: /Apply|Aplicar/ })
          .getBoundingClientRect()
        const box = panel.getBoundingClientRect()
        expect(apply.bottom).toBeLessThanOrEqual(Math.min(box.bottom, window.innerHeight) + 1)
        expect(apply.top).toBeGreaterThanOrEqual(box.top - 1)
      }
    )

    it('DateRangePicker until now: the open end reads in full', async () => {
      await atWidth(width)
      const view = mount(UntilNow)
      expect(view.getByTestId('date-range-picker__value').textContent).toContain('now')
      expect(cutOff(view.getByTestId('date-range-picker'))).toEqual([])
      const panel = await openPanel(view, 'date-range-picker')
      expect(cutOff(panel)).toEqual([])
      expect(outside(panel, width)).toEqual([])
    })

    it('DatePicker with time: trigger and panel show every word', async () => {
      await atWidth(width)
      const view = mount(DatePickerWithTime)
      expect(cutOff(view.getByTestId('date-picker'))).toEqual([])
      const panel = await openPanel(view, 'date-picker')
      expect(cutOff(panel)).toEqual([])
      expect(outside(panel, width)).toEqual([])
      if (width < 640) {
        expect(Math.round(panel.getBoundingClientRect().bottom)).toBe(window.innerHeight)
      }
    })
  })
})

describe('the absolute range opens on the calendar and keeps Apply in view on short screens', () => {
  const SCREENS = [
    { name: 'laptop', width: 1280, height: 720 },
    { name: 'phone', width: 390, height: 664 }
  ] as const

  const shownIn = (el: Element, box: DOMRect): boolean => {
    const rect = el.getBoundingClientRect()
    return rect.height > 0 && rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1
  }

  it.each(SCREENS)(
    'shows the tabs, the calendar and Apply without scrolling on a $name screen',
    async ({ width, height }) => {
      await page.viewport(width, height)
      await vi.waitFor(() => expect(window.innerWidth).toBe(width))
      const Host = defineComponent({
        setup: () => () =>
          h('div', { style: { paddingTop: `${Math.round(height / 2) - 40}px` } }, [
            h(
              ConfigProvider,
              { now: NOW, timeZone: 'UTC', locale: 'en-US', catalogs: LOCALES },
              { default: () => h(TimeZone) }
            )
          ])
      })
      const view = render(Host)
      const panel = await openPanel(view, 'date-range-picker')
      const box = panel.getBoundingClientRect()
      expect(box.top).toBeGreaterThanOrEqual(-1)
      expect(box.bottom).toBeLessThanOrEqual(height + 1)
      const absolute = within(panel).getByTestId('date-range-picker__absolute')
      const grid = within(absolute).getByRole('grid')
      const visible = [
        within(panel).getByRole('radio', { name: 'Absolute' }),
        within(panel).getByRole('radio', { name: 'Relative' }),
        within(absolute).getByLabelText('Month'),
        within(absolute).getByLabelText('Year'),
        within(panel).getByText('Timezone'),
        within(panel).getByRole('button', { name: 'Apply' }),
        within(panel).getByRole('button', { name: 'Cancel' })
      ]
      for (const el of visible) expect(shownIn(el, box), el.outerHTML.slice(0, 120)).toBe(true)
      expect(shownIn(grid.querySelector('[role="row"]') as Element, box)).toBe(true)
      const reachable = async (el: Element): Promise<void> => {
        el.scrollIntoView({ block: 'nearest' })
        await frame()
        const now = panel.getBoundingClientRect()
        expect(shownIn(el, now), el.outerHTML.slice(0, 120)).toBe(true)
        expect(shownIn(within(panel).getByRole('button', { name: 'Apply' }), now)).toBe(true)
      }
      const rows = grid.querySelectorAll('[role="row"]')
      await reachable(rows[rows.length - 1] as Element)
      await reachable(within(panel).getByRole('button', { name: 'Enter dates' }))

      await fireEvent.click(within(panel).getByRole('button', { name: 'Enter dates' }))
      await nextTick()
      await frame()
      for (const el of [
        within(panel).getByLabelText('Start time'),
        within(panel).getByLabelText('End time'),
        within(panel).getByRole('button', { name: 'Show calendar' })
      ]) {
        await reachable(el)
      }

      await fireEvent.click(within(panel).getByRole('radio', { name: 'Relative' }))
      await nextTick()
      await frame()
      await reachable(within(panel).getByRole('button', { name: 'Custom range' }))
    }
  )
})

describe('the quick ranges start on one inline edge', () => {
  const textStart = (el: Element, dir: 'ltr' | 'rtl'): number => {
    const range = document.createRange()
    range.selectNodeContents(el)
    const box = range.getBoundingClientRect()
    return dir === 'rtl' ? box.right : box.left
  }

  it.each(['ltr', 'rtl'] as const)('heading and options line up (%s)', async (dir) => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h(
            ConfigProvider,
            { now: NOW, timeZone: 'UTC', locale: 'en-US', catalogs: LOCALES, dir },
            { default: () => h(RelativeOnly) }
          )
      })
    )
    const panel = await openPanel(view, 'date-range-picker')
    const legend = within(panel).getByTestId('date-range-picker__legend')
    const label = within(panel)
      .getAllByTestId('date-range-picker__option')[0]
      ?.querySelector('span')
    expect(Math.abs(textStart(legend, dir) - textStart(label as Element, dir))).toBeLessThanOrEqual(
      1
    )
  })
})

describe('Refresh every starts the footer and Apply ends it', () => {
  it.each([
    [320, 'ltr'],
    [390, 'ltr'],
    [1280, 'ltr'],
    [390, 'rtl']
  ] as const)('on one row at %ipx (%s)', async (width, dir) => {
    await atWidth(width)
    const view = render(
      defineComponent({
        setup: () => () =>
          h(
            ConfigProvider,
            { now: NOW, timeZone: 'UTC', locale: 'en-US', catalogs: LOCALES, dir },
            { default: () => h(AutoRefresh) }
          )
      })
    )
    const panel = await openPanel(view, 'date-range-picker')
    const refresh = within(panel)
      .getByTestId('date-range-picker__refresh-interval')
      .getBoundingClientRect()
    const cancel = within(panel).getByRole('button', { name: 'Cancel' }).getBoundingClientRect()
    const apply = within(panel).getByRole('button', { name: 'Apply' }).getBoundingClientRect()
    const box = panel.getBoundingClientRect()
    expect(refresh.width).toBeGreaterThan(0)
    expect(
      Math.abs(refresh.top + refresh.height / 2 - (apply.top + apply.height / 2))
    ).toBeLessThanOrEqual(2)
    if (dir === 'ltr') {
      expect(refresh.right).toBeLessThanOrEqual(cancel.left)
      expect(cancel.right).toBeLessThanOrEqual(apply.left)
      expect(refresh.left - box.left).toBeLessThan(box.right - apply.right + 24)
    } else {
      expect(refresh.left).toBeGreaterThanOrEqual(cancel.right)
      expect(cancel.left).toBeGreaterThanOrEqual(apply.right)
    }
  })
})
