const plugin = (() => {
  try {
    return require('tailwindcss/plugin');
  } catch {
    return (handler) => handler;
  }
})();

/** Generate semantic animation utilities and keyframes */
export const animations = () => {
  return plugin(({ addUtilities, addComponents }) => {
    // Animation utilities
    const animations = {
      '.animate-fade-in': {
        animation: 'fadeIn 220ms ease-in-out',
      },
      '.animate-fade-out': {
        animation: 'fadeOut 220ms ease-in-out',
      },
      '.animate-slide-down': {
        animation: 'slideDown 220ms ease-in-out',
      },
      '.animate-blink': {
        animation: 'blink 1s step-end infinite',
      },
      '.animate-highlight-fade': {
        animation: 'highlight ease-in forwards',
      },
      '.animate-popup-scale-in': {
        animation: 'popupScaleIn 150ms cubic-bezier(0.39, 0.57, 0.56, 1)',
        transformOrigin: 'var(--popup-origin, center)',
      },
      '.animate-popup-scale-out': {
        animation: 'popupScaleOut 110ms cubic-bezier(0.55, 0.09, 0.68, 0.53)',
        transformOrigin: 'var(--popup-origin, center)',
      },
    };

    // Keyframes components
    const keyframes = {
      '@keyframes fadeIn': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      '@keyframes fadeOut': {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      '@keyframes slideDown': {
        '0%': { height: '0' },
        '100%': { height: 'auto' },
      },
      '@keyframes blink': {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0' },
      },
      '@keyframes highlight': {
        '0%': { backgroundColor: 'var(--surface-hover)', fontWeight: '500' },
        '100%': { backgroundColor: 'var(--surface-hover)', fontWeight: '500' },
      },
      '@keyframes popupScaleIn': {
        '0%': { opacity: '0', transform: 'scale(0.95)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      '@keyframes popupScaleOut': {
        '0%': { opacity: '1', transform: 'scale(1)' },
        '100%': { opacity: '0', transform: 'scale(0.95)' },
      },
    };

    const variants = ['responsive', 'hover', 'focus', 'active', 'motion-safe', 'motion-reduce'];
    addUtilities(animations, variants);
    addComponents(keyframes);
  });
};

export default animations;
