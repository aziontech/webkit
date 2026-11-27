import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import { fontPreloadTags } from '../plugins/font-preload.ts'

test('preloads the Rubik latin face the first paint uses, by its built name', () => {
  const tags = fontPreloadTags(
    [
      '_app/index-a1b2c3d4.js',
      '_app/rubik-latin-ext-wght-normal-Zx9.woff2',
      '_app/rubik-latin-wght-normal-Q1w2E3.woff2'
    ],
    '/'
  )
  assert.equal(tags.length, 1)
  assert.deepEqual(tags[0]!.attrs, {
    rel: 'preload',
    href: '/_app/rubik-latin-wght-normal-Q1w2E3.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: ''
  })
})

test('adds nothing when the build has no such face', () => {
  assert.deepEqual(fontPreloadTags(['_app/index.js']), [])
})

test('the docs build registers the preload plugin', () => {
  const config = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8')
  assert.match(config, /fontPreloadPlugin\(\)/)
})
