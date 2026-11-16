import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { cleanup, cli, cliJson, makeProject } from './lib/cli-project.mjs'

const BLOCK = 'create/create-hub'
const manifestOf = (dir) => JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))

test('remove deletes every file of a copied block, its guidelines and its manifest entry', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK, '--variant', 'connected', '--with-guidelines').code, 0)
    const copied = [
      'src/views/create-hub.vue',
      'src/views/create-hub.sample.ts',
      'src/views/create-hub-connected.vue',
      'src/views/create-hub.guidelines.md'
    ]
    for (const path of copied) assert.ok(existsSync(join(dir, path)), path)
    writeFileSync(join(dir, 'src/views/create-hub.vue'), '<template><p>edited</p></template>\n')

    const r = cli(dir, 'remove', 'create-hub')
    assert.equal(r.code, 0, r.stderr)
    for (const path of copied) assert.ok(!existsSync(join(dir, path)), `${path} is left`)
    assert.equal(manifestOf(dir).blocks[BLOCK], undefined)
    assert.match(r.stdout, /deleted src\/views\/create-hub\.vue/)
  } finally {
    cleanup(dir)
  }
})

test('remove --dry-run deletes nothing and lists what it would delete', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK).code, 0)
    const before = readFileSync(join(dir, 'webkit.blocks.json'), 'utf8')
    const r = cli(dir, 'remove', BLOCK, '--dry-run')
    assert.equal(r.code, 0, r.stderr)
    assert.match(r.stdout, /would delete src\/views\/create-hub\.vue/)
    assert.match(r.stdout, /Dry run/)
    assert.ok(existsSync(join(dir, 'src/views/create-hub.vue')))
    assert.equal(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'), before)
  } finally {
    cleanup(dir)
  }
})

test('remove by path drops one file and keeps the rest of the block', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK, '--variant', 'connected').code, 0)
    const r = cli(dir, 'remove', 'src/views/create-hub-connected.vue')
    assert.equal(r.code, 0, r.stderr)
    assert.ok(!existsSync(join(dir, 'src/views/create-hub-connected.vue')))
    assert.ok(existsSync(join(dir, 'src/views/create-hub.vue')))
    const paths = manifestOf(dir).blocks[BLOCK].files.map((file) => file.path)
    assert.deepEqual(paths, ['src/views/create-hub.sample.ts', 'src/views/create-hub.vue'])
  } finally {
    cleanup(dir)
  }
})

test('remove names the app files that still import the block', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK).code, 0)
    writeFileSync(
      join(dir, 'src/router.ts'),
      "export const routes = [{ path: '/create', component: () => import('./views/create-hub.vue') }]\n"
    )
    const { json } = cliJson(dir, 'remove', BLOCK)
    assert.deepEqual(json.importers, [{ file: 'src/router.ts', imports: './views/create-hub.vue' }])
    assert.deepEqual(json.removed.sort(), [
      'src/views/create-hub.sample.ts',
      'src/views/create-hub.vue'
    ])
  } finally {
    cleanup(dir)
  }
})

test('remove of a block that was never copied fails and names what is recorded', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK).code, 0)
    const r = cli(dir, 'remove', 'auth/sign-in')
    assert.equal(r.code, 1)
    assert.match(r.stderr, /not recorded in webkit\.blocks\.json \(recorded: create\/create-hub\)/)
  } finally {
    cleanup(dir)
  }
})
