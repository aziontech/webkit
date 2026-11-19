import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { blocks, DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem } from './lib'
import { findGraphicsOnTexture } from './texture-backdrop'

const WIDTHS = [390, 1280]

const EXAMPLES = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../packages/webkit/examples'
)

const TEXTURED = /Texture|Backdrop|Section|SitePage|Hero\b|MediaSplit|MediaTabs|MediaScroll|_id/

const source = (dir: string, file: string) => {
  const vue = readFileSync(join(EXAMPLES, dir, file), 'utf8')
  const json = [...vue.matchAll(/from '\.\/([\w-]+\.json)'/g)].map((match) =>
    readFileSync(join(EXAMPLES, dir, match[1]), 'utf8')
  )
  return [vue, ...json].join('\n')
}

async function expectNoGraphicOnTexture(page: Page) {
  const found = await page.evaluate(findGraphicsOnTexture)
  expect(
    found.map((hit) => `${hit.graphic} on ${hit.texture} (${hit.area}px²)`),
    'a chart, diagram, map or stat lies on a texture: a texture is a backdrop for text only (.claude/rules/styling.md)'
  ).toEqual([])
}

for (const group of exampleGroups()) {
  for (const example of group.examples) {
    if (!TEXTURED.test(source(group.dir, example.file))) continue
    for (const width of WIDTHS) {
      const mode: Mode = { theme: 'light', width }
      test(`texture backdrop example ${group.dir}/${stem(example.file)} ${label(mode)}`, async ({
        page
      }) => {
        await prepare(page, mode)
        await page.goto(`${DOCS}/frame/example/${group.dir}/${stem(example.file)}${query(mode)}`)
        await page.locator('[data-example][data-ready]').waitFor()
        await settle(page)
        await expectNoGraphicOnTexture(page)
      })
    }
  }
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`texture backdrop block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/block/${block.id}/${state.slug}${query(mode)}`)
      await settle(page)
      await expectNoGraphicOnTexture(page)
    })
  }
}

test('texture backdrop detector sees a chart drawn on a texture', async ({ page }) => {
  const mode: Mode = { theme: 'light', width: 1280 }
  await prepare(page, mode)
  await page.goto(`${DOCS}/frame/example/chart/page-entry${query(mode)}`)
  await page.locator('[data-example][data-ready]').waitFor()
  await settle(page)
  await page.evaluate(() => {
    const graphic = document.querySelector('[data-plain-ground]')
    const layer = document.createElement('div')
    layer.setAttribute('data-slot', 'texture')
    layer.setAttribute('data-variant', 'pixelate')
    layer.style.cssText = 'position:absolute;inset:0'
    graphic?.parentElement?.prepend(layer)
  })
  const found = await page.evaluate(findGraphicsOnTexture)
  expect(found.map((hit) => hit.graphic)).toContain('chart')
})

for (const width of WIDTHS) {
  const mode: Mode = { theme: 'light', width }
  test(`texture backdrop hero keeps its dots off a diagram in the bottom window ${label(mode)}`, async ({
    page
  }) => {
    await prepare(page, mode)
    await page.goto(`${DOCS}/frame/example/hero-section/site-scene${query(mode)}`)
    await page.locator('[data-example][data-ready]').waitFor()
    await settle(page)
    const marked = await page.evaluate(() => {
      const scene = document.querySelector('[data-slot="hero-bottom"] .flex')
      scene?.setAttribute('data-plain-ground', '')
      return scene !== null
    })
    expect(marked).toBe(true)
    await expectNoGraphicOnTexture(page)
    const behindTitle = await page.evaluate(() => {
      const title = document.querySelector('h1')!.getBoundingClientRect()
      return [...document.querySelectorAll('[data-slot="texture"]')].some((texture) => {
        const layer = texture.getBoundingClientRect()
        return texture.checkVisibility() && layer.top < title.bottom && layer.bottom > title.top
      })
    })
    expect(behindTitle).toBe(true)
  })
}
