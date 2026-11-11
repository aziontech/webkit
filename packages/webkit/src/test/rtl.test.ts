import { fireEvent, render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Component, defineComponent, h, ref } from 'vue'

import Pagination from '../components/data/pagination/pagination.vue'
import Slider from '../components/inputs/slider/slider.vue'
import Tabs from '../components/navigation/tabs/index'
import TabsItem from '../components/navigation/tabs/tabs-item.vue'
import TabsList from '../components/navigation/tabs/tabs-list.vue'

const modules = {
  ...import.meta.glob<{ default: Component }>('../../blocks/**/*.vue'),
  ...import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

const UNDECLARED = /was accessed during render but is not defined|Failed to resolve component/

function rtlContainer(dir: 'rtl' | 'ltr' = 'rtl'): HTMLElement {
  const container = document.createElement('div')
  container.setAttribute('dir', dir)
  container.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en')
  document.body.appendChild(container)
  return container
}

afterEach(() => {
  document.body.querySelectorAll(':scope > div[dir]').forEach((el) => el.remove())
})

describe('copyable SFCs render inside dir="rtl" lang="ar"', () => {
  let warnings: string[] = []
  beforeEach(() => {
    warnings = []
    vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
      warnings.push(args.map(String).join(' '))
    })
  })
  afterEach(() => vi.restoreAllMocks())

  it.each(Object.keys(modules).map((file) => [file.replace('../../', '')]))('%s', async (file) => {
    const mod = await modules[`../../${file}`]()
    const container = rtlContainer()
    expect(() => render(mod.default, { container })).not.toThrow()
    expect(warnings.filter((w) => UNDECLARED.test(w))).toEqual([])
  })
})

const TabsTree = defineComponent({
  setup() {
    return () =>
      h(Tabs, { defaultValue: 'one', 'data-testid': 'tv' }, () =>
        h(TabsList, null, () => [
          h(TabsItem, { value: 'one', label: 'One' }),
          h(TabsItem, { value: 'two', label: 'Two' }),
          h(TabsItem, { value: 'three', label: 'Three' })
        ])
      )
  }
})

const selectedTab = (container: HTMLElement) =>
  container.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()

describe('arrow keys follow the reading direction', () => {
  it('Tabs: ArrowLeft moves to the next tab under RTL, ArrowRight under LTR', async () => {
    const rtl = rtlContainer('rtl')
    const { getByTestId } = render(TabsTree, { container: rtl })
    await fireEvent.keyDown(getByTestId('tv__list'), { key: 'ArrowLeft' })
    expect(selectedTab(rtl)).toBe('Two')
    await fireEvent.keyDown(getByTestId('tv__list'), { key: 'ArrowRight' })
    expect(selectedTab(rtl)).toBe('One')

    const ltr = rtlContainer('ltr')
    const view = render(TabsTree, { container: ltr })
    await fireEvent.keyDown(view.getByTestId('tv__list'), { key: 'ArrowLeft' })
    expect(selectedTab(ltr)).toBe('Three')
  })

  it('Slider: ArrowLeft increases the value under RTL', async () => {
    const value = ref(50)
    const changes: number[] = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(Slider, {
            modelValue: value.value,
            'onUpdate:modelValue': (next: number) => (value.value = next),
            onChange: (next: number) => changes.push(next),
            step: 5,
            ariaLabel: 'Volume'
          })
      }
    })
    const { getByRole } = render(Host, { container: rtlContainer('rtl') })
    const input = getByRole('slider')
    await fireEvent.keyDown(input, { key: 'ArrowLeft' })
    expect(value.value).toBe(55)
    await fireEvent.keyDown(input, { key: 'ArrowRight' })
    await fireEvent.keyDown(input, { key: 'ArrowRight' })
    expect(value.value).toBe(45)
    expect(changes).toEqual([55, 50, 45])
  })

  it('Pagination: ArrowLeft goes to the next page under RTL and the previous one under LTR', async () => {
    const rtlPages: number[] = []
    const rtl = render(Pagination, {
      container: rtlContainer('rtl'),
      props: { total: 100, page: 3, 'onUpdate:page': (p: number) => rtlPages.push(p) }
    })
    await fireEvent.keyDown(rtl.getByRole('button', { name: 'Next page' }), { key: 'ArrowLeft' })
    await fireEvent.keyDown(rtl.getByRole('button', { name: 'Next page' }), { key: 'ArrowRight' })
    expect(rtlPages).toEqual([4, 2])

    const ltrPages: number[] = []
    const ltr = rtlContainer('ltr')
    render(Pagination, {
      container: ltr,
      props: { total: 100, page: 3, 'onUpdate:page': (p: number) => ltrPages.push(p) }
    })
    const next = ltr.querySelector('[aria-label="Next page"]') as HTMLElement
    await fireEvent.keyDown(next, { key: 'ArrowLeft' })
    expect(ltrPages).toEqual([2])
  })
})
