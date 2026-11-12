import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { exportsProblems } from '../../scripts/build-exports.mjs'
import { allExportsModule, sourceFilesInProgram } from '../../scripts/check-consumer-types.mjs'
import { exportTarget, typedEntry, typesFor } from '../../scripts/lib/exports.mjs'
import { findAncestor, isPnpmCommand, packerToOutlive } from '../../scripts/pack-files.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const ROOT = resolve(PKG, '../..')
const read = (path) => JSON.parse(readFileSync(resolve(ROOT, path), 'utf8'))

test('typesFor maps each source kind into types/', () => {
  assert.equal(
    typesFor('./src/components/sections/site-nav/site-nav.vue'),
    './types/components/sections/site-nav/site-nav.vue.d.ts'
  )
  assert.equal(
    typesFor('./src/components/data/table/index.ts'),
    './types/components/data/table/index.d.ts'
  )
  assert.equal(typesFor('./src/utils/cn.js'), './types/utils/cn.d.ts')
  assert.equal(typesFor('./src/styles.css'), './types/css.d.ts')
  assert.equal(typesFor('./src/assets/logo.svg'), null)
  assert.equal(typesFor('./catalog.json'), null)
})

test('typedEntry is idempotent and exportTarget reads both shapes', () => {
  const once = typedEntry('./src/components/actions/button/button.vue')
  assert.deepEqual(once, {
    types: './types/components/actions/button/button.vue.d.ts',
    default: './src/components/actions/button/button.vue'
  })
  assert.deepEqual(typedEntry(once), once)
  assert.equal(Object.keys(once)[0], 'types')
  assert.equal(exportTarget(once), './src/components/actions/button/button.vue')
  assert.equal(exportTarget('./catalog.json'), './catalog.json')
})

test('package.json#exports is typed, and every target exists', () => {
  assert.deepEqual(exportsProblems(read('packages/webkit/package.json'), PKG), [])
})

test('exportsProblems flags an untyped entry and a missing target', () => {
  const problems = exportsProblems(
    {
      exports: {
        './button': './src/components/actions/button/button.vue',
        './ghost': { types: './types/ghost.vue.d.ts', default: './src/ghost.vue' }
      }
    },
    PKG
  )
  assert.equal(problems.length, 2)
  assert.match(problems[0], /^\.\/button: expected/)
  assert.match(problems[1], /\.\/ghost: \.\/src\/ghost\.vue does not exist/)
})

test('the package ships types/ and builds it at pack time', () => {
  const pkg = read('packages/webkit/package.json')
  assert.ok(pkg.files.includes('types'))
  assert.equal(pkg.scripts.prepack, 'node scripts/pack-files.mjs')
  assert.equal(pkg.scripts.postpack, 'node scripts/pack-files.mjs --clean')
})

test('every CSS entry of @aziontech/icons declares types, in the repo and in dist', () => {
  const icons = read('packages/icons/package.json')
  for (const [key, entry] of Object.entries(icons.exports)) {
    if (exportTarget(entry).endsWith('.css')) {
      assert.equal(entry.types, './dist/index.d.ts', key)
    }
  }
  const build = readFileSync(resolve(ROOT, 'packages/icons/scripts/build.mjs'), 'utf8')
  assert.match(build, /'index\.d\.ts'/)
  assert.match(build, /'\.': \{ types: '\.\/index\.d\.ts', default: '\.\/index\.css' \}/)
})

test('isPnpmCommand recognises the pnpm process and nothing that only mentions it', () => {
  assert.ok(isPnpmCommand('node /usr/local/bin/pnpm pack --pack-destination out'))
  assert.ok(isPnpmCommand('/home/u/.local/share/pnpm/pnpm pack'))
  assert.ok(isPnpmCommand('node /opt/corepack/dist/pnpm.js pack'))
  assert.ok(!isPnpmCommand('node scripts/pack-files.mjs --clean'))
  assert.ok(!isPnpmCommand("/bin/bash -c 'pnpm pack'"))
  assert.ok(!isPnpmCommand('npm pack'))
})

test('findAncestor walks up to the first matching process', () => {
  const table = {
    40: { ppid: 30, command: 'sh -c node scripts/pack-files.mjs --clean' },
    30: { ppid: 20, command: 'node /usr/local/bin/pnpm pack' },
    20: { ppid: 1, command: '/bin/bash' }
  }
  assert.equal(
    findAncestor(40, isPnpmCommand, (pid) => table[pid]),
    30
  )
  assert.equal(
    findAncestor(20, isPnpmCommand, (pid) => table[pid]),
    null
  )
  assert.equal(
    findAncestor(99, isPnpmCommand, () => null),
    null
  )
})

test('packerToOutlive defers only a pnpm postpack', () => {
  const read = () => ({ ppid: 1, command: 'node /usr/local/bin/pnpm pack' })
  const pnpm = { npm_lifecycle_event: 'postpack', npm_config_user_agent: 'pnpm/11.9.0 node/v24' }
  assert.equal(packerToOutlive(pnpm, 50, read), 50)
  assert.equal(
    packerToOutlive({ ...pnpm, npm_config_user_agent: 'npm/11.19.1 node/v24' }, 50, read),
    null
  )
  assert.equal(packerToOutlive({ ...pnpm, npm_lifecycle_event: 'smoke:consume' }, 50, read), null)
})

test('the consumer check imports every typed export and spots WebKit sources', () => {
  const module = allExportsModule({
    './button': typedEntry('./src/components/actions/button/button.vue'),
    './catalog.json': './catalog.json'
  })
  assert.equal(module, "export type * as e0 from '@aziontech/webkit/button'\n")
  const sources = sourceFilesInProgram(
    [
      '/app/node_modules/@aziontech/webkit/types/components/actions/button/button.vue.d.ts',
      '/app/node_modules/@aziontech/webkit/src/components/feedback/toast/index.ts',
      '/app/src/App.vue'
    ].join('\n')
  )
  assert.deepEqual(sources, [
    '/app/node_modules/@aziontech/webkit/src/components/feedback/toast/index.ts'
  ])
})

test('governance runs the exports check and the consumer types check', () => {
  const workflow = readFileSync(resolve(ROOT, '.github/workflows/governance.yml'), 'utf8')
  assert.match(workflow, /webkit run exports:check\n/)
  assert.match(workflow, /webkit run consumer:types\n/)
})
