<script setup lang="ts">
  import { computed, defineAsyncComponent, useAttrs } from 'vue'

  import Texture, {
    type TextureFade,
    type TextureSize,
    type TextureVariant
  } from '../texture/texture.vue'

  const Marquee = defineAsyncComponent(() => import('../marquee/marquee.vue'))

  defineOptions({
    name: 'Hero',
    inheritAttrs: false
  })

  /** Height of the band. */
  export type HeroVariant = 'band' | 'screen'

  /** Width the inner column is capped at. */
  export type HeroWidth = '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'site' | 'full'

  /** Where the content column sits vertically in a band that fills a screen. */
  export type HeroAlign = 'start' | 'center' | 'end'

  /** Vertical rhythm the band applies when padded. */
  export type HeroSize = 'medium' | 'large'

  /** Where the media slot sits in its column. */
  export type HeroMediaAlign = 'center' | 'end'

  export interface HeroProps {
    /** Height of the band; `screen` fills one viewport minus `--hero-banner-offset`. */
    variant?: HeroVariant
    /** Width the inner column is capped at; `site` is the marketing measure, `full` keeps only the inset. */
    maxWidth?: HeroWidth
    /** Draw the band's bottom rule, which is the top edge of whatever follows it. */
    bordered?: boolean
    /** Apply the band's own vertical rhythm. The inline inset is always applied. */
    padded?: boolean
    /** Vertical rhythm the band applies when `padded`, equal above and below; `large` is the opening a page leads with. */
    size?: HeroSize
    /** Paint this texture behind the band's content; `none` leaves the backdrop to the `background` slot. */
    texture?: TextureVariant
    /** Pitch of the tiling the `texture` prop paints — how far apart its cells sit. */
    textureSize?: TextureSize
    /** Fade applied to the layer the `texture` prop paints. */
    textureFade?: TextureFade
    /** Paint this texture standing on the band's floor, filling the `bottom` window under the brand strip. */
    floorTexture?: TextureVariant
    /** Pitch of the tiling the `floorTexture` prop paints — how far apart its cells sit. */
    floorTextureSize?: TextureSize
    /** Where the content column sits vertically when the band fills a screen. */
    align?: HeroAlign
    /** Where the `media` slot sits in its column: `center` balances it in the column, `end` sets its end edge on the container boundary, past the inline inset, from `md` up. */
    mediaAlign?: HeroMediaAlign
    /** Height of the fixed chrome above the band, subtracted from the viewport when `variant` is `screen`; any CSS length. */
    offset?: string
    /** Height of the window under the content, where the brand strip and the floor texture stand; any CSS length. */
    bottomHeight?: string
    /** Stand the brand marquee on the band's floor, under the `bottom` window. */
    marquee?: boolean
    /** Registry names of the marks the marquee shows, in order. */
    marqueeMarks?: string[]
    /** Eyebrow above the brand marquee, stating the claim the marks make. */
    marqueeLabel?: string
  }

  const props = withDefaults(defineProps<HeroProps>(), {
    variant: 'band',
    maxWidth: '7xl',
    bordered: true,
    padded: true,
    size: 'medium',
    texture: 'none',
    textureSize: 'medium',
    textureFade: 'none',
    floorTexture: 'none',
    floorTextureSize: 'medium',
    align: 'center',
    mediaAlign: 'center',
    offset: '',
    bottomHeight: '',
    marquee: false,
    marqueeMarks: () => [],
    marqueeLabel: ''
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
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'hero')

  const hasBackdrop = () => Boolean(slots.background) || props.texture !== 'none'
  const hasMedia = () => Boolean(slots.media)
  const hasFloorTexture = computed(() => props.floorTexture !== 'none')
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-width="maxWidth"
    :data-bordered="props.bordered || null"
    :data-padded="props.padded || null"
    :data-size="size"
    :data-media="hasMedia() || null"
    :data-media-align="hasMedia() ? mediaAlign : null"
    :data-align="align"
    :style="{
      '--hero-banner-offset': offset || undefined,
      '--hero-banner-bottom-height': bottomHeight || undefined
    }"
    class="relative isolate w-full overflow-clip bg-(--bg-canvas) data-[bordered]:border-b data-[bordered]:border-(--border-default) data-[variant=screen]:flex data-[variant=screen]:min-h-[calc(100dvh-var(--hero-banner-offset,0rem))] data-[variant=screen]:flex-col"
  >
    <div
      v-if="hasBackdrop()"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden [z-index:var(--hero-banner-z-background,0)]"
    >
      <div
        class="absolute inset-0 [--texture-fade-lead:transparent] [translate:var(--hero-banner-background-x,0)_var(--hero-banner-background-y,0)]"
      >
        <Texture
          v-if="texture !== 'none'"
          :variant="texture"
          :size="textureSize"
          :fade="textureFade"
        />

        <slot name="background" />
      </div>
    </div>

    <div
      v-if="slots.top"
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 overflow-hidden [height:var(--hero-banner-top-height,auto)] [z-index:var(--hero-banner-z-top,1)]"
    >
      <div class="[translate:var(--hero-banner-top-x,0)_var(--hero-banner-top-y,0)]">
        <slot name="top" />
      </div>
    </div>

    <div
      :data-variant="variant"
      :data-width="maxWidth"
      :data-padded="props.padded || null"
      :data-size="size"
      :data-align="align"
      class="relative mx-auto w-full px-(--layout-boundary-inline) [z-index:var(--hero-banner-z-content,10)] data-[variant=screen]:flex data-[variant=screen]:flex-1 data-[variant=screen]:flex-col data-[variant=screen]:data-[align=start]:justify-start data-[variant=screen]:data-[align=center]:justify-center data-[variant=screen]:data-[align=end]:justify-end data-[width=3xl]:max-w-(--container-3xl) data-[width=4xl]:max-w-(--container-4xl) data-[width=5xl]:max-w-(--container-5xl) data-[width=6xl]:max-w-(--container-6xl) data-[width=7xl]:max-w-(--container-7xl) data-[width=site]:max-w-(--layout-measure-site) data-[width=full]:max-w-none data-[padded]:data-[size=medium]:py-(--spacing-2xl) data-[padded]:data-[size=large]:py-[calc(var(--spacing-2xl)*2)]"
    >
      <div
        v-if="hasMedia()"
        class="grid items-center gap-(--spacing-2xl) md:grid-cols-2 md:gap-(--spacing-xl)"
      >
        <div class="min-w-0">
          <slot />
        </div>

        <div
          :data-media-align="mediaAlign"
          class="flex min-w-0 items-center justify-center md:data-[media-align=end]:-me-(--layout-boundary-inline) md:data-[media-align=end]:justify-end"
        >
          <slot name="media" />
        </div>
      </div>

      <slot v-else />
    </div>

    <div
      v-if="slots.bottom || hasFloorTexture || marquee"
      class="relative w-full shrink-0 [background-color:var(--hero-banner-floor-bg,transparent)] [z-index:var(--hero-banner-z-bottom,1)]"
    >
      <div
        v-if="slots.bottom || hasFloorTexture"
        :data-floor="hasFloorTexture || null"
        class="relative w-full overflow-hidden [height:var(--hero-banner-bottom-height,auto)] data-[floor]:[height:var(--hero-banner-bottom-height,clamp(9rem,30dvh,34rem))]"
      >
        <Texture
          v-if="hasFloorTexture"
          :variant="floorTexture"
          :size="floorTextureSize"
          class="[mask-image:linear-gradient(to_right,black_0%,color-mix(in_srgb,black_30%,transparent)_40%,color-mix(in_srgb,black_30%,transparent)_62%,black_100%)] [mask-mode:alpha] [opacity:var(--hero-banner-floor-ink,0.6)]"
        />

        <div
          v-if="slots.bottom"
          class="[translate:var(--hero-banner-bottom-x,0)_var(--hero-banner-bottom-y,0)]"
        >
          <slot name="bottom" />
        </div>
      </div>

      <div
        v-if="marquee"
        class="w-full [background-color:var(--hero-banner-floor-bg,var(--bg-canvas))]"
      >
        <Marquee
          :data-width="maxWidth"
          :marks="marqueeMarks"
          :label="marqueeLabel"
          size="small"
          class="mx-auto w-full px-(--layout-boundary-inline) py-(--spacing-xl) data-[width=3xl]:max-w-(--container-3xl) data-[width=4xl]:max-w-(--container-4xl) data-[width=5xl]:max-w-(--container-5xl) data-[width=6xl]:max-w-(--container-6xl) data-[width=7xl]:max-w-(--container-7xl) data-[width=site]:max-w-(--layout-measure-site) data-[width=full]:max-w-none"
        />
      </div>
    </div>
  </section>
</template>
