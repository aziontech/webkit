import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { COMPONENT_TERMS } from '../../src/catalog/lexicon/component-terms.js'

const catalog = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf-8'))

// Found by their own plain name, which is already what people type.
const NAME_IS_THE_TERM = new Set(['input', 'brand'])

const appComponents = Object.entries(catalog.imports)
  .filter(([, entry]) => entry.kind === 'component' && entry.surface === 'app')
  .map(([name]) => name)

test('every app component has search terms, so a plain request finds it', () => {
  const missing = appComponents.filter(
    (name) => !NAME_IS_THE_TERM.has(name) && !(COMPONENT_TERMS[name]?.length > 0)
  )
  assert.deepEqual(
    missing,
    [],
    `src/catalog/lexicon/component-terms.js, COMPONENT_TERMS: add the words people type for ${missing.join(', ')} ` +
      '(what it is called elsewhere, the kind of value or job it handles). ' +
      'A component with no terms is found only by its exact name.'
  )
})

test('every term key is a real export and no term belongs to two components', () => {
  const owners = new Map()
  const problems = []
  for (const [name, terms] of Object.entries(COMPONENT_TERMS)) {
    if (!catalog.imports[name]) problems.push(`${name} is not an export`)
    for (const term of terms) {
      const key = term.toLowerCase()
      if (owners.has(key)) problems.push(`"${term}" is listed for ${owners.get(key)} and ${name}`)
      else owners.set(key, name)
    }
  }
  assert.deepEqual(problems, [])
})
