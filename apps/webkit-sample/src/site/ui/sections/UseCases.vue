<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Overline from '@aziontech/webkit/overline'
  import SectionModule from '@aziontech/webkit/section-module'
  import Topic from '@aziontech/webkit/topic'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'UseCases' })

  interface Props {
    /** Overline of the title cell. */
    eyebrow?: string
    /** Headline of the title cell. */
    title: string
    /** One line under the headline, leading into the use cases. */
    description?: string
    /** Link pinned to the foot of the title cell. */
    action?: SiteAction | null
    /** Four use cases, two to a row beside the title cell. */
    items: SiteTopic[]
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    description: '',
    action: null
  })
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
          kind="canvas"
          class="lg:row-span-2"
        >
          <div class="flex h-full flex-col items-start gap-(--spacing-md)">
            <Overline
              v-if="eyebrow"
              prefix="//"
              show-cursor
            >
              {{ eyebrow }}
            </Overline>
            <h2 class="m-0 text-balance text-heading-lg text-(--text-default)">{{ title }}</h2>
            <p
              v-if="description"
              class="m-0 mb-(--spacing-xl) text-body-md text-(--text-muted)"
            >
              {{ description }}
            </p>
            <SectionAction
              v-if="action"
              :action="action"
              class="mt-auto"
            />
          </div>
        </CardGridCell>
        <CardGridCell
          v-for="item in items"
          :key="item.title"
          kind="canvas"
        >
          <Topic
            :heading-level="3"
            :icon="item.icon ?? ''"
            :title="item.title"
            :description="item.description"
          />
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
