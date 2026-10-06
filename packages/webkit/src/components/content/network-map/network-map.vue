<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { NETWORK_MAP_LAND, NETWORK_MAP_REGIONS, NETWORK_MAP_TIERS } from './network-map-data'

  defineOptions({ name: 'NetworkMap', inheritAttrs: false })

  /** Which part of the world the map frames. */
  export type NetworkMapRegion =
    | 'world'
    | 'atlantic'
    | 'americas'
    | 'north-america'
    | 'south-america'
    | 'europe'
    | 'africa'
    | 'asia'
    | 'oceania'

  /** How many PoPs are lit; `none` draws the landmass alone. */
  export type NetworkMapDensity = 'none' | 'low' | 'medium' | 'high'

  /** Where the framed region parks in the space the box leaves over. */
  export type NetworkMapPosition =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

  /** Axis the map fades out along, so it meets content without a hard edge. */
  export type NetworkMapFade = 'none' | 'top' | 'bottom' | 'left' | 'right' | 'edges' | 'vignette'

  interface Props {
    /** Which part of the world has its PoPs lit; the map always frames the whole world. */
    region?: NetworkMapRegion
    /** How many PoPs are lit, from `none` to `high`. */
    density?: NetworkMapDensity
    /** Pulses the PoPs in three staggered waves; static when false. */
    animated?: boolean
    /** Opacity of the landmass dots, from 0 to 1; the PoPs stay at full strength. */
    opacity?: number
    /** Where the map parks in the space the box leaves over. */
    position?: NetworkMapPosition
    /** Size of the map relative to the box; 1 fits it, below 1 shrinks it toward its position, above 1 enlarges it. */
    scale?: number
    /** Horizontal shift as a fraction of the map width; negative moves it left, positive right, past the box edge if large enough. */
    offsetX?: number
    /** Vertical shift as a fraction of the map height; negative moves it up, positive down, past the box edge if large enough. */
    offsetY?: number
    /** Fades the map out along an axis so it meets content without a hard edge. */
    fade?: NetworkMapFade
  }

  const props = withDefaults(defineProps<Props>(), {
    region: 'world',
    density: 'medium',
    animated: false,
    opacity: 0.4,
    position: 'center',
    scale: 0.85,
    offsetX: 0,
    offsetY: 0,
    fade: 'none'
  })

  const attrs = useAttrs()

  const DENSITY_TIERS: Record<NetworkMapDensity, (keyof typeof NETWORK_MAP_TIERS)[]> = {
    none: [],
    low: ['core'],
    medium: ['core', 'satellite'],
    high: ['core', 'satellite', 'extra']
  }

  const ALIGNMENT: Record<NetworkMapPosition, string> = {
    center: 'xMidYMid',
    top: 'xMidYMin',
    bottom: 'xMidYMax',
    left: 'xMinYMid',
    right: 'xMaxYMid',
    'top-left': 'xMinYMin',
    'top-right': 'xMaxYMin',
    'bottom-left': 'xMinYMax',
    'bottom-right': 'xMaxYMax'
  }

  const ANCHOR: Record<NetworkMapPosition, [number, number]> = {
    center: [0.5, 0.5],
    top: [0.5, 0],
    bottom: [0.5, 1],
    left: [0, 0.5],
    right: [1, 0.5],
    'top-left': [0, 0],
    'top-right': [1, 0],
    'bottom-left': [0, 1],
    'bottom-right': [1, 1]
  }

  const POP_CELL = /M(\d+) (\d+)h5v5h-5z/g

  const patternId = `network-map-${useId()}`

  const viewBox = computed(() => {
    const [x, y, width, height] = NETWORK_MAP_REGIONS.world.split(' ').map(Number)
    const factor = props.scale > 0 ? props.scale : 1
    const [anchorX, anchorY] = ANCHOR[props.position]
    const scaledWidth = width / factor
    const scaledHeight = height / factor
    const left = x - (scaledWidth - width) * anchorX - props.offsetX * width
    const top = y - (scaledHeight - height) * anchorY - props.offsetY * height
    return `${left} ${top} ${scaledWidth} ${scaledHeight}`
  })

  const popPhases = computed(() => {
    const [x, y, width, height] = NETWORK_MAP_REGIONS[props.region].split(' ').map(Number)
    const inRegion = (cellX: number, cellY: number) =>
      cellX >= x && cellX < x + width && cellY >= y && cellY < y + height
    return DENSITY_TIERS[props.density]
      .flatMap((tier) =>
        NETWORK_MAP_TIERS[tier].map((d, phase) => ({
          key: `${tier}-${phase}`,
          phase,
          d: Array.from(d.matchAll(POP_CELL))
            .filter(([, cellX, cellY]) => inRegion(Number(cellX), Number(cellY)))
            .map(([cell]) => cell)
            .join('')
        }))
      )
      .filter((pop) => pop.d.length > 0)
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-network-map'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-region="region"
    :data-density="density"
    :data-fade="fade"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden text-(--text-muted) data-[fade=bottom]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--network-map-fade-start,16%),transparent_var(--network-map-fade-end,55%))] data-[fade=top]:[mask-image:linear-gradient(to_top,black_0,black_var(--network-map-fade-start,16%),transparent_var(--network-map-fade-end,55%))] data-[fade=left]:[mask-image:linear-gradient(to_left,black_0,black_var(--network-map-fade-start,50%),transparent_var(--network-map-fade-end,80%))] data-[fade=right]:[mask-image:linear-gradient(to_right,black_0,black_var(--network-map-fade-start,50%),transparent_var(--network-map-fade-end,80%))] data-[fade=edges]:[mask-image:linear-gradient(to_right,transparent_0,black_var(--network-map-fade-start,12%),black_calc(100%-var(--network-map-fade-start,12%)),transparent_100%)] data-[fade=vignette]:[mask-image:radial-gradient(closest-side,black_var(--network-map-fade-start,40%),transparent_var(--network-map-fade-end,100%))] data-[fade=bottom]:[mask-mode:alpha] data-[fade=top]:[mask-mode:alpha] data-[fade=left]:[mask-mode:alpha] data-[fade=right]:[mask-mode:alpha] data-[fade=edges]:[mask-mode:alpha] data-[fade=vignette]:[mask-mode:alpha]"
  >
    <svg
      :viewBox="viewBox"
      :preserveAspectRatio="`${ALIGNMENT[position]} meet`"
      class="absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern
          :id="patternId"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect
            width="5"
            height="5"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <path
        :d="NETWORK_MAP_LAND"
        :fill="`url(#${patternId})`"
        :opacity="opacity"
      />
      <path
        v-for="pop in popPhases"
        :key="pop.key"
        :d="pop.d"
        :data-phase="pop.phase"
        :data-animated="animated || null"
        class="fill-(--primary) data-[animated]:animate-pulse data-[animated]:motion-reduce:animate-none data-[phase=1]:[animation-delay:700ms]! data-[phase=2]:[animation-delay:1400ms]!"
      />
    </svg>
  </div>
</template>
