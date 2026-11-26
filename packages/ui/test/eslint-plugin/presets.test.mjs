import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { Linter } from 'eslint'
import * as astroParser from 'astro-eslint-parser'

// Point the catalog-backed rules at the fixture (version-locked, deterministic).
process.env.AZION_UI_CATALOG_PATH = fileURLToPath(
  new URL('./fixtures/catalog.json', import.meta.url)
)

const { default: azionUiPlugin, HEURISTIC_RULES } = await import('../../src/eslint-plugin/index.js')

test('every preset covers .astro and .vue files', () => {
  for (const name of ['strict', 'recommended', 'performance']) {
    const [config] = azionUiPlugin.configs[name]
    assert.ok(Array.isArray(config.files), `${name} preset should declare a files array`)
    assert.ok(config.files.includes('**/*.astro'), `${name} preset should lint **/*.astro`)
    assert.ok(config.files.includes('**/*.vue'), `${name} preset should lint **/*.vue`)
  }
})

test('every rule ships in recommended or strict, never as warn except the layout heuristics; performance is a subset of recommended', () => {
  const [recommended] = azionUiPlugin.configs.recommended
  const [strict] = azionUiPlugin.configs.strict
  const [performance] = azionUiPlugin.configs.performance

  const heuristics = new Set(HEURISTIC_RULES.map((rule) => `azion-ui/${rule}`))
  assert.deepEqual(
    [...HEURISTIC_RULES],
    [
      'require-container-width',
      'no-output-in-command',
      'no-page-navigation-menu',
      'prefer-date-picker',
      'no-raw-id-input'
    ]
  )
  for (const preset of [recommended, strict, performance]) {
    for (const [key, severity] of Object.entries(preset.rules)) {
      assert.equal(severity, heuristics.has(key) ? 'warn' : 'error', key)
    }
  }

  for (const ruleName of Object.keys(azionUiPlugin.rules)) {
    const key = `azion-ui/${ruleName}`
    const inRecommended = Object.prototype.hasOwnProperty.call(recommended.rules, key)
    const inStrict = Object.prototype.hasOwnProperty.call(strict.rules, key)
    assert.ok(inRecommended || inStrict, `rule "${ruleName}" must appear in recommended or strict`)
  }

  for (const key of Object.keys(performance.rules)) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(recommended.rules, key),
      `performance rule "${key}" should also be part of recommended`
    )
  }
})

test('lints a minimal .astro fixture with astro-eslint-parser: fires on a hardcoded hex, never throws', () => {
  const linter = new Linter({ configType: 'flat' })

  const code = `---
import Button from '@aziontech/ui/button'
const label = 'hi'
---
<div class="text-[#ff0000]"><Button class="p-8">{label}</Button></div>
`

  for (const presetName of ['strict', 'recommended', 'performance']) {
    const [preset] = azionUiPlugin.configs[presetName]
    const config = [
      {
        ...preset,
        files: ['**/*.astro'],
        languageOptions: {
          parser: astroParser,
          ecmaVersion: 2022,
          sourceType: 'module'
        }
      }
    ]

    const messages = linter.verify(code, config, { filename: 'fixture.astro' })

    // No rule should throw / report a parser-internal fatal error.
    const fatals = messages.filter((m) => m.fatal)
    assert.deepEqual(fatals, [], `${presetName}: no rule should throw on an .astro file`)

    if (presetName !== 'performance') {
      const hexHit = messages.find((m) => m.ruleId === 'azion-ui/no-hardcoded-color')
      assert.ok(
        hexHit,
        `${presetName}: no-hardcoded-color should still fire on .astro frontmatter/markup`
      )
    }
  }
})

test('prefer-href-in-menu-node is an error in recommended and strict', () => {
  for (const name of ['recommended', 'strict']) {
    const [config] = azionUiPlugin.configs[name]
    assert.equal(config.rules['azion-ui/prefer-href-in-menu-node'], 'error', name)
  }
})
