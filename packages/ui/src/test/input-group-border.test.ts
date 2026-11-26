import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { type Component, defineComponent, h } from 'vue'

import Sizes from '../../examples/input-group/sizes.vue'
import WithAll from '../../examples/input-group/with-all.vue'
import WithButton from '../../examples/input-group/with-button.vue'
import WithSelect from '../../examples/input-group/with-select.vue'
import PhoneDefault from '../../examples/phone-input/default.vue'
import PhoneInput from '../components/input/phone-input/phone-input.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const atWidth = async (width: number): Promise<void> => {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.innerWidth).toBe(width))
  await frame()
}

afterEach(async () => {
  await page.viewport(1280, 800)
})

const PhoneSizes = defineComponent({
  setup: () => () =>
    h('div', { class: 'flex flex-col gap-(--spacing-md)' }, [
      h(PhoneInput, { size: 'small', 'aria-label': 'Small' }),
      h(PhoneInput, { size: 'medium', 'aria-label': 'Medium' }),
      h(PhoneInput, { size: 'large', 'aria-label': 'Large' })
    ])
})

const offset = (example: Component) =>
  defineComponent({
    setup: () => () =>
      h('div', { style: 'padding-top: 0.8px; padding-inline: 1.4px; max-width: 22rem' }, [
        h(example)
      ])
  })

const painted = (el: Element): boolean => {
  const style = getComputedStyle(el)
  const [, , , alpha = '1'] = style.backgroundColor.match(/[\d.]+/g) ?? []
  return style.backgroundColor !== 'transparent' && Number(alpha) > 0
}

const coveredEdges = (group: HTMLElement): string[] => {
  const outer = group.getBoundingClientRect()
  const border = parseFloat(getComputedStyle(group).borderTopWidth)
  const found: string[] = []
  for (const el of group.querySelectorAll('*')) {
    if (!painted(el)) continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    const style = getComputedStyle(el)
    const clipped = style.backgroundClip === 'padding-box'
    const top = rect.top + (clipped ? parseFloat(style.borderTopWidth) : 0)
    const bottom = rect.bottom - (clipped ? parseFloat(style.borderBottomWidth) : 0)
    const name = el.getAttribute('data-testid') ?? el.tagName.toLowerCase()
    if (top < outer.top + border - 0.01) found.push(`${name} covers the top border`)
    if (bottom > outer.bottom - border + 0.01) found.push(`${name} covers the bottom border`)
  }
  return found
}

const examples: [string, Component][] = [
  ['PhoneInput default', PhoneDefault],
  ['PhoneInput sizes', PhoneSizes],
  ['InputGroup with a select', WithSelect],
  ['InputGroup with a button', WithButton],
  ['InputGroup with every part', WithAll],
  ['InputGroup sizes', Sizes]
]

describe('InputGroup keeps its own border on every side', () => {
  describe.each([320, 390, 768, 1280])('at %i px', (width) => {
    it.each(examples)('%s: no control inside paints over the border', async (_name, example) => {
      await atWidth(width)
      const view = render(offset(example))
      await frame()
      const groups = [...view.container.querySelectorAll<HTMLElement>('[role="group"]')]
      expect(groups.length).toBeGreaterThan(0)
      for (const group of groups) {
        expect(group.getBoundingClientRect().height).toBeGreaterThan(0)
        expect(coveredEdges(group)).toEqual([])
      }
    })
  })
})
