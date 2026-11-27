<script setup lang="ts">
  import CardGrid from '../../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import Container from '../../../layout/container/container.vue'
  import Module from '../../../layout/module/module.vue'
  import RegistrationFrame from '../../../layout/registration-frame/registration-frame.vue'
  import Spacer from '../../../layout/spacer/spacer.vue'
  import FeatureItem from '../../../marketing/feature-item/feature-item.vue'
  import type { HeroSectionItem } from '../hero-section.vue'

  defineOptions({ name: 'HeroSectionArguments' })

  defineProps<{
    items: HeroSectionItem[]
  }>()
</script>

<template>
  <Container max-width="site">
    <Module
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          variant="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="item in items"
            :key="item.title"
            variant="canvas"
          >
            <FeatureItem
              :heading-level="2"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </CardGridCell>
        </CardGrid>
      </RegistrationFrame>
    </Module>

    <Spacer hatch />
  </Container>
</template>
