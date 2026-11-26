import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REPO_ROOT = resolve(PKG_ROOT, '..', '..')
const catalog = JSON.parse(readFileSync(join(PKG_ROOT, 'catalog.json'), 'utf8'))

const pascal = (name) =>
  name
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('')

function markdown(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) markdown(path, out)
    else if (entry.name.endsWith('.md')) out.push(readFileSync(path, 'utf8'))
  }
  return out
}

const guidance = [
  ...markdown(join(REPO_ROOT, 'skills')),
  ...markdown(join(REPO_ROOT, 'rules')),
  readFileSync(join(REPO_ROOT, 'adapters', 'AGENTS_FRAGMENT.md'), 'utf8')
].join('\n')

test('every app component is named in a skill or rule, so agents are told when to use it', () => {
  const missing = Object.entries(catalog.imports)
    .filter(([, entry]) => entry.kind === 'component' && entry.surface === 'app')
    .map(([name]) => name)
    .filter(
      (name) =>
        !new RegExp(`\\b${pascal(name)}\\b`).test(guidance) &&
        !guidance.includes(`@aziontech/webkit/${name}`)
    )
  assert.deepEqual(
    missing,
    [],
    `No skill or rule names ${missing.map(pascal).join(', ')}. Add a row to the table of its family: ` +
      'skills/webkit-usage ("Pick the component for the job"), skills/webkit-form ("Pick the control ' +
      'from the kind of value"), skills/webkit-data-viz ("Pick the chart for the question") or ' +
      'skills/webkit-ai-surfaces ("One component per moment"). A component no skill names is a ' +
      'component agents do not use.'
  )
})

test('the always-on agent text tells agents to pick the component from the kind of value', () => {
  const fragment = readFileSync(join(REPO_ROOT, 'adapters', 'AGENTS_FRAGMENT.md'), 'utf8')
  for (const name of ['DatePicker', 'NumberInput', 'PhoneInput', 'Timestamp', 'CurrencyAmount']) {
    assert.match(fragment, new RegExp(`\`${name}\``), name)
  }
})
