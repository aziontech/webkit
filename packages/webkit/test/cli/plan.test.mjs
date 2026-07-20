import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { planInit, CLAUDE_FRAGMENT_MARKER, MCP_SERVER_NAME } from '../../src/cli/plan.js'
import { applyPlan } from '../../src/cli/apply.js'

function makeProject() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-cli-'))
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'demo', version: '1.0.0' }, null, 2)
  )
  return dir
}

function findAddDeps(plan) {
  return plan.filter((a) => a.type === 'add-dep').map((a) => a.dep)
}

test('planInit records the runtime and dev dependencies', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const deps = findAddDeps(plan)
    for (const d of ['@aziontech/webkit', '@aziontech/theme', '@aziontech/icons']) {
      assert.ok(deps.includes(d), `missing runtime dep ${d}`)
    }
    // The eslint plugin + stylelint config ship inside @aziontech/webkit now, so they
    // are NOT separate deps; only the tooling peers are added.
    for (const d of ['eslint', 'stylelint', 'vue-eslint-parser', 'husky']) {
      assert.ok(deps.includes(d), `missing dev dep ${d}`)
    }
    assert.ok(
      !deps.includes('@aziontech/eslint-plugin-webkit'),
      'must not add a separate eslint-plugin package'
    )
    assert.ok(
      !deps.includes('@aziontech/stylelint-config-webkit'),
      'must not add a separate stylelint-config package'
    )
    // Dev flag is set correctly.
    const dev = plan.find((a) => a.type === 'add-dep' && a.dep === 'eslint')
    assert.equal(dev.dev, true)
    const runtime = plan.find((a) => a.type === 'add-dep' && a.dep === '@aziontech/webkit')
    assert.equal(runtime.dev, false)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit writes eslint.config.mjs and .stylelintrc.json when absent', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const deps = findAddDeps(plan)
    const eslint = plan.find((a) => a.type === 'write' && a.path === 'eslint.config.mjs')
    assert.ok(eslint, 'expected eslint.config.mjs write action')
    assert.match(eslint.content, /@aziontech\/webkit\/eslint-plugin/)
    assert.match(eslint.content, /configs\.strict/)
    assert.match(eslint.content, /vue-eslint-parser/)
    // Static a11y floor is wired (the lint half of the accessibility skill).
    assert.match(eslint.content, /eslint-plugin-vuejs-accessibility/)
    assert.match(eslint.content, /vuejs-accessibility\/click-events-have-key-events/)
    assert.ok(deps.includes('eslint-plugin-vuejs-accessibility'), 'missing a11y lint dep')

    const stylelint = plan.find((a) => a.type === 'write' && a.path === '.stylelintrc.json')
    assert.ok(stylelint, 'expected .stylelintrc.json write action')
    assert.match(stylelint.content, /@aziontech\/webkit\/stylelint-config/)
    // stylelint config wires the .vue / .scss custom syntaxes
    assert.match(stylelint.content, /postcss-html/)
    assert.match(stylelint.content, /postcss-scss/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit wires the Tailwind + PostCSS pipeline and a CSS entry', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const deps = findAddDeps(plan)
    // Style pipeline deps present and pinned to a range (NOT "latest").
    for (const d of ['tailwindcss', 'postcss', 'autoprefixer']) {
      assert.ok(deps.includes(d), `missing style dep ${d}`)
      const action = plan.find((a) => a.type === 'add-dep' && a.dep === d)
      assert.notEqual(action.version, 'latest', `${d} must be pinned, not "latest"`)
      assert.equal(action.dev, true)
    }
    // Tailwind v3 specifically (matches the theme preset).
    const tw = plan.find((a) => a.type === 'add-dep' && a.dep === 'tailwindcss')
    assert.match(tw.version, /^\^3\./, 'tailwind must be v3 to match the theme preset')

    const twCfg = plan.find((a) => a.type === 'write' && a.path === 'tailwind.config.mjs')
    assert.ok(twCfg, 'expected tailwind.config.mjs write action')
    assert.match(twCfg.content, /@aziontech\/theme\/tailwind-preset/)
    // Critically, it must scan webkit's source so component classes compile.
    assert.match(twCfg.content, /node_modules\/@aziontech\/webkit\/src/)

    const pcCfg = plan.find((a) => a.type === 'write' && a.path === 'postcss.config.mjs')
    assert.ok(pcCfg, 'expected postcss.config.mjs write action')
    assert.match(pcCfg.content, /tailwindcss/)
    assert.match(pcCfg.content, /autoprefixer/)

    const cssEntry = plan.find((a) => a.type === 'write' && a.path === 'src/webkit.css')
    assert.ok(cssEntry, 'expected src/webkit.css write action')
    assert.match(cssEntry.content, /@aziontech\/theme\/globals\.css/)
    assert.match(cssEntry.content, /@tailwind base/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('an existing tailwind config is advised, not overwritten', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'tailwind.config.js'), 'export default {}\n')
    const plan = planInit(dir, {})
    const write = plan.find((a) => a.type === 'write' && a.path.startsWith('tailwind.config'))
    assert.equal(write, undefined, 'must not plan to write over an existing tailwind config')
    const advise = plan.find(
      (a) => a.type === 'advise' && /Tailwind config already exists/.test(a.message)
    )
    assert.ok(advise, 'expected a tailwind merge-snippet advice')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit advises the LIGHT default + data-theme dark opt-in', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const advise = plan.find(
      (a) =>
        a.type === 'advise' &&
        /defaults to LIGHT/.test(a.message) &&
        /data-theme="dark"/.test(a.message)
    )
    assert.ok(advise, 'expected a theme-selection advice mentioning the dark opt-in')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('--recommended selects the recommended eslint preset', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, { recommended: true })
    const eslint = plan.find((a) => a.type === 'write' && a.path === 'eslint.config.mjs')
    assert.match(eslint.content, /configs\.recommended/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('an existing eslint config is advised, not overwritten', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'eslint.config.js'), 'export default []\n')
    const plan = planInit(dir, {})
    const write = plan.find((a) => a.type === 'write' && a.path.startsWith('eslint.config'))
    assert.equal(write, undefined, 'must not plan to write over an existing eslint config')
    const advise = plan.find(
      (a) => a.type === 'advise' && /ESLint config already exists/.test(a.message)
    )
    assert.ok(advise, 'expected an advise action with a merge snippet')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('an existing stylelint config is advised, not overwritten', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'stylelint.config.js'), 'export default {}\n')
    const plan = planInit(dir, {})
    const write = plan.find((a) => a.type === 'write' && a.path === '.stylelintrc.json')
    assert.equal(write, undefined, 'must not plan to write over an existing stylelint config')
    const advise = plan.find(
      (a) => a.type === 'advise' && /Stylelint config already exists/.test(a.message)
    )
    assert.ok(advise, 'expected a stylelint merge-snippet advice')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit adds the husky "prepare" script and a shim-free pre-commit hook', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const prepare = plan.find((a) => a.type === 'merge-json' && a.path === 'package.json')
    assert.ok(prepare, 'expected a package.json merge for the prepare script')
    assert.equal(prepare.merge.scripts.prepare, 'husky')

    const hook = plan.find((a) => a.type === 'append' && a.path === '.husky/pre-commit')
    assert.ok(hook, 'expected the husky pre-commit hook')
    assert.doesNotMatch(
      hook.content,
      /husky\.sh/,
      'must not use the removed husky v8 bootstrap shim'
    )
    assert.match(hook.content, /npx eslint/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit merges the webkit MCP server into .mcp.json', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const mcp = plan.find((a) => a.type === 'merge-json' && a.path === '.mcp.json')
    assert.ok(mcp, 'expected .mcp.json merge action')
    assert.ok(mcp.merge.mcpServers[MCP_SERVER_NAME], 'expected webkit server in the merge')
    assert.equal(mcp.merge.mcpServers[MCP_SERVER_NAME].command, 'npx')
    assert.deepEqual(mcp.merge.mcpServers[MCP_SERVER_NAME].args, [
      '-y',
      '-p',
      '@aziontech/webkit',
      'webkit-mcp'
    ])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit copies the .claude/rules/webkit-*.md bundle', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const copies = plan.filter((a) => a.type === 'copy').map((a) => a.to)
    for (const rel of [
      '.claude/rules/webkit-imports.md',
      '.claude/rules/webkit-tokens.md',
      '.claude/rules/webkit-performance.md',
      '.claude/rules/webkit-prefer-over-custom.md',
      '.claude/rules/webkit-style-override.md',
      '.claude/rules/webkit-construction-standards.md',
      '.claude/rules/webkit-prop-vocabulary.md',
      '.claude/rules/webkit-styling.md',
      '.claude/rules/webkit-component-structure.md',
      '.claude/rules/webkit-props.md',
      '.claude/rules/webkit-v-model.md',
      '.claude/rules/webkit-emits.md',
      '.claude/rules/webkit-slots.md',
      '.claude/rules/webkit-composables.md',
      '.claude/rules/webkit-root-element.md',
      '.claude/rules/webkit-component-states.md',
      '.claude/rules/webkit-accessibility.md',
      '.claude/rules/webkit-testid.md',
      '.claude/rules/webkit-deprecation.md',
      '.claude/skills/webkit-usage/SKILL.md',
      // UI-craft pack + cross-cutting quality skills (consumer-side authoring guidance).
      '.claude/skills/webkit-ui-craft/SKILL.md',
      '.claude/skills/webkit-ux-heuristics/SKILL.md',
      '.claude/skills/webkit-ui-states/SKILL.md',
      '.claude/skills/webkit-usability/SKILL.md',
      '.claude/skills/webkit-form/SKILL.md',
      '.claude/skills/webkit-navigation/SKILL.md',
      '.claude/skills/webkit-baseline-ui/SKILL.md',
      '.claude/skills/webkit-motion-polish/SKILL.md',
      '.claude/skills/webkit-impeccable-polish/SKILL.md',
      '.claude/skills/webkit-delight/SKILL.md',
      '.claude/skills/webkit-accessibility-implementation/SKILL.md',
      '.claude/skills/webkit-content-microcopy/SKILL.md',
      '.claude/skills/webkit-responsive-layout/SKILL.md',
      '.claude/skills/webkit-theming-dark-mode/SKILL.md',
      '.claude/skills/webkit-performance-ux/SKILL.md',
      '.claude/skills/webkit-i18n-readiness/SKILL.md',
      '.claude/skills/webkit-data-viz/SKILL.md',
      '.claude/skills/webkit-ui-verify/SKILL.md',
      '.claude/skills/webkit-ds-adoption/SKILL.md',
      '.claude/agents/webkit-expert.md',
      '.claude/agents/webkit-adopter.md',
      '.claude/agents/webkit-reviewer.md',
      '.claude/agents/webkit-ui-verifier.md',
      '.claude/agents/webkit-adoption-auditor.md'
    ]) {
      assert.ok(copies.includes(rel), `missing bundle copy ${rel}`)
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit appends the CLAUDE.md fragment guarded by a marker', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const append = plan.find((a) => a.type === 'append' && a.path === 'CLAUDE.md')
    assert.ok(append, 'expected CLAUDE.md append action')
    assert.equal(append.marker, CLAUDE_FRAGMENT_MARKER)
    assert.ok(append.content.includes(CLAUDE_FRAGMENT_MARKER))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan writes the expected files and is idempotent on a second run', () => {
  const dir = makeProject()
  try {
    // First run.
    applyPlan(dir, planInit(dir, {}))

    // Files landed on disk.
    assert.ok(existsSync(join(dir, 'eslint.config.mjs')))
    assert.ok(existsSync(join(dir, '.stylelintrc.json')))
    assert.ok(existsSync(join(dir, '.mcp.json')))
    assert.ok(existsSync(join(dir, '.husky/pre-commit')))
    assert.ok(existsSync(join(dir, '.claude/rules/webkit-imports.md')))
    assert.ok(existsSync(join(dir, 'CLAUDE.md')))

    // package.json got the deps.
    const pkg1 = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    assert.ok(pkg1.dependencies['@aziontech/webkit'])
    assert.ok(pkg1.devDependencies['eslint'])

    // .mcp.json has exactly one webkit server.
    const mcp1 = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8'))
    assert.equal(Object.keys(mcp1.mcpServers).length, 1)
    assert.ok(mcp1.mcpServers[MCP_SERVER_NAME])

    const claude1 = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    const markerCount1 = claude1.split(CLAUDE_FRAGMENT_MARKER).length - 1
    assert.equal(markerCount1, 1)

    // Second run — must not clobber or duplicate.
    applyPlan(dir, planInit(dir, {}))

    // .mcp.json still has exactly one webkit server.
    const mcp2 = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8'))
    assert.equal(Object.keys(mcp2.mcpServers).length, 1)
    assert.deepEqual(mcp2, mcp1, '.mcp.json changed on the second run')

    // CLAUDE.md fragment appended exactly once (no duplication).
    const claude2 = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    const markerCount2 = claude2.split(CLAUDE_FRAGMENT_MARKER).length - 1
    assert.equal(markerCount2, 1, 'CLAUDE fragment duplicated on the second run')
    assert.equal(claude2, claude1, 'CLAUDE.md changed on the second run')

    // Dependency versions unchanged (no re-pin).
    const pkg2 = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    assert.deepEqual(pkg2, pkg1, 'package.json changed on the second run')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan refuses to overwrite a malformed package.json (no data loss)', () => {
  const dir = makeProject()
  try {
    const pkgPath = join(dir, 'package.json')
    const malformed = '{ "name": "x", oops not valid json'
    writeFileSync(pkgPath, malformed)

    const results = applyPlan(dir, planInit(dir, {}))

    // The unparseable file is left exactly as it was — never clobbered with `{}`.
    assert.equal(readFileSync(pkgPath, 'utf8'), malformed)
    // And the affected actions reported an error instead of silently succeeding.
    assert.ok(
      results.some((r) => r.result === 'error' && /not valid JSON/.test(r.detail)),
      'expected an error result for the malformed package.json'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan preserves an existing pinned dependency version', () => {
  const dir = makeProject()
  try {
    const pkgPath = join(dir, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    pkg.dependencies = { '@aziontech/webkit': '^1.2.3' }
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

    applyPlan(dir, planInit(dir, {}))

    const after = JSON.parse(readFileSync(pkgPath, 'utf8'))
    assert.equal(
      after.dependencies['@aziontech/webkit'],
      '^1.2.3',
      'must not re-pin an existing dep'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan merges into an existing .mcp.json without dropping other servers', () => {
  const dir = makeProject()
  try {
    writeFileSync(
      join(dir, '.mcp.json'),
      JSON.stringify({ mcpServers: { other: { command: 'node', args: ['x.js'] } } }, null, 2)
    )

    applyPlan(dir, planInit(dir, {}))

    const mcp = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8'))
    assert.ok(mcp.mcpServers.other, 'existing server was dropped')
    assert.ok(mcp.mcpServers[MCP_SERVER_NAME], 'webkit server not added')
    assert.equal(Object.keys(mcp.mcpServers).length, 2)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
