import TypographyPreview from '../../foundations/components/TypographyPreview.vue';
import { typographyGroups } from '../../foundations/data/typography.js';

import {
  PageContainer,
  PageHeader,
  SectionHeader,
  Card,
} from '../../foundations/components/layout/index.js';

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
          'All typography classes are defined in `@aziontech/theme/tailwind/semantic-texts-plugin`.',
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
      TypographyPreview,
    },
    setup() {
      return { typographyGroups };
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Typography">
          The Azion typography system uses <strong class="text-default">Sora</strong> as the primary typeface.
          Semantic text classes provide consistent sizing, line heights, and letter spacing across all components.
        </PageHeader>

        <!-- Font family -->
        <SectionHeader title="Font Family" />
        <div class="grid grid-cols-3 gap-5 mb-12">
          <Card class="p-6">
            <p class="text-overline-xs text-muted m-0 mb-2">Primary</p>
            <p class="text-[28px] font-semibold text-default m-0 mb-1 font-sans">Sora</p>
            <p class="text-body-xs text-muted m-0">All UI text, headings, and body copy.</p>
          </Card>
          <Card class="p-6">
            <p class="text-overline-xs text-muted m-0 mb-2">Display Mono</p>
            <p class="text-[28px] font-semibold text-default m-0 mb-1 font-proto">Proto Mono</p>
            <p class="text-body-xs text-muted m-0">Overlines, actions, and special cases.</p>
          </Card>
          <Card class="p-6">
            <p class="text-overline-xs text-muted m-0 mb-2">Monospace</p>
            <p class="text-[28px] font-semibold text-default m-0 mb-1 font-code">Roboto Mono</p>
            <p class="text-body-xs text-muted m-0">Code, tokens, and technical values.</p>
          </Card>
        </div>

        <!-- Type Scale -->
        <SectionHeader
          title="Type Scale"
          description="Complete type scale with responsive values. Each class adapts font size across desktop, tablet, and mobile breakpoints."
          size="lg"
        />

        <div
          v-for="group in typographyGroups"
          :key="group.category"
          class="mb-10"
        >
          <h3 class="text-heading-sm text-default m-0 mb-1">{{ group.label }}</h3>
          <p class="text-body-xs text-muted m-0 mb-4">{{ group.description }}</p>

          <div class="border border-default rounded-lg px-5">
            <TypographyPreview
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
      description: { story: 'Typography system overview: font families and complete type scale.' },
    },
  },
};
