/**
 * Tailwind preset for Azion tokens.
 */

export const preset = {
  theme: {
    extend: {
      colors: {
        text: {
          default: 'var(--text-default)',
          muted: 'var(--text-muted)',
          link: 'var(--text-link)',
          linkHover: 'var(--text-linkHover)',
          code: 'var(--text-code)',
          primary: 'var(--text-primary)',
          primaryHover: 'var(--text-primaryHover)',
          accent: 'var(--text-accent)',
          accentHover: 'var(--text-accentHover)',
          danger: 'var(--text-danger)',
          dangerHover: 'var(--text-dangerHover)',
          warning: 'var(--text-warning)',
          warningHover: 'var(--text-warningHover)',
          success: 'var(--text-success)',
          successHover: 'var(--text-successHover)',
        },
        background: {
          surfaceRaised: 'var(--background-surfaceRaised)',
          surfaceOverlay: 'var(--background-surfaceOverlay)',
          surface: 'var(--background-surface)',
          canvas: 'var(--background-canvas)',
          danger: 'var(--background-danger)',
          dangerHover: 'var(--background-dangerHover)',
          warning: 'var(--background-warning)',
          warningHover: 'var(--background-warningHover)',
          success: 'var(--background-success)',
          successHover: 'var(--background-successHover)',
          backdrop: 'var(--background-backdrop)',
          primary: 'var(--background-primary)',
          primaryHover: 'var(--background-primaryHover)',
        },
        border: {
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
          subtle: 'var(--border-subtle)',
          warning: 'var(--border-warning)',
          warningHover: 'var(--border-warningHover)',
          success: 'var(--border-success)',
          successHover: 'var(--border-successHover)',
          danger: 'var(--border-danger)',
          dangerHover: 'var(--border-dangerHover)',
          primary: 'var(--border-primary)',
          primaryHover: 'var(--border-primaryHover)',
          accent: 'var(--border-accent)',
          accentHover: 'var(--border-accentHover)',
        },
      },
    },
  },
  darkMode: ['class', '.dark', '.azion.azion-dark'],
};

export default preset;
