import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { checksum } from '../../src/cli/blocks.js'
import { cleanup, cli, cliJson, makeProject, PKG_ROOT } from './lib/cli-project.mjs'

const BLOCK = 'create/create-hub'
const canonical = (file) => readFileSync(join(PKG_ROOT, 'blocks', BLOCK, file), 'utf8')
const copiedPrimary = () =>
  canonical('create-hub.vue').replace("'./sample'", "'./create-hub.sample'")
const copiedVariant = (file) =>
  canonical(file)
    .replace("'../create-hub.vue'", "'./create-hub.vue'")
    .replace("'../sample'", "'./create-hub.sample'")

test('add copies the primary SFC into src/views and records it in the manifest', () => {
  const dir = makeProject()
  try {
    const r = cli(dir, 'add', BLOCK)
    assert.equal(r.code, 0, r.stderr)
    const copied = readFileSync(join(dir, 'src/views/create-hub.vue'), 'utf8')
    assert.equal(copied, copiedPrimary())
    const sample = readFileSync(join(dir, 'src/views/create-hub.sample.ts'), 'utf8')
    assert.equal(sample, canonical('sample.ts'))
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    const entry = manifest.blocks[BLOCK]
    assert.equal(entry.version, JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'))).version)
    assert.deepEqual(entry.files, [
      {
        path: 'src/views/create-hub.sample.ts',
        source: `blocks/${BLOCK}/sample.ts`,
        variant: 'Data',
        checksum: checksum(sample)
      },
      {
        path: 'src/views/create-hub.vue',
        source: `blocks/${BLOCK}/create-hub.vue`,
        variant: 'Default',
        imports: { './sample': './create-hub.sample' },
        checksum: checksum(copied)
      }
    ])
    assert.match(r.stdout, /component: \(\) => import\('\.\/views\/create-hub\.vue'\)/)
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
      readFileSync(join(dir, 'src/views/create-hub-connected.vue'), 'utf8'),
      copiedVariant('variants/connected.vue')
    )
    const guide = readFileSync(join(dir, 'src/views/create-hub.guidelines.md'), 'utf8')
    assert.ok(!guide.startsWith('#'), 'the H1 heading is stripped')
    assert.ok(canonical('guidelines.md').endsWith(guide))
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    assert.deepEqual(manifest.blocks[BLOCK].files.map((f) => f.variant).sort(), [
      'Connected',
      'Data',
      'Default'
    ])
  } finally {
    cleanup(dir)
  }
})

test('add --variant after the primary was added keeps the primary copy and adds the variant', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK).code, 0)
    const edited = canonical('create-hub.vue') + '<!-- mine -->\n'
    writeFileSync(join(dir, 'src/views/create-hub.vue'), edited)
    const r = cli(dir, 'add', BLOCK, '--variant', 'connected')
    assert.equal(r.code, 0, r.stderr)
    assert.match(r.stderr, /src\/views\/create-hub\.vue was added before and is kept/)
    assert.equal(readFileSync(join(dir, 'src/views/create-hub.vue'), 'utf8'), edited)
    assert.equal(
      readFileSync(join(dir, 'src/views/create-hub-connected.vue'), 'utf8'),
      copiedVariant('variants/connected.vue')
    )
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    assert.deepEqual(manifest.blocks[BLOCK].files.map((f) => f.variant).sort(), [
      'Connected',
      'Data',
      'Default'
    ])
  } finally {
    cleanup(dir)
  }
})

test('add never overwrites without --force', () => {
  const dir = makeProject({ 'src/views/create-hub.vue': 'mine\n' })
  try {
    const r = cli(dir, 'add', BLOCK)
    assert.equal(r.code, 1)
    assert.match(r.stderr, /already exists: pass --force/)
    assert.equal(readFileSync(join(dir, 'src/views/create-hub.vue'), 'utf8'), 'mine\n')
    assert.ok(!existsSync(join(dir, 'webkit.blocks.json')))
    const forced = cli(dir, 'add', BLOCK, '--force')
    assert.equal(forced.code, 0, forced.stderr)
    assert.equal(readFileSync(join(dir, 'src/views/create-hub.vue'), 'utf8'), copiedPrimary())
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
    assert.equal(dry.json.files[0].path, 'src/pages/create-hub.vue')
    assert.equal(
      dry.json.route.entry,
      "{ path: '/create-hub', name: 'create-hub', component: () => import('@/pages/create-hub.vue') }"
    )
    assert.deepEqual(dry.json.written, [])
    assert.ok(!existsSync(join(dir, 'src/pages/create-hub.vue')))

    const dest = cli(dir, 'add', BLOCK, '--dest', 'src/screens/Hub.vue')
    assert.equal(dest.code, 0, dest.stderr)
    assert.ok(existsSync(join(dir, 'src/screens/Hub.vue')))

    const named = cliJson(
      dir,
      'add',
      BLOCK,
      '--variant',
      'connected',
      '--dest',
      'src/screens/Hub.vue',
      '--dry-run'
    )
    assert.equal(named.json.files.at(-1).path, 'src/screens/HubConnected.vue')
    const kebab = cliJson(
      dir,
      'add',
      BLOCK,
      '--variant',
      'connected',
      '--dest',
      'src/screens',
      '--dry-run'
    )
    assert.equal(kebab.json.files.at(-1).path, 'src/screens/create-hub-connected.vue')
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

test('add copies the block data files beside the SFC and points every local import at the copies', () => {
  const dir = makeProject()
  const shipped = (file) => readFileSync(join(PKG_ROOT, 'blocks/view/table-view', file), 'utf8')
  try {
    const r = cli(dir, 'add', 'view/table-view', '--variant', 'Empty')
    assert.equal(r.code, 0, r.stderr)
    const primary = readFileSync(join(dir, 'src/views/table-view.vue'), 'utf8')
    assert.match(primary, /from '\.\/table-view\.sample'/)
    assert.equal(primary, shipped('table-view.vue').replace("'./sample'", "'./table-view.sample'"))
    assert.equal(
      readFileSync(join(dir, 'src/views/table-view.sample.ts'), 'utf8'),
      shipped('sample.ts')
    )
    const variant = readFileSync(join(dir, 'src/views/table-view-empty.vue'), 'utf8')
    assert.match(variant, /import TableView from '\.\/table-view\.vue'/)
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    const files = manifest.blocks['view/table-view'].files
    assert.deepEqual(
      files.map((f) => [f.path, f.variant, f.imports]),
      [
        ['src/views/table-view-empty.vue', 'Empty', { '../table-view.vue': './table-view.vue' }],
        ['src/views/table-view.sample.ts', 'Data', undefined],
        ['src/views/table-view.vue', 'Default', { './sample': './table-view.sample' }]
      ]
    )
    const diff = cliJson(dir, 'diff', 'view/table-view')
    assert.equal(diff.code, 0, diff.stderr)
    assert.ok(diff.json.files.every((f) => f.status === 'identical'))
  } finally {
    cleanup(dir)
  }
})

test('add renames the data files after a --dest name', () => {
  const dir = makeProject()
  try {
    const r = cliJson(
      dir,
      'add',
      'view/table-view',
      '--dest',
      'src/screens/Resources.vue',
      '--dry-run'
    )
    assert.equal(r.code, 0)
    assert.deepEqual(
      r.json.files.map((f) => f.path),
      ['src/screens/Resources.vue', 'src/screens/Resources.sample.ts']
    )
    assert.deepEqual(r.json.files[0].imports, { './sample': './Resources.sample' })
    assert.deepEqual(r.json.files[1].imports, { './table-view.vue': './Resources.vue' })
  } finally {
    cleanup(dir)
  }
})

test('add copies a shared SFC from the block files with a variant that renders it', () => {
  const dir = makeProject()
  try {
    const r = cli(dir, 'add', 'auth/sign-in', '--variant', 'RejectedToken')
    assert.equal(r.code, 0, r.stderr)
    const card = join(dir, 'src/views/sign-in.token-sign-in.vue')
    assert.ok(existsSync(card))
    const variant = readFileSync(join(dir, 'src/views/sign-in-rejected-token.vue'), 'utf8')
    assert.match(variant, /from '\.\/sign-in\.token-sign-in\.vue'/)
    assert.match(variant, /error="rejected"/)
  } finally {
    cleanup(dir)
  }
})
