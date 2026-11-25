import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = (file: string) => readFileSync(resolve(HERE, '../src', file), 'utf8')

test('a saved language or theme is applied only after the shell has hydrated', () => {
  const app = source('app.vue')
  const mounted = /onMounted\(\(\) => \{([\s\S]*?)\n {2}\}\)/.exec(app)?.[1] ?? ''
  assert.match(
    mounted,
    /route\.meta\.bare === true\) restore\(\)/,
    'only a frame restores on mount'
  )
  assert.match(
    app,
    /<DocsShell[^>]*@hydrated="restore"/,
    'the shell does not hand over the restore'
  )
  const shell = source('components/docs-shell.vue')
  assert.match(shell, /emit\('hydrated'\)/, 'the shell never reports that it has hydrated')
})
