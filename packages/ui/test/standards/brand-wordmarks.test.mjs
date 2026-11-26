import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (path) => readFileSync(resolve(PKG_ROOT, path), 'utf8')

const objectBody = (src, name) => {
  const start = src.indexOf(`export const ${name} = {`)
  assert.notEqual(start, -1, `registry.ts has no ${name}`)
  return src.slice(src.indexOf('{', start) + 1, src.indexOf('\n}', start))
}

const registry = read('src/assets/brands/registry.ts')
const wordmarks = [
  ...objectBody(registry, 'brandWordmarks').matchAll(/^\s*'?([a-z0-9-]+)'?:\s*'([^']+)'/gm)
].map(([, name, label]) => ({ name, label }))
const marks = [...objectBody(registry, 'brandMarks').matchAll(/^\s*'?([a-z0-9-]+)'?:/gm)].map(
  ([, name]) => name
)

test('every brand refused by its terms ships as a text wordmark', () => {
  const labels = wordmarks.map((w) => w.label)
  for (const label of [
    'Splunk',
    'Google BigQuery',
    'Amazon S3',
    'Amazon Kinesis',
    'Zoop',
    'G2 Leader',
    'G2 High Performer',
    'Rust',
    'Datadog'
  ]) {
    assert.ok(labels.includes(label), `${label} has no text wordmark`)
  }
})

test('a wordmark never shadows a mark with artwork', () => {
  for (const { name } of wordmarks) assert.ok(!marks.includes(name), `${name} is in both lists`)
})

test('SOURCES.md records each wordmark as pending the owner’s permission', () => {
  const sources = read('src/assets/logos/SOURCES.md')
  const section = sources.slice(sources.indexOf('## Text wordmarks'))
  assert.ok(section.startsWith('## Text wordmarks'), 'SOURCES.md has no "Text wordmarks" section')
  for (const { name } of wordmarks) assert.ok(section.includes(`\`${name}\``), `${name} missing`)
})
