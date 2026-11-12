// A component's own typings decide whether the obvious consumer usage type-checks. Each fixture
// under fixtures/ is a consumer SFC: it uses a component the documented way and reads typed
// values, and it carries @vue-expect-error probes on misuse, so a typing that widens back to
// unknown or any fails here as an unused directive.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { consumerTypeErrors } from './consumer-app.mjs'

const FIXTURES = fileURLToPath(new URL('./fixtures/', import.meta.url))
const fixtures = readdirSync(FIXTURES).filter((name) => name.endsWith('.vue'))

test('every component typing fixture type-checks in a fresh create-vue app', () => {
  assert.ok(fixtures.length > 0, 'expected fixtures')
  const errors = consumerTypeErrors(fixtures.map((name) => `${FIXTURES}${name}`))
  assert.deepEqual(errors, [], `${errors.length} type error(s):\n${errors.join('\n')}`)
})
