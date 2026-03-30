import SpacingPreview from '../../foundations/components/SpacingPreview.vue';
import { spacingGroups } from '../../foundations/data/spacing.js';

import {
  PageContainer,
  PageHeader,
  SectionHeader,
  Card,
} from '../../foundations/components/layout/index.js';

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
    components: {
      PageContainer,
      PageHeader,
      SectionHeader,
      Card,
      SpacingPreview,
    },
    setup() {
      return { spacingGroups };
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Spacing">
          The Azion spacing system provides <strong class="text-default">semantic spacing classes</strong>
          for consistent layout and density. Classes adapt automatically across desktop, tablet, and mobile breakpoints.
        </PageHeader>

        <!-- Density scale -->
        <SectionHeader title="Density Scale" />
        <div class="flex gap-4 mb-12 flex-wrap">
          <Card class="flex-1 min-w-[140px]">
            <p class="text-overline-xs text-muted m-0 mb-1">Comfortable</p>
            <p class="text-body-sm text-default m-0 mb-1 font-semibold">Spacious</p>
            <p class="text-body-xs text-muted m-0">96px / 64px / 32px</p>
          </Card>
          <Card class="flex-1 min-w-[140px]">
            <p class="text-overline-xs text-muted m-0 mb-1.5">Base</p>
            <p class="text-body-sm text-default m-0 mb-1 font-semibold">Default</p>
            <p class="text-body-xs text-muted m-0">48px / 32px / 24px</p>
          </Card>
          <Card class="flex-1 min-w-[140px]">
            <p class="text-overline-xs text-muted m-0 mb-1">Compact</p>
            <p class="text-body-sm text-default m-0 mb-1 font-semibold">Dense</p>
            <p class="text-body-xs text-muted m-0">24px / 20px / 16px</p>
          </Card>
        </div>

        <!-- Semantic Spacing Classes -->
        <SectionHeader
          title="Semantic Spacing Classes"
          description="Complete spacing scale with responsive values. Each class adapts across desktop, tablet, and mobile breakpoints."
          size="lg"
        />

        <div
          v-for="group in spacingGroups"
          :key="group.category"
          class="mb-10"
        >
          <h3 class="text-heading-sm text-default m-0 mb-1">{{ group.label }}</h3>
          <p class="text-body-xs text-muted m-0 mb-4">{{ group.description }}</p>
          
          <div class="border border-default rounded-lg px-5">
            <SpacingPreview
              v-for="token in group.tokens"
              :key="token.name"
              :token="token"
            />
          </div>
        </div>
      </PageContainer>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Spacing system overview: density scale and complete semantic spacing classes.' },
    },
  },
};
