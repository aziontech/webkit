/**
 * Tailwind preset for Azion tokens.
 */

export const preset = {
  theme: {
    extend: {
      colors: {
        text: {
          default: 'var(--text-textDefault)',
          muted: 'var(--text-textMuted)',
          link: 'var(--text-textLink)',
          linkHover: 'var(--text-textLinkHover)',
          code: 'var(--text-textCode)',
          primary: 'var(--text-textPrimary)',
          primaryHover: 'var(--text-textPrimaryHover)',
          accent: 'var(--text-textAccent)',
          accentHover: 'var(--text-textAccentHover)',
          danger: 'var(--text-textDanger)',
          dangerHover: 'var(--text-textDangerHover)',
          warning: 'var(--text-textWarning)',
          warningHover: 'var(--text-textWarningHover)',
          success: 'var(--text-textSuccess)',
          successHover: 'var(--text-textSuccessHover)',
        },
        background: {
          surfaceRaised: 'var(--background-bgSurfaceRaised)',
          surfaceOverlay: 'var(--background-bgSurfaceOverlay)',
          surface: 'var(--background-bgSurface)',
          canvas: 'var(--background-bgCanvas)',
          danger: 'var(--background-bgDanger)',
          dangerHover: 'var(--background-bgDangerHover)',
          warning: 'var(--background-bgWarning)',
          warningHover: 'var(--background-bgWarningHover)',
          success: 'var(--background-bgSuccess)',
          successHover: 'var(--background-bgSuccessHover)',
          backdrop: 'var(--background-bgBackdrop)',
          primary: 'var(--background-bgPrimary)',
          primaryHover: 'var(--background-bgPrimaryHover)',
        },
        border: {
          default: 'var(--border-borderDefault)',
          strong: 'var(--border-borderStrong)',
          subtle: 'var(--border-borderSubtle)',
          warning: 'var(--border-borderWarning)',
          warningHover: 'var(--border-borderWarningHover)',
          success: 'var(--border-borderSuccess)',
          successHover: 'var(--border-borderSuccessHover)',
          danger: 'var(--border-borderDanger)',
          dangerHover: 'var(--border-borderDangerHover)',
          primary: 'var(--border-borderPrimary)',
          primaryHover: 'var(--border-borderPrimaryHover)',
          accent: 'var(--border-borderAccent)',
          accentHover: 'var(--border-borderAccentHover)',
        },
      },
    },
  },
  darkMode: ['class', '.dark', '.azion.azion-dark'],
};

export default preset;
