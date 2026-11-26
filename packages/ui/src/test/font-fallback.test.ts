import '../../../theme/dist/fonts.css'

import { describe, expect, it } from 'vitest'

const TEXT =
  'Deploy functions to every edge location in seconds, then watch requests, errors and latency stream back into one dashboard while the cache keeps every asset close to the people who load it.'

const box = (family: string, weight: number) => {
  const el = globalThis.document.createElement('p')
  el.textContent = TEXT
  el.style.cssText = `margin:0;width:320px;font:${weight} 16px/24px ${family}`
  globalThis.document.body.append(el)
  const range = globalThis.document.createRange()
  range.selectNodeContents(el)
  const widest = Math.max(...[...range.getClientRects()].map((rect) => rect.width))
  const measured = { height: el.getBoundingClientRect().height, widest }
  el.remove()
  return measured
}

describe('Rubik fallback face', () => {
  it.each([400, 500])(
    'sets text at weight %i in the space Rubik takes, so the swap shifts nothing',
    async (weight) => {
      await globalThis.document.fonts.load(`${weight} 16px Rubik`)
      await globalThis.document.fonts.load(`${weight} 16px 'Rubik Fallback'`)
      expect(globalThis.document.fonts.check(`${weight} 16px 'Rubik Fallback'`)).toBe(true)

      const rubik = box('Rubik', weight)
      const fallback = box("'Rubik Fallback'", weight)

      expect(fallback.height).toBe(rubik.height)
      expect(Math.abs(fallback.widest - rubik.widest) / rubik.widest).toBeLessThan(0.02)
    }
  )
})
