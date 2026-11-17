import { test } from 'node:test'
import assert from 'node:assert/strict'

import { typography } from '../src/tokens/semantic/typography.js'

const DISPLAY = /^text-(heading|amount|big-number)-/
const REM_PX = 16

const displayRoles = Object.entries(typography).filter(([name]) => DISPLAY.test(name))

const largestSize = (fontSize) => {
  const steps = typeof fontSize === 'object' ? Object.values(fontSize) : [fontSize]
  return Math.max(...steps.map((step) => parseFloat(step)))
}

test('heading tracking scales with the font size: em or a unitless zero, never rem or px', () => {
  for (const [name, role] of displayRoles) {
    const spacing = role.letterSpacing
    if (spacing === undefined || spacing === '0') continue
    assert.match(spacing, /^-?\d*\.?\d+em$/, `${name} letter-spacing ${spacing} must be in em`)
  }
})

test('the two display headings keep their desktop tracking of -0.16rem', () => {
  for (const name of ['text-heading-3xl', 'text-heading-2xl']) {
    const role = typography[name]
    const px = parseFloat(role.letterSpacing) * largestSize(role.fontSize) * REM_PX
    assert.ok(Math.abs(px - -0.16 * REM_PX) < 0.05, `${name} desktop tracking is ${px}px, expected -2.56px`)
  }
})
