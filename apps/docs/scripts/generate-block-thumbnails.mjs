import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

import { BLOCK_THUMBNAIL, blockThumbnailFile } from '../src/lib/block-thumbnails.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '../../..')
const BASELINES = join(ROOT, 'apps/visual/baselines/blocks')
const PUBLIC = resolve(HERE, '../public')
const CATALOG = join(ROOT, 'packages/webkit/catalog.json')

const SOURCE = { width: 1280, height: 800 }
const THEMES = ['light', 'dark']

function primaryShot(id, theme) {
  const dir = join(BASELINES, id)
  if (!existsSync(dir)) return null
  const pattern = new RegExp(`^([a-z0-9-]+)--${theme}-1280\\.png$`)
  const shots = readdirSync(dir).filter((name) => pattern.test(name))
  const pick = shots.find((name) => name.startsWith('default--')) ?? shots.sort()[0]
  return pick ? join(dir, pick) : null
}

const ids = Object.keys(JSON.parse(readFileSync(CATALOG, 'utf8')).blocks)
const browser = await chromium.launch()
const page = await browser.newPage()
const missing = []

for (const id of ids) {
  for (const theme of THEMES) {
    const shot = primaryShot(id, theme)
    if (!shot) {
      missing.push(`${id} (${theme})`)
      continue
    }
    const source = `data:image/png;base64,${readFileSync(shot).toString('base64')}`
    const webp = await page.evaluate(
      async ({ source, from, to }) => {
        const image = new Image()
        image.src = source
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = to.width
        canvas.height = to.height
        const context = canvas.getContext('2d')
        context.imageSmoothingQuality = 'high'
        context.drawImage(image, 0, 0, from.width, from.height, 0, 0, to.width, to.height)
        return canvas.toDataURL('image/webp', to.quality)
      },
      { source, from: SOURCE, to: BLOCK_THUMBNAIL }
    )
    const out = join(PUBLIC, blockThumbnailFile(id, theme))
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, Buffer.from(webp.split(',')[1], 'base64'))
  }
}

await browser.close()

if (missing.length) {
  console.error(`✖ no visual baseline for: ${missing.join(', ')}`)
  process.exit(1)
}
console.log(`✓ ${ids.length * THEMES.length} block thumbnails in ${PUBLIC}`)
