import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')

const scopeOf = (file) => readFileSync(file, 'utf8').match(/^scope:\s*(\S+)/m)?.[1] ?? null

const skillFiles = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => join(dir, e.name, 'SKILL.md'))
        .filter((f) => existsSync(f))
    : []

test('every consumer skill at the repo root is scope: general', () => {
  const wrong = skillFiles(join(REPO, 'skills')).filter((f) => scopeOf(f) !== 'general')
  assert.deepEqual(
    wrong,
    [],
    'skills/ ships to projects; WebKit-development skills go in .claude/skills/'
  )
})

test('every contributor skill in .claude/skills is scope: webkit', () => {
  const wrong = skillFiles(join(REPO, '.claude/skills')).filter(
    (f) => scopeOf(f) !== null && scopeOf(f) !== 'webkit'
  )
  assert.deepEqual(wrong, [], '.claude/skills/ never ships; a general skill belongs in skills/')
})

test('the WebKit-development review gate stays out of the consumer bundle', () => {
  assert.equal(existsSync(join(REPO, 'skills/webkit-ui-craft')), false)
  assert.equal(existsSync(join(REPO, '.claude/skills/ui-craft/SKILL.md')), true)
})

test('development docs never ship in the npm package', () => {
  const shipped = readdirSync(join(REPO, 'packages/webkit/docs'))
  for (const dev of [
    'DOC_LINTS.md',
    'PROCESS.md',
    'GOVERNANCE_IMPLEMENTATION.md',
    'ESLINT_DEPENDENCIES_GUIDE.md'
  ]) {
    assert.equal(
      shipped.includes(dev),
      false,
      `${dev} is a contributor doc: keep it in .claude/docs/`
    )
  }
})
