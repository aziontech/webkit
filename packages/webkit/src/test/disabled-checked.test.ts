import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Checkbox from '../components/input/checkbox/checkbox.vue'
import Switch from '../components/input/switch/switch.vue'

const rgb = (color: string): [number, number, number] => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })!
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return [r!, g!, b!]
}

const luminance = (color: string): number => {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = rgb(color).map(channel) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

afterEach(() => {
  delete document.documentElement.dataset['theme']
})

describe('a disabled checked Checkbox keeps a readable mark', () => {
  it.each(['light', 'dark'] as const)('in the %s theme', (theme) => {
    document.documentElement.dataset['theme'] = theme
    const cases = [
      { modelValue: true, indeterminate: false },
      { modelValue: false, indeterminate: true }
    ]
    for (const props of cases) {
      const { getByTestId, unmount } = render(Checkbox, {
        props: { ...props, disabled: true },
        attrs: { 'aria-label': 'Locked field' }
      })
      const root = getByTestId('checkbox')
      const mark = getByTestId('checkbox__icon').querySelector('path') as SVGPathElement
      expect(getComputedStyle(root).opacity).toBe('1')
      const stroke = getComputedStyle(mark).stroke
      const ratio = contrast(stroke, getComputedStyle(root).backgroundColor)
      expect(
        ratio,
        `${stroke} on ${getComputedStyle(root).backgroundColor}`
      ).toBeGreaterThanOrEqual(3)
      unmount()
    }
  })
})

describe('a disabled Switch reads on and off apart', () => {
  it.each(['light', 'dark'] as const)('in the %s theme', (theme) => {
    document.documentElement.dataset['theme'] = theme
    const look = (modelValue: boolean) => {
      const { getByTestId, unmount } = render(Switch, {
        props: { modelValue, disabled: true },
        attrs: { 'aria-label': modelValue ? 'Locked on' : 'Locked off' }
      })
      const root = getByTestId('switch')
      const style = getComputedStyle(root)
      const result = {
        border: style.borderTopColor,
        track: style.backgroundColor,
        handle: getComputedStyle(getByTestId('switch__handle')).backgroundColor
      }
      unmount()
      return result
    }
    const on = look(true)
    const off = look(false)
    expect(rgb(on.border)).toEqual(rgb(off.border))
    expect(on.border).not.toBe('rgba(0, 0, 0, 0)')
    expect(on.track).not.toBe(off.track)
    expect(contrast(on.handle, off.handle), `${on.handle} vs ${off.handle}`).toBeGreaterThan(1.2)
  })
})
