<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import MediaTabs from '@aziontech/webkit/media-tabs'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { type Component, computed } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ArchitectureTabs' })

  export interface ArchitectureTabsTab {
    /** Stable key, handed to the scene as its `tab` prop. */
    value: string
    /** Tab heading. */
    title: string
    /** One sentence under the heading. */
    description: string
  }

  export type ArchitectureTabsPosition = 'left' | 'right' | 'top' | 'bottom'

  interface SiteScene {
    component: Component
    props?: Record<string, unknown>
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** The section's headline. */
    title?: string
    /** One or two sentences under the headline. */
    description?: string
    /** Which side of the diagram the tabs sit on; left and right hold up to three tabs. */
    position?: ArchitectureTabsPosition
    /** Up to five architectures, advanced on a timer. */
    tabs: ArchitectureTabsTab[]
    /** Scene drawn as every tab's media, given its tab's value as `tab` and whether that tab is open as `active`. */
    scene: SiteScene
    /** Milliseconds each tab holds before the next one opens. */
    interval?: number
    /** Button in the section title. */
    action?: SiteAction | null
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    position: 'top',
    interval: 6000,
    action: null
  })

  const items = computed(() =>
    props.tabs.map((tab) => ({ title: tab.title, description: tab.description }))
  )
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="horizontal"
        padding="small"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      >
        <template
          v-if="action"
          #actions
        >
          <SectionAction :action="action" />
        </template>
      </SectionTitle>
    </template>

    <FrameBox
      flush
      borders="top"
      marks="none"
    >
      <div
        class="-mx-px [--media-tabs-media-bg:var(--bg-surface)] [--media-tabs-media-min-lg:28rem] [--media-tabs-media-min:24rem]"
      >
        <MediaTabs
          :position="position"
          size="small"
          :items="items"
          :auto-play-interval="interval"
        >
          <template #media="{ index, active }">
            <component
              :is="scene.component"
              v-bind="scene.props ?? {}"
              :tab="tabs[index]?.value"
              :active="active"
              class="w-full"
            />
          </template>
        </MediaTabs>
      </div>
    </FrameBox>
  </SectionModule>
</template>
