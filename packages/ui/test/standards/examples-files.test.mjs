import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const EXAMPLES = resolve(dirname(fileURLToPath(import.meta.url)), '../../examples')

const groups = readdirSync(EXAMPLES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(EXAMPLES, entry.name, 'examples.json')))
  .map((entry) => entry.name)

const read = (group) => JSON.parse(readFileSync(join(EXAMPLES, group, 'examples.json'), 'utf8'))

test('every file and site JSON an examples.json lists exists in its folder', () => {
  const missing = []
  for (const group of groups) {
    const data = read(group)
    for (const entry of [...(data.examples ?? []), ...(data.site ?? [])]) {
      for (const key of ['file', 'json']) {
        if (entry[key] && !existsSync(join(EXAMPLES, group, entry[key]))) {
          missing.push(`${group}/${entry[key]}`)
        }
      }
    }
  }
  assert.deepEqual(missing, [])
})

test('a site entry imports the component its examples folder documents', () => {
  const foreign = []
  for (const group of groups) {
    for (const entry of read(group).site ?? []) {
      const source = readFileSync(join(EXAMPLES, group, entry.file), 'utf8')
      if (!source.includes(`'@aziontech/ui/${group}'`)) foreign.push(`${group}/${entry.file}`)
      if (!entry.json) continue
      const json = JSON.parse(readFileSync(join(EXAMPLES, group, entry.json), 'utf8'))
      const ids = [json, ...(Array.isArray(json.sections) ? json.sections : [])]
        .map((section) => section?._id)
        .filter(Boolean)
      if (ids.length && !ids.includes(group)) foreign.push(`${group}/${entry.json}`)
    }
  }
  assert.deepEqual(foreign, [])
})
