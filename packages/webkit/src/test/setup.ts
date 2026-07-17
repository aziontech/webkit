// Vitest global setup for @aziontech/webkit (browser mode).
//
// No theme CSS is loaded here on purpose. This env does not run Tailwind, so the
// components' utility classes would not apply anyway (only the token variables
// would load, and nothing here reads them). Unit tests cover behavior / structure
// / ARIA — not the visual layer; pixels & contrast live in Storybook + visual
// regression. Do not re-add `@aziontech/theme/globals.css` without also wiring
// the Tailwind pipeline. See docs/TESTING_AUDIT_2026-07-02.md §2.0.
import { cleanup } from '@testing-library/vue'
import { afterEach, beforeEach } from 'vitest'

// Anchor-navigation guard. Components render real <a href> links; in a real
// browser a click (or Enter) on one triggers a FULL navigation that tears down
// the test iframe ("Cannot connect to the iframe" — which aborts the whole run).
// We prevent the DEFAULT navigation for anchor targets only: component
// @click / @keydown handlers still run and emit their events, while buttons,
// checkboxes, radios and forms are untouched (so v-model / toggle behavior is
// preserved). This kills the class of flaky iframe-teardown crashes at the root.
function preventAnchorNavigation(event: MouseEvent) {
  const target = event.target
  if (target instanceof Element && target.closest('a[href]')) {
    event.preventDefault()
  }
}

beforeEach(() => {
  document.addEventListener('click', preventAnchorNavigation, true)
})

afterEach(() => {
  document.removeEventListener('click', preventAnchorNavigation, true)
  cleanup()
})
