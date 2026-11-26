import './reflow.css'

import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

import AppLayoutDefault from '../../examples/app-layout/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

let host: HTMLDivElement | null = null

afterEach(() => {
  host?.remove()
  host = null
})

async function paintServerHtml(width: number) {
  const html = await renderToString(createSSRApp(AppLayoutDefault))
  host = document.createElement('div')
  host.style.width = `${width}px`
  host.style.height = '700px'
  host.innerHTML = html
  document.body.append(host)
  await frame()
  await frame()
  const navigation = host.querySelector<HTMLElement>('[data-testid$="__navigation"]')
  expect(navigation, 'the server HTML renders the navigation rail').not.toBeNull()
  return navigation as HTMLElement
}

describe('AppLayout server HTML before the script runs', () => {
  it('does not paint the navigation rail in a phone-wide host', async () => {
    const navigation = await paintServerHtml(390)
    expect(getComputedStyle(navigation).display).toBe('none')
  })

  it('paints the navigation rail in a desktop-wide host', async () => {
    const navigation = await paintServerHtml(1024)
    expect(getComputedStyle(navigation).display).not.toBe('none')
    expect(navigation.getBoundingClientRect().width).toBeGreaterThan(0)
  })
})
