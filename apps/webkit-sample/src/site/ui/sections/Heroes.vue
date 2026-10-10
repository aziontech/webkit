<script setup lang="ts">
  import Hero from '@aziontech/webkit/hero-root'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import type { HeroTitleEyebrowPrefix } from '@aziontech/webkit/hero-title'
  import Illustration from '@aziontech/webkit/illustration'
  import { computed } from 'vue'
  import type { Component } from 'vue'

  import { heroArt } from '../../data/hero-art.js'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'Heroes' })

  export type HeroesKind =
    | 'centered-carousel'
    | 'title-band'
    | 'centered-band'
    | 'pixel-floor'
    | 'copy-beside-art'
    | 'copy-on-top-art'

  export type HeroesScenePlacement = 'bottom' | 'top'

  export interface HeroesArt {
    /** Illustration name, also the key of the art's bounds in hero-art.js. */
    name: string
    /** Accessible description of the art. */
    alt: string
    /** Asset image drawn instead of the illustration. */
    src?: string
    /** Intrinsic width of the asset image. */
    width?: number
    /** Intrinsic height of the asset image. */
    height?: number
  }

  interface SiteScene {
    component: Component
    props?: Record<string, unknown>
  }

  interface Props {
    /** Which opening band the copy sits in. */
    kind?: HeroesKind
    /** In-page anchor for the band. */
    anchor?: string
    /** Overline above the headline. */
    eyebrow?: string
    /** Mark set before the eyebrow. */
    eyebrowPrefix?: HeroTitleEyebrowPrefix
    /** Opening phrase of the headline, in the brand accent. */
    highlight?: string
    /** The page's h1. */
    title: string
    /** Supporting sentence under the headline. */
    description?: string
    /** Actions under the copy. */
    actions?: SiteAction[]
    /** Client marks the floor strip runs; without marks the band has no strip. */
    carouselMarks?: string[]
    /** Overline above the client strip. */
    carouselLabel?: string
    /** Art beside the copy, for copy-beside-art. */
    art?: HeroesArt | null
    /** Sample scene drawn in the band's top or bottom window. */
    scene?: SiteScene | null
    /** Window the scene stands in. */
    scenePlacement?: HeroesScenePlacement
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'centered-carousel',
    anchor: '',
    eyebrow: '',
    eyebrowPrefix: '',
    highlight: '',
    description: '',
    actions: () => [],
    carouselMarks: () => [],
    carouselLabel: 'Trusted by mission-critical workloads',
    art: null,
    scene: null,
    scenePlacement: 'bottom'
  })

  const FRAMES = {
    'centered-carousel': {
      kind: 'screen',
      align: 'center',
      maxWidth: 'site',
      texture: 'dots',
      textureFade: 'top'
    },
    'title-band': { kind: 'band', maxWidth: '5xl', size: 'large' },
    'centered-band': {
      kind: 'band',
      size: 'large',
      maxWidth: 'site',
      texture: 'dots',
      textureFade: 'top'
    },
    'pixel-floor': {
      kind: 'screen',
      floorTexture: 'pixelate',
      floorTextureSize: 'small',
      maxWidth: 'full',
      bordered: false,
      bottomHeight: 'clamp(9rem, 24dvh, 34rem)'
    },
    'copy-beside-art': { maxWidth: '5xl', kind: 'screen', mediaAlign: 'end' },
    'copy-on-top-art': {
      kind: 'screen',
      align: 'center',
      maxWidth: 'site',
      texture: 'dots',
      textureSize: 'small',
      textureFade: 'top'
    }
  } as const

  const TITLES = {
    'centered-carousel': { centered: true, maxWidth: 'xl' },
    'title-band': { centered: true },
    'centered-band': { centered: true, maxWidth: '2xl' },
    'pixel-floor': {},
    'copy-beside-art': { maxWidth: 'xl' },
    'copy-on-top-art': { centered: true }
  } as const

  const hasCarousel = computed(() => props.carouselMarks.length > 0)

  const frame = computed(() => FRAMES[props.kind])
  const titleFrame = computed(() => TITLES[props.kind])
  const sceneOnTop = computed(() => Boolean(props.scene) && props.scenePlacement === 'top')
  const sceneOnBottom = computed(() => Boolean(props.scene) && props.scenePlacement === 'bottom')
  const hasArt = computed(() => props.kind === 'copy-beside-art' && Boolean(props.art))
  const artStyle = computed(() => (props.art ? heroArt(props.art.name) : {}))
  const artOrientation = computed(() =>
    props.art?.width && props.art?.height && props.art.height > props.art.width
      ? 'portrait'
      : undefined
  )
</script>

<template>
  <div
    :data-layout="kind"
    class="contents data-[layout=pixel-floor]:[--banner-floor-bg:var(--bg-surface)] data-[layout=pixel-floor]:[--texture-pool-a:95%_64%] data-[layout=pixel-floor]:[--texture-pool-b:-2%_38%]"
  >
    <Hero
      v-bind="frame"
      :id="anchor || undefined"
      :carousel="hasCarousel"
      :carousel-label="carouselLabel"
      :carousel-marks="hasCarousel ? carouselMarks : []"
    >
      <HeroTitle
        v-bind="titleFrame"
        :eyebrow="eyebrow"
        :eyebrow-prefix="eyebrow ? eyebrowPrefix : ''"
        :highlight="highlight"
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
      </HeroTitle>

      <template
        v-if="hasArt && art"
        #media
      >
        <div
          class="w-full md:-mt-(--hero-art-trim-top) md:-mb-(--hero-art-trim-bottom) md:w-(--hero-art-width) md:max-w-none md:shrink-0 md:-me-(--hero-art-bleed)"
          :style="artStyle"
        >
          <img
            v-if="art.src"
            :src="art.src"
            :alt="art.alt"
            :width="art.width"
            :height="art.height"
            :data-orientation="artOrientation"
            decoding="async"
            class="block h-auto w-full max-md:data-[orientation=portrait]:mx-auto max-md:data-[orientation=portrait]:w-1/2"
          />
          <Illustration
            v-else
            :name="art.name"
            :aria-label="art.alt"
          />
        </div>
      </template>

      <template
        v-if="sceneOnTop && scene"
        #top
      >
        <component
          :is="scene.component"
          v-bind="scene.props ?? {}"
        />
      </template>

      <template
        v-if="sceneOnBottom && scene"
        #bottom
      >
        <div class="@container">
          <div
            class="flex animate-content-enter justify-center pb-(--spacing-xxl) motion-reduce:animate-none [--content-enter-delay:120ms] @max-2xl:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          >
            <component
              :is="scene.component"
              v-bind="scene.props ?? {}"
            />
          </div>
        </div>
      </template>
    </Hero>
  </div>
</template>
