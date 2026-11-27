import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  INTENTIONALLY_NON_SQUARE,
  drawnBounds,
  geometryIssues,
  pathBounds
} from '../scripts/lib/svg-geometry.mjs'

const RAW = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'svg-raw')
const SETS = ['az', 'az-color']

const icons = () =>
  SETS.flatMap((set) =>
    readdirSync(join(RAW, set))
      .filter((file) => file.endsWith('.svg'))
      .map((file) => ({ key: `${set}/${file}`, svg: readFileSync(join(RAW, set, file), 'utf8') }))
  )

const svg = (body, root = 'width="14" height="14" fill="currentColor"') =>
  `<svg ${root}>${body}</svg>`

test('every icon draws undistorted on the 14x14 canvas', () => {
  const offenders = icons().flatMap(({ key, svg: source }) =>
    geometryIssues(source, key).map((issue) => `${key}: ${issue}`)
  )
  assert.deepEqual(offenders, [])
})

test('every intentionally non-square icon still exists and is still non-square', () => {
  for (const key of Object.keys(INTENTIONALLY_NON_SQUARE)) {
    const file = join(RAW, key)
    assert.ok(existsSync(file), `${key} is listed as intentionally non-square but does not exist`)
    const box = drawnBounds(readFileSync(file, 'utf8'))
    const ratio = Math.min(box.width, box.height) / Math.max(box.width, box.height)
    assert.ok(ratio < 0.6, `${key} is square enough now; drop it from INTENTIONALLY_NON_SQUARE`)
  }
})

test('the DDoS Protection shield keeps the proportions of the set shield', () => {
  const shieldRatio = (() => {
    const box = drawnBounds(readFileSync(join(RAW, 'az', 'az-shield.svg'), 'utf8'))
    return box.width / box.height
  })()
  const ddos = readFileSync(join(RAW, 'az', 'az-ddos-protection.svg'), 'utf8')
  const shieldOnly = ddos
    .match(/ d="([^"]+)"/)[1]
    .split(/(?=M)/)
    .map(pathBounds)
    .reduce((largest, box) =>
      (box.right - box.x) * (box.bottom - box.y) >
      (largest.right - largest.x) * (largest.bottom - largest.y)
        ? box
        : largest
    )
  assert.ok(
    Math.abs(shieldOnly.right - shieldOnly.x - (shieldOnly.bottom - shieldOnly.y) * shieldRatio) <
      0.1,
    'the shield in az-ddos-protection is narrower or wider than az-shield'
  )
})

test('pathBounds measures curves, arcs and relative commands', () => {
  assert.deepEqual(pathBounds('M0 0 L10 0 L10 5 Z'), { x: 0, y: 0, right: 10, bottom: 5 })
  const curve = pathBounds('M0 0 C0 10 10 10 10 0')
  assert.ok(Math.abs(curve.bottom - 7.5) < 1e-9)
  const circle = pathBounds('M2 7a5 5 0 1 0 10 0a5 5 0 1 0-10 0z')
  assert.ok(Math.abs(circle.y - 2) < 0.01 && Math.abs(circle.bottom - 12) < 0.01)
  assert.deepEqual(pathBounds('m1 1h4v2h-4z'), { x: 1, y: 1, right: 5, bottom: 3 })
})

test('geometryIssues flags each kind of distortion', () => {
  const square = '<path d="M1 1H13V13H1Z"/>'
  assert.deepEqual(geometryIssues(svg(square), 'az/az-x.svg'), [])
  assert.match(geometryIssues(svg(square, 'width="14" height="13"'), 'k')[0], /canvas is 14x13/)
  assert.match(
    geometryIssues(svg(square, 'width="14" height="14" viewBox="0 0 24 14"'), 'k')[0],
    /viewBox="0 0 24 14"/
  )
  assert.match(
    geometryIssues(svg(square, 'width="14" height="14" preserveAspectRatio="none"'), 'k')[0],
    /preserveAspectRatio/
  )
  assert.match(
    geometryIssues(svg(`<g transform="scale(1 0.6)">${square}</g>`), 'k')[0],
    /scales x and y differently/
  )
  assert.match(
    geometryIssues(svg(`<g transform="matrix(1 0 0 0.5 0 0)">${square}</g>`), 'k')[0],
    /does not scale x and y alike/
  )
  assert.deepEqual(geometryIssues(svg(`<g transform="rotate(45) scale(2)">${square}</g>`), 'k'), [])
  assert.match(geometryIssues(svg('<path d="M0 0H15V14H0Z"/>'), 'k')[0], /overflows the canvas/)
  assert.match(geometryIssues(svg('<path d="M0 5H14V9H0Z"/>'), 'k')[0], /badly non-square/)
  assert.deepEqual(geometryIssues(svg('<path d="M0 5H14V9H0Z"/>'), 'az/az-minus.svg'), [])
})
