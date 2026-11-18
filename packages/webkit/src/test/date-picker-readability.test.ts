import './reflow.css'

import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { type Component, defineComponent, h, nextTick } from 'vue'

import DatePickerWithTime from '../../examples/date-picker/with-time.vue'
import AutoRefresh from '../../examples/date-range-picker/auto-refresh.vue'
import UntilNow from '../../examples/date-range-picker/until-now.vue'
import WithStep from '../../examples/date-range-picker/with-step.vue'
import ConfigProvider from '../components/provider/config-provider/config-provider.vue'
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

        const tabs = within(panel).getAllByRole('radio').slice(0, 2)
        await fireEvent.click(tabs[0] as HTMLElement)
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
        expect(Math.round(rect.bottom)).toBe(window.innerHeight)
        expect(rect.height).toBeLessThanOrEqual(window.innerHeight * 0.85 + 1)
        expect(getComputedStyle(backdrop as Element).display).not.toBe('none')
        for (const button of within(panel).getAllByRole('button', { name: /Apply|Cancel/ })) {
          expect(button.getBoundingClientRect().width).toBeGreaterThan(width / 3)
        }
      } else {
        expect(rect.width).toBeLessThan(width / 2)
        expect(getComputedStyle(backdrop as Element).display).toBe('none')
      }
      expect(cutOff(panel)).toEqual([])
      expect(outside(panel, width)).toEqual([])
    })

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
