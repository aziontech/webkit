// Runs the shareable config against sample CSS through Stylelint's Node API and
// asserts the token-forbidding rules actually fire (or stay silent for tokens).

import { test } from 'node:test'
import assert from 'node:assert/strict'

import stylelint from 'stylelint'

import config from '../../src/stylelint-config.js'

/**
 * Lint a snippet with the shared config and return its warnings.
 * @param {string} code CSS source to lint.
 */
async function lint(code) {
  const result = await stylelint.lint({ code, config })
  return result.results[0].warnings
}

/** True when at least one warning was raised by the given rule. */
function firedBy(warnings, rule) {
  return warnings.some((w) => w.rule === rule)
}

test('flags a hex color (color-no-hex)', async () => {
  const warnings = await lint('a{color:#fff}')
  assert.ok(warnings.length > 0, 'expected at least one warning for a hex color')
  assert.ok(firedBy(warnings, 'color-no-hex'), 'expected color-no-hex to fire')
  assert.match(warnings.find((w) => w.rule === 'color-no-hex').text, /var\(--\*\)/)
})

test('allows a design token via var(--*)', async () => {
  const warnings = await lint('a{color:var(--primary)}')
  assert.equal(warnings.length, 0, `expected no warnings, got: ${JSON.stringify(warnings)}`)
})

test('flags a raw color function (function-disallowed-list)', async () => {
  const warnings = await lint('a{color:rgb(0,0,0)}')
  assert.ok(warnings.length > 0, 'expected at least one warning for rgb()')
  assert.ok(
    firedBy(warnings, 'function-disallowed-list'),
    'expected function-disallowed-list to fire'
  )
})

test('flags a named color on a color property (declaration-property-value-disallowed-list)', async () => {
  const warnings = await lint('a{color:black}')
  assert.ok(
    firedBy(warnings, 'declaration-property-value-disallowed-list'),
    'expected declaration-property-value-disallowed-list to fire for a named color'
  )
})

test('leaves safe keyword values alone (currentColor / transparent / inherit)', async () => {
  for (const value of ['currentColor', 'transparent', 'inherit']) {
    const warnings = await lint(`a{color:${value}}`)
    assert.equal(
      warnings.length,
      0,
      `expected no warnings for ${value}, got: ${JSON.stringify(warnings)}`
    )
  }
})

test('flags literal motion timing / raw cubic-bezier / transition: all', async () => {
  for (const decl of [
    'transition:opacity 200ms',
    'transition-duration:1.5s',
    'animation:spin 1s linear',
    'transition:opacity 240ms cubic-bezier(0.4,0,0.2,1)',
    'transition:all'
  ]) {
    const warnings = await lint(`a{${decl}}`)
    assert.ok(
      firedBy(warnings, 'declaration-property-value-disallowed-list'),
      `expected the motion discipline to fire for "${decl}"`
    )
    assert.match(
      warnings.find((w) => w.rule === 'declaration-property-value-disallowed-list').text,
      /animate-\*|duration/
    )
  }
})

test('allows motion timing read from tokens (var(--duration-*/--ease-*))', async () => {
  for (const decl of [
    'transition:opacity var(--duration-fast-01) var(--ease-productive-entrance)',
    'transition:transform var(--duration-moderate-01)',
    'animation-duration:var(--duration-slow-01)'
  ]) {
    const warnings = await lint(`a{${decl}}`)
    assert.equal(
      warnings.length,
      0,
      `expected no warnings for "${decl}", got: ${JSON.stringify(warnings)}`
    )
  }
})
