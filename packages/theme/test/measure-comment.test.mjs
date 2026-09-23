// Pins the measure-comment gate (src/scripts/measure-comment.mjs): it fires on the drift
// that motivated it (a rung reverted under a comment describing the old one), stays quiet
// on agreement, catches a rung that does not exist, and matches the real layouts source.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { assertMeasureCommentsMatch, findMeasureComments } from '../src/scripts/measure-comment.mjs'
import { container } from '../src/tokens/primitives/shape/container.js'

const layoutsSource = readFileSync(
  fileURLToPath(new URL('../src/tokens/semantic/layouts.data.js', import.meta.url)),
  'utf8'
)

test('the shipped layouts source passes, and the scan actually finds its measures', () => {
  const rows = findMeasureComments(layoutsSource)
  assert.ok(rows.length >= 8, `expected the scan to find the measure lines, found ${rows.length}`)
  assert.doesNotThrow(() => assertMeasureCommentsMatch(layoutsSource, container))
})

test('a comment disagreeing with its rung is flagged — the 7xl-annotated-1388px regression', () => {
  const drifted =
    "  'layout-measure': 'var(--container-7xl)', // 1388px — the standard page container"
  assert.throws(
    () => assertMeasureCommentsMatch(drifted, container),
    /layout-measure → --container-7xl is 1620px, comment says 1388px/
  )
})

test('agreement is silent, with or without a trailing comma', () => {
  assert.doesNotThrow(() =>
    assertMeasureCommentsMatch("  'layout-measure': 'var(--container-7xl)', // 1620px", container)
  )
  assert.doesNotThrow(() =>
    assertMeasureCommentsMatch(
      "  'layout-measure-control': 'var(--container-3xs)' // 256px",
      container
    )
  )
})

test('a rung that is not on the ladder is flagged rather than passing silently', () => {
  assert.throws(
    () => assertMeasureCommentsMatch("  'x': 'var(--container-9xl)', // 2000px", container),
    /--container-9xl is not a rung of the ladder/
  )
})

test('a line with no px annotation is not scanned', () => {
  assert.equal(findMeasureComments("  'layout-measure': 'var(--container-7xl)',").length, 0)
  assert.doesNotThrow(() =>
    assertMeasureCommentsMatch("  'layout-measure': 'var(--container-7xl)',", container)
  )
})
