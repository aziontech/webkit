import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '../..')
const registry = readFileSync(join(PKG, 'src/assets/logos/clients/registry.ts'), 'utf-8')
const exportsMap = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf-8')).exports
const siteAssets = JSON.parse(readFileSync(join(PKG, 'src/assets/site-assets.json'), 'utf-8'))
const photos = [...registry.matchAll(/from '\.\/photos\/([\w-]+)\.(\w+)'/g)]

test('components load every client photograph as WebP', () => {
  assert.ok(photos.length > 0)
  for (const [, name, ext] of photos) assert.equal(ext, 'webp', `${name} is imported as .${ext}`)
})

test('each photograph is exported and mapped for page JSON as WebP, and stays light', () => {
  for (const [, name] of photos) {
    const webp = exportsMap[`./assets/${name}.webp`]
    assert.ok(webp, `no ./assets/${name}.webp export`)
    assert.equal(exportsMap[`./assets/${name}.jpg`], undefined)
    assert.ok(Object.values(siteAssets).includes(`@aziontech/webkit/assets/${name}.webp`))
    assert.ok(statSync(join(PKG, webp)).size < 50 * 1024, `${name}.webp is over 50 KB`)
  }
})
