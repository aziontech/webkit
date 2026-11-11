import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Component, defineComponent, h, ref } from 'vue'

import Pagination from '../components/data/pagination/pagination.vue'
import TableColumnSelector from '../components/data/table/table-column-selector/table-column-selector.vue'
import TableFilter from '../components/data/table/table-filter/table-filter.vue'
import PhoneInput from '../components/inputs/phone-input/phone-input.vue'
import Select from '../components/inputs/select/select.vue'
import SelectContent from '../components/inputs/select/select-content/select-content.vue'
import SelectOption from '../components/inputs/select/select-option/select-option.vue'
import SelectTrigger from '../components/inputs/select/select-trigger/select-trigger.vue'
import Slider from '../components/inputs/slider/slider.vue'
import DropdownMenu, {
  DropdownMenuGroup,
  DropdownMenuOption,
  DropdownMenuTrigger
} from '../components/navigation/dropdown-menu/index'
import Tabs from '../components/navigation/tabs/index'
import TabsItem from '../components/navigation/tabs/tabs-item.vue'
import TabsList from '../components/navigation/tabs/tabs-list.vue'
import Dialog from '../components/overlay/dialog/dialog.vue'
import DialogContent from '../components/overlay/dialog/dialog-content.vue'
import DialogPortal from '../components/overlay/dialog/dialog-portal.vue'
import DialogTitle from '../components/overlay/dialog/dialog-title.vue'
import Popover from '../components/overlay/popover/popover.vue'
import PopoverContent from '../components/overlay/popover/popover-content/popover-content.vue'
import PopoverTrigger from '../components/overlay/popover/popover-trigger/popover-trigger.vue'
import Tooltip from '../components/overlay/tooltip/tooltip.vue'
import WebkitProvider from '../components/utils/webkit-provider/webkit-provider.vue'

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

const overlays = () => [
  h(Dialog, { open: true }, () =>
    h(DialogPortal, null, () => h(DialogContent, null, () => h(DialogTitle, null, () => 'Dialog')))
  ),
  h(Popover, { open: true }, () => [
    h(PopoverTrigger, null, () => h('button', { type: 'button' }, 'Popover')),
    h(PopoverContent, null, () => 'Popover body')
  ]),
  h(Tooltip, { open: true, text: 'Tip' }, () => h('button', { type: 'button' }, 'Tooltip')),
  h(Select, { open: true, modelValue: 'a' }, () => [
    h(SelectTrigger, { 'aria-label': 'Pick' }),
    h(SelectContent, null, () => h(SelectOption, { value: 'a', label: 'Alpha' }))
  ]),
  h(DropdownMenu, { open: true }, () => [
    h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
    h(DropdownMenuGroup, null, () => h(DropdownMenuOption, { value: 'one', label: 'One' }))
  ])
]

const PANELS = {
  dialog: '[role="dialog"][aria-modal="true"]',
  popover: '[data-testid="overlay-popover__panel"]',
  tooltip: '[role="tooltip"]',
  select: '[role="listbox"]',
  menu: '[role="menu"]'
}

const panels = () =>
  Object.fromEntries(
    Object.entries(PANELS).map(([name, selector]) => [
      name,
      document.body.querySelector<HTMLElement>(selector)
    ])
  )

describe('overlays teleported to body keep the WebkitProvider dir and lang', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('Dialog, Popover, Tooltip, Select and DropdownMenu resolve to rtl and ar under <WebkitProvider locale="ar">', async () => {
    render(defineComponent({ setup: () => () => h(WebkitProvider, { locale: 'ar' }, overlays) }))
    await waitFor(() => expect(Object.values(panels()).every(Boolean)).toBe(true))
    for (const [name, panel] of Object.entries(panels())) {
      const host = panel?.closest('[dir]')
      expect(host?.closest('[data-testid="utils-webkit-provider"]'), name).toBeNull()
      expect(host?.getAttribute('dir'), name).toBe('rtl')
      expect(panel?.closest('[lang]')?.getAttribute('lang'), name).toBe('ar')
    }
  })

  it('sets nothing on the teleported roots without a provider', async () => {
    render(defineComponent({ setup: () => () => h('div', null, overlays()) }))
    await waitFor(() => expect(Object.values(panels()).every(Boolean)).toBe(true))
    for (const [name, panel] of Object.entries(panels())) {
      expect(panel?.closest('[dir]'), name).toBeNull()
    }
  })
})

const tablePanels = async (provider: boolean) => {
  const triggers = [
    h(TableFilter, { 'data-testid': 'rtl-filter', fields: [] }),
    h(TableColumnSelector, { 'data-testid': 'rtl-columns' })
  ]
  const view = render(
    defineComponent({
      setup: () => () =>
        provider ? h(WebkitProvider, { locale: 'ar' }, () => triggers) : h('div', null, triggers)
    })
  )
  await fireEvent.click(view.getByTestId('rtl-filter'))
  await fireEvent.click(view.getByTestId('rtl-columns'))
  return waitFor(() => {
    const found = ['rtl-filter', 'rtl-columns'].map((id) =>
      document.body.querySelector<HTMLElement>(`[data-testid="${id}__panel"]`)
    )
    expect(found.every(Boolean)).toBe(true)
    return found as HTMLElement[]
  })
}

describe('Table.Filter and Table.ColumnSelector panels keep the WebkitProvider dir and lang', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('bind rtl and ar on the panel teleported to body under <WebkitProvider locale="ar">', async () => {
    for (const panel of await tablePanels(true)) {
      expect(panel.closest('[data-testid="utils-webkit-provider"]')).toBeNull()
      expect(panel.getAttribute('dir')).toBe('rtl')
      expect(panel.getAttribute('lang')).toBe('ar')
    }
  })

  it('set nothing on the panel without a provider', async () => {
    for (const panel of await tablePanels(false)) {
      expect(panel.closest('[dir]')).toBeNull()
      expect(panel.hasAttribute('lang')).toBe(false)
    }
  })
})

describe('values keep their own direction inside an rtl trigger', () => {
  it('PhoneInput: the closed trigger isolates the dial code as ltr, so +55 does not read 55+', () => {
    const { getByTestId } = render(PhoneInput, {
      container: rtlContainer('rtl'),
      props: { country: 'BR' }
    })
    const value = getByTestId('select-trigger__value')
    const isolate = value.querySelector('bdi')
    expect(isolate?.getAttribute('dir')).toBe('ltr')
    expect(isolate?.textContent).toBe('+55')
    expect(value.closest('[dir]')?.getAttribute('dir')).toBe('rtl')
  })

  it('Select: the shown value sits in a <bdi> that follows its own first strong character', () => {
    const { getByTestId } = render(
      defineComponent({
        setup: () => () =>
          h(Select, { modelValue: 'Alpha' }, () => [
            h(SelectTrigger, { 'aria-label': 'Pick' }),
            h(SelectContent, null, () => h(SelectOption, { value: 'Alpha', label: 'Alpha' }))
          ])
      }),
      { container: rtlContainer('rtl') }
    )
    const isolate = getByTestId('select-trigger__value').querySelector('bdi')
    expect(isolate?.textContent).toBe('Alpha')
    expect(isolate?.hasAttribute('dir')).toBe(false)
  })
})
