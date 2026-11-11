import './reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { commands, userEvent } from 'vitest/browser'
import type { Component } from 'vue'
import { defineComponent, nextTick } from 'vue'

import DrawerDefault from '../../examples/drawer/default.vue'
import DropdownMenuDefault from '../../examples/dropdown-menu/default.vue'
import SelectDefault from '../../examples/select/default.vue'
import Button from '../components/actions/button/button.vue'
import StatusIndicator from '../components/feedback/status-indicator/status-indicator.vue'
import Checkbox from '../components/inputs/checkbox/checkbox.vue'
import Chip from '../components/inputs/chip/chip.vue'
import Input from '../components/inputs/input/input.vue'
import Switch from '../components/inputs/switch/switch.vue'
import Tabs from '../components/navigation/tabs'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  await frame()
  await frame()
}

const style = (el: Element) => getComputedStyle(el)

const hasVisibleOutline = (el: Element) =>
  style(el).outlineStyle !== 'none' && parseFloat(style(el).outlineWidth) >= 2

const hasVisibleBorder = (el: Element) =>
  style(el).borderTopStyle !== 'none' && parseFloat(style(el).borderTopWidth) > 0

async function tabTo(el: HTMLElement) {
  for (let i = 0; i < 12 && document.activeElement !== el; i += 1) await userEvent.tab()
  expect(document.activeElement).toBe(el)
}

describe('forced colors (Windows high contrast)', () => {
  beforeAll(async () => {
    await commands.emulateMedia({ forcedColors: 'active' })
  })

  afterAll(async () => {
    await commands.emulateMedia({ forcedColors: null })
  })

  it('the emulation is on', () => {
    expect(matchMedia('(forced-colors: active)').matches).toBe(true)
  })

  it.each<[string, Component, Record<string, unknown>, string]>([
    ['Button', Button, { label: 'Save' }, 'button'],
    ['Input', Input, { 'aria-label': 'Name' }, 'input'],
    ['Checkbox', Checkbox, { binary: true, 'aria-label': 'Accept' }, 'input'],
    ['Switch', Switch, { 'aria-label': 'Notifications' }, 'button'],
    ['Chip (clickable)', Chip, { label: 'Region', clickable: true }, '[role="button"]']
  ])(
    '%s shows a 2px system-colour focus outline on keyboard focus',
    async (_, component, props, selector) => {
      const { container } = render(component, { props })
      const el = container.querySelector<HTMLElement>(selector)!
      await tabTo(el)
      expect(hasVisibleOutline(el)).toBe(true)
    }
  )

  it('the Input and the Switch track keep a visible border', async () => {
    const input = render(Input, { props: { 'aria-label': 'Name' } })
    const field = input.container.querySelector('input')!
    const bordered = [field, field.parentElement!, field.parentElement!.parentElement!].some(
      hasVisibleBorder
    )
    expect(bordered).toBe(true)
    const toggle = render(Switch, { props: { 'aria-label': 'Notifications' } })
    expect(hasVisibleBorder(toggle.container.querySelector('button')!)).toBe(true)
  })

  it('the Switch handle stays distinct from the track, on and off', async () => {
    const view = render(Switch, { props: { 'aria-label': 'Notifications' } })
    const track = view.container.querySelector('button')!
    const handle = view.getByTestId('input-switch__handle')
    expect(style(handle).backgroundColor).not.toBe(style(track).backgroundColor)
    await fireEvent.click(track)
    await settle()
    expect(style(handle).backgroundColor).not.toBe(style(track).backgroundColor)
  })

  it('the StatusIndicator dot stays painted', () => {
    const view = render(StatusIndicator, { props: { severity: 'success', label: 'Healthy' } })
    const dot = view.getByTestId('feedback-status-indicator__dot')
    expect(style(dot).backgroundColor).not.toBe(style(document.body).backgroundColor)
    expect(style(dot).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('a selected tab and a pressed chip carry a selection outline', async () => {
    const Host = defineComponent({
      components: { Tabs, TabsList: Tabs.List, TabsItem: Tabs.Item },
      template: `
        <Tabs model-value="a">
          <TabsList>
            <TabsItem value="a" label="Alpha" />
            <TabsItem value="b" label="Beta" />
          </TabsList>
        </Tabs>
      `
    })
    const tabs = render(Host)
    await settle()
    const [selected, other] = tabs.getAllByRole('tab')
    expect(hasVisibleOutline(selected!)).toBe(true)
    expect(hasVisibleOutline(other!)).toBe(false)

    const chip = render(Chip, { props: { label: 'Region', selectable: true, selected: true } })
    expect(hasVisibleOutline(chip.container.querySelector('[aria-pressed="true"]')!)).toBe(true)
  })

  it('the selected option of an open Select carries a selection outline', async () => {
    const view = render(SelectDefault)
    await settle()
    await fireEvent.click(view.container.querySelector('[role="combobox"]')!)
    await settle()
    const options = Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))
    expect(options.length).toBeGreaterThan(0)
    await fireEvent.click(options[0]!)
    await settle()
    await fireEvent.click(view.container.querySelector('[role="combobox"]')!)
    await settle()
    const selected = document.body.querySelector('[role="option"][aria-selected="true"]')
    expect(selected).not.toBeNull()
    expect(hasVisibleOutline(selected!)).toBe(true)
  })
})

function longMotion(root: HTMLElement): string[] {
  const animations = root
    .getAnimations({ subtree: true })
    .filter((animation) => Number(animation.effect?.getComputedTiming().duration ?? 0) > 1)
    .map((animation) => (animation as CSSAnimation).animationName ?? 'animation')
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  const transitions = elements
    .filter((element) =>
      style(element)
        .transitionDuration.split(',')
        .some((value) => parseFloat(value) > 0.001)
    )
    .map((element) => element.dataset['testid'] ?? element.tagName)
  return [...animations, ...transitions]
}

describe('reduced motion on overlay entrance', () => {
  afterEach(async () => {
    await commands.emulateMedia({ reducedMotion: null })
  })

  it.each<[string, Component, string, string]>([
    ['Drawer', DrawerDefault, 'button', '[role="dialog"]'],
    ['DropdownMenu', DropdownMenuDefault, 'button', '[role="menu"]'],
    ['Select', SelectDefault, '[role="combobox"]', '[role="listbox"]']
  ])(
    '%s opens with no animation or transition longer than 1ms',
    async (_, example, trigger, popup) => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      const view = render(example)
      await settle()
      await fireEvent.click(view.container.querySelector(trigger)!)
      await settle()
      const panel = document.body.querySelector<HTMLElement>(popup)
      expect(panel).not.toBeNull()
      const surface = (panel!.closest('[data-testid$="__panel"]') as HTMLElement | null) ?? panel!
      expect(longMotion(surface)).toEqual([])
    }
  )
})
