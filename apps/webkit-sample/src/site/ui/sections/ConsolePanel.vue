<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import TextureMaterial, { type TextureMaterialKind } from '@aziontech/webkit/texture-material'
  import { type Component, computed, ref } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ConsolePanel' })

  export interface ConsolePanelTab {
    /** Stable key, handed to the scene as its `tab` prop. */
    value: string
    /** Tab label. */
    title: string
  }

  interface SiteScene {
    /** The scene component the page supplies. */
    component: Component
    /** Props forwarded to the scene. */
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
    /** The full-width console scene the band presents. */
    scene: SiteScene
    /** Texture the panel is grounded with. */
    texture?: TextureMaterialKind
    /** Tabs over the frame; each one plays its own beat of the scene. */
    tabs?: ConsolePanelTab[]
    /** Share of the scene's height clipped off its bottom, from 0 to 0.5, on `md` and up. */
    crop?: number
    /** Link under the frame. */
    action?: SiteAction | null
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    texture: 'pixelate',
    tabs: () => [],
    crop: 0,
    action: null
  })

  const current = ref(props.tabs[0]?.value ?? '')

  const options = computed(() => props.tabs.map((tab) => ({ value: tab.value, label: tab.title })))

  const SCENE_ASPECT = 1.9

  const cropStyle = computed(() => {
    const crop = Math.min(Math.max(props.crop, 0), 0.5)
    const fadeEnd = Math.round((1 - crop) * 100) + 3
    return {
      '--console-panel-crop': `${((crop / SCENE_ASPECT) * 100).toFixed(2)}%`,
      '--console-panel-fade-end': `${fadeEnd}%`,
      '--console-panel-fade-start': `${fadeEnd - 22}%`
    }
  })

  const { follow } = useSiteLink()
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    kind="centered"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
  >
    <template
      v-if="tabs.length"
      #actions
    >
      <SegmentedButton
        v-model="current"
        :options="options"
        size="large"
        aria-label="Console views"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <div
        class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-md) pb-(--spacing-xl) md:pb-0"
      >
        <TextureMaterial
          :kind="texture"
          size="small"
          fade="top"
        />
        <div
          class="relative z-10 aspect-square w-full md:-mb-(--console-panel-crop) md:aspect-[1.9/1] md:[--mockup-fade-end:var(--console-panel-fade-end)] md:[--mockup-fade-start:var(--console-panel-fade-start)]"
          :style="cropStyle"
        >
          <component
            :is="scene.component"
            v-bind="scene.props ?? {}"
            :tab="tabs.length ? current : undefined"
          />
        </div>
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
