import TypographyPreview from '../../foundations/components/TypographyPreview.vue';
import { typographyTokens, typographyGroups } from '../../foundations/data/typography.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Typography',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: [
          'Typography system documentation — semantic text styles for Azion Design System.',
          'All typography classes are defined in `@aziontech/theme/tailwind/semantic-texts-plugin.js`.',
        ].join(' '),
      },
    },
  },
};

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview = {
  name: 'Overview',
  render: () => ({
    components: { TypographyPreview },
    setup() {
      return { typographyGroups };
    },
    template: /* html */ `
      <div style="font-family: Sora, sans-serif; max-width: 1000px; padding: 40px;">

        <!-- Header -->
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Typography</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion typography system uses <strong style="color: var(--text-default)">Sora</strong> as the primary typeface.
          Semantic text classes provide consistent sizing, line heights, and letter spacing across all components.
        </p>

        <!-- Font family -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Font Family</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px;">
          <div style="padding: 24px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 8px;">Primary</p>
            <p style="font-family: Sora, sans-serif; font-size: 28px; font-weight: 600; color: var(--text-default); margin: 0 0 4px;">
              Sora
            </p>
            <p class="text-body-xs text-muted" style="margin: 0;">
              All UI text, headings, and body copy.
            </p>
          </div>
          <div style="padding: 24px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 8px;">Display Mono</p>
            <p style="font-family: 'Proto Mono', monospace; font-size: 28px; font-weight: 600; color: var(--text-default); margin: 0 0 4px;">
              Proto Mono
            </p>
            <p class="text-body-xs text-muted" style="margin: 0;">
              Overlines, actions, and special cases.
            </p>
          </div>
          <div style="padding: 24px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 8px;">Monospace</p>
            <p style="font-family: 'Roboto Mono', monospace; font-size: 28px; font-weight: 600; color: var(--text-default); margin: 0 0 4px;">
              Roboto Mono
            </p>
            <p class="text-body-xs text-muted" style="margin: 0;">
              Code, tokens, and technical values.
            </p>
          </div>
        </div>

        <!-- Type Scale -->
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Type Scale</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 36px; line-height: 1.7;">
          Complete type scale with responsive values. Each class adapts font size across desktop, tablet, and mobile breakpoints.
        </p>

        <div v-for="group in typographyGroups" :key="group.category" style="margin-bottom: 40px;">
          <h3 class="text-heading-sm text-default" style="margin: 0 0 4px;">{{ group.label }}</h3>
          <p class="text-body-xs text-muted" style="margin: 0 0 16px;">{{ group.description }}</p>
          
          <div style="border: 1px solid var(--border-default); border-radius: 8px; padding: 0 20px;">
            <TypographyPreview
              v-for="token in group.tokens"
              :key="token.name"
              :token="token"
            />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Typography system overview: font families and complete type scale.' },
    },
  },
};
