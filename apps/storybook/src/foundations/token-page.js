import { PageContainer, PageHeader, PageSection } from './components/layout/index.js'
import TokenPanel from './components/TokenPanel.vue'
import { primitiveFamilies } from './data/primitives.js'
import { responsiveFamilies } from './data/responsive.js'

const families = { ...primitiveFamilies, ...responsiveFamilies }

export function tokenPage({ title, lede, families: ids }) {
  const sections = ids.map((id) => families[id])
  return () => ({
    components: { PageContainer, PageHeader, PageSection, TokenPanel },
    setup: () => ({ title, lede, sections }),
    template: /* html */ `
      <PageContainer>
        <PageHeader :title="title" :description="lede" />
        <TokenPanel v-if="sections.length === 1" :family="sections[0]" />
        <template v-else>
          <PageSection
            v-for="family in sections"
            :key="family.title"
            :title="family.title"
            :description="family.description"
          >
            <TokenPanel :family="family" />
          </PageSection>
        </template>
      </PageContainer>
    `
  })
}
