<script setup lang="ts">
  import type { BigNumberItem } from '@aziontech/webkit/big-numbers'
  import SectionContainer from '@aziontech/webkit/section-container'

  import CapabilityGrid from './CapabilityGrid.vue'
  import type { HeroesTitleLength } from './Heroes.vue'
  import Heroes from './Heroes.vue'
  import StatsBand from './StatsBand.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'HeroWithOpening' })

  interface Props {
    /** Overline above the headline. */
    eyebrow?: string
    /** Length of the headline; long widens its column so it breaks into two lines instead of three. */
    titleLength?: HeroesTitleLength
    /** Opening phrase of the headline, in the brand accent. */
    highlight?: string
    /** The page's h1. */
    title: string
    /** Length of the headline; short keeps it in the narrow column. */
    titleLength?: HeroesTitleLength
    /** Supporting sentence under the headline. */
    description?: string
    /** Actions under the copy. */
    actions?: SiteAction[]
    /** The sales arguments, three or six, three to a row. */
    items?: SiteTopic[]
    /** KPI figures set under the band in place of the sales arguments. */
    figures?: BigNumberItem[]
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    titleLength: 'long',
    highlight: '',
    titleLength: 'long',
    description: '',
    actions: () => [],
    items: () => [],
    figures: () => []
  })
</script>

<template>
  <Heroes
    kind="title-band"
    :title-length="titleLength"
    :eyebrow="eyebrow"
    :highlight="highlight"
    :title="title"
    :description="description"
    :actions="actions"
  />
  <SectionContainer max-width="site">
    <StatsBand
      v-if="figures.length"
      :items="figures"
    />
    <CapabilityGrid
      v-else
      :items="items"
    />
  </SectionContainer>
</template>
