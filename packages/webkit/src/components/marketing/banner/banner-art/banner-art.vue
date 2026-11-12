<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import SpinningGlobe from '../../../../assets/globe/spinning-globe.vue'
  import NetworkMap from '../../../content/network-map/network-map.vue'
  import TextureMaterial from '../../texture-material/texture-material.vue'

  defineOptions({ name: 'BannerArt', inheritAttrs: false })

  /** The backdrop drawn behind a band: `globe` hangs a globe half past the page's inline-end rule over the dot lattice, `map` insets the world map beside the copy, `network` lays the map full bleed with its PoPs lit, traffic crossing between them and a scrim over the copy column. */
  export type BannerArtKind = 'globe' | 'map' | 'network'

  interface Props {
    /** Which backdrop to draw. */
    art?: BannerArtKind
    /** Spins the globe or pulses the PoPs; a still frame when false or under reduced motion. */
    animated?: boolean
  }

  withDefaults(defineProps<Props>(), {
    art: 'map',
    animated: true
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-banner-art'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-art="art"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden [container-type:size]"
  >
    <template v-if="art === 'globe'">
      <TextureMaterial />
      <div
        class="absolute inset-0 mx-auto flex w-full max-w-(--layout-measure-site) items-center justify-end"
      >
        <div
          class="relative aspect-square w-[min(calc(100cqh*1.25),150vw,var(--container-5xl))] shrink-0 translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent_0%,black_20%),linear-gradient(to_bottom,transparent_11%,black_26%,black_74%,transparent_89%)] rtl:-translate-x-1/2 rtl:[mask-image:linear-gradient(to_left,transparent_0%,black_20%),linear-gradient(to_bottom,transparent_11%,black_26%,black_74%,transparent_89%)]"
        >
          <SpinningGlobe
            :animated="animated"
            :scale="1"
            :opacity="0.6"
            density="high"
          />
        </div>
      </div>
    </template>

    <template v-else-if="art === 'map'">
      <div class="absolute inset-y-0 end-0 w-full md:w-3/5">
        <NetworkMap
          region="atlantic"
          density="medium"
          position="right"
          fade="vignette"
          :scale="1"
          :opacity="0.5"
          :animated="animated"
        />
      </div>
      <div
        class="absolute inset-0 [background-image:linear-gradient(to_right,var(--bg-canvas)_0%,transparent_50%)] rtl:[background-image:linear-gradient(to_left,var(--bg-canvas)_0%,transparent_50%)]"
      />
      <div
        class="absolute inset-x-0 bottom-0 h-1/4 [background-image:linear-gradient(to_top,var(--bg-canvas),transparent)]"
      />
    </template>

    <template v-else>
      <div
        class="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%)]"
      >
        <NetworkMap
          region="atlantic"
          density="high"
          position="center"
          fade="bottom"
          :scale="1.15"
          :opacity="0.5"
          :animated="animated"
          traffic
        />
        <div
          class="absolute inset-0 [background-image:linear-gradient(to_right,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_72%,transparent)_22%,color-mix(in_srgb,var(--bg-canvas)_28%,transparent)_40%,transparent_56%)] rtl:[background-image:linear-gradient(to_left,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_72%,transparent)_22%,color-mix(in_srgb,var(--bg-canvas)_28%,transparent)_40%,transparent_56%)]"
        />
      </div>
    </template>
  </div>
</template>
