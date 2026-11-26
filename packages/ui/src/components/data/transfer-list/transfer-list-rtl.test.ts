import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { nextTick } from 'vue'

import Default from '../../../../examples/transfer-list/default.vue'

const glyph = (control: string) => {
  const icon = document.querySelector<HTMLElement>(
    `[data-testid="transfer-list-controls__${control}"] i`
  )
  const style = icon ? getComputedStyle(icon) : null
  return { rotate: style?.rotate, scale: style?.scale }
}

const point = async (width: number, dir: 'ltr' | 'rtl') => {
  await page.viewport(width, 900)
  document.documentElement.setAttribute('dir', dir)
  const view = render(Default)
  await nextTick()
  const result = {
    toTarget: glyph('move-to-target'),
    allToSource: glyph('move-all-to-source')
  }
  view.unmount()
  return result
}

afterEach(() => {
  document.documentElement.removeAttribute('dir')
})

describe('TransferList', () => {
  describe('controls (styled)', () => {
    it('point the arrows at the target list side by side, mirrored in right-to-left', async () => {
      const ltr = await point(1280, 'ltr')
      expect(ltr.toTarget).toEqual({ rotate: 'none', scale: 'none' })
      const rtl = await point(1280, 'rtl')
      expect(rtl.toTarget).toEqual({ rotate: 'none', scale: '-1 1' })
      expect(rtl.allToSource).toEqual({ rotate: 'none', scale: '-1 1' })
    })

    it('point the arrows down and up when the lists stack, in both reading directions', async () => {
      const ltr = await point(390, 'ltr')
      expect(ltr.toTarget).toEqual({ rotate: '90deg', scale: 'none' })
      const rtl = await point(390, 'rtl')
      expect(rtl.toTarget).toEqual({ rotate: '-90deg', scale: '-1 1' })
      expect(rtl.allToSource).toEqual({ rotate: '-90deg', scale: '-1 1' })
    })
  })
})
