import icons from '@aziontech/icons/catalog'
import colorIcons from '@aziontech/icons/color-catalog'

import IconGrid from '../../foundations/components/IconGrid.vue'
import {
  CodeBlock,
  PageContainer,
  PageHeader,
  SectionHeader
} from '../../foundations/components/layout/index.js'

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
          'Icons are distributed via the `@aziontech/icons` package.'
        ].join(' ')
      },
      // Token/icon catalog page: a copy-paste SFC is not meaningful here, so the
      // "Show code" panel stays hidden (documented foundations-catalog exemption).
      canvas: { sourceState: 'none' }
    }
  },
  argTypes: {
    initialSize: {
      control: { type: 'range', min: 12, max: 64, step: 4 },
      defaultValue: 24
    }
  }
}

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview = {
  name: 'Overview',
  render: (args) => ({
    components: {
      PageContainer,
      PageHeader,
      SectionHeader,
      CodeBlock,
      IconGrid
    },
    setup() {
      const usageCode = [
        '<i class="ai ai-azion"></i>',
        '<i class="ai ai-edge-functions text-default text-2xl"></i>',
        '<i class="pi pi-check"></i>',
        '<i class="pi pi-times text-default text-2xl"></i>'
      ].join('\n')
      return { icons, colorIcons, args, usageCode }
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
        <CodeBlock label="HTML" :content="usageCode" class="mb-6" />
        <p class="text-body-sm text-muted m-0 max-w-[620px] leading-relaxed mb-12">
          Icons are a font, which means they inherit text properties.
          <strong class="text-default">Colored</strong> brand icons (the <code>-cor</code> set) are
          multicolor logos that can't live in the font — they ship as inline SVG via
          <code>@aziontech/icons/color-catalog</code> and keep their own palette.
        </p>

        <!-- Icon Gallery -->
        <SectionHeader
          title="Icon Gallery"
          :description="\`Browse all \${icons.length + colorIcons.length} icons. Use the search to filter by name, and the slider to adjust preview size.\`"
          size="lg"
        />

        <IconGrid :icons="icons" :color-icons="colorIcons" :initial-size="args.initialSize" />
      </PageContainer>
    `
  }),
  args: {
    initialSize: 24
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon system overview: import, usage examples, and complete icon gallery.'
      }
    }
  }
}
