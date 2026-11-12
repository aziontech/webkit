import './reflow.css'

import { cleanup, render } from '@testing-library/vue'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { commands, page, server } from 'vitest/browser'
import type { Component } from 'vue'
import { nextTick } from 'vue'

const modules = import.meta.glob<{ default: Component }>(
  '../../examples/{chart,donut-chart,gauge-chart,map-chart,spark-chart,bar-list,tracker,stat-tile}/*.vue'
)

// Screenshots each chart example with and without `forced-colors: active` (real CSS through
// reflow.css) and compares the inked pixels. Chromium keeps SVG fills, so line, area, bar, donut
// and map marks survive; marks painted with `background-color` (tracker blocks, bar-list fills,
// legend keys) are forced to Canvas and vanish unless they opt out with `forced-color-adjust:
// none`. A surface that only loses its tinted fill (an Alert) keeps its border and stays above the
// threshold; a vanished mark drops the ink to a tenth. The PNGs land in __screenshots__ for review.
// The ratio is calibrated on Chromium and asserted there only; other engines take the shots.
const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  for (let i = 0; i < 6; i += 1) await frame()
}

async function ink(element: HTMLElement, name: string): Promise<number> {
  const shot = await page.screenshot({
    element,
    base64: true,
    path: `__screenshots__/forced-colors/${name}.png`
  })
  const base64 = typeof shot === 'string' ? shot : shot.base64
  const bitmap = await createImageBitmap(
    await (await fetch(`data:image/png;base64,${base64}`)).blob()
  )
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const context = canvas.getContext('2d')!
  context.drawImage(bitmap, 0, 0)
  const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height)
  const [r0, g0, b0] = [data[0], data[1], data[2]]
  let count = 0
  for (let i = 0; i < data.length; i += 4) {
    const delta = Math.abs(data[i] - r0) + Math.abs(data[i + 1] - g0) + Math.abs(data[i + 2] - b0)
    if (delta > 60) count += 1
  }
  return count
}

const SETTLED =
  '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}'

describe('forced colors · chart marks (screenshots)', () => {
  beforeAll(() => {
    const style = document.createElement('style')
    style.dataset['forcedCharts'] = ''
    style.textContent = SETTLED
    document.head.appendChild(style)
    document.body.style.background = 'var(--bg-canvas)'
    document.body.style.color = 'var(--text-default)'
  })

  afterAll(async () => {
    await commands.emulateMedia({ forcedColors: null })
    document.head.querySelectorAll('style[data-forced-charts]').forEach((style) => style.remove())
    document.body.removeAttribute('style')
  })

  afterEach(() => cleanup())

  it.each(
    Object.keys(modules)
      .sort()
      .map((file) => [file.replace('../../examples/', '')])
  )('%s keeps its marks under forced-colors: active', async (file) => {
    const mod = await modules[`../../examples/${file}`]!()
    const host = document.createElement('div')
    host.style.width = '720px'
    host.style.padding = '16px'
    document.body.appendChild(host)
    render(mod.default, { container: host })
    await settle()
    const name = file.replace(/[/.]/g, '-')
    await commands.emulateMedia({ forcedColors: 'none' })
    await settle()
    const normal = await ink(host, `${name}-normal`)
    await commands.emulateMedia({ forcedColors: 'active' })
    await settle()
    const forced = await ink(host, `${name}-forced`)
    host.remove()
    if (normal < 100 || server.browser !== 'chromium') return
    expect(forced / normal, 'marks drawn with a background vanished').toBeGreaterThan(0.25)
  })
})
