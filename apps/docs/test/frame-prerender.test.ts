import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { exampleFrameRoutes } from '../plugins/content.ts'
import { walk, WEBKIT } from '../plugins/paths.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = (file: string) => readFileSync(resolve(HERE, '..', file), 'utf8')

test('every example has its own prerendered frame route', () => {
  const routes = exampleFrameRoutes()
  const files = walk(join(WEBKIT, 'examples'), (name) => name === 'examples.json').flatMap(
    (file) => (JSON.parse(readFileSync(file, 'utf8')) as { examples: unknown[] }).examples
  )
  assert.equal(routes.length, files.length)
  assert.ok(routes.includes('/frame/example/chart/default'))
  assert.ok(routes.every((route) => /^\/frame\/example\/[\w/-]+$/.test(route)))
  assert.match(source('vite.config.ts'), /\.\.\.exampleFrameRoutes\(\)/)
})

test('an example frame renders its example on the server and loads it before the route resolves', () => {
  const page = source('src/pages/example-frame-page.vue')
  const live = page.match(/const live = computed\(([\s\S]*?)\)\n/)?.[1] ?? ''
  assert.notEqual(live, '', 'the live example computed was not found')
  assert.doesNotMatch(live, /mounted/, 'the example must not wait for mount to render')
  assert.match(page, /:data-ready="mounted && live/)
  assert.match(page, /v-if="live && \(SSR \|\| mounted\)"/, 'the client mounts the example fresh')
  assert.match(page, /data-allow-mismatch="children"/)
  assert.match(source('src/lib/route-data.ts'), /route\.name === 'example-frame'/)
})
