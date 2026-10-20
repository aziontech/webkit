<script setup lang="ts">
  import BandStack from '@aziontech/webkit/band-stack'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type { Component } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'MediaSplitStack' })

  /** solutions: large centered bands, copy first, each linking through; alternating: bands that swap the media side from one to the next. */
  export type MediaSplitStackKind = 'solutions' | 'alternating'

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

  interface StackBand {
    /** Overline above the band's title. */
    eyebrow?: string
    /** The band's headline. */
    title: string
    /** One or two sentences under the title. */
    description: string
    /** Destination of the whole band; defaults to its action's. */
    href?: string
    /** Registered illustration shown as the media. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationLabel?: string
    /** Asset image shown as the media, in place of an illustration. */
    image?: SiteImage | null
    /** Scene component shown as the media, in place of an illustration. */
    scene?: SiteScene | null
    /** The band's one outlined button, lit with the band on hover. */
    actions?: SiteAction[]
  }

  interface Props {
    /** Layout of the stack. */
    kind?: MediaSplitStackKind
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline of the section title over the stack. */
    eyebrow?: string
    /** Section title over the stack; empty renders the stack alone. */
    title?: string
    /** The stacked bands, top to bottom. */
    bands: StackBand[]
  }

  withDefaults(defineProps<Props>(), {
    kind: 'solutions',
    anchor: '',
    eyebrow: '',
    title: ''
  })

  const { follow } = useSiteLink()

  const bandHref = (band: StackBand) => band.href || band.actions?.[0]?.href || ''

  const bandAction = (action: SiteAction): SiteAction => ({
    ...action,
    kind: 'outlined',
    size: 'medium',
    trailing: true
  })

  const followBand = (event: MouseEvent, href: string) => {
    if (event.defaultPrevented || !href) return
    const link = (event.target as globalThis.Element).closest('a, button')
    if (link && link.getAttribute('href') !== href) return
    if (!link && globalThis.getSelection()?.toString()) return
    follow(event, href)
  }
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template
      v-if="title"
      #header
    >
      <SectionTitle
        kind="centered"
        :size="kind === 'solutions' ? 'large' : 'medium'"
        :eyebrow="eyebrow"
        :title="title"
      />
    </template>

    <BandStack
      sticky
      flush
    >
      <MediaSplit
        v-for="(band, index) in bands"
        :key="band.title"
        :kind="kind === 'alternating' && index % 2 === 0 ? 'media-start' : 'media-end'"
        :divided="true"
        :heading-level="title ? 3 : 2"
        :align="kind === 'solutions' ? 'center' : 'top'"
        :size="kind === 'solutions' ? 'large' : 'medium'"
        :media-fill="kind === 'solutions' ? 'canvas' : 'surface'"
        texture="pixelate"
        texture-size="small"
        texture-fade="top"
        :media-href="bandHref(band)"
        :eyebrow="band.eyebrow ?? ''"
        :title="band.title"
        :description="band.description"
        @click="followBand($event, bandHref(band))"
      >
        <template #media>
          <component
            :is="band.scene.component"
            v-if="band.scene"
            v-bind="band.scene.props ?? {}"
          />
          <div
            v-else-if="band.image"
            class="flex aspect-592/300 w-full items-center justify-center"
          >
            <img
              :src="band.image.src"
              :alt="band.image.alt"
              :width="band.image.width"
              :height="band.image.height"
              decoding="async"
              class="block h-auto w-[60.81%]"
            />
          </div>
          <Illustration
            v-else
            :name="band.illustration ?? ''"
            :aria-label="band.illustrationLabel ?? ''"
          />
        </template>
        <template
          v-if="band.actions?.length"
          #actions
        >
          <SectionAction :action="bandAction(band.actions[0])" />
        </template>
      </MediaSplit>
    </BandStack>
  </SectionModule>
</template>
