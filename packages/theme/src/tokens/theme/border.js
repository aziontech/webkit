import { tokenRef } from '../../scripts/refs.js'

// The neutral rules are OPAQUE steps of the surface palette, not alpha.
//
// They used to be `alpha.black.100` / `alpha.white.100` / `alpha.white.50`, which meant one
// token painted a different colour on every backdrop — the same hairline read four different
// ways across canvas / surface / raised / overlay — and two rules meeting composited into a
// brighter line, so any stacked or abutting border doubled. An opaque step gives a rule one
// identity wherever it is drawn, and makes overlap a no-op.
//
// The steps are ones added to fill the ramp's gaps (`gray.150` / `gray.250` / `gray.750` /
// `gray.775`), NOT the steps that bracket them — `surface-200` (light) and `surface-800` (dark)
// are what `--bg-selected` and `--bg-disabled` already use, so a border drawn there is exactly
// its own fill and vanishes. Every pairing a component can produce now clears zero:
//   light default  surface-250  vs canvas 32 · surface 37 · selected/disabled 11
//   light muted    surface-150  vs canvas 14 · surface 19 · selected/disabled 7
//   dark  default  surface-750  vs canvas 43 · surface 33 · raised 23 · selected 17
//   dark  muted    surface-775  vs canvas 36 · surface 26 · raised 16 · selected 10
//
// `muted` sits closer to the background than `default` in BOTH themes — lighter in light,
// darker in dark. It is a subtler rule, not a second default; it is drawn on `--bg-surface` /
// `--bg-canvas` (the segmented-button track, the tab-view list, a flow node), never on a
// selected or disabled fill, which is what lets the light step go as light as it does. Dark
// cannot go proportionally as subtle: `--bg-surface-raised` sits at 20 and would swallow it.
export const border = {
  light: {
    'border-default': tokenRef('theme.surfaces.surface-250'),
    'border-muted': tokenRef('theme.surfaces.surface-150'),
    'border-strong': tokenRef('primitives.base.black'),
    'border-selected': tokenRef('brand.primary.primary-500')
  },
  dark: {
    'border-default': tokenRef('theme.surfaces.surface-750'),
    'border-muted': tokenRef('theme.surfaces.surface-775'),
    'border-strong': tokenRef('primitives.base.white'),
    'border-selected': tokenRef('brand.primary.primary-500')
  }
}

export default { border }
