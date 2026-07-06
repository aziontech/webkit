import SemanticSwatchGroup from '../../foundations/components/SemanticSwatchGroup.vue'
import { PageContainer, PageHeader } from '../../foundations/components/layout/index.js'
import { themeColorGroups } from '../../foundations/data/theme.js'

export default {
  title: 'Foundations/Theme',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Semantic theme colors — every mode-aware color token that ships in `@aziontech/theme/globals.css`, generated straight from the token source so the catalog can never drift. Each swatch renders the live token, so toggle the theme in the toolbar to see light and dark. Click a row to copy its CSS variable.'
      }
    }
  }
}

export const Overview = {
  name: 'Overview',
  render: () => ({
    components: { PageContainer, PageHeader, SemanticSwatchGroup },
    setup() {
      return { themeColorGroups }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Theme">
          Semantic color tokens layered on top of the primitive palette. Consume these
          <code class="font-code text-code">var(--*)</code> tokens — or the matching Tailwind
          <code class="font-code text-code">bg-*</code> / <code class="font-code text-code">text-*</code> /
          <code class="font-code text-code">border-*</code> utilities — never a raw hex, so a single theme
          drives both light and dark — toggle the theme in the toolbar to preview each token.
          Click any row to copy its CSS variable.
        </PageHeader>

        <SemanticSwatchGroup
          v-for="group in themeColorGroups"
          :key="group.id"
          :title="group.title"
          :description="group.description"
          :items="group.items"
        />
      </PageContainer>
    `
  })
}
