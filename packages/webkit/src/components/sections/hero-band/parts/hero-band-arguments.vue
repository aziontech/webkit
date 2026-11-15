<script setup lang="ts">
  import FrameBox from '../../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionContainer from '../../../marketing/section-container/section-container.vue'
  import SectionGap from '../../../marketing/section-gap/section-gap.vue'
  import SectionModule from '../../../marketing/section-module/section-module.vue'
  import Topic from '../../../marketing/topic/topic.vue'
  import type { HeroBandItem } from '../hero-band.vue'

  defineOptions({ name: 'HeroBandArguments' })

  defineProps<{
    items: HeroBandItem[]
  }>()
</script>

<template>
  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="item in items"
            :key="item.title"
            kind="canvas"
          >
            <Topic
              :heading-level="2"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />
  </SectionContainer>
</template>
