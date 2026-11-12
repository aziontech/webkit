#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { VUE_TSC_KNOWN_GOOD } from '../src/cli/toolchain.js'
import { buildWorkspace, packWorkspace, runLogged as run } from './lib/consumer-app.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(SCRIPT_DIR, '..')
const ROOT = resolve(PKG, '..', '..')
export const CREATE_VITE = 'create-vite@9.3.4'

export const APP_VUE = `<script setup lang="ts">
  import HeroBand from '@aziontech/webkit/hero-band'
  import SiteNav from '@aziontech/webkit/site-nav'
  import Table from '@aziontech/webkit/table'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { cn } from '@aziontech/webkit/utils/cn'

  interface Edge {
    id: string
    name: string
  }

  const collection = useCollection<Edge>({
    items: [{ id: '1', name: 'storefront' }],
    pagination: { pageSize: 10 }
  })
  const notify = (): void => {
    toast.success('Saved')
  }
  const heroClass = cn('a', 'b')
</script>

<template>
  <WebkitProvider>
    <SiteNav :menus="[]" />
    <!-- @vue-expect-error -->
    <SiteNav />
    <HeroBand title="Ship" eyebrow="https://www.azion.com" :class="heroClass" />
    <Table>
      <Table.Body>
        <Table.Row v-for="edge in collection.items.value" :key="edge.id">
          <Table.Cell>{{ edge.name }}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
    <button type="button" @click="notify">Notify</button>
  </WebkitProvider>
</template>
`

export const MAIN_TS = `import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import '@aziontech/icons'
import '@aziontech/theme'
import '@aziontech/webkit/styles'
import { ToastPlugin } from '@aziontech/webkit/toast'
import App from './App.vue'

const router = createRouter({ history: createMemoryHistory(), routes: [] })

createApp(App).use(router).use(ToastPlugin).mount('#app')
`

export const PROBE_TS = `import { useCollection } from '@aziontech/webkit/use-collection'

// @ts-expect-error
useCollection({ items: [1, 2] })
`

export function allExportsModule(exportsMap) {
  const lines = Object.entries(exportsMap)
    .filter(([, entry]) => entry && typeof entry === 'object' && entry.types)
    .map(([key], i) => `export type * as e${i} from '@aziontech/webkit/${key.slice(2)}'`)
  return `${lines.join('\n')}\n`
}

export function sourceFilesInProgram(fileList) {
  return fileList
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /node_modules[\\/]@aziontech[\\/]webkit[\\/]/.test(line))
    .filter((line) => !line.endsWith('.d.ts'))
}

function fail(message) {
  console.error(`\n✖ consumer-types: ${message}`)
  process.exit(1)
}

function main() {
  const keep = process.argv.includes('--keep')
  if (!process.argv.includes('--skip-build')) buildWorkspace(ROOT)

  const work = mkdtempSync(join(tmpdir(), 'webkit-consumer-types-'))
  const tarballs = packWorkspace(ROOT, join(work, 'tarballs'))

  run(
    'npm',
    [
      'create',
      CREATE_VITE.replace('create-', ''),
      '--',
      'app',
      '--template',
      'vue-ts',
      '--no-interactive'
    ],
    work
  )
  const app = join(work, 'app')
  if (!existsSync(join(app, 'tsconfig.app.json')))
    fail('create-vite did not write the vue-ts template')

  const appPkgPath = join(app, 'package.json')
  const appPkg = JSON.parse(readFileSync(appPkgPath, 'utf8'))
  if (appPkg.scripts?.build !== 'vue-tsc -b && vite build') {
    fail(`the template build script changed: ${appPkg.scripts?.build}`)
  }
  appPkg.dependencies = {
    ...appPkg.dependencies,
    '@aziontech/webkit': `file:${tarballs.webkitTgz}`,
    '@aziontech/theme': `file:${tarballs.themeTgz}`,
    '@aziontech/icons': `file:${tarballs.iconsTgz}`,
    'vue-router': '^5.5.0'
  }
  appPkg.devDependencies = { ...appPkg.devDependencies, 'vue-tsc': VUE_TSC_KNOWN_GOOD }
  writeFileSync(appPkgPath, `${JSON.stringify(appPkg, null, 2)}\n`)

  const webkitPkg = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'))
  writeFileSync(join(app, 'src/App.vue'), APP_VUE)
  writeFileSync(join(app, 'src/main.ts'), MAIN_TS)
  writeFileSync(join(app, 'src/probe.ts'), PROBE_TS)
  writeFileSync(join(app, 'src/all-exports.ts'), allExportsModule(webkitPkg.exports))

  run('npm', ['install', '--no-audit', '--no-fund'], app)
  run('npm', ['run', 'build'], app)

  const listed = execFileSync(
    'npx',
    ['vue-tsc', '-p', 'tsconfig.app.json', '--noEmit', '--listFilesOnly'],
    { cwd: app, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  )
  const sources = sourceFilesInProgram(listed)
  if (sources.length) {
    fail(
      `the consumer program type-checks ${sources.length} WebKit source file(s); every export must resolve to types/:\n  ${sources.slice(0, 10).join('\n  ')}`
    )
  }

  console.log(
    `\n✓ consumer-types: a fresh ${CREATE_VITE} vue-ts app builds with the packed tarballs; ${Object.keys(webkitPkg.exports).length} exports, declaration-only program.`
  )
  if (keep) console.log(`  workdir kept: ${work}`)
  else rmSync(work, { recursive: true, force: true })
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main()
