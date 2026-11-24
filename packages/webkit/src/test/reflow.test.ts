import './reflow.css'

import { describe, expect, it } from 'vitest'

import { defineReflowSuites, modules, mountInBox, SCROLLS_BY_DESIGN } from './reflow-harness'

describe('reflow harness', () => {
  it('compiles the theme and the container variants', async () => {
    const host = await mountInBox(
      {
        template:
          '<div class="@container/probe flex"><span class="hidden @3xs/probe:block">wide</span></div>'
      },
      320
    )
    const box = host.firstElementChild as HTMLElement
    expect(getComputedStyle(box).display).toBe('flex')
    expect(getComputedStyle(box).containerType).toBe('inline-size')
    expect(getComputedStyle(box.firstElementChild as HTMLElement).display).toBe('block')
  })

  it('doubles the root font size for the zoom case', async () => {
    document.documentElement.style.fontSize = '200%'
    const host = await mountInBox({ template: '<p class="text-body-md">x</p>' }, 640)
    const doubled = parseFloat(getComputedStyle(document.documentElement).fontSize)
    document.documentElement.style.fontSize = ''
    expect(doubled).toBe(32)
    expect(host.firstElementChild).toBeTruthy()
  })

  it('keeps the allowlist short and pointed at real files', () => {
    const files = Object.keys(modules).map((file) => file.replace('../../', ''))
    for (const file of Object.keys(SCROLLS_BY_DESIGN)) expect(files).toContain(file)
    expect(Object.keys(SCROLLS_BY_DESIGN).length).toBeLessThanOrEqual(5)
  })
})

defineReflowSuites([320, 768])
