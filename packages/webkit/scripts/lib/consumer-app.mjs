import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const BLANK_APP_VUE = `<script setup lang="ts"></script>\n<template>\n  <main></main>\n</template>\n`

export function runLogged(cmd, args, cwd, extraEnv = {}) {
  process.stdout.write(`\n$ ${cmd} ${args.join(' ')}  (cwd: ${cwd})\n`)
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, CI: 'true', ...extraEnv }
  })
}

export function buildWorkspace(root) {
  runLogged('pnpm', ['--filter', '@aziontech/theme', 'run', 'build:tokens'], root)
  runLogged('pnpm', ['--filter', '@aziontech/icons', 'run', 'build'], root)
  runLogged('pnpm', ['--filter', '@aziontech/webkit', 'run', 'catalog:build'], root)
}

function pack(pkgDir, packDir) {
  const out = execFileSync(
    'pnpm',
    ['pack', '--config.ignore-scripts=true', '--pack-destination', packDir],
    { cwd: pkgDir, encoding: 'utf8' }
  )
  const tgz = out.trim().split('\n').pop().trim()
  return tgz.startsWith('/') ? tgz : join(packDir, tgz.split('/').pop())
}

export function packWorkspace(root, packDir) {
  mkdirSync(packDir, { recursive: true })
  const themeTgz = pack(join(root, 'packages/theme'), packDir)
  const iconsTgz = pack(join(root, 'packages/icons'), packDir)
  const webkitDir = join(root, 'packages/webkit')
  runLogged('node', ['scripts/copy-ai-bundle.mjs'], webkitDir)
  try {
    return { themeTgz, iconsTgz, webkitTgz: pack(webkitDir, packDir) }
  } finally {
    runLogged('node', ['scripts/copy-ai-bundle.mjs', '--clean'], webkitDir)
  }
}

export function writeConsumerApp(app, { webkitTgz, themeTgz, iconsTgz, appVue = BLANK_APP_VUE }) {
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
  writeFileSync(join(app, 'src/App.vue'), appVue)
  writeFileSync(
    join(app, 'src/main.ts'),
    `import { createApp } from 'vue'\nimport App from './App.vue'\ncreateApp(App).mount('#app')\n`
  )
}

export function installConsumerApp(app) {
  runLogged(
    'pnpm',
    ['install', '--no-frozen-lockfile', '--config.confirmModulesPurge=false'],
    app,
    {
      PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN: 'false'
    }
  )
}
