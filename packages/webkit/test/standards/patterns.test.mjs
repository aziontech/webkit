import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { checkPatternMetadata, compareToBaseline } from '../../scripts/check-patterns.mjs'
import { readBlocks, readExamples } from '../../scripts/lib/blocks.mjs'
import { importsOf, kebab, patternIdFromTitle } from '../../scripts/lib/patterns.mjs'

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

test('readBlocks builds a pattern from block.json, the primary SFC and every variant file', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'blocks-'))
  try {
    const dir = join(pkg, 'blocks/platform/auth/sign-in')
    mkdirSync(join(dir, 'variants'), { recursive: true })
    const sfc = (tag) =>
      `<script setup>\nimport ${tag} from '@aziontech/webkit/${tag.toLowerCase()}'\n</script>\n<template>\n  <${tag} />\n</template>\n`
    writeFileSync(join(dir, 'sign-in.vue'), sfc('Button'))
    writeFileSync(join(dir, 'variants/password.vue'), sfc('Divider'))
    writeFileSync(
      join(dir, 'block.json'),
      JSON.stringify({
        id: 'platform/auth/sign-in',
        name: 'SignIn',
        title: 'Templates/Platform/Auth/SignIn',
        summary: 'Sign in.',
        intents: ['login'],
        skills: ['webkit-form'],
        steps: ['email', 'password'],
        primary: { name: 'Email', file: 'sign-in.vue' },
        variants: [{ name: 'Password', summary: '', file: 'variants/password.vue' }]
      })
    )
    const entry = readBlocks(pkg)['platform/auth/sign-in']
    assert.equal(entry.source, 'blocks/platform/auth/sign-in/sign-in.vue')
    assert.equal(entry.surface, 'product')
    assert.deepEqual(entry.intents, ['login'])
    assert.deepEqual(entry.steps, ['email', 'password'])
    assert.deepEqual(entry.components, ['Button', 'Divider'])
    assert.equal(entry.primary, 'Email')
    assert.equal(entry.sfc.endsWith('</template>'), true)
    assert.equal(entry.variants.length, 1)
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('readBlocks rejects a block whose id does not match its folder', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'blocks-'))
  try {
    mkdirSync(join(pkg, 'blocks/a'), { recursive: true })
    writeFileSync(join(pkg, 'blocks/a/a.vue'), '<template><div /></template>')
    writeFileSync(
      join(pkg, 'blocks/a/block.json'),
      JSON.stringify({ id: 'b', primary: { name: 'A', file: 'a.vue' } })
    )
    assert.throws(() => readBlocks(pkg), /does not match its folder/)
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('readExamples keeps the first examples under the size cap, only for real exports', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'examples-'))
  try {
    const dir = join(pkg, 'examples/button')
    mkdirSync(dir, { recursive: true })
    const names = ['default', 'huge', 'types', 'sizes', 'icons']
    for (const n of names)
      writeFileSync(
        join(dir, `${n}.vue`),
        n === 'huge' ? 'x'.repeat(9000) : `<template>${n}</template>\n`
      )
    writeFileSync(
      join(dir, 'examples.json'),
      JSON.stringify({ examples: names.map((n) => ({ name: n, file: `${n}.vue` })) })
    )
    mkdirSync(join(pkg, 'examples/not-exported'))
    const out = readExamples(pkg, new Set(['button']))
    assert.deepEqual(Object.keys(out), ['button'])
    assert.deepEqual(
      out.button.map((e) => e.name),
      ['default', 'types', 'sizes']
    )
  } finally {
    rmSync(pkg, { recursive: true, force: true })
  }
})

test('checkPatternMetadata reports a block without a pattern, empty intents and unknown skills', () => {
  const patterns = {
    'platform/x': { source: 'blocks/platform/x/x.vue', intents: [], skills: ['no-such-skill'] }
  }
  const { errors, warnings } = checkPatternMetadata(patterns, ['platform/y'])
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

test('the catalog carries one pattern per block in headers, shells and platform', () => {
  const ids = Object.keys(catalog.patterns)
  assert.ok(ids.length >= 58)
  assert.ok(ids.every((id) => /^(headers|shells|platform)\//.test(id)))
  for (const p of Object.values(catalog.patterns)) {
    assert.ok(p.sfc.includes('<template>'))
    assert.match(p.source, /^blocks\//)
    assert.equal('status' in p, false)
  }
})
