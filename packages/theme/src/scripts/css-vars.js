/**
 * CSS variables initializer for semantic tokens.
 *
 * Reads the single source-of-truth in `tokens/semantic/colors.js` and resolves
 * its `tokenRef(...)` entries against the primitive trees, producing a flat
 * `{ light, dark }` map of CSS variable names → resolved color values.
 */

import {
  brandPrimitives,
  primitives,
  surfacePrimitives
} from '../tokens/primitives/colors/colors.js'
import { semanticColorsData } from '../tokens/semantic/colors.js'
import { resolveRefsToCssVars } from './resolve.js'

export const createCssVars = () =>
  resolveRefsToCssVars({
    primitives,
    surfacePrimitives,
    brandPrimitives,
    textSemantic: semanticColorsData.text,
    backgroundSemantic: semanticColorsData.background,
    borderSemantic: semanticColorsData.border
  })

export const cssVarsString = () => {
  const { light, dark } = createCssVars()
  const format = (vars) =>
    Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')

  return [
    `:root, [data-theme=light], .azion.azion-light {\n${format(light)}\n}`,
    `[data-theme=dark], .dark, .azion.azion-dark {\n${format(dark)}\n}`
  ].join('\n\n')
}

export const injectCssVars = () => {
  const style = document.createElement('style')
  style.setAttribute('data-azion-tokens', 'true')
  style.textContent = cssVarsString()
  document.head.appendChild(style)
  return style
}
