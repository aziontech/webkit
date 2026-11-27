import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { localePath, localizedRoutes, splitLocalePath } from '../src/lib/locale-path.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = (file: string) => readFileSync(resolve(HERE, '..', file), 'utf8')

test('a locale prefix splits off the path and joins back on', () => {
  assert.deepEqual(splitLocalePath('/pt-BR/components/button'), {
    locale: 'pt-BR',
    path: '/components/button'
  })
  assert.deepEqual(splitLocalePath('/es'), { locale: 'es', path: '/' })
  assert.deepEqual(splitLocalePath('/esm/x'), { locale: null, path: '/esm/x' })
  assert.equal(localePath('/components/button', 'es'), '/es/components/button')
  assert.equal(localePath('/pt-BR/blocks', 'en'), '/blocks')
  assert.equal(localePath('/', 'pt-BR'), '/pt-BR')
})

test('every docs page is prerendered in each language, frames and the 404 page once', () => {
  const routes = localizedRoutes([
    '/',
    '/components/button',
    '/frame/example/chart/default',
    '/404'
  ])
  assert.deepEqual(routes, ['/pt-BR', '/es', '/pt-BR/components/button', '/es/components/button'])
  assert.match(source('vite.config.ts'), /localizedRoutes\(/)
})

test('a saved language is honoured before the first paint, by its own prerendered page', () => {
  const html = source('index.html')
  assert.match(html, /azion-ui-docs:locale/)
  assert.match(html, /location\.replace\(/)
  assert.match(source('src/main.ts'), /splitLocalePath\(/)
})
