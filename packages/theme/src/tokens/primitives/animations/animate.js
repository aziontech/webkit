export const curve = {
  'productive-entrance': 'cubic-bezier(0.39, 0.57, 0.56, 1)',
  'productive-exit': 'cubic-bezier(0.55, 0.09, 0.68, 0.53)',
  'expressive-entrance': 'cubic-bezier(0.17, 0.84, 0.44, 1)',
  'expressive-exit': 'cubic-bezier(0.95, 0.05, 0.8, 0.04)'
}

export const duration = {
  'fast-01': '70ms',
  'fast-02': '110ms',
  'moderate-01': '150ms',
  'moderate-02': '240ms',
  'slow-01': '400ms',
  'slow-02': '700ms',
  'slow-03': '1100ms',
  'slow-04': '2100ms'
}

export const animate = {
  spin: 'spin 1s linear infinite',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
  shimmer: 'shimmer 1.6s linear infinite',
  blink: 'blink 1s step-end infinite',
  'fade-in': 'fadeIn 220ms ease-in-out',
  'fade-out': 'fadeOut 220ms ease-in-out',
  'slide-down': 'slideDown 220ms ease-in-out',
  'highlight-fade': 'highlight ease-in forwards',
  'popup-scale-in': `popupScaleIn ${duration['moderate-01']} ${curve['productive-entrance']}`,
  'popup-scale-out': `popupScaleOut ${duration['fast-02']} ${curve['productive-exit']}`,
  // Lateral panels (sidebar / drawer): the panel slides from its anchored edge.
  // Entrance is a touch longer than popups (larger surface); exit is quicker.
  'slide-in-left': `slideInLeft ${duration['moderate-02']} ${curve['productive-entrance']}`,
  'slide-out-left': `slideOutLeft ${duration['moderate-01']} ${curve['productive-exit']}`,
  'slide-in-right': `slideInRight ${duration['moderate-02']} ${curve['productive-entrance']}`,
  'slide-out-right': `slideOutRight ${duration['moderate-01']} ${curve['productive-exit']}`,
  'progress-indeterminate': `progressIndeterminate ${duration['slow-04']} ${curve['productive-entrance']} infinite`,
  'progress-indeterminate-short': `progressIndeterminateShort ${duration['slow-04']} ${curve['expressive-entrance']} ${duration['slow-03']} infinite`
}

/**
 * When to reach for each `animate-*` utility — the guidance half of the catalog,
 * surfaced to consumers by the webkit MCP (`list_tokens`) and the Storybook
 * Foundations/Motion page. Every `animate` key has an entry; keep them in sync.
 */
export const useWhen = {
  spin: 'Indeterminate circular spinners (loading icons).',
  ping: 'One-off attention ring radiating from a small element (notification dot).',
  pulse: 'Skeleton/placeholder opacity pulse while content loads.',
  bounce: 'Playful attention bounce (scroll-down hints); use sparingly.',
  shimmer: 'Skeleton shimmer sweep while content loads.',
  blink: 'Text caret / terminal cursor blink.',
  'fade-in': 'Content or backdrop appearing in place (no directional origin).',
  'fade-out': 'Content or backdrop leaving in place (pair of fade-in).',
  'slide-down': 'Vertical disclosure expanding (accordion panel, expandable row).',
  'highlight-fade': 'Row/item briefly highlighted after an update (recently changed).',
  'popup-scale-in':
    'Anchored overlays opening (dropdown, popover, tooltip, menu); set --popup-origin.',
  'popup-scale-out': 'Anchored overlays closing (pair of popup-scale-in).',
  'slide-in-left':
    'Left-anchored panel entering (sidebar, navigation drawer). Wrap the v-if region in a Vue Transition with enter-active-class.',
  'slide-out-left':
    'Left-anchored panel leaving (pair of slide-in-left; use as leave-active-class).',
  'slide-in-right': 'Right-anchored panel entering (settings/detail drawer).',
  'slide-out-right': 'Right-anchored panel leaving (pair of slide-in-right).',
  'progress-indeterminate': 'Indeterminate linear progress bar (primary sweep).',
  'progress-indeterminate-short': 'Indeterminate linear progress bar (secondary short sweep).'
}

export default { animate, curve, duration, useWhen }
