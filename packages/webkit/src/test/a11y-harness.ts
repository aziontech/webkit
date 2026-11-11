// Shared by the a11y-*.test.ts files: every copyable SFC (blocks and examples) is mounted with
// the real theme and Tailwind build (reflow.css) and checked by axe against WCAG 2.1 A and AA,
// colour contrast included, in the light and dark themes; a separate pass emulates
// forced-colors and prefers-reduced-motion. Known findings live in a11y-known.json, keyed by
// pass and file, and the list only shrinks. In the light and dark passes every animation and
// transition is settled to its end state first, so contrast is read on the final colours: a new finding fails, and so does a known one that
// no longer fires (delete its entry). Set VITE_A11Y_RECORD=1 to print the current findings as
// `A11Y_KNOWN {...}` lines instead of asserting, to rebuild the file.
import './reflow.css'

import { render } from '@testing-library/vue'
import axe from 'axe-core'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import type { Component } from 'vue'
import { nextTick } from 'vue'

import KNOWN from './a11y-known.json'

export type A11yPass = 'light' | 'dark' | 'media'
export type A11yScope = 'blocks' | 'examples'

const modules: Record<A11yScope, Record<string, () => Promise<{ default: Component }>>> = {
  blocks: import.meta.glob<{ default: Component }>('../../blocks/**/*.vue'),
  examples: import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

const RECORD = import.meta.env['VITE_A11Y_RECORD'] === '1'

const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const known = KNOWN as Record<A11yPass, Record<string, string[]>>

const SETTLED_MOTION =
  '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}'

function axeOptions(pass: A11yPass): axe.RunOptions {
  return {
    runOnly: { type: 'tag', values: WCAG_21_AA },
    rules: pass === 'media' ? { 'color-contrast': { enabled: false } } : {},
    resultTypes: ['violations']
  }
}

function settle(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
}

function runningInfiniteAnimations(root: Element): string[] {
  return root
    .getAnimations({ subtree: true })
    .filter((animation) => {
      const timing = animation.effect?.getComputedTiming()
      return animation.playState === 'running' && timing?.iterations === Infinity
    })
    .map((animation) => {
      const target = (animation.effect as KeyframeEffect | null)?.target as HTMLElement | null
      const id = target?.dataset['testid'] ?? target?.className.toString().slice(0, 40) ?? '?'
      return `${(animation as CSSAnimation).animationName ?? 'animation'} on ${id}`
    })
}

function describeViolations(violations: axe.Result[]): string {
  return violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.nodes
          .slice(0, 3)
          .map((node) => node.target.join(' '))
          .join(' | ')}`
    )
    .join('\n')
}

export function runA11ySuite(scope: A11yScope, pass: A11yPass): void {
  const files = Object.keys(modules[scope]).sort()

  describe(`a11y · ${scope} · ${pass}`, () => {
    beforeAll(async () => {
      await commands.emulateMedia(
        pass === 'media'
          ? { colorScheme: 'light', forcedColors: 'active', reducedMotion: 'reduce' }
          : { colorScheme: pass, forcedColors: 'none', reducedMotion: 'no-preference' }
      )
      document.documentElement.dataset['theme'] = pass === 'dark' ? 'dark' : 'light'
      document.body.style.background = 'var(--bg-canvas)'
      document.body.style.color = 'var(--text-default)'
      if (pass !== 'media') {
        const style = document.createElement('style')
        style.dataset['a11yHarness'] = ''
        style.textContent = SETTLED_MOTION
        document.head.appendChild(style)
      }
    })

    afterAll(async () => {
      await commands.emulateMedia({ colorScheme: null, forcedColors: null, reducedMotion: null })
      delete document.documentElement.dataset['theme']
      document.body.removeAttribute('style')
      document.head.querySelectorAll('style[data-a11y-harness]').forEach((style) => style.remove())
    })

    afterEach(() => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    })

    it.each(files.map((file) => [file.replace('../../', '')]))('%s', async (file) => {
      const mod = await modules[scope][`../../${file}`]!()
      render(mod.default)
      await nextTick()
      await settle()

      const results = await axe.run(document.body, axeOptions(pass))
      const findings = new Set(results.violations.map((violation) => violation.id))
      const animations = pass === 'media' ? runningInfiniteAnimations(document.body) : []
      if (animations.length) findings.add('reduced-motion-infinite-animation')

      if (RECORD) {
        if (findings.size)
          console.warn(`A11Y_KNOWN ${JSON.stringify({ pass, file, rules: [...findings].sort() })}`)
        return
      }

      const allowed = new Set(known[pass]?.[file] ?? [])
      const fresh = results.violations.filter((violation) => !allowed.has(violation.id))
      const freshAnimations = allowed.has('reduced-motion-infinite-animation') ? [] : animations
      const stale = [...allowed].filter((rule) => !findings.has(rule))

      expect(describeViolations(fresh), 'new axe violations').toBe('')
      expect(freshAnimations, 'infinite animations still running under reduced motion').toEqual([])
      expect(stale, `fixed: remove these rules from a11y-known.json ${pass} › ${file}`).toEqual([])
    })
  })
}
