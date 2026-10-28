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

  /** How many capabilities a row holds at the large breakpoint. */
  export type CapabilityGridColumns = 3 | 4

  export interface CapabilityGridItem extends SiteTopic {
    /** Bullet points under the description. */
    points?: string[]
  }

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** Section headline over the grid; omit for a bare grid. */
    title?: string
    /** One or two sentences under the title. */
    description?: string
    /** Three or six capabilities, three to a row; four with four columns. */
    items: CapabilityGridItem[]
    /** Capabilities per row at the large breakpoint. */
    columns?: CapabilityGridColumns
    /** Actions under the section title. */
    actions?: SiteAction[]
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    columns: 3,
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
        :columns="columns"
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
          <ul
            v-if="item.points?.length"
            class="m-0 mt-(--spacing-sm) flex list-disc flex-col gap-(--spacing-xs) pl-(--spacing-md) text-body-md text-(--text-muted)"
          >
            <li
              v-for="point in item.points"
              :key="point"
            >
              {{ point }}
            </li>
          </ul>
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
