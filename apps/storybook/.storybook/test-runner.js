/**
 * Storybook test-runner — visual regression over every story.
 *
 * Each story is visited in real Chromium (Playwright), screenshotted at the
 * `#storybook-root` element and compared against a committed baseline with
 * jest-image-snapshot. This is the styled layer of the test architecture:
 * units (packages/webkit, Vitest browser mode) own behavior/structure/ARIA on
 * an unstyled DOM; THIS layer owns pixels. See docs/TESTING_AUDIT_2026-07-02.md §2.0.
 *
 * Baselines are per-platform (font rasterization differs across OSes):
 *   test-visual/__image_snapshots__/linux/  → the CI contract, committed
 *   test-visual/__image_snapshots__/darwin/ → local-only, gitignored
 * Update linux baselines via the app-storybook-visual workflow (dispatch with
 * update_baselines) or a Linux container — never commit darwin baselines.
 *
 * Opt a story out of the snapshot (still visited for render errors) with
 * `parameters: { visual: false }`.
 */
import { getStoryContext, waitForPageReady } from '@storybook/test-runner'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

const TEST_VISUAL_DIR = `${__dirname}/test-visual`
const DIFF_DIR = `${TEST_VISUAL_DIR}/__diff_output__`
const SNAPSHOT_DIR = `${TEST_VISUAL_DIR}/__image_snapshots__/${process.platform}`

/** @type {import('@storybook/test-runner').TestRunnerConfig} */
module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot })
  },

  async preVisit(page) {
    await page.setViewportSize({ width: 1280, height: 720 })

    // Park the real pointer: the worker page is reused across stories, so a
    // pointer left over an element would leak hover state (hover-open menus,
    // tooltips) into the next story's render and screenshot.
    await page.mouse.move(0, 0)

    // Near-zero durations instead of `animation: none` / reducedMotion:
    // components that wait for animationend/transitionend to settle state
    // (use-transition-status) would hang forever with animations removed —
    // 1ms keeps the events firing while making motion invisible to the
    // screenshot. Idempotent: story switches reuse the worker page.
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
      }`

      document.head.appendChild(style)
    })
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context)

    if (storyContext.parameters?.visual === false) return

    await waitForPageReady(page)
    await page.evaluate(() => document.fonts.ready)

    const image = await page.locator('#storybook-root').screenshot({ animations: 'disabled' })
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: SNAPSHOT_DIR,
      customSnapshotIdentifier: context.id,
      customDiffDir: DIFF_DIR,
      // Absorb sub-pixel antialiasing noise; a real change moves far more
      // than 0.01% of the element's pixels.
      failureThreshold: 0.01,
      failureThresholdType: 'percent'
    })
  }
}
