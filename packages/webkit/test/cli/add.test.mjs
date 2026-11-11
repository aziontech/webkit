import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { checksum } from '../../src/cli/blocks.js'
import { cleanup, cli, cliJson, makeProject, PKG_ROOT } from './_helpers/cli-project.mjs'

const BLOCK = 'platform/create/create-hub'
const canonical = (file) => readFileSync(join(PKG_ROOT, 'blocks', BLOCK, file), 'utf8')

test('add copies the primary SFC into src/views and records it in the manifest', () => {
  const dir = makeProject()
  try {
    const r = cli(dir, 'add', BLOCK)
    assert.equal(r.code, 0, r.stderr)
    const copied = readFileSync(join(dir, 'src/views/CreateHub.vue'), 'utf8')
    assert.equal(copied, canonical('create-hub.vue'))
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    const entry = manifest.blocks[BLOCK]
    assert.equal(entry.version, JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'))).version)
    assert.deepEqual(entry.files, [
      {
        path: 'src/views/CreateHub.vue',
        source: `blocks/${BLOCK}/create-hub.vue`,
        variant: 'Default',
        checksum: checksum(copied)
      }
    ])
    assert.match(r.stdout, /component: \(\) => import\('\.\/views\/CreateHub\.vue'\)/)
    assert.match(r.stderr, /not installed in this project/)
  } finally {
    cleanup(dir)
  }
})

test('add resolves a short name, copies the chosen variant and the guidelines sidecar', () => {
  const dir = makeProject()
  try {
    const r = cli(dir, 'add', 'create-hub', '--variant', 'connected', '--with-guidelines')
    assert.equal(r.code, 0, r.stderr)
    assert.equal(
      readFileSync(join(dir, 'src/views/CreateHubConnected.vue'), 'utf8'),
      canonical('variants/connected.vue')
    )
    const guide = readFileSync(join(dir, 'src/views/CreateHub.guidelines.md'), 'utf8')
    assert.ok(!guide.startsWith('#'), 'the H1 heading is stripped')
    assert.ok(canonical('guidelines.md').endsWith(guide))
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    assert.deepEqual(
      manifest.blocks[BLOCK].files.map((f) => f.variant),
      ['Default', 'Connected']
    )
  } finally {
    cleanup(dir)
  }
})

test('add never overwrites without --force', () => {
  const dir = makeProject({ 'src/views/CreateHub.vue': 'mine\n' })
  try {
    const r = cli(dir, 'add', BLOCK)
    assert.equal(r.code, 1)
    assert.match(r.stderr, /already exists: pass --force/)
    assert.equal(readFileSync(join(dir, 'src/views/CreateHub.vue'), 'utf8'), 'mine\n')
    assert.ok(!existsSync(join(dir, 'webkit.blocks.json')))
    const forced = cli(dir, 'add', BLOCK, '--force')
    assert.equal(forced.code, 0, forced.stderr)
    assert.equal(
      readFileSync(join(dir, 'src/views/CreateHub.vue'), 'utf8'),
      canonical('create-hub.vue')
    )
  } finally {
    cleanup(dir)
  }
})

test('add --dry-run writes nothing; --dest and the router views dir pick the target', () => {
  const dir = makeProject({
    'src/router/index.ts': "import Home from '@/pages/Home.vue'\nexport default []\n",
    'vite.config.ts': "export default { resolve: { alias: { '@': '/src' } } }\n"
  })
  try {
    const dry = cliJson(dir, 'add', BLOCK, '--dry-run')
    assert.equal(dry.code, 0)
    assert.equal(dry.json.files[0].path, 'src/pages/CreateHub.vue')
    assert.equal(
      dry.json.route.entry,
      "{ path: '/create-hub', name: 'create-hub', component: () => import('@/pages/CreateHub.vue') }"
    )
    assert.deepEqual(dry.json.written, [])
    assert.ok(!existsSync(join(dir, 'src/pages/CreateHub.vue')))

    const dest = cli(dir, 'add', BLOCK, '--dest', 'src/screens/Hub.vue')
    assert.equal(dest.code, 0, dest.stderr)
    assert.ok(existsSync(join(dir, 'src/screens/Hub.vue')))
  } finally {
    cleanup(dir)
  }
})

test('add verifies every @aziontech/webkit import against the installed exports', () => {
  const dir = makeProject({}, { installWebkit: true })
  try {
    const r = cliJson(dir, 'add', BLOCK, '--dry-run')
    assert.equal(r.code, 0)
    assert.ok(r.json.imports.webkit.length > 3)
    assert.ok(r.json.imports.webkit.every((i) => i.ok))
    assert.deepEqual(r.json.imports.missing, [])
    assert.ok(!r.json.warnings.some((w) => /not installed in this project/.test(w)))
  } finally {
    cleanup(dir)
  }
})

test('add rejects an unknown block or variant with suggestions', () => {
  const dir = makeProject()
  try {
    const unknown = cli(dir, 'add', 'create-hubb')
    assert.equal(unknown.code, 1)
    assert.match(unknown.stderr, /No block "create-hubb"/)
    const variant = cli(dir, 'add', BLOCK, '--variant', 'Nope')
    assert.equal(variant.code, 1)
    assert.match(variant.stderr, /no variant "Nope"\. Variants: Default, Connected/)
  } finally {
    cleanup(dir)
  }
})
