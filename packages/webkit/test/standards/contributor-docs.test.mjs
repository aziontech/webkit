import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const agents = readFileSync(join(ROOT, 'contributing/AGENTS.md'), 'utf8')
const WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve'
]

test('contributing/AGENTS.md states the Node version of .nvmrc and engines.node', () => {
  const nvmrc = readFileSync(join(ROOT, '.nvmrc'), 'utf8').trim()
  const engines = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).engines.node
  assert.equal(engines, `>=${nvmrc}`)
  assert.match(agents, new RegExp(`Node\\.js: \`>= ${nvmrc}\``))
})

test('contributing/AGENTS.md counts and lists every hook', () => {
  const hooks = readdirSync(join(ROOT, 'contributing/hooks')).filter((file) => file.endsWith('.mjs'))
  const word = WORDS[hooks.length]
  assert.match(
    agents,
    new RegExp(`${word[0].toUpperCase()}${word.slice(1)} hooks in`),
    `${hooks.length} hooks`
  )
  for (const hook of hooks) assert.ok(agents.includes(`contributing/hooks/${hook}`), hook)
})

test('contributing/AGENTS.md names only part words the components have', () => {
  for (const retired of ['Portal + Overlay', 'Card composto', 'Sheet/Drawer'])
    assert.ok(!agents.includes(retired), retired)
})
