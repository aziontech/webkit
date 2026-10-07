<script setup lang="ts">
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'
  import { computed } from 'vue'
  import type { Component } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'MediaSplitBand' })

  /** architecture: a large centered title over a canvas-filled diagram; guide: title and description beside the art; two-actions: two buttons, so the band itself links nowhere. */
  export type MediaSplitBandKind = 'architecture' | 'guide' | 'two-actions'

  interface SiteScene {
    /** The scene component the page supplies. */
    component: Component
    /** Props forwarded to the scene. */
    props?: Record<string, unknown>
  }

  interface SiteImage {
    /** Image URL. */
    src: string
    /** Alternative text; empty keeps the image decorative. */
    alt: string
    /** Intrinsic width, in pixels. */
    width?: number
    /** Intrinsic height, in pixels. */
    height?: number
  }

  interface Props {
    /** Layout of the band. */
    kind?: MediaSplitBandKind
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** The band's headline. */
    title: string
    /** One or two sentences under the title. */
    description?: string
    /** Registered illustration shown as the media. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationLabel?: string
    /** Asset image shown as the media, in place of an illustration. */
    image?: SiteImage | null
    /** Scene component shown as the media, in place of an illustration. */
    scene?: SiteScene | null
    /** Medium buttons under the copy; with one, the whole band links to its destination. */
    actions?: SiteAction[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'guide',
    anchor: '',
    eyebrow: '',
    description: '',
    illustration: '',
    illustrationLabel: '',
    image: null,
    scene: null,
    actions: () => []
  })

  const { follow } = useSiteLink()

  const bandHref = computed(() =>
    props.kind === 'two-actions' ? '' : (props.actions[0]?.href ?? '')
  )

  const followBand = (event: MouseEvent) => {
    if (event.defaultPrevented || !bandHref.value) return
    const link = (event.target as globalThis.Element).closest('a, button')
    if (link && link.getAttribute('href') !== bandHref.value) return
    if (!link && globalThis.getSelection()?.toString()) return
    follow(event, bandHref.value)
  }
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <MediaSplit
      framed
      :media-href="bandHref"
      :align="kind === 'architecture' ? 'center' : 'top'"
      :size="kind === 'architecture' ? 'large' : 'medium'"
      :media-fill="kind === 'architecture' ? 'canvas' : 'surface'"
      texture="pixelate"
      texture-size="small"
      texture-fade="top"
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
      @click="followBand"
    >
      <template #media>
        <component
          :is="scene.component"
          v-if="scene"
          v-bind="scene.props ?? {}"
        />
        <img
          v-else-if="image"
          :src="image.src"
          :alt="image.alt"
          :width="image.width"
          :height="image.height"
          decoding="async"
          class="block h-auto max-w-full"
        />
        <Illustration
          v-else
          :name="illustration"
          :aria-label="illustrationLabel"
        />
      </template>
      <template
        v-if="actions.length"
        #actions
      >
        <SectionAction
          v-for="action in actions"
          :key="action.label"
          :action="{ kind: 'outlined', size: 'medium', ...action }"
        />
      </template>
    </MediaSplit>
  </SectionModule>
</template>
