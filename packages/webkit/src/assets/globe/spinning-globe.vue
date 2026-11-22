<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useAttrs, useTemplateRef, watch } from 'vue'

  import type {
    NetworkMapDensity,
    NetworkMapFade,
    NetworkMapPosition,
    NetworkMapRegion
  } from '../../components/content/network-map/network-map.vue'
  import { NETWORK_MAP_REGIONS } from '../../components/content/network-map/network-map-data'
  import { GLOBE_NODE_TIERS, type GlobeNode } from './globe-data'
  import { drawGlobe } from './lib/draw-globe'

  defineOptions({ name: 'SpinningGlobe', inheritAttrs: false })

  interface Props {
    /** Which part of the world has its data centers lit; the globe always shows the whole world. */
    region?: NetworkMapRegion
    /** How many data centers are lit, from `none` to `high`. */
    density?: NetworkMapDensity
    /** Spins the globe; static when false. */
    animated?: boolean
    /** Opacity of the landmass dots, from 0 to 1; the data centers stay at full strength. */
    opacity?: number
    /** Where the globe parks in the space the box leaves over. */
    position?: NetworkMapPosition
    /** Size of the globe relative to the box; 1 fits it, below 1 shrinks it toward its position, above 1 enlarges it. */
    scale?: number
    /** Horizontal shift as a fraction of the globe width; negative moves it left, positive right, past the box edge if large enough. */
    offsetX?: number
    /** Vertical shift as a fraction of the globe height; negative moves it up, positive down, past the box edge if large enough. */
    offsetY?: number
    /** Fades the globe out along an axis so it meets content without a hard edge. */
    fade?: NetworkMapFade
    /** Seconds one full turn of the globe takes. */
    duration?: number
    /** Degrees the north pole leans toward the viewer. */
    tilt?: number
    /** Longitude, in degrees, facing the viewer on the first frame. */
    longitude?: number
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
    fade: 'none',
    duration: 60,
    tilt: 12,
    longitude: -30
  })

  const attrs = useAttrs()
  const canvasEl = useTemplateRef<HTMLCanvasElement>('canvasEl')

  const DENSITY_TIERS: Record<NetworkMapDensity, (keyof typeof GLOBE_NODE_TIERS)[]> = {
    none: [],
    low: ['core'],
    medium: ['core', 'satellite'],
    high: ['core', 'satellite', 'extra']
  }

  const nodes = computed<readonly GlobeNode[]>(() => {
    const [x, y, width, height] = NETWORK_MAP_REGIONS[props.region].split(' ').map(Number)
    return DENSITY_TIERS[props.density]
      .flatMap((tier) => GLOBE_NODE_TIERS[tier])
      .filter((node) => node.x >= x && node.x < x + width && node.y >= y && node.y < y + height)
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'assets-spinning-globe'
  )

  let frame = 0
  let last = 0
  let turn = 0
  let visible = false
  let reduced = false
  const cleanups: Array<() => void> = []

  const draw = () => {
    const el = canvasEl.value
    if (!el) return
    drawGlobe(el, props, nodes.value, turn)
  }

  const tick = (now: number) => {
    turn += ((now - last) / 1000 / props.duration) * Math.PI * 2
    last = now
    draw()
    frame = requestAnimationFrame(tick)
  }

  const sync = () => {
    cancelAnimationFrame(frame)
    frame = 0
    if (props.animated && visible && !reduced) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    } else draw()
  }

  const fit = () => {
    const el = canvasEl.value
    if (!el) return
    const width = Math.round(el.clientWidth * window.devicePixelRatio)
    const height = Math.round(el.clientHeight * window.devicePixelRatio)
    if (width !== el.width || height !== el.height) {
      el.width = width
      el.height = height
    }
    draw()
  }

  watch(
    () => [
      nodes.value,
      props.opacity,
      props.position,
      props.scale,
      props.offsetX,
      props.offsetY,
      props.tilt,
      props.longitude
    ],
    draw
  )

  watch(() => props.animated, sync)

  onMounted(() => {
    const el = canvasEl.value
    if (!el) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => {
      reduced = motion.matches
      sync()
    }
    motion.addEventListener('change', onMotion)
    cleanups.push(() => motion.removeEventListener('change', onMotion))

    const resize = new ResizeObserver(fit)
    resize.observe(el)
    cleanups.push(() => resize.disconnect())

    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    view.observe(el)
    cleanups.push(() => view.disconnect())

    reduced = motion.matches
    fit()
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    cleanups.forEach((cleanup) => cleanup())
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-region="region"
    :data-density="density"
    :data-fade="fade"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden text-(--text-muted) [--globe-node:var(--primary)] [--globe-grid:var(--illustration-line)] [--globe-ground:var(--illustration-ground)] data-[fade=bottom]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--network-map-fade-start,16%),transparent_var(--network-map-fade-end,55%))] data-[fade=top]:[mask-image:linear-gradient(to_top,black_0,black_var(--network-map-fade-start,16%),transparent_var(--network-map-fade-end,55%))] data-[fade=left]:[mask-image:linear-gradient(to_left,black_0,black_var(--network-map-fade-start,50%),transparent_var(--network-map-fade-end,80%))] data-[fade=right]:[mask-image:linear-gradient(to_right,black_0,black_var(--network-map-fade-start,50%),transparent_var(--network-map-fade-end,80%))] data-[fade=edges]:[mask-image:linear-gradient(to_right,transparent_0,black_var(--network-map-fade-start,12%),black_calc(100%-var(--network-map-fade-start,12%)),transparent_100%)] data-[fade=vignette]:[mask-image:radial-gradient(closest-side,black_var(--network-map-fade-start,40%),transparent_var(--network-map-fade-end,100%))] data-[fade=bottom]:[mask-mode:alpha] data-[fade=top]:[mask-mode:alpha] data-[fade=left]:[mask-mode:alpha] data-[fade=right]:[mask-mode:alpha] data-[fade=edges]:[mask-mode:alpha] data-[fade=vignette]:[mask-mode:alpha]"
  >
    <canvas
      ref="canvasEl"
      class="absolute inset-0 block h-full w-full"
    />
  </div>
</template>
