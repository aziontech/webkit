import { tokenRef } from '../../scripts/refs.js'

export const background = {
  light: {
    'bg-canvas': tokenRef('theme.surfaces.surface-50'),
    'bg-surface': tokenRef('theme.surfaces.surface-0'),
    'bg-surface-raised': tokenRef('theme.surfaces.surface-0'),
    'bg-mask': tokenRef('primitives.alpha.black.50'),
    'bg-surface-overlay': tokenRef('theme.surfaces.surface-50'),
    'bg-placeholder': tokenRef('primitives.alpha.black.100'),
    'bg-placeholder-highlight': tokenRef('primitives.alpha.white.600'),
    'bg-hover': tokenRef('primitives.alpha.black.100'),
    'bg-active': tokenRef('primitives.alpha.black.50'),
    'bg-backdrop': tokenRef('primitives.alpha.black.800'),
    'bg-selected': tokenRef('theme.surfaces.surface-200'),
    'bg-contrast': tokenRef('theme.surfaces.surface-900'),
    'bg-disabled': tokenRef('theme.surfaces.surface-200')
  },
  dark: {
    'bg-canvas': tokenRef('primitives.base.black'),
    'bg-surface': tokenRef('theme.surfaces.surface-950'),
    'bg-surface-raised': tokenRef('theme.surfaces.surface-900'),
    'bg-mask': tokenRef('primitives.alpha.white.50'),
    'bg-surface-overlay': tokenRef('theme.surfaces.surface-700'),
    'bg-placeholder': tokenRef('primitives.alpha.white.100'),
    'bg-placeholder-highlight': tokenRef('primitives.alpha.white.100'),
    // Interaction overlays LIGHTEN in dark. A black alpha over a dark surface is invisible
    // (and a literal no-op over `bg-canvas`, which is pure black), so hover/active follow the
    // same polarity flip `bg-mask` / `bg-placeholder` / `border-default` already make here.
    // `active` stacks on top of `hover` (the row paints both layers while pressed), so it is
    // the smaller increment, mirroring light's 8% + 2%.
    'bg-hover': tokenRef('primitives.alpha.white.100'),
    'bg-active': tokenRef('primitives.alpha.white.50'),
    'bg-backdrop': tokenRef('primitives.alpha.black.800'),
    'bg-selected': tokenRef('theme.surfaces.surface-800'),
    'bg-contrast': tokenRef('theme.surfaces.surface-50'),
    'bg-disabled': tokenRef('theme.surfaces.surface-800')
  }
}

export default { background }
