import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, posix } from 'node:path'

import { checksum, planAdd } from '../../src/cli/blocks.js'
import { catalogFor, resolveWebkit } from '../../src/cli/source.js'
import { cleanup, cli, cliJson, makeProject, PKG_ROOT } from './lib/cli-project.mjs'

const BLOCK = 'create/create-hub'
const canonical = (file) => readFileSync(join(PKG_ROOT, 'blocks', BLOCK, file), 'utf8')
const PRIMARY_IMPORTS = {
  './parts/repository-list.vue': './create-hub-repository-list.vue',
  './parts/template-gallery.vue': './create-hub-template-gallery.vue',
  './sample': './create-hub.sample',
  './types': './create-hub.types'
}
const copiedPrimary = () =>
  Object.entries(PRIMARY_IMPORTS).reduce(
    (text, [from, to]) => text.replaceAll(`'${from}'`, `'${to}'`),
    canonical('create-hub.vue')
  )
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
    const sampleEntry = entry.files.find((f) => f.path === 'src/views/create-hub.sample.ts')
    assert.deepEqual(sampleEntry, {
      path: 'src/views/create-hub.sample.ts',
      source: `blocks/${BLOCK}/sample.ts`,
      variant: 'Data',
      checksum: checksum(sample)
    })
    assert.deepEqual(
      entry.files.find((f) => f.path === 'src/views/create-hub.vue'),
      {
        path: 'src/views/create-hub.vue',
        source: `blocks/${BLOCK}/create-hub.vue`,
        variant: 'Default',
        imports: PRIMARY_IMPORTS,
        checksum: checksum(copied)
      }
    )
    assert.deepEqual(entry.files.map((f) => f.path).sort(), [
      'src/views/create-hub-repository-list.vue',
      'src/views/create-hub-template-gallery.vue',
      'src/views/create-hub.sample.ts',
      'src/views/create-hub.types.ts',
      'src/views/create-hub.vue'
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
      'Data',
      'Data',
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
      'Data',
      'Data',
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
  const shipped = (file) => readFileSync(join(PKG_ROOT, 'blocks/view/view-table', file), 'utf8')
  try {
    const r = cli(dir, 'add', 'view/view-table', '--variant', 'Empty')
    assert.equal(r.code, 0, r.stderr)
    const primary = readFileSync(join(dir, 'src/views/view-table.vue'), 'utf8')
    assert.match(primary, /from '\.\/view-table\.sample'/)
    assert.equal(
      primary,
      shipped('view-table.vue')
        .replace("'./sample'", "'./view-table.sample'")
        .replace("'./parts/collection-controls.vue'", "'./view-table-collection-controls.vue'")
    )
    assert.equal(
      readFileSync(join(dir, 'src/views/view-table.sample.ts'), 'utf8'),
      shipped('sample.ts').replace("'./lib/deployments'", "'./view-table.deployments'")
    )
    const variant = readFileSync(join(dir, 'src/views/view-table-empty.vue'), 'utf8')
    assert.match(variant, /import ViewTable from '\.\/view-table\.vue'/)
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    const files = manifest.blocks['view/view-table'].files
    assert.deepEqual(
      files.map((f) => [f.path, f.variant, f.imports]),
      [
        ['src/views/view-table-collection-controls.vue', 'Data', undefined],
        [
          'src/views/view-table-deployments-page.vue',
          'Data',
          {
            '../lib/deployments': './view-table.deployments',
            '../sample': './view-table.sample',
            './collection-controls.vue': './view-table-collection-controls.vue',
            './deployments-table.vue': './view-table-deployments-table.vue'
          }
        ],
        [
          'src/views/view-table-deployments-table.vue',
          'Data',
          { '../lib/deployments': './view-table.deployments' }
        ],
        ['src/views/view-table-empty.vue', 'Empty', { '../view-table.vue': './view-table.vue' }],
        ['src/views/view-table.deployments.ts', 'Data', undefined],
        [
          'src/views/view-table.sample.ts',
          'Data',
          { './lib/deployments': './view-table.deployments' }
        ],
        [
          'src/views/view-table.vue',
          'Default',
          {
            './parts/collection-controls.vue': './view-table-collection-controls.vue',
            './sample': './view-table.sample'
          }
        ]
      ]
    )
    const diff = cliJson(dir, 'diff', 'view/view-table')
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
      'view/view-table',
      '--dest',
      'src/screens/Resources.vue',
      '--dry-run'
    )
    assert.equal(r.code, 0)
    assert.deepEqual(
      r.json.files.map((f) => f.path),
      [
        'src/screens/Resources.vue',
        'src/screens/Resources.sample.ts',
        'src/screens/Resources.deployments.ts',
        'src/screens/ResourcesCollectionControls.vue',
        'src/screens/ResourcesDeploymentsPage.vue',
        'src/screens/ResourcesDeploymentsTable.vue'
      ]
    )
    assert.deepEqual(r.json.files[0].imports, {
      './parts/collection-controls.vue': './ResourcesCollectionControls.vue',
      './sample': './Resources.sample'
    })
    assert.deepEqual(r.json.files[1].imports, {
      './lib/deployments': './Resources.deployments',
      './view-table.vue': './Resources.vue'
    })
  } finally {
    cleanup(dir)
  }
})

test('add copies a shared SFC from the block files with a variant that renders it', () => {
  const dir = makeProject()
  try {
    const r = cli(dir, 'add', 'auth/auth-sign-in', '--variant', 'RejectedToken')
    assert.equal(r.code, 0, r.stderr)
    const card = join(dir, 'src/views/auth-sign-in-token-sign-in.vue')
    assert.ok(existsSync(card))
    const variant = readFileSync(join(dir, 'src/views/auth-sign-in-rejected-token.vue'), 'utf8')
    assert.match(variant, /from '\.\/auth-sign-in-token-sign-in\.vue'/)
    assert.match(variant, /error="rejected"/)
  } finally {
    cleanup(dir)
  }
})

const RELATIVE_IMPORT = /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)['"](\.{1,2}\/[^'"]+)['"]/g
const IMPORT_SUFFIXES = ['', '.ts', '.vue', '.js', '/index.ts']

function unresolvedImports(files) {
  const planned = new Set(files.map((f) => f.path))
  const out = []
  for (const file of files) {
    for (const m of file.content.matchAll(RELATIVE_IMPORT)) {
      const target = posix.normalize(
        posix.join(posix.dirname(file.path), m[1].replace(/[?#].*$/, ''))
      )
      if (!IMPORT_SUFFIXES.some((s) => planned.has(target + s))) out.push(`${file.path} -> ${m[1]}`)
    }
  }
  return out
}

function blockIds(dir = join(PKG_ROOT, 'blocks'), prefix = '') {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const id = prefix ? `${prefix}/${entry.name}` : entry.name
      const here = existsSync(join(dir, entry.name, 'block.json')) ? [id] : []
      return here.length ? here : blockIds(join(dir, entry.name), id)
    })
}

test('add copies the sibling variant a variant imports and points the import at the copy', () => {
  const dir = makeProject()
  const shipped = (file) =>
    readFileSync(join(PKG_ROOT, 'blocks/settings/settings-form', file), 'utf8')
  try {
    const r = cli(dir, 'add', 'settings/settings-form', '--variant', 'SavingOneGroup')
    assert.equal(r.code, 0, r.stderr)
    const variant = readFileSync(join(dir, 'src/views/settings-form-saving-one-group.vue'), 'utf8')
    assert.equal(
      variant,
      shipped('variants/saving-one-group.vue').replace(
        "'./save-per-group.vue'",
        "'./settings-form-save-per-group.vue'"
      )
    )
    assert.ok(existsSync(join(dir, 'src/views/settings-form-save-per-group.vue')))
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    const files = manifest.blocks['settings/settings-form'].files
    assert.deepEqual(files.map((f) => f.variant).sort(), [
      'Data',
      'Data',
      'Data',
      'Data',
      'SaveAll',
      'SavePerGroup',
      'SavingOneGroup'
    ])
    for (const part of [
      'settings-form-general-group-card.vue',
      'settings-form-notifications-group-card.vue',
      'settings-form.settings-form-save.ts'
    ])
      assert.ok(existsSync(join(dir, `src/views/${part}`)), part)
    assert.deepEqual(files.find((f) => f.variant === 'SavingOneGroup').imports, {
      './save-per-group.vue': './settings-form-save-per-group.vue'
    })
    assert.ok(!existsSync(join(dir, 'src/views/settings-form-save-per-card.vue')))
    const diff = cliJson(dir, 'diff', 'settings/settings-form')
    assert.ok(diff.json.files.every((f) => f.status === 'identical'))
  } finally {
    cleanup(dir)
  }
})

test('add keeps a sibling variant that was copied before and edited', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', 'settings/settings-form', '--variant', 'SavePerGroup').code, 0)
    const sibling = join(dir, 'src/views/settings-form-save-per-group.vue')
    const edited = `${readFileSync(sibling, 'utf8')}<!-- mine -->\n`
    writeFileSync(sibling, edited)
    const r = cli(dir, 'add', 'settings/settings-form', '--variant', 'SavingOneGroup')
    assert.equal(r.code, 0, r.stderr)
    assert.equal(readFileSync(sibling, 'utf8'), edited)
    assert.ok(existsSync(join(dir, 'src/views/settings-form-saving-one-group.vue')))
  } finally {
    cleanup(dir)
  }
})

test('add reaches a part through the sibling variant a variant imports', () => {
  const dir = makeProject()
  try {
    const r = cli(dir, 'add', 'create/create-page', '--variant', 'RequiredFields')
    assert.equal(r.code, 0, r.stderr)
    const variant = readFileSync(join(dir, 'src/views/create-page-required-fields.vue'), 'utf8')
    assert.match(variant, /import CreateService from '\.\/create-page-create-service\.vue'/)
    const sibling = readFileSync(join(dir, 'src/views/create-page-create-service.vue'), 'utf8')
    assert.match(sibling, /from '\.\/create-page-create-service-form\.vue'/)
    const part = readFileSync(join(dir, 'src/views/create-page-create-service-form.vue'), 'utf8')
    assert.match(part, /from '\.\/create-page-creation-header\.vue'/)
    assert.match(part, /from '\.\/create-page-discard-dialog\.vue'/)
    assert.match(part, /from '\.\/create-page\.use-create-form'/)
    for (const file of [
      'create-page-creation-header.vue',
      'create-page-discard-dialog.vue',
      'create-page.use-create-form.ts'
    ]) {
      assert.ok(existsSync(join(dir, `src/views/${file}`)), file)
    }
    const manifest = JSON.parse(readFileSync(join(dir, 'webkit.blocks.json'), 'utf8'))
    const paths = manifest.blocks['create/create-page'].files.map((f) => f.path)
    assert.equal(new Set(paths).size, paths.length)
    assert.ok(
      !paths.some((path) => /create-page-create-(zone|purge|organization)\.vue$/.test(path))
    )
  } finally {
    cleanup(dir)
  }
})

test('every block and variant plans a copy whose relative imports all point at planned files', () => {
  const dir = makeProject()
  try {
    const webkit = resolveWebkit(dir)
    const catalog = catalogFor(webkit)
    const problems = []
    let plans = 0
    for (const id of blockIds()) {
      const meta = JSON.parse(readFileSync(join(PKG_ROOT, 'blocks', id, 'block.json'), 'utf8'))
      for (const variant of [undefined, ...(meta.variants || []).map((v) => v.name)]) {
        const label = `${id}${variant ? ` --variant ${variant}` : ''}`
        const plan = planAdd(dir, webkit, catalog, id, { variant })
        plans += 1
        if (!plan.files) {
          problems.push(`${label}: ${plan.errors.join(' ')}`)
          continue
        }
        const paths = plan.files.map((f) => f.path)
        if (new Set(paths).size !== paths.length) problems.push(`${label}: two files share a path`)
        problems.push(...unresolvedImports(plan.files).map((miss) => `${label}: ${miss}`))
      }
    }
    assert.ok(plans > 100, `${plans} plans`)
    assert.deepEqual(problems, [])
  } finally {
    cleanup(dir)
  }
})
