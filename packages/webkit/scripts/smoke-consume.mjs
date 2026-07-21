#!/usr/bin/env node
// Consumer smoke test — the umbrella gate for the `webkit init` adoption flow.
//
// It reproduces what a real app does with the PUBLISHED packages, end to end:
//   1. build theme + icons + the webkit catalog,
//   2. `pnpm pack` @aziontech/{theme,icons,webkit} into tarballs (only published files),
//   3. scaffold a bare Vite + Vue app in a temp dir and install the three tarballs,
//   4. run `webkit init` from the packed CLI (tailwind/postcss/webkit.css/mcp/…),
//   5. render a REAL component (<Button>) and `vite build`,
//   6. assert the output CSS carries the component's classes.
//
// This is the only gate that sees the classes of failure the internal CI cannot:
//   - components render unstyled (Tailwind not wired / not scanning webkit source),
//   - a malformed arbitrary value breaks a consumer's lightningcss build (Vite 8),
//   - the theme/icons dist is missing from the published tarball.
// Any of these fails the build here instead of in a consumer's project.
//
// Usage: node packages/webkit/scripts/smoke-consume.mjs [--keep]
//   --keep  leave the temp workdir for inspection (default: removed on success)

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

// ── 1. Build the packages a consumer would install ──────────────────────────
run('pnpm', ['--filter', '@aziontech/theme', 'run', 'build:tokens'], ROOT)
run('pnpm', ['--filter', '@aziontech/icons', 'run', 'build'], ROOT)
run('pnpm', ['--filter', '@aziontech/webkit', 'run', 'catalog:build'], ROOT)

// ── 2. Pack the three packages (published files only) ───────────────────────
const work = mkdtempSync(join(tmpdir(), 'webkit-smoke-'))
const packDir = join(work, 'tarballs')
mkdirSync(packDir, { recursive: true })

const pack = (pkgDir) => {
  // --ignore-scripts: skip the `prepack` .d.ts build (vue-tsc). The consume smoke exercises
  // RUNTIME consumption, not type publishing; dist/ is already built in step 1 above.
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

// ── 3. Scaffold a bare Vite + Vue app ───────────────────────────────────────
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
// pnpm-workspace.yaml: (a) isolates this temp app from the real monorepo above it, and
// (b) carries `overrides` — the current home for them (package.json#pnpm.overrides is
// ignored by pnpm 9+). Forces webkit's OWN @aziontech/* deps (packed as @x@4.0.0, which is
// unpublished → 404) to resolve to the local tarballs.
writeFileSync(
  join(app, 'pnpm-workspace.yaml'),
  [
    'packages: []',
    'overrides:',
    `  '@aziontech/webkit': file:${webkitTgz}`,
    `  '@aziontech/theme': file:${themeTgz}`,
    `  '@aziontech/icons': file:${iconsTgz}`,
    // Opt out of dep build scripts (binaries ship via platform optionalDeps) — mirrors the
    // monorepo's allowBuilds. Without this pnpm 11 fails the install with ERR_PNPM_IGNORED_BUILDS.
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
// A scope registry so any stray @aziontech resolution hits npmjs, not GitHub Packages.
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

// ── 4. Install, run the packed CLI's `init`, then install again ─────────────
const install = () =>
  run('pnpm', ['install', '--no-frozen-lockfile', '--config.confirmModulesPurge=false'], app, {
    PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: 'false'
  })
install() // base: vue + the three tarballs
run('node', [join(app, 'node_modules/@aziontech/webkit/src/cli/cli.js'), 'init'], app)
install() // pick up the style deps init added to package.json (tailwind/postcss/…)

// main.ts must import the generated CSS entry (init only advises it — the consumer wires it).
const mainPath = join(app, 'src/main.ts')
writeFileSync(
  mainPath,
  `import './webkit.css'\nimport '@aziontech/icons'\n${readFileSync(mainPath, 'utf8')}`
)

// ── 5. Build ────────────────────────────────────────────────────────────────
run('pnpm', ['run', 'build'], app, { PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: 'false' })

// ── 6. Assert the styled output ─────────────────────────────────────────────
const assetsDir = join(app, 'dist/assets')
const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'))
if (!cssFiles.length) fail('no CSS emitted — the style pipeline did not run.')
const css = cssFiles.map((f) => readFileSync(join(assetsDir, f), 'utf8')).join('\n')

// Component classes present ⇒ Tailwind scanned webkit source (not unstyled).
if (!/data-kind=primary/.test(css) && !/\[data-kind/.test(css)) {
  fail('component classes absent from CSS — Tailwind did not scan webkit source (unstyled UI).')
}
// Note: web fonts are not asserted here — @aziontech/theme ships them separately, so the
// init does not wire a fonts import yet. Add the @font-face check back once that lands.

console.log(
  `\n✓ smoke-consume: init + build succeeded; ${cssFiles.length} CSS file(s), component classes present.`
)
if (KEEP) console.log(`  workdir kept: ${work}`)
else rmSync(work, { recursive: true, force: true })
