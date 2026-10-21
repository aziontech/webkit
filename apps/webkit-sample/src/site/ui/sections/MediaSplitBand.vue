<script setup lang="ts">
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit, {
    type MediaSplitOrientation,
    type MediaSplitSize
  } from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'
  import type { TextureMaterialKind } from '@aziontech/webkit/texture-material'
  import type { Component } from 'vue'
  import { computed } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'MediaSplitBand' })

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
    /** One or two medium buttons under the copy; with one, the whole band links to it and hovering the band activates it. */
    actions?: SiteAction[]
    /** Axis the band splits on; vertical stacks the media under the copy for a wide scene. */
    orientation?: MediaSplitOrientation
    /** Texture painted under the media. */
    texture?: TextureMaterialKind
    /** Type scale of the copy; large centres it beside the media. */
    size?: MediaSplitSize
    /** Link the whole band to a lone action; turn it off when the media holds controls of its own. */
    linked?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    description: '',
    illustration: '',
    illustrationLabel: '',
    image: null,
    scene: null,
    actions: () => [],
    orientation: 'horizontal',
    texture: 'pixelate',
    size: 'medium',
    linked: true
  })

  const { follow } = useSiteLink()

  const bandHref = computed(() =>
    props.linked && props.actions.length === 1 ? props.actions[0].href : ''
  )

  const buttons = computed<SiteAction[]>(() => {
    const [first, second] = props.actions
    if (!first) return []
    if (!second) return [{ ...first, kind: 'outlined', size: 'medium', trailing: true }]
    return [
      { ...first, kind: 'secondary', size: 'medium' },
      { ...second, kind: 'outlined', size: 'medium' }
    ]
  })

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
      :orientation="orientation"
      :media-href="bandHref"
      :align="size === 'large' ? 'center' : 'top'"
      :size="size"
      media-fill="surface"
      :texture="texture"
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
        v-if="buttons.length"
        #actions
      >
        <SectionAction
          v-for="action in buttons"
          :key="action.label"
          :action="action"
        />
      </template>
    </MediaSplit>
  </SectionModule>
</template>
