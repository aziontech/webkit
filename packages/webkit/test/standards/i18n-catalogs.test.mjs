import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const MESSAGES = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/i18n/messages')

function leaves(catalog, prefix = '') {
  return Object.entries(catalog).flatMap(([key, value]) =>
    typeof value === 'string' ? [`${prefix}${key}`] : leaves(value, `${prefix}${key}.`)
  )
}

async function load(file) {
  const mod = await import(pathToFileURL(join(MESSAGES, file)).href)
  return mod.en ?? mod.ptBR ?? mod.es
}

const files = readdirSync(MESSAGES).filter((f) => f.endsWith('.ts'))

test('the built-in catalogs are en, pt-BR and es', () => {
  assert.deepEqual(files.sort(), ['en.ts', 'es.ts', 'pt-BR.ts'])
})

test('every locale has exactly the keys of en', async () => {
  const english = leaves(await load('en.ts')).sort()
  assert.ok(english.length > 0)
  for (const file of files.filter((f) => f !== 'en.ts')) {
    const keys = leaves(await load(file)).sort()
    const missing = english.filter((k) => !keys.includes(k))
    const extra = keys.filter((k) => !english.includes(k))
    assert.deepEqual({ file, missing, extra }, { file, missing: [], extra: [] })
  }
})

test('every message is non-empty and keeps the placeholders of its English source', async () => {
  const english = await load('en.ts')
  const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
  const lookup = (catalog, path) => path.split('.').reduce((node, key) => node?.[key], catalog)
  for (const file of files) {
    const catalog = await load(file)
    for (const key of leaves(english)) {
      const source = lookup(english, key)
      const text = lookup(catalog, key)
      assert.equal(typeof text, 'string', `${file} ${key}`)
      assert.ok(text.length > 0, `${file} ${key} is empty`)
      const sourceParams = placeholders(source).filter((p) => p !== 'count')
      assert.deepEqual(
        placeholders(text).filter((p) => p !== 'count'),
        sourceParams,
        `${file} ${key}`
      )
    }
  }
})
