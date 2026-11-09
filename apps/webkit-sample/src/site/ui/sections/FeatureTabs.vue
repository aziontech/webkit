<script setup lang="ts">
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTabs from '@aziontech/webkit/media-tabs'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { type Component, computed } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'FeatureTabs' })

  export interface FeatureTabsTab {
    /** Stable key, handed to the scene as its `tab` prop. */
    value: string
    /** Tab heading. */
    title: string
    /** One sentence under the heading. */
    description: string
    /** Illustration drawn for this tab when it has no code and the band has no scene. */
    illustration?: string
    /** Code file this tab opens as its media. */
    code?: CodeBlockTab
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
    /** Scene drawn as every tab's media, given its tab's value as `tab` and whether that tab is open as `active`. */
    scene?: SiteScene | null
    /** Milliseconds each tab holds before the next one opens. */
    interval?: number
    /** Button in the section title. */
    action?: SiteAction | null
    /** Accessible name of the copy control on each code file. */
    copyAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    scene: null,
    interval: 5200,
    action: null,
    copyAriaLabel: 'Copy the code sample'
  })

  const items = computed(() =>
    props.tabs.map((tab) => ({ title: tab.title, description: tab.description }))
  )

  const codeFiles = computed(() => props.tabs.map((tab) => (tab.code ? [tab.code] : [])))

  const hasCode = computed(() => props.tabs.some((tab) => tab.code))
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
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      >
        <template
          v-if="action"
          #actions
        >
          <SectionAction :action="{ trailing: true, ...action }" />
        </template>
      </SectionTitle>
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div
        :data-code="hasCode || null"
        class="-mx-px [--media-tabs-media-min:24rem] data-[code]:[--media-tabs-media-min:30rem]"
      >
        <MediaTabs
          :items="items"
          size="medium"
          :texture="hasCode ? 'pixelate' : 'none'"
          texture-size="small"
          texture-fade="top"
          :auto-play-interval="interval"
        >
          <template #media="{ index, active }">
            <div
              v-if="codeFiles[index]?.length"
              class="w-full min-w-0 p-(--spacing-xl)"
            >
              <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
                <CodeBlock
                  :tabs="codeFiles[index]"
                  show-line-numbers
                  :animate-lines="active"
                  :copy-aria-label="copyAriaLabel"
                />
              </div>
            </div>
            <component
              :is="scene.component"
              v-else-if="scene"
              v-bind="scene.props ?? {}"
              :tab="tabs[index]?.value"
              :active="active"
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
    </FrameBox>
  </SectionModule>
</template>
