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
import type { Component, ComponentInternalInstance, VNode } from 'vue'
import { defineComponent, getCurrentInstance, h, nextTick } from 'vue'

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

type OverlayContext = { open: () => void; close: () => void; isOpen: { value: boolean } }

const OVERLAYS = new Set(['Dialog', 'Drawer'])

function collectOverlays(node: VNode | null | undefined, out: ComponentInternalInstance[]): void {
  if (!node) return
  if (node.component) {
    if (OVERLAYS.has(node.component.type.name ?? '')) out.push(node.component)
    collectOverlays(node.component.subTree, out)
    return
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === 'object') collectOverlays(child as VNode, out)
    }
  }
}

function overlayContext(instance: ComponentInternalInstance): OverlayContext | undefined {
  const provides = (instance as unknown as { provides: Record<symbol, unknown> }).provides
  for (const key of Reflect.ownKeys(provides)) {
    const value = provides[key as symbol] as Partial<OverlayContext> | undefined
    if (value && typeof value.open === 'function' && value.isOpen) return value as OverlayContext
  }
  return undefined
}

function overlayLabel(instance: ComponentInternalInstance, index: number): string {
  const testId = (instance.vnode.props?.['data-testid'] as string | undefined) ?? ''
  return `${instance.type.name} #${index + 1}${testId ? ` (${testId})` : ''}`
}

async function closeOverlay(
  instance: ComponentInternalInstance,
  ctx: OverlayContext
): Promise<void> {
  ctx.close()
  await nextTick()
  if (ctx.isOpen.value) instance.emit('update:open', false)
  await nextTick()
  await settle()
}

/**
 * Opens every Dialog and Drawer a copyable SFC mounts but renders closed, one at a time, and runs
 * axe on the page with it open: the overlay's own markup, the landmarks it adds next to the page's
 * (a second banner or contentinfo), and what it hides from the rest. Opening goes through the
 * overlay's own context, so it works for a `v-model:open` driven by the page and for an
 * uncontrolled overlay with a trigger part alike; an overlay the page keeps closed (its
 * `update:open` handler ignores `true`, like a reveal shown only after a create) is skipped and is
 * covered by its block's own test. No known-findings list: the pass stays clean.
 */
export function runA11yOpenSuite(scope: A11yScope, theme: 'light' | 'dark'): void {
  const files = Object.keys(modules[scope]).sort()

  describe(`a11y · ${scope} · open overlays · ${theme}`, () => {
    let ran = 0
    let opened = 0

    beforeAll(async () => {
      await commands.emulateMedia({
        colorScheme: theme,
        forcedColors: 'none',
        reducedMotion: 'no-preference'
      })
      document.documentElement.dataset['theme'] = theme
      document.body.style.background = 'var(--bg-canvas)'
      document.body.style.color = 'var(--text-default)'
      const style = document.createElement('style')
      style.dataset['a11yHarness'] = ''
      style.textContent = SETTLED_MOTION
      document.head.appendChild(style)
    })

    afterAll(async () => {
      await commands.emulateMedia({ colorScheme: null, forcedColors: null, reducedMotion: null })
      delete document.documentElement.dataset['theme']
      document.body.removeAttribute('style')
      document.head.querySelectorAll('style[data-a11y-harness]').forEach((style) => style.remove())
      if (ran > 10) expect(opened, 'the pass opened no overlay at all').toBeGreaterThan(0)
    })

    afterEach(() => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    })

    it.each(files.map((file) => [file.replace('../../', '')]))('%s', async (file) => {
      ran += 1
      const mod = await modules[scope][`../../${file}`]!()
      let host: ComponentInternalInstance | null = null
      render(
        defineComponent({
          setup() {
            host = getCurrentInstance()
            return () => h(mod.default)
          }
        })
      )
      await nextTick()
      await settle()

      const overlays: ComponentInternalInstance[] = []
      collectOverlays((host as ComponentInternalInstance | null)?.subTree, overlays)
      const failures: string[] = []

      for (const [index, instance] of overlays.entries()) {
        const ctx = overlayContext(instance)
        if (!ctx || ctx.isOpen.value) continue
        ctx.open()
        await nextTick()
        await settle()
        const label = overlayLabel(instance, index)
        if (!ctx.isOpen.value) continue
        opened += 1
        const results = await axe.run(document.body, axeOptions(theme))
        if (RECORD && results.violations.length) {
          console.warn(
            `A11Y_OPEN ${JSON.stringify({ theme, file, overlay: label, rules: results.violations.map((v) => v.id) })}`
          )
        }
        if (results.violations.length)
          failures.push(
            `${label}\n${results.violations
              .map(
                (violation) =>
                  `${violation.id}: ${violation.nodes
                    .slice(0, 3)
                    .map((node) => `${node.target.join(' ')} ${node.html.slice(0, 160)}`)
                    .join(' | ')}`
              )
              .join('\n')}`
          )
        await closeOverlay(instance, ctx)
        if (ctx.isOpen.value) break
      }

      if (RECORD) return
      expect(failures.join('\n\n'), 'axe violations with an overlay open').toBe('')
    })
  })
}
