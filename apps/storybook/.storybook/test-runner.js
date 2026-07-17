/**
 * Storybook test-runner — visual regression over every story.
 *
 * Each story is visited in real Chromium (Playwright) and screenshotted at the
 * `#storybook-root` element in every mode of the theme × viewport matrix
 * declared in ./visual-modes.js (dark|light × desktop|tablet|mobile), then
 * compared against a committed baseline with jest-image-snapshot. This is the
 * styled layer of the test architecture: units (packages/webkit, Vitest
 * browser mode) own behavior/structure/ARIA on an unstyled DOM; THIS layer
 * owns pixels. See docs/TESTING_AUDIT_2026-07-02.md §2.0.
 *
 * Baseline naming: the dark-desktop pass keeps the bare story id
 * (`components-actions-button--default.png`) so pre-matrix baselines stay
 * valid; every other mode is suffixed (`…--default--light-mobile.png`).
 *
 * Baselines are per-platform (font rasterization differs across OSes):
 *   test-visual/__image_snapshots__/linux/  → the CI contract, committed
 *   test-visual/__image_snapshots__/darwin/ → local-only, gitignored
 * Update linux baselines via the app-storybook-generate-baseline workflow
 * (dispatch with update_baselines) or a Linux container — never commit darwin
 * baselines.
 *
 * Per-story control via `parameters.visual`:
 *   false                                → no snapshots (still visited for render errors)
 *   { modes: ['dark-desktop', …] }       → only those modes (names from visual-modes.js)
 * Env filter: VISUAL_MODES=dark-desktop,light-desktop narrows any run — fast
 * local iteration and partial baseline regeneration.
 */
import { getStoryContext, waitForPageReady } from '@storybook/test-runner'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

import {
  MODES,
  resolveModes,
  snapshotIdentifier,
  THEME_CLASSES,
  VIEWPORTS
} from './visual-modes.js'

const TEST_VISUAL_DIR = `${__dirname}/test-visual`
const DIFF_DIR = `${TEST_VISUAL_DIR}/__diff_output__`
const SNAPSHOT_DIR = `${TEST_VISUAL_DIR}/__image_snapshots__/${process.platform}`

async function setThemeClasses(page, theme) {
  await page.evaluate((classes) => {
    const el = document.documentElement
    el.classList.remove('azion', 'azion-light', 'azion-dark')
    el.classList.add(...classes)
  }, THEME_CLASSES[theme])
}

async function settleFrame(page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  )
}

async function awaitImages(page) {
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images, (img) =>
        img.complete
          ? img.decode().catch(() => {})
          : new Promise((resolve) => {
              img.addEventListener('load', () => resolve(img.decode().catch(() => {})), {
                once: true
              })
              img.addEventListener('error', resolve, { once: true })
            })
      )
    )
  )
}

/** @type {import('@storybook/test-runner').TestRunnerConfig} */
module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot })
  },

  async preVisit(page) {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.mouse.move(0, 0)
    await page.evaluate(() => {
      if (document.getElementById('visual-test-freeze')) return

      const style = document.createElement('style')
      style.id = 'visual-test-freeze'
      style.textContent = `*, *::before, *::after {
        animation-duration: 1ms !important;
        animation-delay: 0ms !important;
        transition-duration: 1ms !important;
        transition-delay: 0ms !important;
        caret-color: transparent !important;
      }

      /* preview.css themes the canvas/docs surfaces with
         \`transition: all 0.4s ease-in-out !important\` at up to (0,2,0)
         specificity, which outranks the * rule above. Mirroring those
         selectors verbatim here wins per-longhand: equal specificity +
         !important + later in the cascade (this style is appended to <head>
         last). Keep in sync with preview.css. */
      .sb-main-padded, .docs-story, .docs-story > *,
      .azion-dark .sb-main-padded, .azion-dark .docs-story, .azion-dark .docs-story > *,
      .sbdocs.sbdocs-wrapper, .azion-dark .sbdocs.sbdocs-wrapper,
      .azion-light > body, .azion-dark > body {
        transition-duration: 1ms !important;
        transition-delay: 0ms !important;
      }`

      document.head.appendChild(style)
    })
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context)

    const modes = resolveModes(storyContext.parameters?.visual, process.env.VISUAL_MODES)
    if (modes.length === 0) return

    await waitForPageReady(page)
    await page.evaluate(() => document.fonts.ready)
    await awaitImages(page)

    const failures = []
    try {
      for (const modeId of modes) {
        const { theme, viewport } = MODES[modeId]

        await page.setViewportSize(VIEWPORTS[viewport])
        await setThemeClasses(page, theme)
        await settleFrame(page)

        await page.evaluate(() => document.fonts.ready)
        await awaitImages(page)

        const image = await page.locator('#storybook-root').screenshot({ animations: 'disabled' })
        try {
          expect(image).toMatchImageSnapshot({
            customSnapshotsDir: SNAPSHOT_DIR,
            customSnapshotIdentifier: snapshotIdentifier(context.id, modeId),
            customDiffDir: DIFF_DIR,
            failureThreshold: 0.01,
            failureThresholdType: 'percent'
          })
        } catch (error) {
          failures.push(`[${modeId}] ${error.message}`)
        }
      }
    } finally {
      await setThemeClasses(page, 'dark')
      await page.setViewportSize(VIEWPORTS.desktop)
    }

    if (failures.length > 0) {
      throw new Error(`Visual mismatch in ${failures.length} mode(s):\n\n${failures.join('\n\n')}`)
    }
  }
}
