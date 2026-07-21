/**
 * Visual-mode matrix — single source of truth for the visual regression layer
 * (test-runner.js) and the Storybook viewport toolbar (preview.js).
 *
 * Consumed by BOTH module worlds:
 *  - .storybook/test-runner.js — required via storybook serverRequire, which
 *    registers esbuild-register (format: cjs); ESM syntax is transpiled.
 *  - .storybook/preview.js — native ESM under Vite.
 * Keep this file dependency-free and side-effect-free so both loaders agree.
 */

// Aligned to the theme token breakpoints (min-width 640 / 768 / 1280):
// mobile sits below every breakpoint, tablet exactly at md (min-width: 768px
// matches at 768), desktop at xl — the historical baseline size.
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 }
}

// Mirrors THEME_CLASSES / applyThemeClass in preview.js.
export const THEME_CLASSES = {
  light: ['azion', 'azion-light'],
  dark: ['azion', 'azion-dark']
}

/**
 * Full theme × viewport cross product; keys are also the snapshot suffixes.
 * Grouped by viewport so the per-story loop resizes only 3 times.
 */
export const MODES = {
  'dark-desktop': { theme: 'dark', viewport: 'desktop' },
  'light-desktop': { theme: 'light', viewport: 'desktop' },
  'dark-tablet': { theme: 'dark', viewport: 'tablet' },
  'light-tablet': { theme: 'light', viewport: 'tablet' },
  'dark-mobile': { theme: 'dark', viewport: 'mobile' },
  'light-mobile': { theme: 'light', viewport: 'mobile' }
}

// Every story gets the full cross product by default; narrow per story with
// `parameters.visual = { modes: [...] }`. dark-desktop MUST stay first: it
// writes the bare-story-id baseline (see snapshotIdentifier).
export const DEFAULT_MODES = Object.keys(MODES)

export const BASELINE_MODE = 'dark-desktop'

/**
 * dark-desktop keeps the bare story id so the pre-matrix committed baselines
 * stay byte-identical; every other mode is suffixed `<story-id>--<mode>`.
 * CSF id sanitization collapses consecutive dashes, so a bare story id can
 * never collide with a suffixed one.
 */
export function snapshotIdentifier(storyId, modeId) {
  return modeId === BASELINE_MODE ? storyId : `${storyId}--${modeId}`
}

/**
 * Resolve `parameters.visual` into the list of modes to screenshot.
 *  - false                → [] (skip snapshots; the story is still visited)
 *  - { modes: [...] }     → exactly those (an unknown name throws = typo guard)
 *  - anything else/absent → DEFAULT_MODES
 * `envFilter` (the VISUAL_MODES env var, comma-separated) intersects the
 * result — for fast local runs and partial baseline regeneration.
 */
export function resolveModes(visualParam, envFilter) {
  if (visualParam === false) return []
  const requested =
    visualParam && Array.isArray(visualParam.modes) ? visualParam.modes : DEFAULT_MODES
  for (const mode of requested) {
    if (!MODES[mode]) {
      throw new Error(
        `Unknown visual mode "${mode}". Valid modes: ${Object.keys(MODES).join(', ')}`
      )
    }
  }
  if (!envFilter) return requested
  const allow = envFilter
    .split(',')
    .map((mode) => mode.trim())
    .filter(Boolean)
  for (const mode of allow) {
    if (!MODES[mode]) {
      throw new Error(
        `Unknown visual mode "${mode}" in VISUAL_MODES. Valid modes: ${Object.keys(MODES).join(', ')}`
      )
    }
  }
  return requested.filter((mode) => allow.includes(mode))
}

/** `parameters.viewport.viewports` shape for the Storybook toolbar. */
export const STORYBOOK_VIEWPORTS = {
  mobile: {
    name: 'Mobile (375×667)',
    styles: { width: '375px', height: '667px' },
    type: 'mobile'
  },
  tablet: {
    name: 'Tablet (768×1024)',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet'
  },
  desktop: {
    name: 'Desktop (1280×720)',
    styles: { width: '1280px', height: '720px' },
    type: 'desktop'
  }
}
