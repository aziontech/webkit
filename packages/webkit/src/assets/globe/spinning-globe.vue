<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useAttrs, useTemplateRef, watch } from 'vue'

  import type {
    NetworkMapDensity,
    NetworkMapFade,
    NetworkMapPosition,
    NetworkMapRegion
  } from '../../components/content/network-map/network-map.vue'
  import { NETWORK_MAP_REGIONS } from '../../components/content/network-map/network-map-data'
  import { GLOBE_CELL_DEGREES, GLOBE_LAND, GLOBE_NODE_TIERS, type GlobeNode } from './globe-data'

  defineOptions({ name: 'SpinningGlobe', inheritAttrs: false })

  interface Props {
    /** Which part of the world has its PoPs lit; the globe always shows the whole world. */
    region?: NetworkMapRegion
    /** How many PoPs are lit, from `none` to `high`. */
    density?: NetworkMapDensity
    /** Spins the globe; static when false. */
    animated?: boolean
    /** Opacity of the landmass dots, from 0 to 1; the PoPs stay at full strength. */
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
  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

  const DENSITY_TIERS: Record<NetworkMapDensity, (keyof typeof GLOBE_NODE_TIERS)[]> = {
    none: [],
    low: ['core'],
    medium: ['core', 'satellite'],
    high: ['core', 'satellite', 'extra']
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

  const GRID_STEP = Math.PI / 12
  const SAMPLE_STEP = Math.PI / 60
  const CELL_ARC = (GLOBE_CELL_DEGREES * Math.PI) / 180 / 2

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
    const el = canvas.value
    const context = el?.getContext('2d')
    if (!el || !context || !el.width || !el.height) return

    const style = getComputedStyle(el)
    const diameter = Math.min(el.width, el.height) * (props.scale > 0 ? props.scale : 1)
    const radius = diameter / 2 - 1
    const [anchorX, anchorY] = ANCHOR[props.position]
    const centerX = (el.width - diameter) * anchorX + diameter / 2 + props.offsetX * diameter
    const centerY = (el.height - diameter) * anchorY + diameter / 2 + props.offsetY * diameter
    const unit = radius / 302
    const lean = (props.tilt * Math.PI) / 180
    const sinLean = Math.sin(lean)
    const cosLean = Math.cos(lean)
    const facing = (props.longitude * Math.PI) / 180 - turn

    const project = (lon: number, lat: number) => {
      const x = Math.cos(lat) * Math.sin(lon - facing)
      const y = Math.sin(lat)
      const z = Math.cos(lat) * Math.cos(lon - facing)
      return [
        centerX + radius * x,
        centerY - radius * (y * cosLean - z * sinLean),
        y * sinLean + z * cosLean
      ]
    }

    const trace = (points: Array<[number, number]>) => {
      let pen = false
      for (const [lon, lat] of points) {
        const [x, y, depth] = project(lon, lat)
        if (depth < 0) {
          pen = false
          continue
        }
        if (pen) context.lineTo(x, y)
        else context.moveTo(x, y)
        pen = true
      }
    }

    context.clearRect(0, 0, el.width, el.height)
    context.lineWidth = Math.max(0.74 * unit, 0.5)
    context.strokeStyle = style.getPropertyValue('--globe-grid')

    context.beginPath()
    context.arc(centerX, centerY, radius, 0, Math.PI * 2)
    context.fillStyle = style.getPropertyValue('--globe-ground')
    context.fill()
    context.stroke()

    context.beginPath()
    for (let lon = 0; lon < Math.PI * 2; lon += GRID_STEP) {
      const meridian: Array<[number, number]> = []
      for (let lat = -Math.PI / 2; lat <= Math.PI / 2 + 1e-9; lat += SAMPLE_STEP)
        meridian.push([lon, lat])
      trace(meridian)
    }
    for (let lat = -Math.PI / 2 + GRID_STEP; lat < Math.PI / 2 - 1e-9; lat += GRID_STEP) {
      const parallel: Array<[number, number]> = []
      for (let lon = 0; lon <= Math.PI * 2 + 1e-9; lon += SAMPLE_STEP) parallel.push([lon, lat])
      trace(parallel)
    }
    context.stroke()

    const cell = Math.max(radius * CELL_ARC, 1)
    context.beginPath()
    for (const [lon, lat] of GLOBE_LAND) {
      const [x, y, depth] = project(lon, lat)
      if (depth <= 0) continue
      context.rect(x - cell / 2, y - cell / 2, cell, cell)
    }
    context.globalAlpha = Math.min(Math.max(props.opacity, 0), 1)
    context.fillStyle = style.color
    context.fill()
    context.globalAlpha = 1

    context.beginPath()
    for (const { point } of nodes.value) {
      const [x, y, depth] = project(point[0], point[1])
      if (depth <= 0) continue
      context.rect(x - cell / 2, y - cell / 2, cell, cell)
    }
    context.fillStyle = style.getPropertyValue('--globe-node')
    context.fill()
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
    const el = canvas.value
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
    const el = canvas.value
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
      ref="canvas"
      class="absolute inset-0 block h-full w-full"
    />
  </div>
</template>
