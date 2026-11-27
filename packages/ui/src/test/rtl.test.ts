import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Component, defineComponent, h, ref } from 'vue'

import AvatarGroup from '../components/content/avatar-group/avatar-group.vue'
import Badge from '../components/content/badge/badge.vue'
import CurrencyAmount from '../components/content/currency-amount/currency-amount.vue'
import OverflowCount from '../components/content/overflow-count/overflow-count.vue'
import Tag from '../components/content/tag/tag.vue'
import Pagination from '../components/data/pagination/pagination.vue'
import TableCellTime from '../components/data/table/table-cell-time/table-cell-time.vue'
import PhoneInput from '../components/input/phone-input/phone-input.vue'
import SelectRoot from '../components/input/select/select.vue'
import SelectContent from '../components/input/select/select-content/select-content.vue'
import SelectItem from '../components/input/select/select-item/select-item.vue'
import SelectTrigger from '../components/input/select/select-trigger/select-trigger.vue'
import Slider from '../components/input/slider/slider.vue'
import DropdownMenu, {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/navigation/dropdown-menu/index'
import Tabs from '../components/navigation/tabs/index'
import TabsList from '../components/navigation/tabs/tabs-list.vue'
import TabsTrigger from '../components/navigation/tabs/tabs-trigger.vue'
import Dialog from '../components/overlay/dialog/dialog.vue'
import DialogContent from '../components/overlay/dialog/dialog-content.vue'
import DialogTitle from '../components/overlay/dialog/dialog-title.vue'
import Popover from '../components/overlay/popover/popover.vue'
import PopoverContent from '../components/overlay/popover/popover-content/popover-content.vue'
import PopoverTrigger from '../components/overlay/popover/popover-trigger/popover-trigger.vue'
import Tooltip from '../components/overlay/tooltip/tooltip.vue'
import ConfigProvider from '../components/provider/config-provider/config-provider.vue'
import { hostable } from './hostable'

const Select = hostable(SelectRoot)

const modules = {
  ...import.meta.glob<{ default: Component }>([
    '../../blocks/**/*.vue',
    '!../../blocks/**/parts/**'
  ]),
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
          h(TabsTrigger, { value: 'one', label: 'One' }),
          h(TabsTrigger, { value: 'two', label: 'Two' }),
          h(TabsTrigger, { value: 'three', label: 'Three' })
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
    await fireEvent.keyDown(getByTestId('tabs-list'), { key: 'ArrowLeft' })
    expect(selectedTab(rtl)).toBe('Two')
    await fireEvent.keyDown(getByTestId('tabs-list'), { key: 'ArrowRight' })
    expect(selectedTab(rtl)).toBe('One')

    const ltr = rtlContainer('ltr')
    const view = render(TabsTree, { container: ltr })
    await fireEvent.keyDown(view.getByTestId('tabs-list'), { key: 'ArrowLeft' })
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
    h(DialogContent, null, () => h(DialogTitle, null, () => 'Dialog'))
  ),
  h(Popover, { open: true }, () => [
    h(PopoverTrigger, null, () => h('button', { type: 'button' }, 'Popover')),
    h(PopoverContent, null, () => 'Popover body')
  ]),
  h(Tooltip, { open: true, content: 'Tip' }, () => h('button', { type: 'button' }, 'Tooltip')),
  h(Select, { open: true, modelValue: 'a' }, () => [
    h(SelectTrigger, { 'aria-label': 'Pick' }),
    h(SelectContent, null, () => h(SelectItem, { value: 'a', label: 'Alpha' }))
  ]),
  h(DropdownMenu, { open: true }, () => [
    h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
    h(DropdownMenuGroup, null, () => h(DropdownMenuItem, { value: 'one', label: 'One' }))
  ])
]

const PANELS = {
  dialog: '[role="dialog"][aria-modal="true"]',
  popover: '[data-testid="popover-content"]',
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

describe('overlays teleported to body keep the ConfigProvider dir and lang', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('Dialog, Popover, Tooltip, Select and DropdownMenu resolve to rtl and ar under <ConfigProvider locale="ar">', async () => {
    render(defineComponent({ setup: () => () => h(ConfigProvider, { locale: 'ar' }, overlays) }))
    await waitFor(() => expect(Object.values(panels()).every(Boolean)).toBe(true))
    for (const [name, panel] of Object.entries(panels())) {
      const host = panel?.closest('[dir]')
      expect(host?.closest('[data-testid="config-provider"]'), name).toBeNull()
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

describe('values keep their own direction inside an rtl trigger', () => {
  it('PhoneInput: the closed trigger isolates the dial code as ltr, so +55 does not read 55+', () => {
    const { getByTestId } = render(PhoneInput, {
      container: rtlContainer('rtl'),
      props: { country: 'BR' }
    })
    const dialCode = getByTestId('phone-input__selected-dial-code')
    expect(dialCode.getAttribute('dir')).toBe('ltr')
    expect(dialCode.textContent?.trim()).toBe('+55')
    expect(getComputedStyle(dialCode).unicodeBidi).toBe('isolate')
    expect(getComputedStyle(dialCode).direction).toBe('ltr')
    expect(dialCode.parentElement?.closest('[dir]')?.getAttribute('dir')).toBe('rtl')
    expect(getByTestId('select-trigger__value').contains(dialCode)).toBe(false)
  })

  it('Select: the shown value sits in a <bdi> that follows its own first strong character', () => {
    const { getByTestId } = render(
      defineComponent({
        setup: () => () =>
          h(Select, { modelValue: 'Alpha' }, () => [
            h(SelectTrigger, { 'aria-label': 'Pick' }),
            h(SelectContent, null, () => h(SelectItem, { value: 'Alpha', label: 'Alpha' }))
          ])
      }),
      { container: rtlContainer('rtl') }
    )
    const isolate = getByTestId('select-trigger__value').querySelector('bdi')
    expect(isolate?.textContent).toBe('Alpha')
    expect(isolate?.hasAttribute('dir')).toBe(false)
  })

  it('CurrencyAmount and TableCellTime isolate their text, so 184.20 and 2 weeks ago keep their order', () => {
    const amount = render(CurrencyAmount, {
      props: { value: '184.20' },
      container: rtlContainer('rtl')
    })
    const group = amount.getByTestId('currency-amount__amount')
    expect(group.getAttribute('dir')).toBe('ltr')
    expect(getComputedStyle(group).direction).toBe('ltr')
    const time = render(TableCellTime, {
      props: { value: new Date(Date.now() - 14 * 86_400_000) },
      container: rtlContainer('rtl')
    })
    const text = time.getByTestId('table-cell-time__time')
    expect(text.getAttribute('dir')).toBe('auto')
    expect(getComputedStyle(text).direction).toBe('ltr')
  })

  it('Tag, Badge, OverflowCount and AvatarGroup keep a numeric label in its order, so +10.5% does not read 10.5%+', () => {
    const tag = render(Tag, { props: { label: '+10.5%' }, container: rtlContainer('rtl') })
    expect(tag.getByTestId('tag__label').getAttribute('dir')).toBe('ltr')
    expect(getComputedStyle(tag.getByTestId('tag__label')).direction).toBe('ltr')
    const word = render(Tag, { props: { label: 'مستقر' }, container: rtlContainer('rtl') })
    expect(word.getByTestId('tag__label').getAttribute('dir')).toBe('auto')
    expect(getComputedStyle(word.getByTestId('tag__label')).direction).toBe('rtl')
    const badge = render(Badge, { props: { label: '-3' }, container: rtlContainer('rtl') })
    expect(badge.getByTestId('badge__label').getAttribute('dir')).toBe('ltr')
    const count = render(OverflowCount, {
      props: { items: ['a', 'b', 'c'] },
      container: rtlContainer('rtl')
    })
    expect(count.getByTestId('tag__label').getAttribute('dir')).toBe('ltr')
    const group = render(AvatarGroup, {
      props: {
        items: ['Jane Doe', 'John Smith', 'Sam Lee', 'Alex Morgan'].map((name) => ({ name })),
        max: 2
      },
      container: rtlContainer('rtl')
    })
    const more = group.getByTestId('avatar-group__overflow').querySelector('[dir="ltr"]')
    expect(more?.textContent).toBe('+2')
  })
})
