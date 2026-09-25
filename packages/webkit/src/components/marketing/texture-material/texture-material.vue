<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'TextureMaterial',
    inheritAttrs: false
  })

  /** Which texture to paint. */
  export type TextureMaterialKind = 'dots' | 'grid' | 'lines' | 'dither' | 'pixelate' | 'none'

  /** Pitch step; each texture sets its own measured geometry per step. */
  export type TextureMaterialSize = 'small' | 'medium' | 'large'

  /** Axis the layer fades out along, so it meets content without a hard edge. */
  export type TextureMaterialFade = 'none' | 'top' | 'bottom' | 'edges' | 'vignette'

  interface Props {
    /** Which texture to paint; `none` renders the layer with no texture at all. */
    kind?: TextureMaterialKind
    /** Pitch of the tiling — how far apart the cells sit. */
    size?: TextureMaterialSize
    /** Fades the layer out along an axis so it meets content without a hard edge. */
    fade?: TextureMaterialFade
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'dots',
    size: 'medium',
    fade: 'none'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-texture-material'
  )

  // The 4x4 Bayer matrix. A rank is the sub-lattice that appears at that step of the
  // ramp, so dots LEAVE as the density drops instead of dimming — dispersed ranks are
  // what keep the sparse end scattered rather than striped.
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ]

  const ditherPlanes = BAYER.flatMap((row, y) => row.map((rank, x) => ({ rank, x, y })))

  const isDither = computed(() => props.kind === 'dither')
  const isPixelate = computed(() => props.kind === 'pixelate')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-fade="fade"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden data-[fade=bottom]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--texture-fade-start,8%),transparent_var(--texture-fade-end,55%))] data-[fade=top]:[mask-image:linear-gradient(to_top,black_0,black_var(--texture-fade-start,8%),transparent_var(--texture-fade-end,55%))] data-[fade=edges]:[mask-image:linear-gradient(to_right,transparent_0,black_var(--texture-fade-start,12%),black_calc(100%-var(--texture-fade-start,12%)),transparent_100%)] data-[fade=vignette]:[mask-image:radial-gradient(closest-side,black_var(--texture-fade-start,40%),transparent_var(--texture-fade-end,100%))] data-[fade=bottom]:[mask-mode:alpha] data-[fade=top]:[mask-mode:alpha] data-[fade=edges]:[mask-mode:alpha] data-[fade=vignette]:[mask-mode:alpha] [--texture-scale:1] data-[size=large]:[--texture-scale:2] data-[size=small]:[--texture-scale:0.5] data-[kind=dither]:[--texture-cell:calc(6px*var(--texture-scale))] data-[kind=dither]:[--texture-pitch:calc(24px*var(--texture-scale))] data-[kind=dots]:data-[size=small]:[--texture-cell:2px] data-[kind=dots]:data-[size=small]:[--texture-pitch:14px] data-[kind=dots]:data-[size=small]:[--texture-dot-ink:color-mix(in_srgb,var(--text-default)_30%,transparent)] data-[kind=dots]:data-[size=medium]:[--texture-cell:3px] data-[kind=dots]:data-[size=medium]:[--texture-pitch:22px] data-[kind=dots]:data-[size=medium]:[--texture-dot-ink:color-mix(in_srgb,var(--text-default)_38%,transparent)] data-[kind=dots]:data-[size=large]:[--texture-cell:4px] data-[kind=dots]:data-[size=large]:[--texture-pitch:32px] data-[kind=dots]:data-[size=large]:[--texture-dot-ink:color-mix(in_srgb,var(--text-default)_46%,transparent)] data-[kind=grid]:[--texture-pitch:calc(48px*var(--texture-scale))] data-[kind=lines]:data-[size=small]:[--texture-pitch:6px] data-[kind=lines]:data-[size=medium]:[--texture-pitch:8px] data-[kind=lines]:data-[size=large]:[--texture-pitch:14px] data-[kind=pixelate]:[--texture-cell:calc(5px*var(--texture-scale))] data-[kind=pixelate]:[--texture-pitch:calc(15px*var(--texture-scale))] data-[kind=dots]:[background-image:conic-gradient(at_var(--texture-cell)_var(--texture-cell),transparent_0_75%,var(--texture-ink,var(--texture-dot-ink))_75%_100%)] data-[kind=dots]:[background-position:calc(var(--texture-cell)/-2)_calc(var(--texture-cell)/-2)] data-[kind=dots]:[background-size:var(--texture-pitch)_var(--texture-pitch)] data-[kind=grid]:[background-image:linear-gradient(to_right,var(--texture-ink,color-mix(in_srgb,var(--text-default)_22%,transparent))_1px,transparent_1px),linear-gradient(to_bottom,var(--texture-ink,color-mix(in_srgb,var(--text-default)_22%,transparent))_1px,transparent_1px)] data-[kind=grid]:[background-size:var(--texture-pitch)_var(--texture-pitch)] data-[kind=lines]:[background-image:linear-gradient(to_right,var(--texture-ink,color-mix(in_srgb,var(--text-default)_6%,transparent))_1px,transparent_1px)] data-[kind=lines]:[background-size:var(--texture-pitch)_100%]"
  >
    <span
      v-for="plane in isDither ? ditherPlanes : []"
      :key="plane.rank"
      :style="{ '--col': plane.x, '--row': plane.y, '--rank': plane.rank }"
      class="absolute inset-0 [--texture-span:calc(var(--texture-to,0.92)-var(--texture-from,0.06))] [--texture-at:calc(((var(--rank)+0.5)/16-var(--texture-from,0.06))/var(--texture-span)*100%)] [--texture-soft:calc(100%/32/var(--texture-span))] [background-image:conic-gradient(at_var(--texture-cell)_var(--texture-cell),transparent_0_75%,var(--texture-ink,color-mix(in_srgb,var(--text-default)_85%,transparent))_75%_100%)] [background-position:calc(var(--col)*var(--texture-pitch))_calc(var(--row)*var(--texture-pitch))] [background-size:calc(4*var(--texture-pitch))_calc(4*var(--texture-pitch))] [mask-image:linear-gradient(var(--texture-direction,to_bottom),transparent_calc(var(--texture-at)-var(--texture-soft)),black_calc(var(--texture-at)+var(--texture-soft)))] [mask-mode:alpha]"
    />

    <div
      v-if="isPixelate"
      class="absolute inset-0 overflow-hidden [background-color:color-mix(in_srgb,var(--primary)_11%,transparent)] [background-image:radial-gradient(circle_at_var(--texture-pool-a,var(--texture-pool-x,86%)_94%),color-mix(in_srgb,var(--primary)_74%,transparent)_0%,color-mix(in_srgb,var(--primary)_44%,transparent)_24%,color-mix(in_srgb,var(--primary)_18%,transparent)_52%,transparent_88%),radial-gradient(circle_at_var(--texture-pool-b,var(--texture-pool-x,98%)_8%),color-mix(in_srgb,var(--primary)_50%,transparent)_0%,color-mix(in_srgb,var(--primary)_20%,transparent)_28%,transparent_62%)] [mask-image:conic-gradient(at_var(--texture-cell)_var(--texture-cell),transparent_0_75%,black_75%_100%)] [mask-mode:alpha] [mask-position:var(--texture-cell)_var(--texture-cell)] [mask-size:var(--texture-pitch)_var(--texture-pitch)]"
    >
      <div
        class="absolute inset-y-0 left-0 right-[-385.86px] animate-texture-wave-a will-change-transform [--texture-band:380px] [--texture-wave-shift:385.86px] [background-image:repeating-linear-gradient(100deg,transparent_0,color-mix(in_srgb,var(--primary)_18%,transparent)_calc(var(--texture-band)*0.28),color-mix(in_srgb,var(--primary)_50%,transparent)_calc(var(--texture-band)*0.5),color-mix(in_srgb,var(--primary)_18%,transparent)_calc(var(--texture-band)*0.72),transparent_var(--texture-band))] motion-reduce:animate-none"
      />
      <div
        class="absolute inset-y-0 left-[-264.01px] right-0 animate-texture-wave-b will-change-transform [--texture-band:260px] [--texture-wave-shift:264.01px] [background-image:repeating-linear-gradient(80deg,transparent_0,color-mix(in_srgb,var(--primary)_14%,transparent)_calc(var(--texture-band)*0.3),color-mix(in_srgb,var(--primary)_38%,transparent)_calc(var(--texture-band)*0.5),color-mix(in_srgb,var(--primary)_14%,transparent)_calc(var(--texture-band)*0.7),transparent_var(--texture-band))] motion-reduce:animate-none"
      />
    </div>
  </div>
</template>
