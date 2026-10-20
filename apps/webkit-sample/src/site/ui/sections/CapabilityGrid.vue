<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import Topic from '@aziontech/webkit/topic'

  import type { SiteTopic } from './types'

  defineOptions({ name: 'CapabilityGrid' })

  interface Props {
    /** Three or six capabilities, three to a row. */
    items: SiteTopic[]
  }

  defineProps<Props>()
</script>

<template>
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
            :icon="item.icon ?? ''"
            :title="item.title"
            :description="item.description"
          />
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
