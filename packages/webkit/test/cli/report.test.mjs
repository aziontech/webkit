import { test } from 'node:test'
import assert from 'node:assert/strict'

import { collect, diffBaseline, renderMarkdown, UI_EXTENSIONS } from '../../src/cli/report.js'

const CWD = '/project'

/** Minimal ESLint JSON result. */
function result(file, ...ruleIds) {
  return {
    filePath: `${CWD}/${file}`,
    messages: ruleIds.map((ruleId) => ({ ruleId, severity: 2, message: 'x' }))
  }
}

const catalog = { available: true, package: '@aziontech/webkit', version: '4.4.0' }

test('collect counts only webkit/* rules', () => {
  const report = collect(
    [result('src/a.vue', 'webkit/no-style-override', 'vue/no-v-html', 'no-unused-vars')],
    CWD
  )
  assert.equal(report.total, 1)
  assert.deepEqual(report.byRule, [['webkit/no-style-override', 1]])
})

test('collect ignores fatal parse errors, which carry a null ruleId', () => {
  // A fatal error is not a violation — counting it would inflate the number, and a file
  // that failed to parse was not measured at all.
  const report = collect([{ filePath: `${CWD}/src/a.astro`, messages: [{ ruleId: null, fatal: true, message: 'Parsing error' }] }], CWD)
  assert.equal(report.total, 0)
  assert.equal(report.uiFilesTotal, 1)
})

test('the score counts clean UI files, not violations', () => {
  // Two UI files, one of them with three findings: 50%, not 25%. One file with a pile of
  // findings must not read worse than several files with one each.
  const report = collect(
    [
      result('src/dirty.vue', 'webkit/no-hardcoded-color', 'webkit/no-hardcoded-color', 'webkit/no-style-override'),
      result('src/clean.vue')
    ],
    CWD
  )
  assert.equal(report.total, 3)
  assert.equal(report.uiFilesTotal, 2)
  assert.equal(report.uiFilesClean, 1)
  assert.equal(report.score, 50)
})

test('the score denominator is UI files only', () => {
  const report = collect(
    [result('src/a.vue'), result('src/b.astro'), result('scripts/tool.ts', 'webkit/no-barrel-import')],
    CWD
  )
  assert.equal(report.uiFilesTotal, 2, 'the .ts file is not part of the denominator')
  assert.equal(report.score, 100, 'both UI files are clean even though a .ts file has a finding')
  assert.equal(report.total, 1, 'the .ts finding is still reported')
})

test('an empty project scores 100 without dividing by zero', () => {
  const report = collect([], CWD)
  assert.equal(report.score, 100)
  assert.equal(report.total, 0)
})

test('UI_EXTENSIONS covers the two file types the design system governs', () => {
  assert.deepEqual([...UI_EXTENSIONS].sort(), ['astro', 'vue'])
})

test('baseline keys are one per occurrence, file plus rule', () => {
  const report = collect([result('src/a.vue', 'webkit/no-style-override', 'webkit/no-style-override')], CWD)
  assert.deepEqual(report.keys, [
    'src/a.vue::webkit/no-style-override',
    'src/a.vue::webkit/no-style-override'
  ])
})

test('diffBaseline reports nothing new when the run matches the baseline', () => {
  const keys = ['a.vue::webkit/x', 'b.vue::webkit/y']
  const diff = diffBaseline(keys, keys)
  assert.deepEqual(diff.introduced, [])
  assert.deepEqual(diff.fixed, [])
})

test('diffBaseline counts a SECOND occurrence of a baselined rule as introduced', () => {
  // Multiset semantics, same as scripts/check-authoring.mjs. With a plain Set, adding a
  // second violation of an already-known rule in the same file would slip through.
  const diff = diffBaseline(['a.vue::webkit/x', 'a.vue::webkit/x'], ['a.vue::webkit/x'])
  assert.deepEqual(diff.introduced, ['a.vue::webkit/x'])
  assert.deepEqual(diff.fixed, [])
})

test('diffBaseline reports a fixed violation so the baseline can be pruned', () => {
  const diff = diffBaseline(['a.vue::webkit/x'], ['a.vue::webkit/x', 'a.vue::webkit/x'])
  assert.deepEqual(diff.introduced, [])
  assert.deepEqual(diff.fixed, ['a.vue::webkit/x'])
})

test('diffBaseline treats a moved violation as one fixed and one introduced', () => {
  const diff = diffBaseline(['b.vue::webkit/x'], ['a.vue::webkit/x'])
  assert.deepEqual(diff.introduced, ['b.vue::webkit/x'])
  assert.deepEqual(diff.fixed, ['a.vue::webkit/x'])
})

test('the markdown always states what was not looked at', () => {
  const report = collect([result('src/a.vue', 'webkit/no-style-override')], CWD)
  const md = renderMarkdown(report, { catalog, diff: null, baselinePath: null })
  assert.match(md, /Coverage — what this did and did not look at/)
  assert.match(md, /no-style-override.*cannot run on `\.astro`/s, 'names the rule that cannot cover Astro')
  assert.match(md, /caught by no rule yet/, 'names the raw-markup gap')
  assert.match(md, /@aziontech\/webkit@4\.4\.0/, 'names the version it measured against')
})

test('a clean run still carries the coverage note', () => {
  // "No violations" must never read as a clean bill of health on its own.
  const md = renderMarkdown(collect([result('src/a.vue')], CWD), {
    catalog,
    diff: null,
    baselinePath: null
  })
  assert.match(md, /No `webkit\/\*` violations/)
  assert.match(md, /Read the coverage note before celebrating/)
})

test('an unresolved catalog is announced first, not buried', () => {
  const md = renderMarkdown(collect([], CWD), {
    catalog: { available: false, package: '@aziontech/webkit', version: null },
    diff: null,
    baselinePath: null
  })
  const warning = md.indexOf('catalog could not be resolved')
  assert.ok(warning !== -1, 'the warning is present')
  assert.ok(warning < md.indexOf('| Violations |'), 'and it comes before the numbers')
})

test('introduced violations are listed individually so a PR author can act', () => {
  const report = collect([result('src/a.vue', 'webkit/no-hardcoded-color')], CWD)
  const diff = diffBaseline(report.keys, [])
  const md = renderMarkdown(report, { catalog, diff, baselinePath: '.webkit-baseline.json' })
  assert.match(md, /1 new violation\(s\)/)
  assert.match(md, /`src\/a\.vue`.*`no-hardcoded-color`/)
})
