// Vitest global setup for @aziontech/webkit (browser mode).
//
// No theme CSS is loaded here on purpose, so a suite runs unstyled by default: utility classes
// emit no CSS and a computed style reads the UA default. A suite that asserts layout, geometry or
// a computed style imports ./reflow.css first, which compiles the theme and the component classes
// with the Tailwind plugin in vitest.config.ts. The two modes are described in
// contributing/rules/testing.md.
import { cleanup, configure } from '@testing-library/vue'
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

// Lazily loaded parts (Monaco, chart scenes, overlay menus) can take longer than Testing Library's
// 1 s default to appear when four shards share a loaded machine; every findBy/waitFor waits 5 s.
export const ASYNC_UTIL_TIMEOUT = 5000

configure({ asyncUtilTimeout: ASYNC_UTIL_TIMEOUT })

beforeEach(() => {
  document.addEventListener('click', preventAnchorNavigation, true)
})

afterEach(() => {
  document.removeEventListener('click', preventAnchorNavigation, true)
  cleanup()
})
