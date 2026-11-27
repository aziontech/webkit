<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import SpinningGlobe from '../../../assets/globe/spinning-globe.vue'
  import NetworkMap from '../../content/network-map/network-map.vue'
  import Texture from '../../content/texture/texture.vue'

  defineOptions({ name: 'Backdrop', inheritAttrs: false })

  /**
   * The backdrop drawn behind a band: `globe` hangs a globe half past the page's inline-end rule over
   * the dot lattice, `map` insets the world map beside the copy, `network` lays the map full bleed with
   * its data centers lit, traffic crossing between them and a scrim over the copy column.
   */
  export type BackdropVariant = 'globe' | 'map' | 'network'

  export interface BackdropProps {
    /** Which backdrop to draw. */
    variant?: BackdropVariant
    /** Spins the globe or pulses the data centers; a still frame when false or under reduced motion. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<BackdropProps>(), {
    variant: 'map',
    animated: true
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'backdrop')

  const backdrop = computed<BackdropVariant>(() => props.variant)

  const GLOBE_FRAME_CLASS =
    'relative aspect-square w-[min(calc(100cqh*1.25),150vw,var(--container-5xl))] shrink-0 translate-x-1/2 [mask-composite:intersect] ' +
    '[mask-image:linear-gradient(to_right,transparent_0%,black_20%),linear-gradient(to_bottom,transparent_11%,black_26%,black_74%,transparent_89%)] ' +
    'rtl:-translate-x-1/2 rtl:[mask-image:linear-gradient(to_left,transparent_0%,black_20%),linear-gradient(to_bottom,transparent_11%,black_26%,black_74%,transparent_89%)]'

  const MAP_MASK_CLASS =
    'absolute inset-0 [mask-composite:intersect] ' +
    '[mask-image:linear-gradient(to_right,transparent_0%,black_50%),linear-gradient(to_top,transparent_0%,black_25%)] ' +
    'rtl:[mask-image:linear-gradient(to_left,transparent_0%,black_50%),linear-gradient(to_top,transparent_0%,black_25%)]'

  const NETWORK_MASK_CLASS =
    'absolute inset-0 [mask-composite:intersect] ' +
    '[mask-image:linear-gradient(to_bottom,transparent_0%,black_18%),linear-gradient(to_right,transparent_0%,color-mix(in_srgb,black_28%,transparent)_22%,color-mix(in_srgb,black_72%,transparent)_40%,black_56%)] ' +
    'rtl:[mask-image:linear-gradient(to_bottom,transparent_0%,black_18%),linear-gradient(to_left,transparent_0%,color-mix(in_srgb,black_28%,transparent)_22%,color-mix(in_srgb,black_72%,transparent)_40%,black_56%)]'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="backdrop"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden [container-type:size]"
  >
    <template v-if="backdrop === 'globe'">
      <Texture />
      <div
        class="absolute inset-0 mx-auto flex w-full max-w-(--layout-measure-site) items-center justify-end"
      >
        <div :class="GLOBE_FRAME_CLASS">
          <SpinningGlobe
            :animated="animated"
            :scale="1"
            :opacity="0.6"
            density="high"
          />
        </div>
      </div>
    </template>

    <template v-else-if="backdrop === 'map'">
      <div
        data-slot="backdrop-fade"
        :class="MAP_MASK_CLASS"
      >
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
      </div>
    </template>

    <template v-else>
      <div
        data-slot="backdrop-fade"
        :class="NETWORK_MASK_CLASS"
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
      </div>
    </template>
  </div>
</template>
