import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

import { readCatalog, SPECS, AZION_UI } from '../plugins/paths.ts'

type ExampleFile = { component: string; examples: { name: string; summary?: string }[] }

const EXAMPLES = join(AZION_UI, 'examples')
const catalog = readCatalog()

const files = readdirSync(EXAMPLES)
  .map((dir) => join(EXAMPLES, dir, 'examples.json'))
  .filter((file) => existsSync(file))
  .map((file) => ({ file, data: JSON.parse(readFileSync(file, 'utf8')) as ExampleFile }))

const summaries = files.flatMap(({ file, data }) =>
  data.examples.map((example) => ({
    where: `${file.slice(EXAMPLES.length + 1)} ${example.name}`,
    component: data.component,
    summary: example.summary ?? ''
  }))
)

type Entry = { props?: { name: string }[]; models?: string[] }

function specProps(component: string): string[] {
  const file = join(SPECS, `${component}.md`)
  if (!existsSync(file)) return []
  return [...readFileSync(file, 'utf8').matchAll(/`:?([a-zA-Z-]+)\??(?::[^`]*)?`/g)].map(
    (match) => match[1] ?? ''
  )
}

function propNames(component: string): Set<string> {
  const entry = catalog.imports[component] as Entry | undefined
  const names = [
    ...(entry?.props ?? []).map((prop) => prop.name),
    ...(entry?.models ?? []),
    ...specProps(component)
  ]
  return new Set(
    names.flatMap((name) => [name, name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)])
  )
}

test('no example summary sends the reader to a Storybook panel the docs site does not have', () => {
  const stale = /\b(Controls|Actions) panel\b|Storybook|\bCanvas tab\b|\bDocs tab\b/
  assert.deepEqual(
    summaries.filter((entry) => stale.test(entry.summary)).map((entry) => entry.where),
    []
  )
})

test('a prop an example summary names is a prop of that component', () => {
  const named = /`:?([a-z][a-zA-Z-]*)` prop\b|\bset `:?([a-z][a-zA-Z-]*)` to\b/g
  const wrong = summaries.flatMap((entry) => {
    if (!catalog.imports[entry.component]) return []
    const props = propNames(entry.component)
    return [...entry.summary.matchAll(named)]
      .map((match) => match[1] ?? match[2] ?? '')
      .filter((name) => !props.has(name))
      .map((name) => `${entry.where}: \`${name}\``)
  })
  assert.deepEqual(wrong, [])
})
