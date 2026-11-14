import { tokenRef } from '../../../scripts/refs.js'

/** @deprecated since 5.3 — the `--width-*` CSS variables: use `--container-*`, which hold the same values. Removed in 6.0. */
export const width = {
  '3xs': tokenRef('shape.container.3xs'),
  '2xs': tokenRef('shape.container.2xs'),
  xs: tokenRef('shape.container.xs'),
  sm: tokenRef('shape.container.sm'),
  md: tokenRef('shape.container.md'),
  lg: tokenRef('shape.container.lg'),
  xl: tokenRef('shape.container.xl'),
  '2xl': tokenRef('shape.container.2xl'),
  '3xl': tokenRef('shape.container.3xl'),
  '4xl': tokenRef('shape.container.4xl'),
  '5xl': tokenRef('shape.container.5xl'),
  '6xl': tokenRef('shape.container.6xl'),
  '7xl': tokenRef('shape.container.7xl')
}

export default { width }
