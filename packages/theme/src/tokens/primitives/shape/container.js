/*
 * Container widths — a geometric rhythm, not a hand-picked list.
 *
 * The scale is anchored at both ends: `3xs` stays 256px (the narrowest useful
 * field/rail width) and `7xl` is 1620px (the widest container in the system —
 * a full-bleed hero or marketing band; the standard page measure is `6xl`). The eleven
 * slots between them are `256 × r^n` with r = (1620 / 256)^(1/12) ≈ 1.1662 —
 * so every neighbouring pair sits at the same ~+16.6% apart and the whole set
 * reads as one progression instead of two grids spliced together (the previous
 * scale stepped +32, then +64, then +96, then +128).
 *
 * Values are rounded to the 4px grid; `7xl` keeps its exact anchor and `4xl`
 * is nudged 4px to land on 1024 (2.6px off the ideal, and a landmark worth
 * keeping). Ratio between neighbours therefore ranges 1.157–1.172.
 *
 * Rounding is 4px, not 8px, because 1620 is not a multiple of 8 — the anchor
 * defines the grid, so a stricter grid could not reach it.
 */
export const container = {
  '3xs': '256px', //  ×1     — anchor
  '2xs': '300px', //  +44
  xs: '348px', //     +48
  sm: '408px', //     +60
  md: '472px', //     +64
  lg: '552px', //     +80
  xl: '644px', //     +92
  '2xl': '752px', //  +108
  '3xl': '876px', //  +124
  '4xl': '1024px', // +148
  '5xl': '1192px', // +168
  '6xl': '1388px', // +196
  '7xl': '1620px' //  +232 — anchor
}

export default { container }
