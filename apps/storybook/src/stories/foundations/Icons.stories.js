import icons from '@aziontech/icons/catalog'
import colorIcons from '@aziontech/icons/color-catalog'
import CodeBlock from '@aziontech/webkit/code-block'

import IconGrid from '../../foundations/components/IconGrid.vue'
import {
  PageContainer,
  PageHeader,
  PageSection
} from '../../foundations/components/layout/index.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Assets/Icons',
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
      PageSection,
      CodeBlock,
      IconGrid
    },
    setup() {
      const importTabs = [
        {
          label: 'JavaScript',
          value: 'js',
          language: 'javascript',
          code: "import '@aziontech/icons';"
        }
      ]
      const usageTabs = [
        {
          label: 'HTML',
          value: 'html',
          language: 'html',
          fileName: 'index.html',
          code: [
            '<i class="ai ai-azion"></i>',
            '<i class="ai ai-edge-functions text-default text-2xl"></i>',
            '<i class="pi pi-check"></i>',
            '<i class="pi pi-times text-default text-2xl"></i>'
          ].join('\n')
        }
      ]
      return { icons, colorIcons, args, importTabs, usageTabs }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Icons">
          The Azion icon system combines <strong class="text-default">custom product icons</strong>
          with the <strong class="text-default">PrimeIcons</strong> library for general-purpose UI icons.
        </PageHeader>

        <PageSection title="Import">
          <CodeBlock :tabs="importTabs" :border="true" :show-line-numbers="false" class="h-fit" />
        </PageSection>

        <PageSection title="Usage">
          <template #description>
            Icons are a font, so they inherit text properties.
            <strong class="text-(--text-default)">Colored</strong> brand icons (the <code>-cor</code> set)
            are multicolor logos that can't live in the font — they ship as inline SVG via
            <code>@aziontech/icons/color-catalog</code> and keep their own palette.
          </template>
          <CodeBlock :tabs="usageTabs" :border="true" :show-line-numbers="false" class="h-fit" />
        </PageSection>

        <PageSection
          title="Icon Gallery"
          :description="\`Browse all \${icons.length + colorIcons.length} icons. Use the search to filter by name, and the slider to adjust preview size.\`"
        >
          <IconGrid :icons="icons" :color-icons="colorIcons" :initial-size="args.initialSize" />
        </PageSection>
      </PageContainer>
    `
  }),
  args: {
    initialSize: 24
  },
  parameters: {
    visual: { modes: ['dark-desktop', 'light-desktop'] },
    docs: {
      description: {
        story: 'Icon system overview: import, usage examples, and complete icon gallery.'
      }
    }
  }
}
