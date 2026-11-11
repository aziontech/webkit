import { describe, expect, it } from 'vitest'

import styles from '../styles.css?raw'
import {
  DIRECTIONAL_ICONS,
  directionalIconClass,
  isDirectionalIcon,
  MIRROR_CLASS
} from './directional-icons'

describe('directional icons', () => {
  it('mirrors arrows and chevrons, never external links, media or logos', () => {
    expect(isDirectionalIcon('pi pi-chevron-right')).toBe(true)
    expect(isDirectionalIcon('pi pi-arrow-left')).toBe(true)
    expect(isDirectionalIcon('pi pi-sign-out')).toBe(true)
    for (const icon of [
      'pi pi-external-link',
      'pi pi-arrow-up-right',
      'pi pi-play',
      'pi pi-github',
      'pi pi-chevron-down',
      '',
      undefined
    ]) {
      expect(isDirectionalIcon(icon)).toBe(false)
    }
    expect(directionalIconClass('pi pi-angle-left')).toBe(MIRROR_CLASS)
    expect(directionalIconClass('pi pi-box')).toBe('')
  })

  it('keeps the stylesheet rule in sync with the list', () => {
    const selectors = [...styles.matchAll(/\.((?:pi|ai)-[a-z0-9-]+):dir\(rtl\)/g)].map((m) => m[1])
    expect(new Set(selectors)).toEqual(new Set(DIRECTIONAL_ICONS))
  })

  it('matches exactly the listed icons', () => {
    for (const icon of DIRECTIONAL_ICONS) {
      expect(isDirectionalIcon(`pi ${icon}`)).toBe(true)
      expect(isDirectionalIcon(`${icon}-x`)).toBe(false)
      expect(isDirectionalIcon(`x${icon}`)).toBe(false)
    }
    for (const icon of ['pi-arrow-up-left', 'pi-caret-circle-left', 'pi-chevron-double-left']) {
      expect(isDirectionalIcon(icon)).toBe(false)
    }
  })
})
