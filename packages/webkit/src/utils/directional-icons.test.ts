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
    expect(isDirectionalIcon('ai ai-chevron-right')).toBe(true)
    expect(isDirectionalIcon('ai ai-arrow-left')).toBe(true)
    expect(isDirectionalIcon('ai ai-sign-out')).toBe(true)
    for (const icon of [
      'ai ai-external-link',
      'ai ai-arrow-up-right',
      'ai ai-play',
      'ai ai-github',
      'ai ai-chevron-down',
      '',
      undefined
    ]) {
      expect(isDirectionalIcon(icon)).toBe(false)
    }
    expect(directionalIconClass('ai ai-angle-left')).toBe(MIRROR_CLASS)
    expect(directionalIconClass('ai ai-box')).toBe('')
  })

  it('keeps the stylesheet rule in sync with the list', () => {
    const selectors = [...styles.matchAll(/\.(ai-[a-z0-9-]+)/g)].map((m) => m[1])
    expect(new Set(selectors)).toEqual(new Set(DIRECTIONAL_ICONS))
  })

  it('matches exactly the listed icons', () => {
    for (const icon of DIRECTIONAL_ICONS) {
      expect(isDirectionalIcon(`ai ${icon}`)).toBe(true)
      expect(isDirectionalIcon(`${icon}-x`)).toBe(false)
      expect(isDirectionalIcon(`x${icon}`)).toBe(false)
    }
    for (const icon of [
      'ai-arrow-up-left',
      'ai-arrow-circle-up',
      'pi-chevron-left',
      'ai-chevron-double-left'
    ]) {
      expect(isDirectionalIcon(icon)).toBe(false)
    }
  })
})
