import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import stylelint from 'stylelint'

import { applyPlan } from '../../src/cli/apply.js'
import { cssScanFindings } from '../../src/cli/css-check.js'
import { planInit } from '../../src/cli/plan.js'
import { cleanup, cli, cliJson, makeProject, PKG_ROOT } from './_helpers/cli-project.mjs'

const BAD = `<script setup>
import Paginator from '@aziontech/webkit/paginator'
import Ghost from '@aziontech/webkit/not-a-thing'
</script>

<template>
  <div class="ml-2 text-left bg-[#ff0000]"><Paginator /><Ghost /></div>
</template>

<style scoped>
.x { color: #123456; }
</style>
`

const BAD_CSS = `.a {
  color: rgb(1, 2, 3);
  margin: 0px;
  width: calc(100% - 0rem);
  transition: all 150ms;
}
`

const STYLELINT_RC = JSON.stringify({
  extends: ['@aziontech/webkit/stylelint-config'],
  overrides: [{ files: ['**/*.vue'], customSyntax: 'postcss-html' }]
})

const by = (json, source) => json.findings.filter((f) => f.source === source)

function packageDir(name, from) {
  const require = createRequire(join(from, 'package.json'))
  let dir = dirname(require.resolve(name))
  while (
    !existsSync(join(dir, 'package.json')) ||
    readJson(join(dir, 'package.json')).name !== name
  ) {
    const parent = dirname(dir)
    if (parent === dir) throw new Error(`no package.json for ${name}`)
    dir = parent
  }
  return dir
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function postcssHtml() {
  try {
    return packageDir(
      'postcss-html',
      packageDir('stylelint-config-recommended-vue', join(PKG_ROOT, '..', '..'))
    )
  } catch {
    return null
  }
}

function withStylelint(files) {
  const dir = makeProject({ '.stylelintrc.json': STYLELINT_RC, ...files }, { installWebkit: true })
  for (const [name, target] of [
    ['stylelint', packageDir('stylelint', PKG_ROOT)],
    ['postcss-html', postcssHtml()]
  ]) {
    mkdirSync(join(dir, 'node_modules'), { recursive: true })
    symlinkSync(target, join(dir, 'node_modules', name), 'dir')
  }
  return dir
}

const hits = (findings) => findings.map((f) => `${f.file}:${f.line} ${f.rule}`).sort()

function initialised(files) {
  const dir = makeProject(files, { installWebkit: true })
  applyPlan(dir, planInit(dir, { icons: false }))
  return dir
}

test('check gathers doctor, v5 names, unknown imports and the built-in style scan', () => {
  const dir = makeProject({ 'src/views/Bad.vue': BAD, 'src/bad.css': BAD_CSS })
  try {
    const r = cliJson(dir, 'check', '--no-lint')
    assert.equal(r.code, 1)
    assert.equal(r.json.exitCode, 1)
    assert.ok(
      by(r.json, 'doctor').some((f) => f.check === 'eslint config' && f.severity === 'error')
    )
    const migration = by(r.json, 'migration')
    assert.equal(migration.length, 1)
    assert.match(migration[0].message, /paginator → @aziontech\/webkit\/pagination/)
    const imports = by(r.json, 'imports')
    assert.equal(imports.length, 1)
    assert.equal(imports[0].line, 3)
    assert.match(imports[0].message, /not-a-thing is not exported/)
    const style = by(r.json, 'style').map((f) => f.message)
    assert.ok(style.some((m) => m.includes('"ml-2"') && m.includes('"ms-2"')))
    assert.ok(style.some((m) => m.includes('"text-left"')))
    assert.ok(style.some((m) => m.includes('#ff0000')))
    assert.ok(
      by(r.json, 'lint').some((f) => f.severity === 'warn' && /did not run/.test(f.message))
    )
    assert.equal(r.json.stylelint, false)
    assert.deepEqual(hits(by(r.json, 'css')), [
      'src/bad.css:2 function-disallowed-list',
      'src/bad.css:3 length-zero-no-unit',
      'src/bad.css:5 declaration-property-value-disallowed-list',
      'src/views/Bad.vue:11 color-no-hex'
    ])
    assert.ok(by(r.json, 'css').every((f) => f.severity === 'error'))
    assert.ok(
      by(r.json, 'stylelint').some(
        (f) => f.severity === 'warn' && /Stylelint did not run \(--no-lint\)/.test(f.message)
      )
    )
    assert.equal(r.json.errors, r.json.findings.filter((f) => f.severity === 'error').length)

    const text = cli(dir, 'check', '--no-lint')
    assert.match(text.stdout, /^\[migration\]$/m)
    assert.match(text.stdout, /ERROR src\/views\/Bad\.vue:3 — /)
    assert.match(text.stdout, /\d+ error\(s\), \d+ warning\(s\) in 1 source file\(s\)\./)
  } finally {
    cleanup(dir)
  }
})

test('check passes a wired project and enforces --max-warnings', () => {
  const dir = initialised({
    'src/main.ts': "import './webkit.css'\n",
    'src/App.vue':
      '<script setup>\nimport WebkitProvider from \'@aziontech/webkit/webkit-provider\'\nimport Button from \'@aziontech/webkit/button\'\n</script>\n<template><WebkitProvider><Button label="Go" class="ms-2" /></WebkitProvider></template>\n'
  })
  try {
    const r = cliJson(dir, 'check', '--no-lint')
    const errors = r.json.findings.filter((f) => f.severity === 'error')
    assert.deepEqual(errors, [])
    assert.equal(r.code, 0)
    assert.ok(r.json.warnings > 0)
    const capped = cliJson(dir, 'check', '--no-lint', '--max-warnings', '0')
    assert.equal(capped.code, 1)
    const loose = cliJson(dir, 'check', '--no-lint', '--max-warnings', String(r.json.warnings))
    assert.equal(loose.code, 0)
    assert.equal(cli(dir, 'check', '--max-warnings', 'x').code, 2)
  } finally {
    cleanup(dir)
  }
})

test('check warns when a copied block drifted from the canonical one', () => {
  const dir = initialised({ 'src/main.ts': "import './webkit.css'\n" })
  try {
    assert.equal(cli(dir, 'add', 'headers/auth-header').code, 0)
    const manifestPath = join(dir, 'webkit.blocks.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    manifest.blocks['headers/auth-header'].files[0].checksum = 'sha256:old'
    manifest.blocks['headers/auth-header'].files.push({
      path: 'src/views/Gone.vue',
      source: 'blocks/headers/auth-header/auth-header.vue',
      variant: 'Default',
      checksum: 'sha256:x'
    })
    writeFileSync(manifestPath, JSON.stringify(manifest))
    const r = cliJson(dir, 'check', '--no-lint')
    const drift = by(r.json, 'blocks')
    assert.ok(
      drift.some((f) => f.file === 'src/views/AuthHeader.vue' && /changed since/.test(f.message))
    )
    assert.ok(drift.some((f) => f.file === 'src/views/Gone.vue' && /file is gone/.test(f.message)))
    assert.ok(drift.every((f) => f.severity === 'warn'))
  } finally {
    cleanup(dir)
  }
})

test('the built-in CSS scan reports what the webkit stylelint config reports', async (t) => {
  const syntax = postcssHtml()
  if (!syntax) return t.skip('postcss-html is not resolvable in this install')
  const dir = makeProject({
    'src/bad.css': BAD_CSS,
    'src/clean.css':
      '.ok {\n  color: var(--text-default);\n  margin: 0;\n  transition: opacity var(--duration-fast);\n}\n',
    'src/views/Bad.vue': BAD,
    'src/views/Inline.vue':
      '<template>\n  <div style="color: #fff; padding: 0em">x</div>\n</template>\n<style lang="scss">\n// a comment: #000\n.a {\n  &:hover { background: white; }\n}\n</style>\n'
  })
  try {
    const { default: config } = await import('../../src/stylelint-config.js')
    const { results } = await stylelint.lint({
      cwd: dir,
      files: 'src/**/*.{css,vue}',
      config: {
        ...config,
        overrides: [
          {
            files: ['**/*.vue'],
            customSyntax: createRequire(join(dirname(syntax), 'x.js')).resolve('postcss-html')
          }
        ]
      }
    })
    const real = results.flatMap((r) =>
      r.warnings.map((w) => ({ file: r.source.slice(dir.length + 1), line: w.line, rule: w.rule }))
    )
    assert.ok(real.length >= 6)
    assert.deepEqual(hits(cssScanFindings(dir).findings), hits(real))
  } finally {
    cleanup(dir)
  }
})

test('check runs the project Stylelint like the pre-commit hook, with JSON and --max-warnings', (t) => {
  if (!postcssHtml()) return t.skip('postcss-html is not resolvable in this install')
  const dir = withStylelint({ 'src/views/Bad.vue': BAD, 'src/bad.css': BAD_CSS })
  try {
    const hook = spawnSync(
      process.execPath,
      [
        join(dir, 'node_modules', 'stylelint', 'bin', 'stylelint.mjs'),
        'src/**/*.{css,scss,vue}',
        '--allow-empty-input'
      ],
      { cwd: dir, encoding: 'utf8' }
    )
    assert.notEqual(hook.status, 0)

    const r = cliJson(dir, 'check')
    assert.equal(r.json.stylelint, true)
    assert.equal(r.code, 1)
    const found = by(r.json, 'stylelint')
    assert.ok(
      found.some(
        (f) => f.file === 'src/views/Bad.vue' && f.line === 11 && f.rule === 'color-no-hex'
      )
    )
    assert.ok(found.some((f) => f.file === 'src/bad.css' && f.rule === 'length-zero-no-unit'))
    assert.ok(found.every((f) => f.severity === 'error' && !/\(color-no-hex\)$/.test(f.message)))
    assert.deepEqual(by(r.json, 'css'), [])
    assert.ok(!found.some((f) => /did not run/.test(f.message)))
    assert.match(cli(dir, 'check').stdout, /^\[stylelint\]$/m)
  } finally {
    cleanup(dir)
  }
})

test('check counts Stylelint warnings against --max-warnings', (t) => {
  if (!postcssHtml()) return t.skip('postcss-html is not resolvable in this install')
  const dir = withStylelint({
    '.stylelintrc.json': JSON.stringify({
      extends: ['@aziontech/webkit/stylelint-config'],
      rules: { 'length-zero-no-unit': [true, { severity: 'warning' }] }
    }),
    'src/ok.css': '.a {\n  margin: 0px;\n}\n'
  })
  try {
    const r = cliJson(dir, 'check')
    assert.equal(r.json.stylelint, true)
    const warned = by(r.json, 'stylelint')
    assert.deepEqual(
      warned.map((f) => [f.file, f.line, f.rule, f.severity]),
      [['src/ok.css', 2, 'length-zero-no-unit', 'warn']]
    )
    assert.ok(r.json.warnings >= 1)
    assert.equal(cliJson(dir, 'check', '--max-warnings', String(r.json.warnings - 1)).code, 1)
    const loose = cliJson(dir, 'check', '--max-warnings', String(r.json.warnings))
    assert.equal(loose.code, r.json.errors ? 1 : 0)
  } finally {
    cleanup(dir)
  }
})
