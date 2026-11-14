import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const css = readFileSync(resolve(ROOT, 'packages/theme/dist/v4/globals.css'), 'utf8')
const readme = readFileSync(resolve(ROOT, 'packages/theme/README.md'), 'utf8')

const shipped = [...css.matchAll(/^\s*(--[\w-]+):/gm)].map((match) => match[1])
const deprecated = [...new Set(shipped)].filter((name) =>
  /^--(surface-\d+|height-\d+|width-\w+|z-input-popup)$/.test(name)
)

test('the deprecated variables still ship, so 5.x consumers keep working', () => {
  assert.equal(deprecated.filter((n) => n.startsWith('--surface-')).length, 18)
  assert.equal(deprecated.filter((n) => n.startsWith('--height-')).length, 28)
  assert.equal(deprecated.filter((n) => n.startsWith('--width-')).length, 13)
  assert.ok(deprecated.includes('--z-input-popup'))
})

test('the README lists every deprecated variable family with its replacement', () => {
  const section = readme.split('### Deprecated variables')[1]?.split('\n## ')[0] ?? ''
  for (const family of ['--surface-0', '--height-2', '--width-3xs', '--z-input-popup']) {
    assert.ok(section.includes(`\`${family}\``), `${family} is missing from the README`)
  }
})

test('nothing in WebKit reads a deprecated variable', () => {
  const files = execFileSync(
    'git',
    [
      'ls-files',
      'packages/webkit/src',
      'packages/webkit/blocks',
      'packages/webkit/examples',
      'apps',
      'skills',
      'rules'
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  )
    .split('\n')
    .filter((file) => /\.(vue|ts|js|mjs|css|md|json)$/.test(file))
  const pattern = new RegExp(`(${deprecated.join('|')})(?![\\w-])`)
  const readers = files.filter((file) => pattern.test(readFileSync(resolve(ROOT, file), 'utf8')))
  assert.deepEqual(readers, [])
})
