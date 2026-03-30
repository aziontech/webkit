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
    template: /* html */ `
      <div style="font-family: Sora, sans-serif; max-width: 900px; padding: 40px 0;">

        <!-- Header -->
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Foundations</p>
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Typography</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion typography system uses <strong style="color: var(--text-default)">Sora</strong> as the primary typeface.
          Semantic text classes provide consistent sizing, line heights, and letter spacing across all components.
        </p>

        <!-- Type scale summary -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Type Scale</h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 48px;">
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Headings</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">5 styles</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              2XL → SM<br>Page and section titles
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Body</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">5 styles</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              LG → XSS<br>Paragraphs and content
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Overline</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">3 styles</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              MD → XS<br>Labels and categories
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Special</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">1 style</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Big Number<br>Statistics and hero numbers
            </p>
          </div>
        </div>

        <!-- Font family -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Font Family</h2>
        <div style="display: flex; gap: 20px; margin-bottom: 48px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; padding: 24px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 8px;">Primary</p>
            <p style="font-family: Sora, sans-serif; font-size: 28px; font-weight: 600; color: var(--text-default); margin: 0 0 4px;">
              Sora
            </p>
            <p class="text-body-xs text-muted" style="margin: 0;">
              All UI text, headings, and body copy
            </p>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 24px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 8px;">Monospace</p>
            <p style="font-family: 'Roboto Mono', monospace; font-size: 28px; font-weight: 600; color: var(--text-default); margin: 0 0 4px;">
              Roboto Mono
            </p>
            <p class="text-body-xs text-muted" style="margin: 0;">
              Code, tokens, and technical values
            </p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Typography system overview: type scale, font families, and usage rules.' },
    },
  },
};

// ─── Type Scale ───────────────────────────────────────────────────────────────

export const TypeScale = {
  name: 'Type Scale',
  render: () => ({
    components: { TypographyPreview },
    setup() {
      return { typographyGroups };
    },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Typography</p>
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
      description: { story: 'Complete type scale with all semantic text classes and their responsive values.' },
    },
  },
};
