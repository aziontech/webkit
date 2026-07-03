// Vitest global setup for @aziontech/webkit (browser mode).
//
// No theme CSS is loaded here on purpose. This env does not run Tailwind, so the
// components' utility classes would not apply anyway (only the token variables
// would load, and nothing here reads them). Unit tests cover behavior / structure
// / ARIA — not the visual layer; pixels & contrast live in Storybook + visual
// regression. Do not re-add `@aziontech/theme/globals.css` without also wiring
// the Tailwind pipeline. See docs/TESTING_AUDIT_2026-07-02.md §2.0.
import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
