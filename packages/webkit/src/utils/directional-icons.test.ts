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
    expect(isDirectionalIcon('az az-chevron-right')).toBe(true)
    expect(isDirectionalIcon('az az-arrow-left')).toBe(true)
    expect(isDirectionalIcon('az az-log-out')).toBe(true)
    for (const icon of [
      'az az-external-link',
      'az az-arrow-up-right',
      'az az-play',
      'az az-github',
      'az az-chevron-down',
      '',
      undefined
    ]) {
      expect(isDirectionalIcon(icon)).toBe(false)
    }
    expect(directionalIconClass('az az-chevron-left')).toBe(MIRROR_CLASS)
    expect(directionalIconClass('az az-box')).toBe('')
  })

  it('keeps the stylesheet rule in sync with the list', () => {
    const selectors = [...styles.matchAll(/\.(az-[a-z0-9-]+)/g)].map((m) => m[1])
    expect(new Set(selectors)).toEqual(new Set(DIRECTIONAL_ICONS))
  })

  it('matches exactly the listed icons', () => {
    for (const icon of DIRECTIONAL_ICONS) {
      expect(isDirectionalIcon(`ai ${icon}`)).toBe(true)
      expect(isDirectionalIcon(`${icon}-x`)).toBe(false)
      expect(isDirectionalIcon(`x${icon}`)).toBe(false)
    }
    for (const icon of [
      'az-arrow-up-left',
      'az-circle-arrow-up',
      'pi-chevron-left',
      'ai-chevron-double-left',
      'ai-angle-left',
      'ai-sign-in',
      'az-circle-chevron-up'
    ]) {
      expect(isDirectionalIcon(icon)).toBe(false)
    }
  })
})
