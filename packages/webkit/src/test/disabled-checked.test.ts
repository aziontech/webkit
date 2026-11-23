import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Checkbox from '../components/input/checkbox/checkbox.vue'

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
      const icon = getByTestId('checkbox__icon')
      expect(getComputedStyle(root).opacity).toBe('1')
      const ratio = contrast(getComputedStyle(icon).stroke, getComputedStyle(root).backgroundColor)
      expect(
        ratio,
        `${getComputedStyle(icon).stroke} on ${getComputedStyle(root).backgroundColor}`
      ).toBeGreaterThanOrEqual(3)
      unmount()
    }
  })
})
