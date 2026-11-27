import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BLANK_APP_VUE = `<script setup lang="ts"></script>\n<template>\n  <main></main>\n</template>\n`

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
  runLogged('pnpm', ['--filter', '@aziontech/ui', 'run', 'build:catalog'], root)
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
  const azionUiDir = join(root, 'packages/ui')
  runLogged('node', ['scripts/pack-files.mjs'], azionUiDir)
  try {
    return { themeTgz, iconsTgz, azionUiTgz: pack(azionUiDir, packDir) }
  } finally {
    runLogged('node', ['scripts/pack-files.mjs', '--clean'], azionUiDir)
  }
}

export function packAzionUiMcp(root, packDir) {
  mkdirSync(packDir, { recursive: true })
  return pack(join(root, 'packages/ui-mcp'), packDir)
}

export function writeConsumerApp(
  app,
  { azionUiTgz, themeTgz, iconsTgz, azionUiMcpTgz = null, appVue = BLANK_APP_VUE }
) {
  const mcpDependency = azionUiMcpTgz ? { '@aziontech/ui-mcp': `file:${azionUiMcpTgz}` } : {}
  mkdirSync(join(app, 'src'), { recursive: true })
  writeFileSync(
    join(app, 'package.json'),
    JSON.stringify(
      {
        name: 'azion-ui-smoke-app',
        private: true,
        type: 'module',
        scripts: { build: 'vite build' },
        dependencies: {
          vue: '^3.5.0',
          '@aziontech/ui': `file:${azionUiTgz}`,
          '@aziontech/theme': `file:${themeTgz}`,
          '@aziontech/icons': `file:${iconsTgz}`
        },
        devDependencies: { vite: '^6.0.0', '@vitejs/plugin-vue': '^5.0.0', ...mcpDependency }
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
      `  '@aziontech/ui': file:${azionUiTgz}`,
      `  '@aziontech/theme': file:${themeTgz}`,
      `  '@aziontech/icons': file:${iconsTgz}`,
      ...(azionUiMcpTgz ? [`  '@aziontech/ui-mcp': file:${azionUiMcpTgz}`] : []),
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
