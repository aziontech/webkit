<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { networkMapMesh, type NetworkMapMeshRay } from './lib/network-map-mesh'
  import {
    NETWORK_MAP_ANCHOR,
    NETWORK_MAP_DENSITY_TIERS,
    NETWORK_MAP_LAND,
    NETWORK_MAP_REGIONS,
    NETWORK_MAP_TIERS
  } from './network-map-data'

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

  /** How many data centers are lit; `none` draws the landmass alone. */
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

  export interface NetworkMapProps {
    /** Which part of the world has its data centers lit; the map always frames the whole world. */
    region?: NetworkMapRegion
    /** How many data centers are lit, from `none` to `high`. */
    density?: NetworkMapDensity
    /** Pulses the data centers in three staggered waves that settle within five seconds; static when false. */
    animated?: boolean
    /** Opacity of the landmass dots, from 0 to 1; the data centers stay at full strength. */
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
    /** Draws traffic between lit data centers: faint links and, while `animated`, packets that cross them; the links alone under reduced motion. */
    traffic?: boolean
  }

  const props = withDefaults(defineProps<NetworkMapProps>(), {
    region: 'world',
    density: 'medium',
    animated: false,
    opacity: 0.4,
    position: 'center',
    scale: 0.85,
    offsetX: 0,
    offsetY: 0,
    fade: 'none',
    traffic: false
  })

  const attrs = useAttrs()

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

  const POP_CELL = /M(\d+) (\d+)h5v5h-5z/g

  const patternId = `network-map-${useId()}`

  const viewBox = computed(() => {
    const [x, y, width, height] = NETWORK_MAP_REGIONS.world.split(' ').map(Number)
    const factor = props.scale > 0 ? props.scale : 1
    const [anchorX, anchorY] = NETWORK_MAP_ANCHOR[props.position]
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
    return NETWORK_MAP_DENSITY_TIERS[props.density]
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

  const PACKET_TRAVEL = 0.45
  const MOTION_LIMIT = 4800

  const meshRays = computed<NetworkMapMeshRay[]>(() =>
    props.traffic
      ? networkMapMesh(
          popPhases.value.flatMap((pop) =>
            Array.from(pop.d.matchAll(POP_CELL)).map(([, x, y]) => ({
              x: Number(x) + 2.5,
              y: Number(y) + 2.5
            }))
          )
        )
      : []
  )

  const packetEls = ref<SVGPathElement[]>([])
  let packetAnimations: Animation[] = []
  let reducedMotion: MediaQueryList | null = null

  const packetIterations = (ray: NetworkMapMeshRay) => {
    const cycles = (MOTION_LIMIT + ray.delay) / ray.duration
    const landing = cycles - Math.floor(cycles)
    return landing >= PACKET_TRAVEL ? cycles : Math.floor(cycles)
  }

  const stopPackets = () => {
    packetAnimations.forEach((animation) => animation.cancel())
    packetAnimations = []
  }
  const startPackets = () => {
    stopPackets()
    if (!props.traffic || !props.animated || reducedMotion?.matches) return
    packetAnimations = packetEls.value.flatMap((el, index) => {
      const ray = meshRays.value[index]
      if (!ray || typeof el.animate !== 'function') return []
      return [
        el.animate(
          [
            { strokeDashoffset: 0, strokeDasharray: '0 200', offset: 0 },
            { strokeDashoffset: -50, strokeDasharray: '30 200', offset: 0.225 },
            { strokeDashoffset: -100, strokeDasharray: '0 200', offset: PACKET_TRAVEL },
            { strokeDashoffset: -100, strokeDasharray: '0 200', offset: 1 }
          ],
          {
            duration: ray.duration,
            delay: -ray.delay,
            iterations: packetIterations(ray),
            easing: 'linear'
          }
        )
      ]
    })
  }

  onMounted(() => {
    reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
    reducedMotion?.addEventListener('change', startPackets)
    startPackets()
  })
  onBeforeUnmount(() => {
    reducedMotion?.removeEventListener('change', startPackets)
    stopPackets()
  })
  watch(
    () => [props.traffic, props.animated, meshRays.value],
    () => startPackets(),
    { flush: 'post' }
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'network-map')

  const ROOT_CLASS =
    'pointer-events-none absolute inset-0 z-0 overflow-hidden text-(--text-muted) ' +
    'data-[fade=bottom]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--network-map-fade-start,16%),transparent_var(--network-map-fade-end,55%))] ' +
    'data-[fade=top]:[mask-image:linear-gradient(to_top,black_0,black_var(--network-map-fade-start,16%),transparent_var(--network-map-fade-end,55%))] ' +
    'data-[fade=left]:[mask-image:linear-gradient(to_left,black_0,black_var(--network-map-fade-start,50%),transparent_var(--network-map-fade-end,80%))] ' +
    'data-[fade=right]:[mask-image:linear-gradient(to_right,black_0,black_var(--network-map-fade-start,50%),transparent_var(--network-map-fade-end,80%))] ' +
    'data-[fade=edges]:[mask-image:linear-gradient(to_right,transparent_0,black_var(--network-map-fade-start,12%),black_calc(100%-var(--network-map-fade-start,12%)),transparent_100%)] ' +
    'data-[fade=vignette]:[mask-image:radial-gradient(closest-side,black_var(--network-map-fade-start,40%),transparent_var(--network-map-fade-end,100%))] ' +
    'data-[fade=bottom]:[mask-mode:alpha] data-[fade=top]:[mask-mode:alpha] data-[fade=left]:[mask-mode:alpha] data-[fade=right]:[mask-mode:alpha] data-[fade=edges]:[mask-mode:alpha] ' +
    'data-[fade=vignette]:[mask-mode:alpha]'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-region="region"
    :data-density="density"
    :data-fade="fade"
    aria-hidden="true"
    :class="ROOT_CLASS"
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
        class="fill-(--primary) data-[animated]:animate-pulse-settle data-[animated]:motion-reduce:animate-none data-[phase=1]:[animation-delay:350ms]! data-[phase=2]:[animation-delay:700ms]!"
      />
      <g
        v-if="meshRays.length"
        data-traffic
        fill="none"
      >
        <path
          v-for="ray in meshRays"
          :key="`link-${ray.key}`"
          :d="ray.d"
          data-traffic-link
          stroke="var(--border-strong)"
          stroke-width="1"
          :stroke-opacity="animated ? 0.12 : 0.24"
          vector-effect="non-scaling-stroke"
        />
        <path
          v-for="ray in meshRays"
          ref="packetEls"
          :key="`packet-${ray.key}`"
          :d="ray.d"
          data-traffic-packet
          stroke="var(--primary)"
          stroke-width="1.5"
          stroke-linecap="butt"
          pathLength="100"
          stroke-dasharray="0 200"
          stroke-dashoffset="-100"
          vector-effect="non-scaling-stroke"
        />
      </g>
    </svg>
  </div>
</template>
