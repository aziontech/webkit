// Vitest global setup for @aziontech/webkit (browser mode).
//
// No theme CSS is loaded here on purpose, so a suite runs unstyled by default: utility classes
// emit no CSS and a computed style reads the UA default. A suite that asserts layout, geometry or
// a computed style imports ./reflow.css first, which compiles the theme and the component classes
// with the Tailwind plugin in vitest.config.ts. The two modes are described in
// .claude/rules/testing.md.
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

// Chromium reports "ResizeObserver loop completed with undelivered notifications" when an observer
// callback resizes what it observes; the browser delivers the rest next frame, so it is benign and
// only floods the log. Registered through the prototype so Vitest's error catcher, which counts
// listeners added through window.addEventListener, keeps failing on every real unhandled error.
export const RESIZE_OBSERVER_LOOP =
  /^ResizeObserver loop (completed with undelivered notifications|limit exceeded)/

function ignoreResizeObserverLoop(event: ErrorEvent) {
  if (RESIZE_OBSERVER_LOOP.test(event.message)) event.stopImmediatePropagation()
}

EventTarget.prototype.addEventListener.call(window, 'error', ignoreResizeObserverLoop, true)

beforeEach(() => {
  document.addEventListener('click', preventAnchorNavigation, true)
})

afterEach(() => {
  document.removeEventListener('click', preventAnchorNavigation, true)
  cleanup()
})
