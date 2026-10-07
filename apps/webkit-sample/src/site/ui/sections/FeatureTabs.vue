<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTabs from '@aziontech/webkit/media-tabs'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { type Component, computed } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteAction } from './types'

  defineOptions({ name: 'FeatureTabs' })

  export interface FeatureTabsTab {
    /** Stable key, handed to the scene as its `tab` prop. */
    value: string
    /** Tab heading. */
    title: string
    /** One sentence under the heading. */
    description: string
    /** Illustration drawn for this tab when the band has no scene. */
    illustration?: string
  }

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
    /** Up to three tabs, advanced on a timer. */
    tabs: FeatureTabsTab[]
    /** Scene drawn as every tab's media, given the active tab's value as its `tab` prop. */
    scene?: SiteScene | null
    /** Milliseconds each tab holds before the next one opens. */
    interval?: number
    /** Link under the frame. */
    action?: SiteAction | null
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    scene: null,
    interval: 5200,
    action: null
  })

  const { follow } = useSiteLink()

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
        kind="left"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="[--media-tabs-media-min:24rem]">
        <MediaTabs
          :items="items"
          size="small"
          :auto-play-interval="interval"
        >
          <template #media="{ index }">
            <component
              :is="scene.component"
              v-if="scene"
              v-bind="scene.props ?? {}"
              :tab="tabs[index]?.value"
              class="size-full"
            />
            <div
              v-else
              class="flex size-full items-center justify-center"
            >
              <Illustration :name="tabs[index]?.illustration ?? ''" />
            </div>
          </template>
        </MediaTabs>
      </div>

      <div
        v-if="action"
        class="p-(--spacing-xl)"
      >
        <MiniButton
          :label="action.label"
          show-icon
          :icon="action.icon || 'pi pi-angle-right'"
          :href="action.href"
          :target="action.external ? '_blank' : '_self'"
          @click="follow($event, action.href)"
        />
      </div>
    </FrameBox>
  </SectionModule>
</template>
