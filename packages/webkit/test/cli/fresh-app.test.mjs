import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { ESLint } from 'eslint'
import stylelint from 'stylelint'

import { applyPlan } from '../../src/cli/apply.js'
import { planDoctor } from '../../src/cli/doctor.js'
import {
  _internals,
  BUILD_OUTPUT_DIRS,
  gitState,
  HUSKY_HOOK_MARKER,
  LEGACY_HUSKY_HOOK_MARKER,
  planInit
} from '../../src/cli/plan.js'
import { PKG_ROOT } from './_helpers/cli-project.mjs'

const requireFromWebkit = createRequire(join(PKG_ROOT, 'package.json'))

function packageDir(name) {
  let dir = dirname(requireFromWebkit.resolve(name))
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

function link(dir, name, target) {
  const at = join(dir, 'node_modules', name)
  mkdirSync(dirname(at), { recursive: true })
  symlinkSync(target, at, 'dir')
}

function makeApp(files = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-fresh-'))
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'fresh', version: '0.0.0', type: 'module' }, null, 2)
  )
  const all = {
    'vite.config.ts':
      "import vue from '@vitejs/plugin-vue'\nimport { defineConfig } from 'vite'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [vue()],\n})\n",
    'src/main.ts':
      "import { createApp } from 'vue'\nimport App from './App.vue'\n\ncreateApp(App).mount('#app')\n",
    'src/style.css': ':root {\n  color: var(--text-default);\n}\n',
    'dist/assets/index-abc123.js': '// built by vite\nconst a="#ff0000";export{a};\n',
    'dist/assets/index-abc123.css': '.x{color:#ff0000;transition:all 150ms}\n',
    ...files
  }
  for (const [rel, content] of Object.entries(all)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true })
    writeFileSync(join(dir, rel), content)
  }
  return dir
}

function git(dir, ...args) {
  return spawnSync('git', args, { cwd: dir, encoding: 'utf8' })
}

const hasGit = !git(tmpdir(), '--version').error

test('the generated eslint config lints a fresh app clean and never the build output', async () => {
  const dir = makeApp()
  try {
    applyPlan(dir, planInit(dir, { wireEntry: false }))
    link(dir, '@aziontech/webkit', PKG_ROOT)
    for (const dep of [
      'eslint-plugin-vuejs-accessibility',
      'vue-eslint-parser',
      '@typescript-eslint/parser'
    ]) {
      link(dir, dep, packageDir(dep))
    }

    const eslint = new ESLint({ cwd: dir })
    const results = await eslint.lintFiles(['.'])
    const linted = results.map((r) => r.filePath.slice(dir.length + 1)).sort()
    assert.ok(
      linted.every((f) => !f.startsWith('dist/') && !f.startsWith('node_modules/')),
      `build output was linted: ${linted.join(', ')}`
    )
    assert.ok(linted.includes('eslint.config.mjs') && linted.includes('vite.config.ts'))
    const messages = results.flatMap((r) =>
      r.messages.map((m) => `${r.filePath.slice(dir.length + 1)}:${m.line} ${m.ruleId}`)
    )
    assert.deepEqual(messages, [])

    writeFileSync(join(dir, 'src/format.ts'), '// explains the code\nexport const x = 1\n')
    const [own] = await eslint.lintFiles(['src/format.ts'])
    assert.deepEqual(
      own.messages.map((m) => m.ruleId),
      ['webkit/authoring-standards'],
      'the tool-config exemption must not reach the source'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the generated .stylelintignore keeps stylelint off the compiled CSS', async () => {
  const dir = makeApp()
  try {
    applyPlan(dir, planInit(dir, { wireEntry: false }))
    link(dir, '@aziontech/webkit', PKG_ROOT)
    assert.equal(readFileSync(join(dir, '.stylelintignore'), 'utf8'), _internals.STYLELINT_IGNORE)
    for (const out of BUILD_OUTPUT_DIRS) {
      assert.match(_internals.STYLELINT_IGNORE, new RegExp(`^${out.replace('.', '\\.')}/$`, 'm'))
    }

    const { results } = await stylelint.lint({ files: '**/*.css', cwd: dir })
    const linted = results.map((r) => r.source.slice(dir.length + 1)).sort()
    assert.deepEqual(linted, ['src/style.css', 'src/webkit.css'])
    assert.ok(results.every((r) => !r.errored))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the pre-commit hook lints only the source, and an existing .stylelintignore is advised', () => {
  const hook = _internals.HUSKY_PRECOMMIT
  assert.ok(hook.includes(HUSKY_HOOK_MARKER))
  assert.match(hook, /^npx eslint src /m)
  assert.match(hook, /^npx stylelint "src\/\*\*\/\*\.\{css,scss,vue\}"/m)
  assert.doesNotMatch(hook, /npx eslint \.$/m)

  const dir = makeApp({ '.stylelintignore': 'tmp/\n' })
  try {
    const plan = planInit(dir, {})
    assert.ok(!plan.some((a) => a.type === 'write' && a.path === '.stylelintignore'))
    assert.ok(
      plan.some(
        (a) =>
          a.type === 'advise' && a.message.includes('.stylelintignore') && /dist\//.test(a.message)
      )
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init upgrades the whole-tree hook an older init wrote, keeping the user lines', () => {
  const legacy =
    'npm test\n# Lint with the webkit rules before every commit.\nnpx eslint .\nnpx stylelint "**/*.{css,scss,vue}"\n'
  const dir = makeApp({ '.husky/pre-commit': legacy })
  try {
    const plan = planInit(dir, {})
    assert.ok(!plan.some((a) => a.type === 'append' && a.path === '.husky/pre-commit'))
    applyPlan(dir, plan)
    const hook = readFileSync(join(dir, '.husky/pre-commit'), 'utf8')
    assert.equal(hook, `npm test\n${_internals.HUSKY_PRECOMMIT}`)
    assert.ok(!hook.includes(LEGACY_HUSKY_HOOK_MARKER))

    const again = planInit(dir, {})
    applyPlan(dir, again)
    assert.equal(readFileSync(join(dir, '.husky/pre-commit'), 'utf8'), hook)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns about a whole-tree hook and about build output that is not ignored', () => {
  const dir = makeApp({
    'eslint.config.mjs':
      "import webkit from '@aziontech/webkit/eslint-plugin'\nexport default [...webkit.configs.recommended]\n",
    '.stylelintrc.json': '{ "extends": ["@aziontech/webkit/stylelint-config"] }\n',
    '.husky/pre-commit': 'npx eslint .\nnpx stylelint "**/*.{css,scss,vue}"\n'
  })
  try {
    const report = planDoctor(dir)
    const byCheck = Object.fromEntries(report.map((c) => [c.check, c]))
    assert.equal(byCheck['pre-commit hook'].status, 'warn')
    assert.match(byCheck['pre-commit hook'].detail, /build output/)
    assert.equal(byCheck['build output ignored'].status, 'warn')
    assert.match(byCheck['build output ignored'].detail, /eslint\.config\.mjs does not ignore dist/)
    assert.match(byCheck['build output ignored'].detail, /\.stylelintignore/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init outside a git repository advises git init + npx husky, and doctor reports it', () => {
  const dir = makeApp()
  try {
    const plan = planInit(dir, {})
    assert.ok(!plan.some((a) => a.type === 'activate-hooks'))
    const note = plan.find((a) => a.type === 'advise' && /not a git repository/.test(a.message))
    assert.ok(note, 'expected the not-a-git-repository note')
    assert.match(note.message, /git init/)
    assert.match(note.message, /npx husky/)

    applyPlan(dir, plan)
    const report = planDoctor(dir)
    const hooks = report.find((c) => c.check === 'git hooks')
    assert.equal(hooks.status, 'warn')
    assert.match(hooks.detail, /not a git repository/)
    assert.equal(report.find((c) => c.check === 'build output ignored').status, 'ok')
    assert.equal(report.find((c) => c.check === 'pre-commit hook').status, 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test(
  'init inside a git repository activates the husky hooks once husky is installed',
  { skip: !hasGit && 'git is not installed' },
  () => {
    const dir = makeApp()
    try {
      assert.equal(git(dir, 'init', '-q').status, 0)

      const before = planInit(dir, {})
      assert.ok(!before.some((a) => a.type === 'activate-hooks'), 'husky is not installed yet')
      assert.ok(
        before.some((a) => a.type === 'advise' && /runs the "prepare" script/.test(a.message))
      )
      applyPlan(dir, before)
      const inactive = planDoctor(dir).find((c) => c.check === 'git hooks')
      assert.equal(inactive.status, 'warn')
      assert.match(inactive.detail, /npx husky/)

      link(dir, 'husky', packageDir('husky'))
      const plan = planInit(dir, {})
      assert.ok(plan.some((a) => a.type === 'activate-hooks'))
      const results = applyPlan(dir, plan)
      const activated = results.find((r) => r.action.type === 'activate-hooks')
      assert.equal(activated.result, 'written', activated.detail)
      assert.equal(gitState(dir).hooksPath, '.husky/_')
      assert.ok(existsSync(join(dir, '.husky/_/pre-commit')))
      assert.equal(planDoctor(dir).find((c) => c.check === 'git hooks').status, 'ok')

      assert.ok(!planInit(dir, {}).some((a) => a.type === 'activate-hooks'), 'already active')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
)

test(
  'init in a project below the git root advises the husky subdirectory setup',
  { skip: !hasGit && 'git is not installed' },
  () => {
    const root = mkdtempSync(join(tmpdir(), 'webkit-mono-'))
    try {
      assert.equal(git(root, 'init', '-q').status, 0)
      const dir = join(root, 'apps', 'web')
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'package.json'), '{ "name": "web" }\n')
      const plan = planInit(dir, {})
      assert.ok(!plan.some((a) => a.type === 'activate-hooks'))
      const note = plan.find((a) => a.type === 'advise' && /git root/.test(a.message))
      assert.ok(note)
      assert.match(note.message, /"prepare": "cd \.\.\/\.\. && husky apps\/web\/\.husky"/)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }
)

test('init and doctor flag a starter stylesheet with raw colours before the first commit fails on it', () => {
  const dir = makeApp({
    'src/style.css':
      ':root {\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n}\n',
    'src/components/card.scss': '.card {\n  color: var(--text-default);\n}\n'
  })
  try {
    const plan = planInit(dir, {})
    const note = plan.find((a) => a.type === 'advise' && /raw colours/.test(a.message))
    assert.ok(note, 'expected the raw-colour note')
    assert.match(note.message, /^src\/style\.css uses raw colours/)
    assert.doesNotMatch(note.message, /card\.scss|webkit\.css|dist/)

    applyPlan(dir, plan)
    const check = planDoctor(dir).find((c) => c.check === 'raw colours in styles')
    assert.equal(check.status, 'warn')
    assert.match(check.detail, /^src\/style\.css —/)

    writeFileSync(join(dir, 'src/style.css'), ':root {\n  color: var(--text-default);\n}\n')
    assert.ok(!planInit(dir, {}).some((a) => a.type === 'advise' && /raw colours/.test(a.message)))
    assert.ok(!planDoctor(dir).some((c) => c.check === 'raw colours in styles'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
