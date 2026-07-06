export const curve = {
  'productive-entrance': 'cubic-bezier(0.39, 0.57, 0.56, 1)',
  'productive-exit': 'cubic-bezier(0.55, 0.09, 0.68, 0.53)',
  'expressive-entrance': 'cubic-bezier(0.17, 0.84, 0.44, 1)',
  'expressive-exit': 'cubic-bezier(0.95, 0.05, 0.8, 0.04)',
};

export const duration = {
  'fast-01': '70ms',
  'fast-02': '110ms',
  'moderate-01': '150ms',
  'moderate-02': '240ms',
  'slow-01': '400ms',
  'slow-02': '700ms',
  'slow-03': '1100ms',
  'slow-04': '2100ms',
};

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
  'progress-indeterminate': `progressIndeterminate ${duration['slow-04']} ${curve['productive-entrance']} infinite`,
  'progress-indeterminate-short': `progressIndeterminateShort ${duration['slow-04']} ${curve['expressive-entrance']} ${duration['slow-03']} infinite`,
};

export default { animate, curve, duration };
