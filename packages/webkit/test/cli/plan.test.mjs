import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { planInit, CLAUDE_FRAGMENT_MARKER, MCP_SERVER_NAME } from '../../src/cli/plan.js'
import { applyPlan } from '../../src/cli/apply.js'
import { FRAGMENT_START } from '../../src/cli/bundle.js'

const MAIN_TS =
  "import { createApp } from 'vue'\nimport App from './App.vue'\ncreateApp(App).mount('#app')\n"

function makeProject() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-cli-'))
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'demo', version: '1.0.0' }, null, 2)
  )
  mkdirSync(join(dir, 'src'))
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
    for (const d of ['tailwindcss', '@tailwindcss/postcss']) {
      assert.ok(deps.includes(d), `missing style dep ${d}`)
      const action = plan.find((a) => a.type === 'add-dep' && a.dep === d)
      assert.notEqual(action.version, 'latest', `${d} must be pinned, not "latest"`)
      assert.equal(action.dev, true)
    }
    // Tailwind v4 specifically (matches the theme's v4 stylesheet).
    const tw = plan.find((a) => a.type === 'add-dep' && a.dep === 'tailwindcss')
    assert.match(tw.version, /^\^4\./, 'tailwind must be v4 to match the theme stylesheet')
    // v4 is CSS-first: no autoprefixer, no tailwind.config.
    assert.ok(!deps.includes('autoprefixer'), 'autoprefixer is not needed under Tailwind v4')
    const twCfg = plan.find(
      (a) => a.type === 'write' && a.path && a.path.startsWith('tailwind.config')
    )
    assert.equal(
      twCfg,
      undefined,
      'Tailwind v4 is CSS-first — no tailwind.config should be written'
    )

    const pcCfg = plan.find((a) => a.type === 'write' && a.path === 'postcss.config.mjs')
    assert.ok(pcCfg, 'expected postcss.config.mjs write action')
    assert.match(pcCfg.content, /@tailwindcss\/postcss/)

    const cssEntry = plan.find((a) => a.type === 'write' && a.path === 'src/webkit.css')
    assert.ok(cssEntry, 'expected src/webkit.css write action')
    assert.match(cssEntry.content, /@import '@aziontech\/theme'/)
    // Critically, it must register webkit's source so component classes compile — via the
    // package-name import (the @source ships inside webkit), never a ../node_modules path.
    assert.match(cssEntry.content, /@import '@aziontech\/webkit\/styles'/)
    // Font smoothing ships in the consumer's own file, inside `@layer base`, so it stays
    // overridable by their unlayered rules and is visible where they can edit it.
    assert.match(cssEntry.content, /@layer base \{[\s\S]*-webkit-font-smoothing: antialiased;/)
    assert.match(cssEntry.content, /-moz-osx-font-smoothing: grayscale;/)
    assert.doesNotMatch(
      cssEntry.content,
      /node_modules/,
      'the CSS entry must not hardcode a node_modules path'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('an existing postcss config is advised, not overwritten', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'postcss.config.js'), 'export default {}\n')
    const plan = planInit(dir, {})
    const write = plan.find((a) => a.type === 'write' && a.path.startsWith('postcss.config'))
    assert.equal(write, undefined, 'must not plan to write over an existing postcss config')
    const advise = plan.find(
      (a) => a.type === 'advise' && /PostCSS config already exists/.test(a.message)
    )
    assert.ok(advise, 'expected a postcss merge-snippet advice')
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

test('planInit patches the app entry with the style imports by default', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'src/main.ts'), MAIN_TS, { flag: 'w' })
    const plan = planInit(dir, {})
    const patch = plan.find((a) => a.type === 'patch-entry')
    assert.ok(patch, 'expected a patch-entry action for src/main.ts')
    assert.equal(patch.path, 'src/main.ts')
    assert.deepEqual(patch.imports, ["import './webkit.css'", "import '@aziontech/icons'"])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('wireEntry: false falls back to entry advice, never edits the file', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'src/main.ts'), MAIN_TS, { flag: 'w' })
    const plan = planInit(dir, { wireEntry: false })
    assert.equal(
      plan.find((a) => a.type === 'patch-entry'),
      undefined,
      'must not plan an entry patch with wireEntry: false'
    )
    const advise = plan.find(
      (a) => a.type === 'advise' && /import '\.\/webkit\.css'/.test(a.message)
    )
    assert.ok(advise, 'expected the entry-imports advice')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('icons: false drops @aziontech/icons from deps and entry imports', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'src/main.ts'), MAIN_TS, { flag: 'w' })
    const plan = planInit(dir, { icons: false })
    assert.ok(!findAddDeps(plan).includes('@aziontech/icons'), 'icons dep must be omitted')
    const patch = plan.find((a) => a.type === 'patch-entry')
    assert.deepEqual(patch.imports, ["import './webkit.css'"])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit never wires feature-scoped setup (toast is just-in-time, not init)', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'src/main.ts'), MAIN_TS)
    const plan = planInit(dir, {})
    const patch = plan.find((a) => a.type === 'patch-entry')
    assert.equal(patch.use, undefined, 'patch-entry must not carry plugin wiring')
    assert.ok(
      !patch.imports.some((l) => l.includes('ToastPlugin')),
      'init must not import ToastPlugin — toast setup is just-in-time (catalog `setup` + doctor)'
    )
    assert.ok(
      !plan.some((a) => a.type === 'advise' && /ToastPlugin|Toaster/.test(a.message)),
      'init must not advise toast setup'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan wires the entry imports once and is idempotent', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, 'src/main.ts'), MAIN_TS, { flag: 'w' })
    applyPlan(dir, planInit(dir, {}))

    const wired = readFileSync(join(dir, 'src/main.ts'), 'utf8')
    assert.ok(wired.startsWith("import './webkit.css'\nimport '@aziontech/icons'\n"))
    assert.ok(wired.includes(MAIN_TS), 'original entry content must be preserved')

    // Second run — no duplication.
    applyPlan(dir, planInit(dir, {}))
    const again = readFileSync(join(dir, 'src/main.ts'), 'utf8')
    assert.equal(again, wired, 'entry file changed on the second run')

    // A partially wired entry (double quotes, moved line) is completed, not duplicated.
    writeFileSync(join(dir, 'src/main.ts'), `import "./webkit.css"\n${MAIN_TS}`)
    applyPlan(dir, planInit(dir, {}))
    const completed = readFileSync(join(dir, 'src/main.ts'), 'utf8')
    assert.equal(completed.split('webkit.css').length - 1, 1, 'webkit.css import duplicated')
    assert.equal(
      completed.split('@aziontech/icons').length - 1,
      1,
      'icons import missing/duplicated'
    )
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
    const copies = plan.filter((a) => a.type === 'copy-stamped').map((a) => a.to)
    for (const rel of [
      '.claude/rules/webkit-imports.md',
      '.claude/rules/webkit-tokens.md',
      '.claude/rules/webkit-performance.md',
      '.claude/rules/webkit-prefer-over-custom.md',
      '.claude/rules/webkit-style-override.md',
      '.claude/rules/webkit-comments.md',
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
      '.claude/rules/webkit-motion.md',
      '.claude/rules/webkit-testid.md',
      '.claude/rules/webkit-deprecation.md',
      '.claude/skills/webkit-usage/SKILL.md',
      // UI-craft pack (19 skills: the redundancy/false-positive pass + webkit-tables +
      // webkit-lists (the page around the table) + webkit-layout (the container system
      // every page is built on) + webkit-errors (where a failure goes) +
      // webkit-create-surface (page vs drawer, and the anatomy both share) +
      // webkit-microcopy — Azion product copy rules, unlike the generic
      // content-microcopy dropped below).
      '.claude/skills/webkit-ui-craft/SKILL.md',
      '.claude/skills/webkit-ux-heuristics/SKILL.md',
      '.claude/skills/webkit-ui-states/SKILL.md',
      '.claude/skills/webkit-form/SKILL.md',
      '.claude/skills/webkit-create-surface/SKILL.md',
      '.claude/skills/webkit-errors/SKILL.md',
      '.claude/skills/webkit-tables/SKILL.md',
      '.claude/skills/webkit-lists/SKILL.md',
      '.claude/skills/webkit-navigation/SKILL.md',
      '.claude/skills/webkit-layout/SKILL.md',
      '.claude/skills/webkit-microcopy/SKILL.md',
      '.claude/skills/webkit-baseline-ui/SKILL.md',
      '.claude/skills/webkit-theming-dark-mode/SKILL.md',
      '.claude/skills/webkit-data-viz/SKILL.md',
      '.claude/skills/webkit-motion-polish/SKILL.md',
      '.claude/skills/webkit-impeccable-polish/SKILL.md',
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
    // Dropped (false positives) and merged skills must NOT ship — locks the redundancy pass.
    for (const gone of [
      '.claude/skills/webkit-performance-ux/SKILL.md',
      '.claude/skills/webkit-content-microcopy/SKILL.md',
      '.claude/skills/webkit-i18n-readiness/SKILL.md',
      '.claude/skills/webkit-responsive-layout/SKILL.md',
      '.claude/skills/webkit-usability/SKILL.md',
      '.claude/skills/webkit-delight/SKILL.md',
      '.claude/skills/webkit-accessibility-implementation/SKILL.md'
    ]) {
      assert.ok(!copies.includes(gone), `dropped/merged skill must not ship: ${gone}`)
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('planInit fences the CLAUDE.md fragment instead of appending it once', () => {
  const dir = makeProject()
  try {
    const plan = planInit(dir, {})
    const fenceAction = plan.find((a) => a.type === 'fence' && a.path === 'CLAUDE.md')
    assert.ok(fenceAction, 'expected a CLAUDE.md fence action')
    assert.equal(fenceAction.start, FRAGMENT_START)
    assert.ok(fenceAction.content.length > 0, 'fence content must be the fragment body')
    // The fragment body itself is not marker-wrapped by the plan — spliceFragment owns the
    // wrapping — so the legacy marker string should not appear inside the plain content.
    assert.ok(
      !fenceAction.content.includes(CLAUDE_FRAGMENT_MARKER),
      'fence content must be the raw fragment body, not pre-wrapped with a marker'
    )
    // No append action for CLAUDE.md anymore.
    assert.equal(
      plan.find((a) => a.type === 'append' && a.path === 'CLAUDE.md'),
      undefined,
      'CLAUDE.md must no longer be planned as an append-once action'
    )
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
    const fenceCount1 = claude1.split(FRAGMENT_START).length - 1
    assert.equal(fenceCount1, 1)

    // Second run — must not clobber or duplicate.
    applyPlan(dir, planInit(dir, {}))

    // .mcp.json still has exactly one webkit server.
    const mcp2 = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8'))
    assert.equal(Object.keys(mcp2.mcpServers).length, 1)
    assert.deepEqual(mcp2, mcp1, '.mcp.json changed on the second run')

    // CLAUDE.md fenced block present exactly once (no duplication), content unchanged.
    const claude2 = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    const fenceCount2 = claude2.split(FRAGMENT_START).length - 1
    assert.equal(fenceCount2, 1, 'CLAUDE fragment duplicated on the second run')
    assert.equal(claude2, claude1, 'CLAUDE.md changed on the second run')

    // Dependency versions unchanged (no re-pin).
    const pkg2 = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    assert.deepEqual(pkg2, pkg1, 'package.json changed on the second run')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan migrates a pre-existing legacy CLAUDE.md marker into a fenced block', () => {
  const dir = makeProject()
  try {
    writeFileSync(
      join(dir, 'CLAUDE.md'),
      `# My project\n\n${CLAUDE_FRAGMENT_MARKER}\nOld fragment body.\n\n## Notes\nUser content.\n`
    )

    const results = applyPlan(dir, planInit(dir, {}))
    const fenceResult = results.find(
      (r) => r.action.type === 'fence' && r.action.path === 'CLAUDE.md'
    )
    assert.equal(
      fenceResult.result,
      'merged',
      'a pre-existing file must report merged, not written'
    )

    const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    assert.equal(claude.split(FRAGMENT_START).length - 1, 1, 'expected exactly one fenced block')
    assert.ok(
      !claude.includes(CLAUDE_FRAGMENT_MARKER),
      'legacy marker must be gone after migration'
    )
    assert.ok(claude.startsWith('# My project'), 'user heading must be preserved')
    assert.ok(
      claude.includes('## Notes\nUser content.'),
      'user content after the fragment must be preserved'
    )
    assert.ok(
      !claude.includes('Old fragment body.'),
      'the legacy body must be replaced with the current one'
    )

    // Idempotent: applying again either reports skipped, or plans no fence action at all
    // (the fragment already classifies as `current`, so `planSync` omits the action) —
    // either way the file must not be rewritten.
    const results2 = applyPlan(dir, planInit(dir, {}))
    const fenceResult2 = results2.find(
      (r) => r.action.type === 'fence' && r.action.path === 'CLAUDE.md'
    )
    assert.equal(
      fenceResult2?.result ?? 'skipped',
      'skipped',
      'a second run must not rewrite an already-fenced file'
    )
    assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), claude, 'CLAUDE.md changed on rerun')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan repairs a CLAUDE.md with the legacy fragment duplicated at two positions', () => {
  const dir = makeProject()
  try {
    // Mirrors the real docs-repo case: the legacy marker + fragment appended twice.
    const legacyFragment = `${CLAUDE_FRAGMENT_MARKER}\n## @aziontech/webkit design system\nOld body.\n`
    writeFileSync(
      join(dir, 'CLAUDE.md'),
      `# Proj\n\n${legacyFragment}\n${legacyFragment}\n## Other\nkeep me\n`
    )

    applyPlan(dir, planInit(dir, {}))

    const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8')
    assert.equal(claude.split(CLAUDE_FRAGMENT_MARKER).length - 1, 0, 'no legacy marker must remain')
    assert.equal(claude.split(FRAGMENT_START).length - 1, 1, 'exactly one fenced block must remain')
    assert.ok(claude.includes('## Other\nkeep me'), 'trailing user content must survive the repair')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('applyPlan writes CLAUDE.md fresh (fence result "written") when the file is absent', () => {
  const dir = makeProject()
  try {
    assert.ok(!existsSync(join(dir, 'CLAUDE.md')))
    const results = applyPlan(dir, planInit(dir, {}))
    const fenceResult = results.find(
      (r) => r.action.type === 'fence' && r.action.path === 'CLAUDE.md'
    )
    assert.equal(fenceResult.result, 'written')
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
