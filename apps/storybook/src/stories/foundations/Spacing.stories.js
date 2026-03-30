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
    components: { SpacingPreview },
    setup() {
      return { spacingGroups };
    },
    template: /* html */ `
      <div style="font-family: Sora, sans-serif; max-width: 1000px; padding: 40px;">

        <!-- Header -->
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Spacing</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion spacing system provides <strong style="color: var(--text-default)">semantic spacing classes</strong>
          for consistent layout and density. Classes adapt automatically across desktop, tablet, and mobile breakpoints.
        </p>

        <!-- Density scale -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Density Scale</h2>
        <div style="display: flex; gap: 16px; margin-bottom: 48px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 140px; padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">Comfortable</p>
            <p class="text-body-sm text-default" style="margin: 0 0 4px; font-weight: 600;">Spacious</p>
            <p class="text-body-xs text-muted" style="margin: 0;">96px / 64px / 32px</p>
          </div>
          <div style="flex: 1; min-width: 140px; padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 6px;">Base</p>
            <p class="text-body-sm text-default" style="margin: 0 0 4px; font-weight: 600;">Default</p>
            <p class="text-body-xs text-muted" style="margin: 0;">48px / 32px / 24px</p>
          </div>
          <div style="flex: 1; min-width: 140px; padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--background-surface);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">Compact</p>
            <p class="text-body-sm text-default" style="margin: 0 0 4px; font-weight: 600;">Dense</p>
            <p class="text-body-xs text-muted" style="margin: 0;">24px / 20px / 16px</p>
          </div>
        </div>

        <!-- Semantic Spacing Classes -->
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
      description: { story: 'Spacing system overview: density scale and complete semantic spacing classes.' },
    },
  },
};
