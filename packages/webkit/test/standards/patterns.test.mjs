import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { checkPatternMetadata, compareToBaseline } from '../../scripts/check-patterns.mjs'
import {
  importsOf,
  kebab,
  patternFromModule,
  patternIdFromTitle
} from '../../scripts/lib/patterns.mjs'

const catalog = JSON.parse(readFileSync(new URL('../../catalog.json', import.meta.url), 'utf-8'))

test('pattern ids come from the story title, kebab-cased, without "Templates/"', () => {
  assert.equal(patternIdFromTitle('Templates/Platform/Auth/SignIn'), 'platform/auth/sign-in')
  assert.equal(patternIdFromTitle('Templates/Headers/CreationHeader'), 'headers/creation-header')
  assert.equal(
    patternIdFromTitle('Templates/Platform/Creation/CreationHeader'),
    'platform/creation/creation-header'
  )
  assert.equal(kebab('SQLDatabase'), 'sql-database')
})

test('importsOf keeps only @aziontech/webkit imports with their bindings', () => {
  const sfc = [
    '<script setup>',
    "import Button from '@aziontech/webkit/button'",
    "import { ref } from 'vue'",
    "import FieldText from '@aziontech/webkit/field-text'",
    '</script>'
  ].join('\n')
  assert.deepEqual(importsOf(sfc), [
    { binding: 'Button', subpath: 'button' },
    { binding: 'FieldText', subpath: 'field-text' }
  ])
})

test('patternFromModule reads metadata from parameters.webkit and every export SFC', () => {
  const sfc = (tag) =>
    `<script setup>\nimport ${tag} from '@aziontech/webkit/${tag.toLowerCase()}'\n</script>\n<template>\n  <${tag} />\n</template>`
  const mod = {
    default: {
      title: 'Templates/Platform/Auth/SignIn',
      parameters: {
        docs: { description: { component: 'Sign in.' } },
        webkit: { intents: ['login'], skills: ['webkit-form'], steps: ['email', 'password'] }
      }
    },
    Email: { parameters: { docs: { source: { code: sfc('Button') } } } },
    Password: { parameters: { docs: { source: { code: sfc('Divider') } } } }
  }
  const { id, entry } = patternFromModule(mod, { file: '/r/a.stories.js', repoRoot: '/r' })
  assert.equal(id, 'platform/auth/sign-in')
  assert.deepEqual(entry.intents, ['login'])
  assert.deepEqual(entry.steps, ['email', 'password'])
  assert.deepEqual(entry.components, ['Button', 'Divider'])
  assert.equal(entry.primary, 'Email')
  assert.equal(entry.variants.length, 1)
  assert.equal('status' in entry, false)
})

test('checkPatternMetadata reports a story without a pattern, empty intents and unknown skills', () => {
  const patterns = {
    'platform/x': { story: 'apps/x.stories.js', intents: [], skills: ['no-such-skill'] }
  }
  const { errors, warnings } = checkPatternMetadata(patterns, ['/r/apps/y.stories.js'], {
    repoRoot: '/r'
  })
  assert.equal(errors.length, 2)
  assert.match(errors[0], /no entry/)
  assert.match(errors[1], /no-such-skill/)
  assert.equal(warnings.length, 1)
})

test('compareToBaseline only reports counts above the baseline', () => {
  const counts = { a: { 'webkit/no-style-override': 3 }, b: { 'webkit/no-style-override': 1 } }
  const baseline = { a: { 'webkit/no-style-override': 3 } }
  assert.deepEqual(compareToBaseline(counts, baseline), [
    { id: 'b', rule: 'webkit/no-style-override', count: 1, allowed: 0 }
  ])
})

test('the catalog carries one pattern per story in headers, shells and platform', () => {
  const ids = Object.keys(catalog.patterns)
  assert.ok(ids.length >= 58)
  assert.ok(ids.every((id) => /^(headers|shells|platform)\//.test(id)))
  for (const p of Object.values(catalog.patterns)) {
    assert.ok(p.sfc.includes('<template>'))
    assert.equal('status' in p, false)
  }
})
