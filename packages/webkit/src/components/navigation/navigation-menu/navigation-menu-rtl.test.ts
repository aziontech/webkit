import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import NavigationMenuArrow from './navigation-menu-arrow.vue'

const arrowIn = (dir: 'ltr' | 'rtl') => {
  const host = document.createElement('div')
  host.setAttribute('dir', dir)
  document.body.appendChild(host)
  const view = render(NavigationMenuArrow, { container: host })
  const arrow = view.getByTestId('navigation-menu__arrow')
  arrow.setAttribute('data-side', 'bottom')
  return { arrow, host }
}

describe('NavigationMenu.Arrow in a right-to-left subtree (styled)', () => {
  it('keeps its visible corner pointing at the trigger by flipping on the inline axis', () => {
    const ltr = arrowIn('ltr')
    const ltrStyle = getComputedStyle(ltr.arrow)
    expect(ltrStyle.borderRightWidth).toBe('0px')
    expect(ltrStyle.scale).toBe('none')
    ltr.host.remove()

    const rtl = arrowIn('rtl')
    const rtlStyle = getComputedStyle(rtl.arrow)
    expect(rtlStyle.borderLeftWidth).toBe('0px')
    expect(rtlStyle.scale).toBe('-1 1')
    rtl.host.remove()
  })
})
