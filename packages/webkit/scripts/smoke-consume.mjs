#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '..', '..', '..')
const KEEP = process.argv.includes('--keep')

const run = (cmd, args, cwd, extraEnv = {}) => {
  process.stdout.write(`\n$ ${cmd} ${args.join(' ')}  (cwd: ${cwd})\n`)
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, CI: 'true', ...extraEnv }
  })
}

const fail = (msg) => {
  console.error(`\n✖ smoke-consume: ${msg}`)
  process.exit(1)
}

run('pnpm', ['--filter', '@aziontech/theme', 'run', 'build:tokens'], ROOT)
run('pnpm', ['--filter', '@aziontech/icons', 'run', 'build'], ROOT)
run('pnpm', ['--filter', '@aziontech/webkit', 'run', 'catalog:build'], ROOT)

const work = mkdtempSync(join(tmpdir(), 'webkit-smoke-'))
const packDir = join(work, 'tarballs')
mkdirSync(packDir, { recursive: true })

const pack = (pkgDir) => {
  const out = execFileSync(
    'pnpm',
    ['pack', '--config.ignore-scripts=true', '--pack-destination', packDir],
    { cwd: pkgDir, encoding: 'utf8' }
  )
  const tgz = out.trim().split('\n').pop().trim()
  return tgz.startsWith('/') ? tgz : join(packDir, tgz.split('/').pop())
}
const themeTgz = pack(join(ROOT, 'packages/theme'))
const iconsTgz = pack(join(ROOT, 'packages/icons'))
const webkitTgz = pack(join(ROOT, 'packages/webkit'))

const app = join(work, 'app')
mkdirSync(join(app, 'src'), { recursive: true })

writeFileSync(
  join(app, 'package.json'),
  JSON.stringify(
    {
      name: 'webkit-smoke-app',
      private: true,
      type: 'module',
      scripts: { build: 'vite build' },
      dependencies: {
        vue: '^3.5.0',
        '@aziontech/webkit': `file:${webkitTgz}`,
        '@aziontech/theme': `file:${themeTgz}`,
        '@aziontech/icons': `file:${iconsTgz}`
      },
      devDependencies: { vite: '^6.0.0', '@vitejs/plugin-vue': '^5.0.0' }
    },
    null,
    2
  )
)
writeFileSync(
  join(app, 'pnpm-workspace.yaml'),
  [
    'packages: []',
    'overrides:',
    `  '@aziontech/webkit': file:${webkitTgz}`,
    `  '@aziontech/theme': file:${themeTgz}`,
    `  '@aziontech/icons': file:${iconsTgz}`,
    'allowBuilds:',
    "  '@parcel/watcher': false",
    "  '@swc/core': false",
    '  es5-ext: false',
    '  esbuild: false',
    '  ttf2woff2: false',
    '  unrs-resolver: false',
    '  vue-demi: false',
    ''
  ].join('\n')
)
writeFileSync(join(app, '.npmrc'), '@aziontech:registry=https://registry.npmjs.org/\n')
writeFileSync(
  join(app, 'vite.config.mjs'),
  `import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\nexport default defineConfig({ plugins: [vue()] })\n`
)
writeFileSync(
  join(app, 'index.html'),
  `<!doctype html><html data-theme="dark"><head><meta charset="utf-8" /></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n`
)
writeFileSync(
  join(app, 'src/App.vue'),
  `<script setup lang="ts">\nimport Button from '@aziontech/webkit/button'\n</script>\n<template>\n  <Button kind="primary" size="large">Deploy</Button>\n</template>\n`
)
writeFileSync(
  join(app, 'src/main.ts'),
  `import { createApp } from 'vue'\nimport App from './App.vue'\ncreateApp(App).mount('#app')\n`
)

const install = () =>
  run('pnpm', ['install', '--no-frozen-lockfile', '--config.confirmModulesPurge=false'], app, {
    PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: 'false'
  })
install()
run('node', [join(app, 'node_modules/@aziontech/webkit/src/cli/cli.js'), 'init', '--yes'], app)
install()

const mainSrc = readFileSync(join(app, 'src/main.ts'), 'utf8')
if (!mainSrc.includes('./webkit.css') || !mainSrc.includes('@aziontech/icons')) {
  fail('init did not wire the design-system imports into src/main.ts (patch-entry).')
}
if (mainSrc.includes('ToastPlugin')) {
  fail('init must not wire the toast plugin — toast setup is just-in-time (catalog + doctor).')
}

const cliBin = join(app, 'node_modules/@aziontech/webkit/src/cli/cli.js')
const runSync = (args) =>
  execFileSync('node', [cliBin, 'sync', ...args], { cwd: app, encoding: 'utf8' })

let syncOut = runSync(['--check'])
if (!/drift: no/.test(syncOut)) {
  fail(`sync --check reported drift right after init:\n${syncOut}`)
}

const ruleFile = join(app, '.claude/rules/webkit-imports.md')
const pristine = readFileSync(ruleFile, 'utf8')
writeFileSync(ruleFile, `${pristine}\n<!-- local note -->\n`)

syncOut = runSync(['--check'])
if (!/modified/.test(syncOut)) {
  fail(`sync --check did not report the locally edited rule as "modified":\n${syncOut}`)
}
if (readFileSync(ruleFile, 'utf8') === pristine) {
  fail('sync --check must not touch disk, but the edited rule reverted.')
}

runSync(['--force'])
syncOut = runSync(['--check'])
if (!/drift: no/.test(syncOut)) {
  fail(`sync --check still reports drift after --force restored the file:\n${syncOut}`)
}

const doctorOut = execFileSync('node', [cliBin, 'doctor'], { cwd: app, encoding: 'utf8' })
if (!/OK\s+claude bundle/.test(doctorOut)) {
  fail(`doctor did not report the claude bundle as OK after sync --force:\n${doctorOut}`)
}

run('pnpm', ['run', 'build'], app, { PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: 'false' })

const assetsDir = join(app, 'dist/assets')
const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'))
if (!cssFiles.length) fail('no CSS emitted — the style pipeline did not run.')
const css = cssFiles.map((f) => readFileSync(join(assetsDir, f), 'utf8')).join('\n')

if (!/data-kind=primary/.test(css) && !/\[data-kind/.test(css)) {
  fail('component classes absent from CSS — Tailwind did not scan webkit source (unstyled UI).')
}

console.log(
  `\n✓ smoke-consume: init + build succeeded; ${cssFiles.length} CSS file(s), component classes present.`
)
if (KEEP) console.log(`  workdir kept: ${work}`)
else rmSync(work, { recursive: true, force: true })
