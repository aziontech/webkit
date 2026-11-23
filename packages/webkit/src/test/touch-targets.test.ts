import './reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands, page } from 'vitest/browser'
import { h, nextTick } from 'vue'

import AccordionDefault from '../../examples/accordion/default.vue'
import AppHeaderWithAccount from '../../examples/app-header/with-account.vue'
import AppLayoutDefault from '../../examples/app-layout/default.vue'
import ConsoleShowcaseDefault from '../../examples/console-showcase-section/default.vue'
import DatePickerDefault from '../../examples/date-picker/default.vue'
import DropdownMenuStates from '../../examples/dropdown-menu/states.vue'
import FooterDefault from '../../examples/footer/default.vue'
import InputDefault from '../../examples/input/default.vue'
import MultiSelectDefault from '../../examples/multi-select/default.vue'
import NumberInputDefault from '../../examples/number-input/default.vue'
import SelectDefault from '../../examples/select/default.vue'
import SettingsGroupCollapsible from '../../examples/settings-group/collapsible.vue'
import SettingsGroupDefault from '../../examples/settings-group/default.vue'
import TabsDefault from '../../examples/tabs/default.vue'
import ThemeSwitcherDefault from '../../examples/theme-switcher/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  await frame()
  await frame()
}

const hits = (el: Element, x: number, y: number) => {
  const found = document.elementFromPoint(x, y)
  return found !== null && el.contains(found)
}

function hitSpan(el: HTMLElement, axis: 'x' | 'y') {
  const box = el.getBoundingClientRect()
  const cx = box.left + box.width / 2
  const cy = box.top + box.height / 2
  const at = (d: number) => (axis === 'y' ? hits(el, cx, cy + d) : hits(el, cx + d, cy))
  let before = 0
  while (before < 40 && at(-(before + 1))) before += 1
  let after = 0
  while (after < 40 && at(after + 1)) after += 1
  return before + after + 1
}

const byTestId = (root: HTMLElement, id: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`))

async function mount(component: object) {
  const view = render({ render: () => h('div', { style: 'padding: 4rem' }, [h(component)]) })
  await settle()
  return view
}

afterEach(async () => {
  await commands.emulateTouch(false)
  await page.viewport(414, 896)
})

describe('tap targets on a coarse pointer (styled)', () => {
  it('keeps the drawn size on a fine pointer', async () => {
    const view = await mount(InputDefault)
    const field = view.container.querySelector<HTMLElement>('[data-slot="input"]')!
    expect(hitSpan(field, 'y')).toBe(Math.round(field.getBoundingClientRect().height))
  })

  describe('with touch', () => {
    const touch = async () => {
      await commands.emulateTouch(true)
      await page.viewport(390, 844)
    }

    it.each([
      ['Input', InputDefault, 'input'],
      ['Select', SelectDefault, 'select-trigger'],
      ['MultiSelect', MultiSelectDefault, 'multi-select-trigger'],
      ['DatePicker', DatePickerDefault, 'date-picker__trigger']
    ])('%s answers a tap across 44px of height', async (_name, component, id) => {
      await touch()
      const view = await mount(component)
      const field = byTestId(view.container as HTMLElement, id)[0]!
      const target = field.tagName === 'INPUT' ? field.parentElement! : field
      expect(target.getBoundingClientRect().height).toBeLessThan(44)
      expect(hitSpan(target, 'y')).toBeGreaterThanOrEqual(44)
    })

    it('NumberInput steppers are 44px tall to the touch', async () => {
      await touch()
      const view = await mount(NumberInputDefault)
      const steppers = Array.from(
        view.container.querySelectorAll<HTMLElement>('button[tabindex="-1"]')
      )
      expect(steppers).toHaveLength(2)
      for (const stepper of steppers) {
        expect(stepper.getBoundingClientRect().width).toBeGreaterThanOrEqual(39)
        expect(hitSpan(stepper, 'y')).toBeGreaterThanOrEqual(44)
      }
    })

    it('ThemeSwitcher segments answer a tap across 44 x 44', async () => {
      await touch()
      const view = await mount(ThemeSwitcherDefault)
      const segment = view.container.querySelector<HTMLElement>('[role="radio"]')!
      expect(segment.getBoundingClientRect().height).toBeLessThan(40)
      expect(hitSpan(segment, 'y')).toBeGreaterThanOrEqual(44)
    })

    it.each([
      ['Tabs', TabsDefault, '[role="tab"]'],
      ['Accordion', AccordionDefault, '[data-testid="accordion-trigger"]'],
      ['FooterLink', FooterDefault, '[data-testid="footer-link"]']
    ])('%s rows are 44px tall', async (_name, component, selector) => {
      await touch()
      const view = await mount(component)
      const row = view.container.querySelector<HTMLElement>(selector)!
      expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })

    it('Select and DropdownMenu rows are 44px tall', async () => {
      await touch()
      const select = await mount(SelectDefault)
      await fireEvent.click(select.container.querySelector<HTMLElement>('[role="combobox"]')!)
      await settle()
      const option = document.body.querySelector<HTMLElement>('[role="option"]')!
      expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
      select.unmount()

      const menu = await mount(DropdownMenuStates)
      await fireEvent.click(menu.container.querySelector<HTMLElement>('button')!)
      await settle()
      const item = document.body.querySelector<HTMLElement>('[role^="menuitem"]')!
      expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })

    it('ConsoleShowcaseSection keeps a large, fluid view switcher on a phone', async () => {
      await touch()
      const view = await mount(ConsoleShowcaseDefault)
      const group = view.container.querySelector<HTMLElement>('[role="radiogroup"]')!
      expect(group.dataset['size']).toBe('large')
      expect(group).toHaveAttribute('data-fluid')
      const option = group.querySelector<HTMLElement>('[role="radio"]')!
      expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(28)
      expect(hitSpan(option, 'y')).toBeGreaterThanOrEqual(44)
    })

    it.each([
      ['SettingsGroup disclosure', SettingsGroupCollapsible, 'settings-group__trigger'],
      ['SettingsGroup copy link', SettingsGroupDefault, 'settings-group__copy-link'],
      ['AppHeaderAccount', AppHeaderWithAccount, 'app-header-account'],
      ['Footer home link', FooterDefault, 'footer__home']
    ])('%s answers a tap across 44 x 44', async (_name, component, id) => {
      await touch()
      const view = await mount(component)
      const control = byTestId(view.container as HTMLElement, id)[0]!
      expect(hitSpan(control, 'y')).toBeGreaterThanOrEqual(44)
      expect(hitSpan(control, 'x')).toBeGreaterThanOrEqual(44)
    })

    it('the AppLayout split-panel separator takes a finger drag across 44px', async () => {
      await touch()
      const view = await mount(AppLayoutDefault)
      const separator = byTestId(view.container as HTMLElement, 'app-layout__split-separator')[0]!
      expect(getComputedStyle(separator).touchAction).toBe('none')
      expect(hitSpan(separator, 'y')).toBeGreaterThanOrEqual(40)
    })
  })
})
