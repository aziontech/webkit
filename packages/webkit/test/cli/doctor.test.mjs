import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { planInit } from '../../src/cli/plan.js'
import { applyPlan } from '../../src/cli/apply.js'
import { planDoctor } from '../../src/cli/doctor.js'

function makeProject(pkg = { name: 'demo', version: '1.0.0' }) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-doctor-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  return dir
}

const statusOf = (report, check) => report.find((c) => c.check === check)?.status
const detailOf = (report, check) => report.find((c) => c.check === check)

test('doctor on a bare project fails the required checks', () => {
  const dir = makeProject()
  try {
    const report = planDoctor(dir)
    assert.equal(statusOf(report, 'webkit catalog'), 'fail')
    assert.equal(statusOf(report, 'eslint config'), 'fail')
    assert.equal(statusOf(report, 'stylelint config'), 'fail')
    assert.equal(statusOf(report, 'webkit.css @source'), 'fail')
    assert.equal(statusOf(report, 'mcp server'), 'fail')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when src/webkit.css does not keep the AI guidance files out of the scan', () => {
  const dir = makeProject()
  try {
    mkdirSync(join(dir, 'src'))
    writeFileSync(
      join(dir, 'src/webkit.css'),
      "@import '@aziontech/theme';\n@import './webkit.sources.css';\n@source not '../.claude';\n"
    )
    const warned = detailOf(planDoctor(dir), 'webkit.css @source not')
    assert.equal(warned.status, 'warn')
    assert.match(warned.detail, /CLAUDE\.md, AGENTS\.md/)
    assert.match(warned.detail, /`@source not '\.\.\/AGENTS\.md';`/)
    writeFileSync(
      join(dir, 'src/webkit.css'),
      "@import './webkit.sources.css';\n@source not '../.claude';\n@source not '../CLAUDE.md';\n@source not '../AGENTS.md';\n"
    )
    assert.equal(statusOf(planDoctor(dir), 'webkit.css @source not'), 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor fails a v5 .mcp.json that still runs the webkit-mcp bin of @aziontech/webkit', () => {
  const dir = makeProject()
  try {
    writeFileSync(
      join(dir, '.mcp.json'),
      JSON.stringify({
        mcpServers: {
          webkit: { command: 'npx', args: ['-y', '-p', '@aziontech/webkit', 'webkit-mcp'] }
        }
      })
    )
    const report = planDoctor(dir)
    assert.equal(statusOf(report, 'mcp server'), 'fail')
    assert.match(detailOf(report, 'mcp server').detail, /@aziontech\/webkit-mcp/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

const hasGit = !spawnSync('git', ['--version']).error

test(
  'doctor after init passes the config/mcp/husky/style checks',
  { skip: !hasGit && 'git is not installed' },
  () => {
    const dir = makeProject()
    try {
      spawnSync('git', ['init', '-q'], { cwd: dir })
      applyPlan(dir, planInit(dir, {}))
      const report = planDoctor(dir)
      assert.equal(statusOf(report, 'eslint config'), 'ok')
      assert.equal(statusOf(report, 'stylelint config'), 'ok')
      assert.equal(statusOf(report, 'webkit.css @source'), 'ok')
      assert.equal(statusOf(report, 'tailwind build'), 'ok')
      assert.equal(statusOf(report, 'mcp server'), 'ok')
      assert.equal(statusOf(report, 'husky prepare script'), 'ok')
      assert.equal(statusOf(report, 'pre-commit hook'), 'ok')
      // webkit is not actually installed in the scratch project → catalog still fails.
      assert.equal(statusOf(report, 'webkit catalog'), 'fail')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
)

test('doctor does not warn about the git hooks init skipped outside a git repository', () => {
  const dir = makeProject()
  try {
    applyPlan(dir, planInit(dir, {}))
    const report = planDoctor(dir)
    assert.equal(statusOf(report, 'git hooks'), 'ok')
    assert.match(detailOf(report, 'git hooks').detail, /git init/)
    assert.equal(statusOf(report, 'husky prepare script'), undefined)
    assert.equal(statusOf(report, 'pre-commit hook'), undefined)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor accepts Tailwind through @tailwindcss/vite with no PostCSS config, as init plans it', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    devDependencies: { '@tailwindcss/vite': '^4.0.0', vite: '^7.0.0' }
  })
  try {
    applyPlan(dir, planInit(dir, {}))
    assert.equal(existsSync(join(dir, 'postcss.config.mjs')), false)
    const check = detailOf(planDoctor(dir), 'tailwind build')
    assert.equal(check.status, 'ok')
    assert.match(check.detail, /@tailwindcss\/vite/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor finds @tailwindcss/vite in vite.config when package.json does not list it', () => {
  const dir = makeProject()
  try {
    writeFileSync(
      join(dir, 'vite.config.ts'),
      "import tailwindcss from '@tailwindcss/vite'\nexport default { plugins: [tailwindcss()] }\n"
    )
    assert.equal(statusOf(planDoctor(dir), 'tailwind build'), 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when Tailwind runs through both @tailwindcss/vite and PostCSS', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    devDependencies: { '@tailwindcss/vite': '^4.0.0' }
  })
  try {
    writeFileSync(
      join(dir, 'postcss.config.mjs'),
      "export default { plugins: { '@tailwindcss/postcss': {} } }\n"
    )
    const check = detailOf(planDoctor(dir), 'tailwind build')
    assert.equal(check.status, 'warn')
    assert.match(check.detail, /processed twice/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when neither @tailwindcss/vite nor a Tailwind PostCSS config is present', () => {
  const dir = makeProject()
  try {
    assert.equal(statusOf(planDoctor(dir), 'tailwind build'), 'warn')
    writeFileSync(join(dir, 'postcss.config.mjs'), 'export default { plugins: {} }\n')
    assert.match(
      detailOf(planDoctor(dir), 'tailwind build').detail,
      /does not load @tailwindcss\/postcss/
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor resolves the catalog via WEBKIT_CATALOG_PATH', () => {
  const dir = makeProject()
  const catalog = join(dir, 'catalog.json')
  writeFileSync(
    catalog,
    JSON.stringify({ package: '@aziontech/webkit', webkitVersion: '1.2.3', imports: {} })
  )
  const prev = process.env.WEBKIT_CATALOG_PATH
  process.env.WEBKIT_CATALOG_PATH = catalog
  try {
    const report = planDoctor(dir)
    const c = report.find((x) => x.check === 'webkit catalog')
    assert.equal(c.status, 'ok')
    assert.match(c.detail, /1\.2\.3/)
  } finally {
    if (prev === undefined) delete process.env.WEBKIT_CATALOG_PATH
    else process.env.WEBKIT_CATALOG_PATH = prev
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when a toolkit dependency is pinned as "latest" and reports installed version', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    dependencies: { '@aziontech/webkit': 'latest' }
  })
  try {
    // Simulate the installed package so doctor can read its resolved version.
    const inst = join(dir, 'node_modules', '@aziontech', 'webkit')
    mkdirSync(inst, { recursive: true })
    writeFileSync(
      join(inst, 'package.json'),
      JSON.stringify({ name: '@aziontech/webkit', version: '2.5.0' })
    )

    const report = planDoctor(dir)
    const dep = report.find((c) => c.check === 'dependency versions')
    assert.ok(dep, 'expected a dependency-versions check')
    assert.equal(dep.status, 'warn')
    assert.match(dep.detail, /latest/)
    assert.match(dep.detail, /2\.5\.0/) // installed version surfaced
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when @aziontech/icons is a dependency but not imported at the entry', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    dependencies: { '@aziontech/icons': 'latest' }
  })
  try {
    mkdirSync(join(dir, 'src'))
    writeFileSync(join(dir, 'src/main.ts'), "import { createApp } from 'vue'\n")
    let report = planDoctor(dir)
    assert.equal(statusOf(report, 'icons import'), 'warn')

    writeFileSync(join(dir, 'src/main.ts'), "import '@aziontech/icons'\n")
    report = planDoctor(dir)
    assert.equal(statusOf(report, 'icons import'), 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor flags toast usage with no wired region, and passes once wired', () => {
  const dir = makeProject()
  try {
    mkdirSync(join(dir, 'src/components'), { recursive: true })

    // No toast anywhere → the check does not even appear.
    writeFileSync(join(dir, 'src/main.ts'), "import { createApp } from 'vue'\n")
    assert.equal(statusOf(planDoctor(dir), 'toast setup'), undefined)

    // toast imported, no region wired → warn with the fix.
    writeFileSync(
      join(dir, 'src/components/save.ts'),
      "import { toast } from '@aziontech/webkit/toast'\ntoast.success('Saved')\n"
    )
    const warned = planDoctor(dir).find((c) => c.check === 'toast setup')
    assert.equal(warned.status, 'warn')
    assert.match(warned.detail, /\.use\(ToastPlugin\)/)

    // Service wiring in the entry → ok.
    writeFileSync(
      join(dir, 'src/main.ts'),
      "import { ToastPlugin } from '@aziontech/webkit/toast'\nimport { createApp } from 'vue'\ncreateApp({}).use(ToastPlugin).mount('#app')\n"
    )
    assert.equal(statusOf(planDoctor(dir), 'toast setup'), 'ok')

    // A manually mounted Toaster also counts.
    writeFileSync(join(dir, 'src/main.ts'), "import { createApp } from 'vue'\n")
    writeFileSync(
      join(dir, 'src/components/App.vue'),
      "<script setup>\nimport Toaster from '@aziontech/webkit/toast-root'\n</script>\n<template>\n  <Toaster />\n</template>\n"
    )
    assert.equal(statusOf(planDoctor(dir), 'toast setup'), 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor reports a malformed .mcp.json as a failure, not a crash', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, '.mcp.json'), '{ not valid json')
    const report = planDoctor(dir)
    const mcp = report.find((c) => c.check === 'mcp server')
    assert.equal(mcp.status, 'fail')
    assert.match(mcp.detail, /not valid JSON/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor fails when a second theme copy is nested under webkit or the theme misses the peer range', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    dependencies: { '@aziontech/webkit': '^6.0.0', '@aziontech/theme': '^5.2.2' }
  })
  try {
    const nm = join(dir, 'node_modules', '@aziontech')
    mkdirSync(join(nm, 'webkit', 'node_modules', '@aziontech', 'theme'), { recursive: true })
    mkdirSync(join(nm, 'theme'), { recursive: true })
    writeFileSync(
      join(nm, 'webkit', 'package.json'),
      JSON.stringify({
        name: '@aziontech/webkit',
        version: '6.0.0',
        peerDependencies: { '@aziontech/theme': '^5.2.2' }
      })
    )
    writeFileSync(
      join(nm, 'theme', 'package.json'),
      JSON.stringify({ name: '@aziontech/theme', version: '5.2.2' })
    )
    writeFileSync(
      join(nm, 'webkit', 'node_modules', '@aziontech', 'theme', 'package.json'),
      JSON.stringify({ name: '@aziontech/theme', version: '4.3.1' })
    )
    let c = planDoctor(dir).find((x) => x.check === 'theme version')
    assert.equal(c.status, 'fail')
    assert.match(c.detail, /second copy/)
    rmSync(join(nm, 'webkit', 'node_modules'), { recursive: true, force: true })
    c = planDoctor(dir).find((x) => x.check === 'theme version')
    assert.equal(c.status, 'ok')
    writeFileSync(
      join(nm, 'theme', 'package.json'),
      JSON.stringify({ name: '@aziontech/theme', version: '4.3.1' })
    )
    c = planDoctor(dir).find((x) => x.check === 'theme version')
    assert.equal(c.status, 'fail')
    assert.match(c.detail, /does not satisfy/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
