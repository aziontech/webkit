import './reflow.css'

import { userEvent } from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'

import PageTabsDefault from '../../examples/page-tabs/default.vue'
import TabsCentered from '../../examples/tabs/centered.vue'
import TabsDefault from '../../examples/tabs/default.vue'
import TabsScrollable from '../../examples/tabs/scrollable.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  await frame()
  await frame()
}

function outsetRing(el: HTMLElement) {
  const shadow = getComputedStyle(el).boxShadow
  if (!shadow || shadow === 'none') return 0
  const layers = shadow.split(/,(?![^(]*\))/)
  let reach = 0
  for (const layer of layers) {
    if (/\binset\b/.test(layer)) continue
    const lengths = layer
      .replace(/(rgba?|oklch|oklab|color-mix|hsla?)\([^)]*\)/g, '')
      .match(/-?\d*\.?\d+px/g)
    if (!lengths || lengths.length < 4) continue
    const [x, y, blur, spread] = lengths.map((value) => parseFloat(value))
    reach = Math.max(reach, spread! + Math.max(Math.abs(x!), Math.abs(y!)) + blur!)
  }
  return reach
}

function clippingAncestor(el: HTMLElement) {
  let node = el.parentElement
  while (node) {
    const style = getComputedStyle(node)
    if (style.overflowX !== 'visible' || style.overflowY !== 'visible') return node
    node = node.parentElement
  }
  return null
}

function expectRingInsideClip(el: HTMLElement) {
  const reach = outsetRing(el)
  const clip = clippingAncestor(el)
  if (!clip || reach === 0) return
  const box = el.getBoundingClientRect()
  const area = clip.getBoundingClientRect()
  expect(box.top - reach).toBeGreaterThanOrEqual(area.top - 0.5)
  expect(box.bottom + reach).toBeLessThanOrEqual(area.bottom + 0.5)
}

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('focus rings are not clipped by a scrolling container (styled)', () => {
  it.each([
    ['Tabs', TabsDefault],
    ['Tabs centered', TabsCentered],
    ['Tabs scrollable', TabsScrollable],
    ['PageTabs', PageTabsDefault]
  ])('%s draws the whole ring of a keyboard-focused tab', async (_name, component) => {
    await page.viewport(390, 844)
    const view = render({ render: () => h('div', { style: 'padding: 4rem' }, [h(component)]) })
    await settle()
    const first = view.container.querySelector<HTMLElement>('[role="tab"]')!
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    await settle()
    const focused = document.activeElement as HTMLElement
    expect(focused.getAttribute('role')).toBe('tab')
    expect(focused.matches(':focus-visible')).toBe(true)
    expect(getComputedStyle(focused).boxShadow).not.toBe('none')
    expectRingInsideClip(focused)
  })
})
