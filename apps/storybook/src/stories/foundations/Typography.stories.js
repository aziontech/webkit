import TypographyPreview from '../../foundations/components/TypographyPreview.vue';

import { PageContainer, PageHeader } from '../../foundations/components/layout/index.js';

export default {
  title: 'Foundations/Typography',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: [
          'Typography system — semantic text classes from `@aziontech/theme`',
          '(`packages/theme/src/tokens/semantic/texts.data.js`).',
        ].join(' '),
      },
    },
  },
};

export const Overview = {
  name: 'Overview',
  render: () => ({
    components: { PageContainer, PageHeader, TypographyPreview },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Typography">
          Semantic text styles generated from <code class="font-code text-code">texts.data.js</code>.
          Each row applies the matching <code class="font-code text-code">.text-*</code> class.
        </PageHeader>
        <TypographyPreview />
      </PageContainer>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Full type catalog: one surface row per style, plus inline text-link inside body copy.',
      },
    },
  },
};
