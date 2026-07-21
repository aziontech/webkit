import { PageContainer, PageHeader } from '../../foundations/components/layout/index.js'
import TypographyPreview from '../../foundations/components/TypographyPreview.vue'

export default {
  title: 'Foundations/Typography',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The typography foundations catalog: every semantic text class (`.text-*`) generated from `@aziontech/theme/texts`. Each row renders a sample in its own class and exposes the class name — click a row to copy it.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

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
    `
  }),
  parameters: {
    visual: { modes: ['dark-desktop', 'light-desktop'] },
    docs: {
      description: {
        story:
          'Full type catalog: one surface row per semantic text style, followed by an inline text-link shown inside body copy. Click any row to copy its `.text-*` class name.'
      }
    }
  }
}
