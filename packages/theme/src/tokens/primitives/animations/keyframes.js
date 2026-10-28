export const keyframes = {
  fadeIn: {
    '0%': 'opacity: 0',
    '100%': 'opacity: 1'
  },
  fadeOut: {
    '0%': 'opacity: 1',
    '100%': 'opacity: 0'
  },
  slideDown: {
    '0%': 'height: 0',
    '100%': 'height: auto'
  },
  blink: {
    '0%, 100%': 'opacity: 1',
    '50%': 'opacity: 0'
  },
  highlight: {
    '0%, 40%': 'background-color: var(--surface-hover); font-weight: 500',
    '100%': 'background-color: transparent; font-weight: 400'
  },
  shimmer: {
    '0%': 'background-position: 200% 0',
    '100%': 'background-position: -200% 0'
  },
  pageEnter: {
    '0%': 'opacity: 0; translate: calc(var(--page-enter-distance, var(--layout-boundary-inline)) * -1) 0',
    '100%': 'opacity: 1; translate: 0 0'
  },
  contentEnter: {
    '0%': 'opacity: 0; translate: 0 var(--spacing-xs)',
    '100%': 'opacity: 1; translate: 0 0'
  },
  popupScaleIn: {
    '0%': 'opacity: 0; transform: scale(0.9)',
    '100%': 'opacity: 1; transform: scale(1)'
  },
  popupScaleOut: {
    '0%': 'opacity: 1; transform: scale(1)',
    '100%': 'opacity: 0; transform: scale(0.9)'
  },
  slideInLeft: {
    '0%': 'transform: translateX(-100%)',
    '100%': 'transform: translateX(0)'
  },
  slideOutLeft: {
    '0%': 'transform: translateX(0)',
    '100%': 'transform: translateX(-100%)'
  },
  slideInRight: {
    '0%': 'transform: translateX(100%)',
    '100%': 'transform: translateX(0)'
  },
  slideOutRight: {
    '0%': 'transform: translateX(0)',
    '100%': 'transform: translateX(100%)'
  },
  progressIndeterminate: {
    '0%': 'inset-inline-start: -35%; inset-inline-end: 100%',
    '60%': 'inset-inline-start: 100%; inset-inline-end: -90%',
    '100%': 'inset-inline-start: 100%; inset-inline-end: -90%'
  },
  progressIndeterminateShort: {
    '0%': 'inset-inline-start: -200%; inset-inline-end: 100%',
    '60%': 'inset-inline-start: 107%; inset-inline-end: -8%',
    '100%': 'inset-inline-start: 107%; inset-inline-end: -8%'
  },
  flowDash: {
    '0%': 'stroke-dashoffset: 24',
    '100%': 'stroke-dashoffset: 0'
  },
  textureWaveA: {
    to: 'transform: translate3d(calc(-1 * var(--texture-wave-shift)), 0, 0)'
  },
  textureWaveB: {
    to: 'transform: translate3d(var(--texture-wave-shift), 0, 0)'
  },
  brandMarquee: {
    '0%': 'transform: translateX(0)',
    '100%': 'transform: translateX(-50%)'
  }
}

export const animateExtras = {
  'animate-popup-scale-in': { 'transform-origin': 'var(--popup-origin, center)' },
  'animate-popup-scale-out': { 'transform-origin': 'var(--popup-origin, center)' }
}

export default { keyframes, animateExtras }
