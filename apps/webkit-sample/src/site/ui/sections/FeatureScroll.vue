<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MediaTile from '@aziontech/webkit/media-tile'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import StickyStack from '@aziontech/webkit/sticky-stack'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import type { Component } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'FeatureScroll' })

  interface SiteScene {
    /** The product widget the feature presents. */
    component: Component
    /** Props forwarded to the widget. */
    props?: Record<string, unknown>
  }

  export interface FeatureScrollItem extends SiteTopic {
    /** The console widget shown while the feature is open. */
    scene: SiteScene
    /** The feature's own action, shown under its description while it is open. */
    action?: SiteAction | null
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
    /** Features, opened one at a time as the page scrolls. */
    items: FeatureScrollItem[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
        size="large"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
      class="lg:hidden"
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
          :padded="false"
        >
          <MediaTile
            kind="plain"
            :title="item.title"
            :description="item.description"
          >
            <template #media>
              <div class="h-80 w-full min-w-0">
                <component
                  :is="item.scene.component"
                  v-bind="item.scene.props ?? {}"
                  still
                />
              </div>
            </template>
          </MediaTile>
        </CardGridCell>
      </CardGrid>
    </FrameBox>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
      class="hidden lg:block [--sticky-stack-top:3.5rem] [--sticky-stack-height:min(40rem,calc(100dvh-3.5rem))] [--sticky-stack-align:stretch] [--sticky-stack-frame-border:1px]"
    >
      <StickyStack :items="items">
        <template #media="{ index, active }">
          <div class="contents">
            <div
              class="relative h-[30rem] w-full min-w-0 overflow-hidden rounded-(--shape-card) bg-(--bg-surface) lg:absolute lg:inset-0 lg:h-auto lg:rounded-none lg:border-0 [background-clip:var(--illustration-rim-boxes)] [background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),var(--illustration-rim),linear-gradient(var(--bg-surface),var(--bg-surface))] [background-origin:var(--illustration-rim-boxes)] [border:var(--illustration-rim-width-hairline)_solid_transparent]"
            >
              <TextureMaterial
                kind="dots"
                size="small"
                class="opacity-40"
              />
              <div
                class="relative z-10 flex h-full w-full items-center justify-center p-(--spacing-md) lg:p-(--spacing-xl)"
              >
                <div class="h-[30rem] max-h-full w-full min-w-0">
                  <component
                    :is="items[index].scene.component"
                    v-bind="items[index].scene.props ?? {}"
                    :active="active"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #actions="{ index }">
          <SectionAction
            v-if="items[index].action"
            :action="{ size: 'small', trailing: true, ...items[index].action }"
          />
        </template>
      </StickyStack>
    </FrameBox>
  </SectionModule>
</template>
