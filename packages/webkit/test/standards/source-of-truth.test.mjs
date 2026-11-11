import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function files(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) files(p, out)
    else if (/\.(m?js|ts|vue|json)$/.test(name)) out.push(p)
  }
  return out
}

test('nothing in the package reads or imports from apps/ (Storybook is not a source of truth)', () => {
  const offenders = ['src', 'scripts', 'blocks', 'examples']
    .flatMap((d) => files(join(PKG, d)))
    // check-authoring lints the Storybook sources and gates runs the block-stories check, both
    // as repository governance; neither feeds an artifact.
    .filter((f) => !/scripts\/(check-authoring|gates)\.mjs$/.test(f))
    .filter((f) => /apps\/storybook|stories\/(templates|components)/.test(readFileSync(f, 'utf8')))
    .map((f) => relative(PKG, f))
  assert.deepEqual(offenders, [])
})
