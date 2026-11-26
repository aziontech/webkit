import { afterEach, describe, expect, it } from 'vitest'

import { useAnnouncer } from './use-announcer'

const regions = () => document.querySelectorAll<HTMLElement>('[data-azion-announcer]')

afterEach(() => {
  regions().forEach((region) => region.remove())
})

describe('useAnnouncer', () => {
  it('creates no live region until something is announced', () => {
    useAnnouncer()
    expect(regions()).toHaveLength(0)
  })

  it('speaks through one polite, atomic status region on the body', () => {
    useAnnouncer().announce('Saving')
    const [region] = regions()
    expect(region.parentElement).toBe(document.body)
    expect(region.getAttribute('role')).toBe('status')
    expect(region.getAttribute('aria-live')).toBe('polite')
    expect(region.getAttribute('aria-atomic')).toBe('true')
    expect(region.textContent).toBe('Saving')
  })

  it('shares the region between callers and keeps only the latest message', () => {
    useAnnouncer().announce('Saving')
    useAnnouncer().announce('Saved')
    expect(regions()).toHaveLength(1)
    expect(regions()[0].textContent).toBe('Saved')
  })

  it('inserts a new node for a repeated message, so it is spoken again', () => {
    const { announce } = useAnnouncer()
    announce('Loading')
    const first = regions()[0].firstElementChild
    announce('Loading')
    expect(regions()[0].firstElementChild).not.toBe(first)
    expect(regions()[0].textContent).toBe('Loading')
  })

  it('ignores an empty message', () => {
    useAnnouncer().announce('')
    expect(regions()).toHaveLength(0)
  })

  it('takes the region out of the layout without hiding it from assistive technology', () => {
    useAnnouncer().announce('Saving')
    const style = getComputedStyle(regions()[0])
    expect(style.position).toBe('absolute')
    expect(style.overflow).toBe('hidden')
    expect(style.display).not.toBe('none')
    expect(style.visibility).toBe('visible')
  })
})
