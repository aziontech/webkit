import './reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { nextTick } from 'vue'

import ComboboxDefault from '../../examples/combobox/default.vue'
import DropdownMenuStates from '../../examples/dropdown-menu/states.vue'
import MultiSelectDefault from '../../examples/multi-select/default.vue'
import SelectDefault from '../../examples/select/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  await frame()
  await frame()
}

const transparent = (color: string) => color === 'transparent' || color === 'rgba(0, 0, 0, 0)'

async function waitForFill(el: HTMLElement) {
  for (let i = 0; i < 40 && transparent(getComputedStyle(el).backgroundColor); i += 1) await frame()
  await new Promise((resolve) => setTimeout(resolve, 200))
}

function expectSeparatedFills(upper: HTMLElement, lower: HTMLElement) {
  const a = upper.getBoundingClientRect()
  const b = lower.getBoundingClientRect()
  const sa = getComputedStyle(upper)
  const sb = getComputedStyle(lower)

  expect(transparent(sa.backgroundColor)).toBe(false)
  expect(transparent(sb.backgroundColor)).toBe(false)
  expect(sa.backgroundClip).toBe('padding-box')
  expect(sb.backgroundClip).toBe('padding-box')
  expect(Math.abs(b.top - a.bottom)).toBeLessThan(1)
  expect(a.height).toBeGreaterThanOrEqual(32)
  expect(b.height).toBeGreaterThanOrEqual(32)

  const fillBottom = a.bottom - parseFloat(sa.borderBottomWidth)
  const fillTop = b.top + parseFloat(sb.borderTopWidth)
  expect(fillTop - fillBottom).toBeGreaterThanOrEqual(2)
}

function orderByPosition(x: HTMLElement, y: HTMLElement): [HTMLElement, HTMLElement] {
  return x.getBoundingClientRect().top < y.getBoundingClientRect().top ? [x, y] : [y, x]
}

const options = () => Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))

describe('a selected row and a highlighted row keep a visible gap', () => {
  it('Select', async () => {
    const view = render(SelectDefault)
    await settle()
    const trigger = view.container.querySelector<HTMLElement>('[role="combobox"]')!
    await fireEvent.click(trigger)
    await settle()
    await fireEvent.click(options()[0]!)
    await settle()
    await fireEvent.click(trigger)
    await settle()
    const [selected, next] = options()
    expect(selected!.getAttribute('aria-selected')).toBe('true')
    await userEvent.hover(next!)
    await waitForFill(next!)
    expectSeparatedFills(selected!, next!)
  })

  it('MultiSelect', async () => {
    const view = render(MultiSelectDefault)
    await settle()
    await fireEvent.click(view.container.querySelector<HTMLElement>('[role="combobox"]')!)
    await settle()
    const selected = options().find((o) => o.getAttribute('aria-selected') === 'true')!
    const next = options()[options().indexOf(selected) + 1]!
    await userEvent.hover(next)
    await waitForFill(next)
    expectSeparatedFills(selected, next)
  })

  it('Combobox', async () => {
    const view = render(ComboboxDefault)
    await settle()
    const input = view.container.querySelector<HTMLElement>('[role="combobox"]')!
    await userEvent.click(input)
    await settle()
    const selected = options().find((o) => o.getAttribute('aria-selected') === 'true')!
    expect(selected).toBeDefined()
    const next = options()[options().indexOf(selected) + 1]!
    await userEvent.hover(next)
    await waitForFill(next)
    expectSeparatedFills(selected, next)
  })

  it('DropdownMenu', async () => {
    const view = render(DropdownMenuStates)
    await settle()
    await userEvent.click(view.getByRole('button', { name: 'Open menu' }))
    await settle()
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-testid="dropdown-menu-item"]')
    )
    const selected = items.find((item) => item.hasAttribute('data-selected'))!
    const neighbour = items[items.indexOf(selected) - 1]!
    await userEvent.hover(neighbour)
    await waitForFill(neighbour)
    expectSeparatedFills(...orderByPosition(neighbour, selected))
  })
})
