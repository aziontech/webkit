// Vitest global setup for @aziontech/webkit (browser mode).
//
// The theme globals are imported so components render with their real design
// tokens/CSS — this is what makes axe color-contrast and any visual-semantic
// assertion trustworthy (unstyled DOM would silently pass/skip contrast).
import '@aziontech/theme/globals.css'

import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
