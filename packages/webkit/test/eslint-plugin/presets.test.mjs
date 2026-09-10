import { test } from 'node:test'
import assert from 'node:assert/strict'

import plugin, { rules } from '../../src/eslint-plugin/index.js'

/** The extension list decides which files the preset reaches at all. */
function filesOf(preset) {
  return plugin.configs[preset][0].files
}

test('every preset applies to the extensions consumers actually author UI in', () => {
  // `.astro` was missing until 2026-09: the preset simply did not apply to Astro files, so
  // a consumer with 41 of them saw zero findings there and read it as clean. An extension
  // absent from this list fails open and silently, which is why it is pinned by a test.
  for (const preset of ['recommended', 'strict', 'performance']) {
    const files = filesOf(preset)
    for (const extension of ['vue', 'astro', 'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs']) {
      assert.ok(
        files.includes(`**/*.${extension}`),
        `the ${preset} preset must apply to .${extension}`
      )
    }
  }
})

test('recommended and strict cover every rule the plugin ships', () => {
  // A rule that exists but is in no preset is a rule nobody runs.
  for (const preset of ['recommended', 'strict']) {
    const configured = Object.keys(plugin.configs[preset][0].rules)
    for (const rule of Object.keys(rules)) {
      assert.ok(configured.includes(`webkit/${rule}`), `${preset} must configure webkit/${rule}`)
    }
  }
})

test('nothing out of standard is a warning', () => {
  for (const preset of ['recommended', 'strict', 'performance']) {
    for (const [rule, severity] of Object.entries(plugin.configs[preset][0].rules)) {
      assert.equal(severity, 'error', `${rule} in ${preset} must be an error, not a warning`)
    }
  }
})

test('the performance preset is a strict subset, so it can never surprise a consumer', () => {
  const performance = Object.keys(plugin.configs.performance[0].rules)
  const recommended = Object.keys(plugin.configs.recommended[0].rules)
  for (const rule of performance) {
    assert.ok(recommended.includes(rule), `${rule} is in performance but not in recommended`)
  }
  assert.ok(performance.length < recommended.length, 'performance is a subset, not an alias')
})
