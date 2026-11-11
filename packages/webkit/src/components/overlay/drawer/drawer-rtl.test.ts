import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'

import Drawer from './drawer.vue'
import DrawerContent from './drawer-content.vue'
import DrawerPortal from './drawer-portal.vue'
import DrawerTitle from './drawer-title.vue'

const closedTranslate = async (side: 'left' | 'right') => {
  const view = render(() =>
    h(Drawer, { open: true, side }, () =>
      h(DrawerPortal, () => h(DrawerContent, () => h(DrawerTitle, () => 'Settings')))
    )
  )
  await nextTick()
  await nextTick()
  const panel = document.body.querySelector<HTMLElement>('[data-testid="overlay-drawer__panel"]')
  panel?.setAttribute('data-state', 'closed')
  const translate = panel ? getComputedStyle(panel).translate : ''
  view.unmount()
  return translate
}

afterEach(() => {
  document.documentElement.removeAttribute('dir')
})

describe('Drawer in a right-to-left document (styled)', () => {
  it('slides a side drawer out through the edge it is anchored to', async () => {
    await page.viewport(1280, 900)
    expect(await closedTranslate('left')).toBe('-100%')

    document.documentElement.setAttribute('dir', 'rtl')
    expect(await closedTranslate('left')).toBe('100%')
    expect(await closedTranslate('right')).toBe('-100%')
  })
})
