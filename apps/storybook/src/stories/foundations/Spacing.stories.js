import SpacingPreview from '../../foundations/components/SpacingPreview.vue';
import { spacingTokens, spacingGroups } from '../../foundations/data/spacing.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Spacing',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: [
          'Spacing system documentation — semantic spacing classes for Azion Design System.',
          'All spacing classes are defined in `@aziontech/theme/tailwind/semantic-spacing-plugin.js`.',
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
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Spacing</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion spacing system provides <strong style="color: var(--text-default)">semantic spacing classes</strong>
          for consistent layout and density. Classes adapt automatically across desktop, tablet, and mobile breakpoints.
        </p>

        <!-- Scale summary -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Semantic Spacing</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 48px;">
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Container</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">3 classes</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Page-level constraints and container padding.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              max-container-width · px-container
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Padding</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">3 classes</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Internal element padding with density variants.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              p-elements-base · p-elements-compact
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Gap</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">4 classes</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Flex/grid gap between child elements.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              gap-elements-base · gap-sections
            </p>
          </div>
        </div>

        <!-- Density scale -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Density Scale</h2>
        <div style="display: flex; gap: 16px; margin-bottom: 48px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 140px; padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">Comfortable</p>
            <p class="text-body-sm text-default" style="margin: 0 0 4px; font-weight: 600;">Spacious</p>
            <p class="text-body-xs text-muted" style="margin: 0;">96px / 64px / 32px</p>
          </div>
          <div style="flex: 1; min-width: 140px; padding: 16px; border: 1px solid var(--border-primary); border-radius: 8px; background: rgba(254,96,31,0.04);">
            <p class="text-overline-xs text-primary" style="margin: 0 0 4px;">Base</p>
            <p class="text-body-sm text-default" style="margin: 0 0 4px; font-weight: 600;">Default</p>
            <p class="text-body-xs text-muted" style="margin: 0;">48px / 32px / 24px</p>
          </div>
          <div style="flex: 1; min-width: 140px; padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">Compact</p>
            <p class="text-body-sm text-default" style="margin: 0 0 4px; font-weight: 600;">Dense</p>
            <p class="text-body-xs text-muted" style="margin: 0;">24px / 20px / 16px</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Spacing system overview: semantic classes, density scale, and usage rules.' },
    },
  },
};

// ─── Semantic Spacing ─────────────────────────────────────────────────────────

export const SemanticSpacing = {
  name: 'Semantic Spacing',
  render: () => ({
    components: { SpacingPreview },
    setup() {
      return { spacingGroups };
    },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Spacing</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Semantic Spacing Classes</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 36px; line-height: 1.7;">
          Complete spacing scale with responsive values. Each class adapts across desktop, tablet, and mobile breakpoints.
        </p>

        <div v-for="group in spacingGroups" :key="group.category" style="margin-bottom: 40px;">
          <h3 class="text-heading-sm text-default" style="margin: 0 0 4px;">{{ group.label }}</h3>
          <p class="text-body-xs text-muted" style="margin: 0 0 16px;">{{ group.description }}</p>
          
          <div style="border: 1px solid var(--border-default); border-radius: 8px; padding: 0 20px;">
            <SpacingPreview
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
      description: { story: 'Complete spacing scale with all semantic classes and their responsive values.' },
    },
  },
};
