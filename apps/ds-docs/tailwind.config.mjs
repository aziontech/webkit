/** @type {import('tailwindcss').Config} */
import { tokenUtilities } from '@aziontech/theme/tokens/build/tailwind-plugin';
import { primitives, surfacePrimitives, brandPrimitives } from '@aziontech/theme/tokens';

export default {
  darkMode: ['class', '.dark', '.azion.azion-dark'],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './content/**/*.md',
    // Webkit components (playground preview): so Tailwind generates utilities they use (e.g. text-[0.625rem])
    '../../packages/webkit/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primitives from @aziontech/theme (neutral, gray, orange, violet, etc.)
        ...primitives,
        // Surface scale from theme (surface-0, surface-50, … surface-950)
        surface: {
          ...surfacePrimitives.surface,
          DEFAULT: surfacePrimitives.surface[0],
          muted: surfacePrimitives.surface[50],
          subtle: surfacePrimitives.surface[100],
        },
        // Primary brand (orange) from theme — use for accents; docs body/links keep neutral below
        primaryBrand: brandPrimitives.primary,
        accent: brandPrimitives.accent,
        // Primary (neutral scale) for documentation typography and links
        primary: {
          50: primitives.neutral[50],
          100: primitives.neutral[100],
          200: primitives.neutral[200],
          300: primitives.neutral[300],
          400: primitives.neutral[400],
          500: primitives.neutral[500],
          600: primitives.neutral[600],
          700: primitives.neutral[700],
          800: primitives.neutral[800],
          900: primitives.neutral[900],
          950: primitives.neutral[950],
        },
        // Neutral colors for documentation (alias; primitives.neutral also available)
        // Status colors for component status badges
        status: {
          stable: '#10b981',
          beta: '#3b82f6',
          deprecated: '#f59e0b',
          planned: '#6b7280',
          experimental: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['Proto Mono', 'monospace'],
        code: ['Roboto Mono', 'monospace'],
      },
      typography: (theme) => {
        const base = theme('fontSize.base'); // [size, { lineHeight }] or string
        const baseSize = Array.isArray(base) ? base[0] : base;
        const baseLineHeight = Array.isArray(base) && base[1]?.lineHeight ? base[1].lineHeight : '1.5rem';
        return {
          DEFAULT: {
            css: {
              maxWidth: 'none',
              color: theme('colors.text.primary'),
              a: {
                color: theme('colors.primary.600'),
                '&:hover': {
                  color: theme('colors.primary.700'),
                },
              },
              'code::before': {
                content: '""',
              },
              'code::after': {
                content: '""',
              },
              code: {
                color: theme('colors.primary.600'),
                backgroundColor: theme('colors.surface.subtle'),
                padding: '0.125rem 0.25rem',
                borderRadius: '0.25rem',
                fontWeight: '400',
              },
              pre: {
                backgroundColor: '#1f2937',
              },
              'pre code': {
                backgroundColor: 'transparent',
                padding: '0',
              },
              /* Headings: h1 uses 4xl, h2–h6 use base so we don't need prose overrides in global.css */
              h1: {
                fontSize: theme('fontSize.4xl')[0],
                lineHeight: theme('fontSize.4xl')[1]?.lineHeight ?? '2.5rem',
                fontWeight: '500',
                letterSpacing: '-0.025em',
                marginBottom: '1rem',
              },
              h2: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
                fontWeight: '500',
                letterSpacing: '-0.025em',
                marginTop: '2.5rem',
                marginBottom: '1rem',
              },
              h3: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
                fontWeight: '500',
                marginTop: '2rem',
                marginBottom: '0.75rem',
              },
              h4: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
                fontWeight: '500',
              },
              h5: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
                fontWeight: '500',
              },
              h6: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
                fontWeight: '500',
              },
              th: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
              },
              td: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
              },
              strong: {
                fontSize: baseSize,
                lineHeight: baseLineHeight,
                fontWeight: '600',
              },
              p: {
                marginBottom: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.625',
              },
              'ul, ol': {
                marginBottom: '1rem',
                paddingLeft: '1.5rem',
                fontSize: '0.875rem',
              },
              li: {
                marginBottom: '0.5rem',
              },
            },
          },
        };
      },
      // Documentation-specific spacing
      spacing: {
        'docs-sidebar': '280px',
        'docs-header': '64px',
      },
      // Max widths for content
      maxWidth: {
        'docs-content': '800px',
      },
    },
  },
  plugins: [
    // Force light token utilities inside playground preview when site is dark (see PlaygroundPreview wrapper)
    tokenUtilities({
      extraLightSelectors: ['.playground-preview-light'],
    }),
    require('@tailwindcss/typography'),
  ],
};
