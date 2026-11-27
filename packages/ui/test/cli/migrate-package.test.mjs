import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'

import { planMigrate } from '../../src/cli/migrate.js'
import { migratePackageText, planPackageMigration } from '../../src/cli/migrate-package.js'
import { declaredMajor } from '../../src/cli/migrate-version.js'

function project(files) {
  const dir = mkdtempSync(join(tmpdir(), 'migrate-package-'))
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true })
    writeFileSync(join(dir, name), content)
  }
  return dir
}

const read = (dir, name) => readFileSync(join(dir, name), 'utf8')

test('migratePackageText rewrites imports, lint rule ids and stylesheet names', () => {
  const { source, changes } = migratePackageText(
    [
      "import Button from '@aziontech/webkit/button'",
      "import { webkit } from '@aziontech/webkit/vite-plugin'",
      "@import './webkit.sources.css';",
      "rules: { 'webkit/no-style-override': 'off' }",
      "import './webkit.css'",
      'process.env.WEBKIT_CATALOG_PATH',
      "args: ['@aziontech/webkit-mcp']"
    ].join('\n')
  )
  assert.equal(
    source,
    [
      "import Button from '@aziontech/ui/button'",
      "import { webkit } from '@aziontech/ui/vite-plugin'",
      "@import './azion-ui.sources.css';",
      "rules: { 'azion-ui/no-style-override': 'off' }",
      "import './azion-ui.css'",
      'process.env.AZION_UI_CATALOG_PATH',
      "args: ['@aziontech/ui-mcp']"
    ].join('\n')
  )
  assert.ok(changes.includes('@aziontech/webkit → @aziontech/ui'))
  assert.ok(changes.includes('lint rules webkit/* → azion-ui/*'))
})

test('migratePackageText leaves CSS vendor prefixes and other packages alone', () => {
  const input = [
    '.x { -webkit-line-clamp: 2; }',
    '::-webkit-scrollbar { width: 0 }',
    "import x from '@aziontech/theme'",
    "import y from 'packages/webkit-like'"
  ].join('\n')
  assert.equal(migratePackageText(input).source, input)
})

test('a 5.x app moves to @aziontech/ui: dependencies, files, MCP server and AI bundle', () => {
  const dir = project({
    'package.json': JSON.stringify({
      scripts: { 'lint:ds': 'webkit check', setup: 'npx webkit init' },
      dependencies: { '@aziontech/webkit': '^5.13.0', vue: '^3.5.0' },
      devDependencies: { '@aziontech/webkit-mcp': '^5.13.0' }
    }),
    'src/main.ts': "import './webkit.css'\nimport { createApp } from 'vue'\n",
    'src/webkit.css': "@import '@aziontech/webkit/styles';\n@import './webkit.sources.css';\n",
    'src/webkit.sources.css':
      "@source '../node_modules/@aziontech/webkit/src/components/action/button';\n",
    'eslint.config.js':
      "import webkit from '@aziontech/webkit/eslint-plugin'\nexport default [...webkit.configs.recommended, { rules: { 'webkit/no-style-override': 'warn' } }]\n",
    '.mcp.json': JSON.stringify({
      mcpServers: {
        other: { command: 'x' },
        webkit: { command: 'npx', args: ['-y', '-p', '@aziontech/webkit', 'webkit-mcp'] }
      }
    }),
    'AGENTS.md': '<!-- @aziontech/webkit:start -->\nUse webkit.\n<!-- @aziontech/webkit:end -->\n',
    '.claude/skills/webkit-usage/SKILL.md':
      '<!-- webkit-sync source=skills/webkit-usage/SKILL.md version=5.13.0 sha256=0123456789abcdef -->\nbody\n',
    '.claude/skills/webkit-ui-states/SKILL.md': 'states\n',
    '.claude/rules/webkit-tokens.md': 'tokens\n',
    '.claude/agents/webkit-reviewer.md': 'reviewer\n',
    'webkit.blocks.json': JSON.stringify({ blocks: {} }),
    '.stylelintrc.json': JSON.stringify({ extends: ['@aziontech/webkit/stylelint-config'] }),
    'lint.config.js': "export default { rules: { 'webkit/prefer-webkit-component': 'error' } }\n"
  })
  try {
    const results = planMigrate(dir)
    const pkg = JSON.parse(read(dir, 'package.json'))
    assert.equal(pkg.dependencies['@aziontech/webkit'], undefined)
    assert.match(pkg.dependencies['@aziontech/ui'], /^\^\d+\.0\.0$/)
    assert.match(pkg.devDependencies['@aziontech/ui-mcp'], /^\^\d+\.0\.0$/)
    assert.deepEqual(Object.keys(pkg.dependencies), ['@aziontech/ui', 'vue'])
    assert.equal(pkg.scripts['lint:ds'], 'azion-ui check')
    assert.equal(pkg.scripts.setup, 'npx azion-ui init')

    assert.equal(
      read(dir, 'src/main.ts'),
      "import './azion-ui.css'\nimport { createApp } from 'vue'\n"
    )
    assert.ok(!existsSync(join(dir, 'src/webkit.css')))
    assert.equal(
      read(dir, 'src/azion-ui.css'),
      "@import '@aziontech/ui/styles';\n@import './azion-ui.sources.css';\n"
    )
    assert.match(read(dir, 'src/azion-ui.sources.css'), /node_modules\/@aziontech\/ui\/src/)
    assert.match(read(dir, 'eslint.config.js'), /from '@aziontech\/ui\/eslint-plugin'/)
    assert.match(read(dir, 'eslint.config.js'), /'azion-ui\/no-style-override': 'warn'/)

    const mcp = JSON.parse(read(dir, '.mcp.json'))
    assert.equal(mcp.mcpServers.webkit, undefined)
    assert.equal(mcp.mcpServers['azion-ui'].args[0], '-y')
    assert.match(mcp.mcpServers['azion-ui'].args[1], /^@aziontech\/ui-mcp@\^\d+$/)
    assert.deepEqual(mcp.mcpServers.other, { command: 'x' })

    assert.match(read(dir, 'AGENTS.md'), /<!-- @aziontech\/ui:start -->/)
    assert.match(read(dir, '.agents/skills/azion-ui-usage/SKILL.md'), /^<!-- azion-ui-sync source=/)
    assert.ok(existsSync(join(dir, '.agents/skills/azion-ui-states/SKILL.md')))
    assert.ok(existsSync(join(dir, '.agents/rules/azion-ui-tokens.md')))
    assert.ok(existsSync(join(dir, '.agents/agents/azion-ui-reviewer.md')))
    assert.ok(!existsSync(join(dir, '.claude/skills/webkit-usage')))
    assert.ok(existsSync(join(dir, 'azion-ui.blocks.json')))
    assert.ok(!existsSync(join(dir, 'webkit.blocks.json')))

    assert.match(read(dir, '.stylelintrc.json'), /@aziontech\/ui\/stylelint-config/)
    assert.match(read(dir, 'lint.config.js'), /'azion-ui\/prefer-azion-ui-component'/)

    const all = JSON.stringify(results)
    assert.match(all, /@aziontech\/webkit → @aziontech\/ui/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a dry run reports the package move and writes nothing', () => {
  const dir = project({
    'package.json': JSON.stringify({ dependencies: { '@aziontech/webkit': '^5.13.0' } }),
    'src/webkit.css': "@import '@aziontech/webkit/styles';\n"
  })
  try {
    const results = planPackageMigration(dir, { dryRun: true })
    assert.ok(results.some((r) => r.file === 'package.json'))
    assert.ok(results.some((r) => r.changes.includes('moved to src/azion-ui.css')))
    assert.match(read(dir, 'package.json'), /@aziontech\/webkit/)
    assert.ok(existsSync(join(dir, 'src/webkit.css')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('declaredMajor reads the major from the old package name', () => {
  const dir = project({
    'package.json': JSON.stringify({ dependencies: { '@aziontech/webkit': '^5.13.0' } })
  })
  try {
    assert.equal(declaredMajor(dir).major, 5)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a file the new name already holds is never overwritten', () => {
  const dir = project({
    'src/webkit.css': 'old\n',
    'src/azion-ui.css': 'new\n'
  })
  try {
    const results = planPackageMigration(dir)
    assert.equal(read(dir, 'src/azion-ui.css'), 'new\n')
    assert.ok(results.some((r) => r.warnings.some((w) => /already exists/.test(w))))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
