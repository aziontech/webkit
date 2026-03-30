import IconGrid from '../../foundations/components/IconGrid.vue';
import icons from '@aziontech/icons/catalog';

import {
  PageContainer,
  PageHeader,
  SectionHeader,
  CodeBlock,
} from '../../foundations/components/layout/index.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Icons',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: [
          'Icon library documentation — Azion custom icons and PrimeIcons.',
          'Icons are distributed via `@aziontech/icons` package.',
        ].join(' '),
      },
    },
  },
  argTypes: {
    initialSize: {
      control: { type: 'range', min: 12, max: 64, step: 4 },
      defaultValue: 24,
    },
  },
};

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview = {
  name: 'Overview',
  render: (args) => ({
    components: {
      PageContainer,
      PageHeader,
      SectionHeader,
      CodeBlock,
      IconGrid,
    },
    setup() {
      return { icons, args };
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Icons">
          The Azion icon system combines <strong class="text-default">custom product icons</strong>
          with the <strong class="text-default">PrimeIcons</strong> library for general-purpose UI icons.
        </PageHeader>

        <!-- Import -->
        <SectionHeader title="Import" />
        <CodeBlock label="JavaScript" class="mb-12">
          import '@aziontech/icons';
        </CodeBlock>

        <!-- Usage -->
        <SectionHeader title="Usage" />
        <CodeBlock label="HTML" class="mb-6">
          &lt;i class="ai ai-azion"&gt;&lt;/i&gt;
          &lt;i class="ai ai-edge-functions text-default text-2xl"&gt;&lt;/i&gt;
          &lt;i class="pi pi-check"&gt;&lt;/i&gt;
          &lt;i class="pi pi-times text-default text-2xl"&gt;&lt;/i&gt;
        </CodeBlock>
        <p class="text-body-sm text-muted m-0 max-w-[620px] leading-relaxed mb-12">
          Icons are a font, which means they inherit text properties.
        </p>

        <!-- Icon Gallery -->
        <SectionHeader
          title="Icon Gallery"
          :description="\`Browse all \${icons.length} icons. Use the search to filter by name, and the slider to adjust preview size.\`"
          size="lg"
        />
        
        <IconGrid :icons="icons" :initial-size="args.initialSize" />
      </PageContainer>
    `,
  }),
  args: {
    initialSize: 24,
  },
  parameters: {
    docs: {
      description: { story: 'Icon system overview: import, usage examples, and complete icon gallery.' },
    },
  },
};
