// Vitest global setup for @aziontech/webkit.
// Component a11y assertions use axe-core directly (see helpers in test files);
// no global matchers are registered.
import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
