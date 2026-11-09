<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'CapabilityGrid' })

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** Section headline over the grid; omit for a bare grid. */
    title?: string
    /** One or two sentences under the title. */
    description?: string
    /** Three or six capabilities, three to a row. */
    items: SiteTopic[]
    /** Buttons under the section title. */
    actions?: SiteAction[]
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    actions: () => []
  })
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template
      v-if="title"
      #header
    >
      <SectionTitle
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      >
        <template
          v-if="actions.length"
          #actions
        >
          <SectionAction
            v-for="action in actions"
            :key="action.label"
            :action="action"
          />
        </template>
      </SectionTitle>
    </template>

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
            :heading-level="title ? 3 : 2"
            :icon="item.icon ?? ''"
            :title="item.title"
            :description="item.description"
          />
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
