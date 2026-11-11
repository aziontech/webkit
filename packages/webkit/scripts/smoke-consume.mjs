#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

import {
  buildWorkspace,
  installConsumerApp,
  packWorkspace,
  runLogged as run,
  writeConsumerApp
} from './lib/consumer-app.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '..', '..', '..')
const KEEP = process.argv.includes('--keep')

const fail = (msg) => {
  console.error(`\n✖ smoke-consume: ${msg}`)
  process.exit(1)
}

buildWorkspace(ROOT)

const work = mkdtempSync(join(tmpdir(), 'webkit-smoke-'))
const tarballs = packWorkspace(ROOT, join(work, 'tarballs'))

const app = join(work, 'app')
writeConsumerApp(app, {
  ...tarballs,
  appVue: `<script setup lang="ts">\nimport Button from '@aziontech/webkit/button'\n</script>\n<template>\n  <Button kind="primary" size="large">Deploy</Button>\n</template>\n`
})

installConsumerApp(app)
run('node', [join(app, 'node_modules/@aziontech/webkit/src/cli/cli.js'), 'init', '--yes'], app)
installConsumerApp(app)

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
