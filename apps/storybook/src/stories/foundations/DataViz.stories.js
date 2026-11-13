import ChartSeriesPreview from '../../foundations/components/ChartSeriesPreview.vue'
import { PageContainer, PageHeader } from '../../foundations/components/layout/index.js'
import SemanticSwatchGroup from '../../foundations/components/SemanticSwatchGroup.vue'
import { chartColorGroup } from '../../foundations/data/theme.js'

export default {
  title: 'Foundations/Design Tokens/Semantic/Data Viz',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The --chart-* role: six categorical series in a fixed order plus Other, the chart chrome, the inverse tooltip, a sequential ramp, a diverging pair and status aliases. Validated for color-vision separation and 3:1 contrast on the chart surfaces in both themes.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Overview = {
  name: 'Overview',
  render: () => ({
    components: { PageContainer, PageHeader, ChartSeriesPreview, SemanticSwatchGroup },
    setup() {
      return { chartColorGroup }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Data Viz">
          Charts take every color from the <code class="font-code text-code">--chart-*</code> role. Series are
          assigned in declaration order and never cycled; a seventh folds into Other. The order is the same in
          both themes, so a series keeps its hue when the theme changes. Feedback colors stay status only: a
          series uses <code class="font-code text-code">--chart-status-*</code> only when its color means a state.
        </PageHeader>

        <ChartSeriesPreview />

        <SemanticSwatchGroup
          :title="chartColorGroup.title"
          :description="chartColorGroup.description"
          :items="chartColorGroup.items"
        />
      </PageContainer>
    `
  })
}
