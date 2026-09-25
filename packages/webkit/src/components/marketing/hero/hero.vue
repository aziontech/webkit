<script setup lang="ts">
  import { computed, defineAsyncComponent, useAttrs } from 'vue'

  import TextureMaterial, {
    type TextureMaterialFade,
    type TextureMaterialKind
  } from '../texture-material/texture-material.vue'

  // Loaded on demand: a band without a strip must not pay for the strip or its mark
  // registry, and `hero-root` is budgeted for the band alone.
  const BrandCarousel = defineAsyncComponent(() => import('../brand-carousel/brand-carousel.vue'))

  defineOptions({
    name: 'Hero',
    inheritAttrs: false
  })

  /** Height of the band. */
  export type HeroKind = 'band' | 'screen'

  /** Width the inner column is capped at. */
  export type HeroWidth = '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'site' | 'full'

  /** Where the content column sits vertically in a band that fills a screen. */
  export type HeroAlign = 'top' | 'center' | 'bottom'

  interface Props {
    /** Height of the band; `screen` fills one viewport minus `--banner-offset`. */
    kind?: HeroKind
    /** Width the inner column is capped at; `site` is the marketing measure, `full` keeps only the inset. */
    maxWidth?: HeroWidth
    /** Draw the band's bottom rule, which is the top edge of whatever follows it. */
    bordered?: boolean
    /** Apply the band's own vertical rhythm. The inline inset is always applied. */
    padded?: boolean
    /** Paint this texture behind the band's content; `none` leaves the backdrop to the `background` slot. */
    texture?: TextureMaterialKind
    /** Fade applied to the layer the `texture` prop paints. */
    textureFade?: TextureMaterialFade
    /** Paint this texture standing on the band's floor, filling the `bottom` window under the brand strip. */
    floorTexture?: TextureMaterialKind
    /** Where the content column sits vertically when the band fills a screen. */
    align?: HeroAlign
    /** Stand the brand strip on the band's floor, under the `bottom` window. */
    carousel?: boolean
    /** Registry names of the marks the strip shows, in order. */
    carouselMarks?: string[]
    /** Overline above the brand strip, stating the claim the marks make. */
    carouselLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'band',
    maxWidth: '7xl',
    bordered: true,
    padded: true,
    texture: 'none',
    textureFade: 'none',
    floorTexture: 'none',
    align: 'center',
    carousel: false,
    carouselMarks: () => [],
    carouselLabel: ''
  })

  const slots = defineSlots<{
    /** The band's copy, centered in the capped column above the backdrop. */
    default?(): unknown
    /** Screenshot, diagram or form set beside the copy from `md` up. */
    media?(): unknown
    /** Decorative backdrop rendered full-bleed beneath the content. */
    background?(): unknown
    /** Asset window anchored to the band's top edge; clips its child. */
    top?(): unknown
    /** Asset window anchored to the band's bottom edge; clips its child. */
    bottom?(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'marketing-hero')

  const hasBackdrop = computed(() => Boolean(slots.background) || props.texture !== 'none')
  const hasMedia = computed(() => Boolean(slots.media))
  const hasFloorTexture = computed(() => props.floorTexture !== 'none')
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-width="maxWidth"
    :data-bordered="props.bordered || null"
    :data-padded="props.padded || null"
    :data-media="hasMedia || null"
    :data-align="align"
    class="relative isolate w-full overflow-hidden bg-(--bg-canvas) data-[bordered]:border-b data-[bordered]:border-(--border-default) data-[kind=screen]:flex data-[kind=screen]:min-h-[calc(100dvh-var(--banner-offset,0rem))] data-[kind=screen]:flex-col"
  >
    <div
      v-if="hasBackdrop"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden [z-index:var(--banner-z-background,0)]"
    >
      <div
        class="absolute inset-0 [translate:var(--banner-background-x,0)_var(--banner-background-y,0)]"
      >
        <TextureMaterial
          v-if="texture !== 'none'"
          :kind="texture"
          :fade="textureFade"
        />

        <slot name="background" />
      </div>
    </div>

    <div
      v-if="slots.top"
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 overflow-hidden [height:var(--banner-top-height,auto)] [z-index:var(--banner-z-top,1)]"
    >
      <div class="[translate:var(--banner-top-x,0)_var(--banner-top-y,0)]">
        <slot name="top" />
      </div>
    </div>

    <div
      :data-kind="kind"
      :data-width="maxWidth"
      :data-padded="props.padded || null"
      :data-align="align"
      class="relative mx-auto w-full px-(--layout-boundary-inline) [z-index:var(--banner-z-content,10)] data-[kind=screen]:flex data-[kind=screen]:flex-1 data-[kind=screen]:flex-col data-[kind=screen]:data-[align=top]:justify-start data-[kind=screen]:data-[align=center]:justify-center data-[kind=screen]:data-[align=bottom]:justify-end data-[width=3xl]:max-w-(--container-3xl) data-[width=4xl]:max-w-(--container-4xl) data-[width=5xl]:max-w-(--container-5xl) data-[width=6xl]:max-w-(--container-6xl) data-[width=7xl]:max-w-(--container-7xl) data-[width=site]:max-w-(--layout-measure-site) data-[width=full]:max-w-none data-[padded]:py-(--spacing-xl)"
    >
      <div
        v-if="hasMedia"
        class="grid items-center gap-(--spacing-xxl) md:grid-cols-2"
      >
        <div class="min-w-0">
          <slot />
        </div>

        <div class="flex min-w-0 items-center justify-center">
          <slot name="media" />
        </div>
      </div>

      <slot v-else />
    </div>

    <div
      v-if="slots.bottom || hasFloorTexture || carousel"
      class="relative w-full shrink-0 [background-color:var(--banner-floor-bg,transparent)] [z-index:var(--banner-z-bottom,1)]"
    >
      <div
        v-if="slots.bottom || hasFloorTexture"
        :data-floor="hasFloorTexture || null"
        class="relative w-full overflow-hidden [height:var(--banner-bottom-height,auto)] data-[floor]:[height:var(--banner-bottom-height,clamp(9rem,30dvh,34rem))]"
      >
        <TextureMaterial
          v-if="hasFloorTexture"
          :kind="floorTexture"
          class="[mask-image:linear-gradient(to_right,black_0%,color-mix(in_srgb,black_30%,transparent)_40%,color-mix(in_srgb,black_30%,transparent)_62%,black_100%)] [mask-mode:alpha] [opacity:var(--banner-floor-ink,0.6)]"
        />

        <div
          v-if="slots.bottom"
          class="[translate:var(--banner-bottom-x,0)_var(--banner-bottom-y,0)]"
        >
          <slot name="bottom" />
        </div>
      </div>

      <BrandCarousel
        v-if="carousel"
        :data-width="maxWidth"
        :marks="carouselMarks"
        :label="carouselLabel"
        size="small"
        class="mx-auto w-full px-(--layout-boundary-inline) py-(--spacing-xl) data-[width=3xl]:max-w-(--container-3xl) data-[width=4xl]:max-w-(--container-4xl) data-[width=5xl]:max-w-(--container-5xl) data-[width=6xl]:max-w-(--container-6xl) data-[width=7xl]:max-w-(--container-7xl) data-[width=site]:max-w-(--layout-measure-site) data-[width=full]:max-w-none"
      />
    </div>
  </section>
</template>
