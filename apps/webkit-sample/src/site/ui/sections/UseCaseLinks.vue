<script setup lang="ts">
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteTopic } from './types'

  defineOptions({ name: 'UseCaseLinks' })

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Headline over the grid, set at the start edge. */
    title: string
    /** Use cases, three to a row; a use case with an href makes its whole cell the link. */
    items: SiteTopic[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: ''
  })

  const { follow } = useSiteLink()
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="left"
        :title="title"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <CardGrid
        kind="divider"
        :columns="3"
      >
        <div
          v-for="item in items"
          :key="item.title"
          class="grid bg-(--bg-canvas) p-(--spacing-xl)"
        >
          <Topic
            :icon="item.icon ?? ''"
            :title="item.title"
            :description="item.description"
            :href="item.href ?? ''"
            :heading-level="3"
            @click="follow($event, item.href ?? '')"
          />
        </div>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
