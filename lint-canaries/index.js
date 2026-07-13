#!/usr/bin/env node

/**
 * Lint canaries — INVERTED logic: every fixture in this directory violates one
 * configured lint rule ON PURPOSE and must KEEP failing that rule.
 *
 *   fixture still fails its lint  →  canary passes ✅
 *   fixture lints clean           →  canary FAILS ❌ (someone weakened the lint)
 *
 * A fixture that stops failing means eslint.config.js / .stylelintrc.json /
 * .prettierrc.json / commitlint.config.js was relaxed — or a dependency bump
 * changed a rule's behavior. Either way CI must stop and a human must decide.
 *
 * The check is per-rule, not per-exit-code: each fixture must be flagged by the
 * EXACT rule it guards, so a parse error or an unrelated finding cannot fake a
 * pass.
 *
 * Runs in CI (governance.yml → lint-canary job).  Locally:
 *   node lint-canaries/index.js
 *
 * Docs: lint-canaries/README.md · packages/webkit/docs/DOC_LINTS.md
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const CANARY_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(CANARY_DIR, '..')

console.log('[CANARY_DIR]: ', CANARY_DIR)

// ---------------------------------------------------------------------------
// Manifest — one entry per guarded rule. Paths are relative to lint-canaries/.
// Sections mirror packages/webkit/docs/DOC_LINTS.md.
// ---------------------------------------------------------------------------

/**  every entry must be reported by ESLint as an ERROR (severity 2). */
const ESLINT_CANARIES = [
  // ESLint — Vue correctness
  {
    file: 'eslint/vue-correctness/component-definition-name-casing.vue',
    rule: 'vue/component-definition-name-casing'
  },
  {
    file: 'eslint/vue-correctness/component-name-in-template-casing.vue',
    rule: 'vue/component-name-in-template-casing'
  },
  { file: 'eslint/vue-correctness/component-tags-order.vue', rule: 'vue/component-tags-order' },
  {
    file: 'eslint/vue-correctness/no-arrow-functions-in-watch.vue',
    rule: 'vue/no-arrow-functions-in-watch'
  },
  {
    file: 'eslint/vue-correctness/no-async-in-computed-properties.vue',
    rule: 'vue/no-async-in-computed-properties'
  },
  { file: 'eslint/vue-correctness/no-child-content.vue', rule: 'vue/no-child-content' },
  { file: 'eslint/vue-correctness/no-dupe-keys.vue', rule: 'vue/no-dupe-keys' },
  { file: 'eslint/vue-correctness/no-dupe-v-else-if.vue', rule: 'vue/no-dupe-v-else-if' },
  {
    file: 'eslint/vue-correctness/no-duplicate-attributes.vue',
    rule: 'vue/no-duplicate-attributes'
  },
  {
    file: 'eslint/vue-correctness/no-export-in-script-setup.vue',
    rule: 'vue/no-export-in-script-setup'
  },
  {
    file: 'eslint/vue-correctness/no-empty-component-block.vue',
    rule: 'vue/no-empty-component-block'
  },
  {
    file: 'eslint/vue-correctness/no-irregular-whitespace.vue',
    rule: 'vue/no-irregular-whitespace'
  },
  { file: 'eslint/vue-correctness/no-mutating-props.vue', rule: 'vue/no-mutating-props' },
  { file: 'eslint/vue-correctness/no-reserved-keys.vue', rule: 'vue/no-reserved-keys' },
  { file: 'eslint/vue-correctness/no-reserved-props.vue', rule: 'vue/no-reserved-props' },
  { file: 'eslint/vue-correctness/no-unused-vars.vue', rule: 'vue/no-unused-vars' },
  { file: 'eslint/vue-correctness/v-if-else-key.vue', rule: 'vue/v-if-else-key' },
  { file: 'eslint/vue-correctness/no-ref-as-operand.vue', rule: 'vue/no-ref-as-operand' },
  {
    file: 'eslint/vue-correctness/no-side-effects-in-computed-properties.vue',
    rule: 'vue/no-side-effects-in-computed-properties'
  },
  { file: 'eslint/vue-correctness/no-v-html.vue', rule: 'vue/no-v-html' },
  { file: 'eslint/vue-correctness/require-default-prop.vue', rule: 'vue/require-default-prop' },
  { file: 'eslint/vue-correctness/require-explicit-emits.vue', rule: 'vue/require-explicit-emits' },
  { file: 'eslint/vue-correctness/template-curly-spacing.vue', rule: 'vue/template-curly-spacing' },
  // ESLint — Accessibility
  { file: 'eslint/accessibility/alt-text.vue', rule: 'vuejs-accessibility/alt-text' },
  { file: 'eslint/accessibility/aria-props.vue', rule: 'vuejs-accessibility/aria-props' },
  { file: 'eslint/accessibility/aria-role.vue', rule: 'vuejs-accessibility/aria-role' },
  {
    file: 'eslint/accessibility/click-events-have-key-events.vue',
    rule: 'vuejs-accessibility/click-events-have-key-events'
  },
  // ESLint — TypeScript
  { file: 'eslint/typescript/no-unused-vars.ts', rule: '@typescript-eslint/no-unused-vars' },
  { file: 'eslint/typescript/no-explicit-any.ts', rule: '@typescript-eslint/no-explicit-any' },
  // ESLint — Import hygiene
  { file: 'eslint/import-hygiene/sorted-imports.ts', rule: 'simple-import-sort/imports' },
  { file: 'eslint/import-hygiene/sorted-exports.ts', rule: 'simple-import-sort/exports' },
  { file: 'eslint/import-hygiene/first.ts', rule: 'import/first' },
  { file: 'eslint/import-hygiene/newline-after-import.ts', rule: 'import/newline-after-import' },
  { file: 'eslint/import-hygiene/no-duplicates.ts', rule: 'import/no-duplicates' },
  // ESLint — Clean code
  { file: 'eslint/clean-code/no-console.ts', rule: 'no-console' },
  { file: 'eslint/clean-code/no-debugger.ts', rule: 'no-debugger' },
  { file: 'eslint/clean-code/prefer-const.ts', rule: 'prefer-const' }
]

/**
 * `severity` is the MINIMUM the rule must report at. Rules configured with
 * { severity: "warning" } in .stylelintrc.json expect 'warning' (an upgrade to
 * error also passes); the rest must stay errors.
 */
const STYLELINT_CANARIES = [
  {
    file: 'stylelint/selector-class-pattern.css',
    rule: 'selector-class-pattern',
    severity: 'error'
  },
  { file: 'stylelint/selector-max-id.css', rule: 'selector-max-id', severity: 'error' },
  {
    file: 'stylelint/declaration-block-no-duplicate-properties.css',
    rule: 'declaration-block-no-duplicate-properties',
    severity: 'error'
  },
  {
    file: 'stylelint/no-duplicate-selectors.css',
    rule: 'no-duplicate-selectors',
    severity: 'error'
  },
  {
    file: 'stylelint/order-properties-alphabetical-order.css',
    rule: 'order/properties-alphabetical-order',
    severity: 'error'
  },
  {
    file: 'stylelint/property-no-vendor-prefix.css',
    rule: 'property-no-vendor-prefix',
    severity: 'warning'
  },
  {
    file: 'stylelint/value-no-vendor-prefix.css',
    rule: 'value-no-vendor-prefix',
    severity: 'warning'
  },
  {
    file: 'stylelint/no-descending-specificity.css',
    rule: 'no-descending-specificity',
    severity: 'warning'
  }
]

/** every file must show up in `prettier --list-different`. */
const PRETTIER_CANARIES = ['prettier/unformatted-script.ts', 'prettier/unformatted-template.vue']

/** every message must be rejected, reporting the expected rule. */
const COMMITLINT_CANARIES = [
  { file: 'commitlint/no-type.txt', rule: 'type-empty' },
  { file: 'commitlint/type-case.txt', rule: 'type-case' },
  { file: 'commitlint/type-enum.txt', rule: 'type-enum' },
  { file: 'commitlint/scope-case.txt', rule: 'scope-case' },
  { file: 'commitlint/subject-empty.txt', rule: 'subject-empty' },
  { file: 'commitlint/unbracketed-ticket.txt', rule: 'type-empty' },
  { file: 'commitlint/header-max-length.txt', rule: 'header-max-length' }
]

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

const failures = []
let passCount = 0

function rel(file) {
  return join('lint-canaries', file)
}

function stillBroken(label, detail) {
  passCount += 1
  console.log(`  ✅ ${label} — still broken (${detail})`)
}

function weakened(label, why) {
  failures.push({ label, why })
  console.log(`  ❌ ${label} — ${why}`)
}

function run(bin, args) {
  return spawnSync('pnpm', ['exec', bin, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  })
}

function assertFixturesExist(entries) {
  const missing = entries.filter((f) => !existsSync(join(ROOT, rel(f))))
  for (const f of missing) {
    weakened(rel(f), 'fixture file is missing — canary coverage was removed')
  }
  return missing.length === 0
}

function normalize(p) {
  return p.split(sep).join('/')
}

// ---------------------------------------------------------------------------
// ESLint
// ---------------------------------------------------------------------------

function checkEslint() {
  console.log('\n▶ ESLint canaries (eslint.config.js)')
  if (!assertFixturesExist(ESLINT_CANARIES.map((c) => c.file))) return

  const files = ESLINT_CANARIES.map((c) => rel(c.file))
  const res = run('eslint', ['--format', 'json', ...files])

  // 0 = clean, 1 = lint errors found (expected); anything else is an ESLint crash.
  if (res.error || (res.status !== 0 && res.status !== 1)) {
    console.error(res.stderr || res.error?.message || '')
    for (const { file, rule } of ESLINT_CANARIES) {
      weakened(`${rule} (${rel(file)})`, `eslint did not run (exit ${res.status})`)
    }
    return
  }

  let results
  try {
    results = JSON.parse(res.stdout)
  } catch {
    console.error(res.stdout.slice(0, 2000))
    console.error(res.stderr.slice(0, 2000))
    for (const { file, rule } of ESLINT_CANARIES) {
      weakened(`${rule} (${rel(file)})`, 'eslint JSON output was unparseable')
    }
    return
  }

  const byPath = new Map(results.map((r) => [normalize(r.filePath).toLowerCase(), r]))

  for (const { file, rule } of ESLINT_CANARIES) {
    const key = normalize(join(ROOT, rel(file))).toLowerCase()
    const label = `${rule} (${rel(file)})`
    const result = byPath.get(key)
    if (!result) {
      weakened(label, 'file missing from ESLint output — was it ignored by config?')
      continue
    }
    const fatal = result.messages.find((m) => m.fatal)
    const hit = result.messages.find((m) => m.ruleId === rule && m.severity === 2)
    if (hit) {
      stillBroken(label, `line ${hit.line}: ${hit.message.slice(0, 80)}`)
    } else if (fatal) {
      weakened(label, `fixture no longer parses: ${fatal.message.slice(0, 120)}`)
    } else {
      weakened(label, 'rule no longer reports an error — weakened/removed in eslint.config.js?')
    }
  }
}

// ---------------------------------------------------------------------------
// Stylelint
// ---------------------------------------------------------------------------

function checkStylelint() {
  console.log('\n▶ Stylelint canaries (.stylelintrc.json)')
  if (!assertFixturesExist(STYLELINT_CANARIES.map((c) => c.file))) return

  const files = STYLELINT_CANARIES.map((c) => rel(c.file))
  const res = run('stylelint', ['--formatter', 'json', ...files])

  // 0 = clean/warnings only, 2 = lint errors (expected); others are crashes.
  if (res.error || (res.status !== 0 && res.status !== 2)) {
    console.error(res.stderr || res.error?.message || '')
    for (const { file, rule } of STYLELINT_CANARIES) {
      weakened(`${rule} (${rel(file)})`, `stylelint did not run (exit ${res.status})`)
    }
    return
  }

  // Stylelint ≥16 prints the formatter report on stderr; older versions used stdout.
  const raw = [res.stdout, res.stderr].find((s) => s && s.trim().startsWith('['))
  let results
  try {
    results = JSON.parse(raw)
  } catch {
    console.error((res.stdout + res.stderr).slice(0, 2000))
    for (const { file, rule } of STYLELINT_CANARIES) {
      weakened(`${rule} (${rel(file)})`, 'stylelint JSON output was unparseable')
    }
    return
  }

  const byPath = new Map(results.map((r) => [normalize(r.source).toLowerCase(), r]))

  for (const { file, rule, severity } of STYLELINT_CANARIES) {
    const key = normalize(join(ROOT, rel(file))).toLowerCase()
    const label = `${rule} (${rel(file)})`
    const result = byPath.get(key)
    if (!result) {
      weakened(label, 'file missing from Stylelint output — was it ignored by config?')
      continue
    }
    const hits = (result.warnings ?? []).filter((w) => w.rule === rule)
    const strongEnough = hits.find((w) => (severity === 'error' ? w.severity === 'error' : true))
    if (strongEnough) {
      stillBroken(label, `${strongEnough.severity}: ${strongEnough.text.slice(0, 80)}`)
    } else if (hits.length > 0) {
      weakened(
        label,
        `still reported but downgraded to "${hits[0].severity}" — expected "${severity}"`
      )
    } else {
      weakened(label, 'rule no longer reports — weakened/removed in .stylelintrc.json?')
    }
  }
}

// ---------------------------------------------------------------------------
// Prettier
// ---------------------------------------------------------------------------

function checkPrettier() {
  console.log('\n▶ Prettier canaries (.prettierrc.json)')
  if (!assertFixturesExist(PRETTIER_CANARIES)) return

  const files = PRETTIER_CANARIES.map((f) => rel(f))
  const res = run('prettier', ['--list-different', ...files])

  // 0 = everything formatted (all canaries dead), 1 = differences (expected).
  if (res.error || (res.status !== 0 && res.status !== 1)) {
    console.error(res.stderr || res.error?.message || '')
    for (const file of PRETTIER_CANARIES) {
      weakened(`prettier (${rel(file)})`, `prettier did not run (exit ${res.status})`)
    }
    return
  }

  const different = new Set(
    res.stdout
      .split('\n')
      .map((line) => normalize(line.trim()))
      .filter(Boolean)
  )

  for (const file of PRETTIER_CANARIES) {
    const label = `prettier (${rel(file)})`
    if (different.has(normalize(rel(file)))) {
      stillBroken(label, 'still listed by --list-different')
    } else {
      weakened(
        label,
        'now considered formatted — .prettierrc.json weakened or fixture reformatted?'
      )
    }
  }
}

// ---------------------------------------------------------------------------
// commitlint
// ---------------------------------------------------------------------------

function checkCommitlint() {
  console.log('\n▶ commitlint canaries (commitlint.config.js)')
  if (!assertFixturesExist(COMMITLINT_CANARIES.map((c) => c.file))) return

  for (const { file, rule } of COMMITLINT_CANARIES) {
    const label = `${rule} (${rel(file)})`
    const res = run('commitlint', ['--edit', rel(file)])
    const output = `${res.stdout ?? ''}${res.stderr ?? ''}`

    if (res.error) {
      weakened(label, `commitlint did not run: ${res.error.message}`)
    } else if (res.status === 0) {
      weakened(label, 'message now passes — commitlint.config.js weakened?')
    } else if (!output.includes(`[${rule}]`)) {
      weakened(label, `rejected, but not by [${rule}] — expected rule missing from the report`)
    } else {
      stillBroken(label, `rejected with [${rule}]`)
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('Lint canaries — every fixture must KEEP FAILING its lint rule.')
console.log(`Repo root: ${ROOT}`)

checkEslint()
checkStylelint()
checkPrettier()
checkCommitlint()

const total = passCount + failures.length
console.log('\n──────────────────────────────────────────────────────────────')
console.log(
  `Summary: ${passCount}/${total} canaries still broken (good) · ${failures.length} weakened`
)

if (failures.length > 0) {
  console.log('\nThe following lint guarantees no longer hold:')
  for (const { label, why } of failures) {
    console.log(`  • ${label}\n      ${why}`)
  }
  console.log(`
A canary that "passes" its lint means the rule was weakened, removed, or its
behavior changed with a dependency bump. If the relaxation is INTENTIONAL,
update or delete the fixture and its manifest entry in
lint-canaries/index.js, and update
packages/webkit/docs/DOC_LINTS.md in the same PR.`)
  process.exit(1)
}

console.log('All lint rules still enforce their documented failures. ✔')
