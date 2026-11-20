import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { applyPlan } from '../../src/cli/apply.js'
import { planSources, SOURCES_FILE, writeSources } from '../../src/cli/css-sources.js'
import { planDoctor } from '../../src/cli/doctor.js'
import { patchViteConfig, planInit } from '../../src/cli/plan.js'

function put(dir, rel, content) {
  const path = join(dir, rel)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

function makeApp() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-css-sources-'))
  put(dir, 'package.json', JSON.stringify({ name: 'app', version: '1.0.0' }))
  const pkg = 'node_modules/@aziontech/webkit'
  put(
    dir,
    `${pkg}/package.json`,
    JSON.stringify({
      name: '@aziontech/webkit',
      exports: {
        './button': {
          types: './types/b.d.ts',
          default: './src/components/action/button/button.vue'
        },
        './dialog': './src/components/overlay/dialog/index.ts',
        './utils/cn': './src/utils/cn.ts'
      }
    })
  )
  put(
    dir,
    `${pkg}/src/components/action/button/button.vue`,
    "<script setup>\nimport Spinner from '../../feedback/spinner/spinner.vue'\nimport { cn } from '@aziontech/webkit/utils/cn'\n</script>\n"
  )
  put(dir, `${pkg}/src/components/feedback/spinner/spinner.vue`, '<template><i /></template>\n')
  put(dir, `${pkg}/src/utils/cn.ts`, 'export const cn = () => 1\n')
  put(
    dir,
    `${pkg}/src/components/overlay/dialog/index.ts`,
    "import Dialog from './dialog.vue'\nexport default Dialog\n"
  )
  put(dir, `${pkg}/src/components/overlay/dialog/dialog.vue`, '<template><div /></template>\n')
  put(dir, `${pkg}/src/components/data/table/table.vue`, '<template><table /></template>\n')
  return dir
}

const sourcesOf = (dir) => readFileSync(join(dir, SOURCES_FILE), 'utf8')

test('the sources list holds the imported components and what they import, nothing else', () => {
  const dir = makeApp()
  try {
    put(
      dir,
      'src/App.vue',
      "<script setup>\nimport Button from '@aziontech/webkit/button'\n</script>\n"
    )
    const plan = planSources(dir)
    assert.deepEqual(plan.subpaths, ['button'])
    assert.equal(plan.stale, true)
    assert.equal(writeSources(plan), true)
    const css = sourcesOf(dir)
    assert.match(
      css,
      /@source "\.\.\/node_modules\/@aziontech\/webkit\/src\/components\/action\/button\/button\.vue";/
    )
    assert.match(css, /feedback\/spinner\/spinner\.vue/)
    assert.match(css, /src\/utils\/cn\.ts/)
    assert.doesNotMatch(css, /dialog|table/)
    assert.equal(planSources(dir).stale, false)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a new import makes the list stale until it is rewritten', () => {
  const dir = makeApp()
  try {
    put(
      dir,
      'src/App.vue',
      "<script setup>\nimport Button from '@aziontech/webkit/button'\n</script>\n"
    )
    writeSources(planSources(dir))
    put(
      dir,
      'src/pages/Edit.vue',
      "<script setup>\nconst D = () => import('@aziontech/webkit/dialog')\n</script>\n"
    )
    const plan = planSources(dir)
    assert.equal(plan.stale, true)
    writeSources(plan)
    assert.match(sourcesOf(dir), /overlay\/dialog\/dialog\.vue/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init wires the sources list and doctor fails when it goes stale', () => {
  const dir = makeApp()
  try {
    put(dir, 'src/main.ts', "import { createApp } from 'vue'\n")
    put(
      dir,
      'src/App.vue',
      "<script setup>\nimport Button from '@aziontech/webkit/button'\n</script>\n"
    )
    applyPlan(dir, planInit(dir, {}))
    assert.match(
      readFileSync(join(dir, 'src/webkit.css'), 'utf8'),
      /@import '\.\/webkit\.sources\.css';/
    )
    assert.match(sourcesOf(dir), /button\.vue/)
    const ok = planDoctor(dir)
    assert.equal(ok.find((c) => c.check === 'webkit.css @source')?.status, 'ok')
    assert.equal(ok.find((c) => c.check === 'webkit css sources')?.status, 'ok')
    put(
      dir,
      'src/Other.vue',
      "<script setup>\nimport Dialog from '@aziontech/webkit/dialog'\n</script>\n"
    )
    const stale = planDoctor(dir).find((c) => c.check === 'webkit css sources')
    assert.equal(stale?.status, 'fail')
    assert.match(stale.detail, /2 imported WebKit file/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor fails the v5 wiring that relied on @aziontech/webkit/styles to scan the package', () => {
  const dir = makeApp()
  try {
    put(dir, 'src/webkit.css', "@import '@aziontech/theme';\n@import '@aziontech/webkit/styles';\n")
    const check = planDoctor(dir).find((c) => c.check === 'webkit.css @source')
    assert.equal(check?.status, 'fail')
    assert.match(check.detail, /webkit\.sources\.css/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init adds the Vite plugin to an existing config, once', () => {
  const dir = makeApp()
  try {
    put(
      dir,
      'vite.config.ts',
      "import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [vue()]\n})\n"
    )
    applyPlan(dir, planInit(dir, {}))
    const cfg = readFileSync(join(dir, 'vite.config.ts'), 'utf8')
    assert.match(cfg, /^import webkit from '@aziontech\/webkit\/vite-plugin'$/m)
    assert.match(cfg, /plugins: \[webkit\(\), vue\(\)\]/)
    assert.equal(patchViteConfig(cfg), cfg)
    assert.equal(planDoctor(dir).find((c) => c.check === 'webkit vite plugin')?.status, 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a config with no plugins array is advised, not rewritten', () => {
  assert.equal(patchViteConfig('export default {}\n'), null)
})
