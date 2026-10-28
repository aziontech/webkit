<script setup lang="ts">
  import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

  import { WORLD_LAND } from './world-land'

  defineOptions({ name: 'SpinningGlobe', inheritAttrs: false })

  interface Props {
    /** Seconds one full turn of the globe takes. */
    duration?: number
    /** Degrees the north pole leans toward the viewer. */
    tilt?: number
    /** Longitude, in degrees, facing the viewer on the first frame. */
    longitude?: number
    /** Accessible name; empty keeps the globe decorative and hidden from assistive tech. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    duration: 90,
    tilt: 12,
    longitude: -30,
    ariaLabel: ''
  })

  const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

  const GRID_STEP = Math.PI / 12
  const SAMPLE_STEP = Math.PI / 60

  let frame = 0
  let last = 0
  let turn = 0
  let visible = false
  let reduced = false
  const cleanups: Array<() => void> = []

  const draw = () => {
    const el = canvas.value
    const context = el?.getContext('2d')
    if (!el || !context || !el.width) return

    const style = getComputedStyle(el)
    const size = el.width
    const radius = size / 2 - 1
    const unit = radius / 302
    const center = size / 2
    const lean = (props.tilt * Math.PI) / 180
    const sinLean = Math.sin(lean)
    const cosLean = Math.cos(lean)
    const facing = (props.longitude * Math.PI) / 180 - turn

    // Orthographic: rotate about the polar axis, then lean the pole toward the viewer.
    const project = (lon: number, lat: number) => {
      const x = Math.cos(lat) * Math.sin(lon - facing)
      const y = Math.sin(lat)
      const z = Math.cos(lat) * Math.cos(lon - facing)
      return [center + radius * x, center - radius * (y * cosLean - z * sinLean), y * sinLean + z * cosLean]
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

    context.clearRect(0, 0, size, size)
    context.lineWidth = Math.max(0.74 * unit, 0.5)
    context.strokeStyle = style.getPropertyValue('--globe-grid')

    context.beginPath()
    context.arc(center, center, radius, 0, Math.PI * 2)
    context.fillStyle = style.getPropertyValue('--globe-ground')
    context.fill()
    context.stroke()

    context.beginPath()
    for (let lon = 0; lon < Math.PI * 2; lon += GRID_STEP) {
      const meridian: Array<[number, number]> = []
      for (let lat = -Math.PI / 2; lat <= Math.PI / 2 + 1e-9; lat += SAMPLE_STEP) meridian.push([lon, lat])
      trace(meridian)
    }
    for (let lat = -Math.PI / 2 + GRID_STEP; lat < Math.PI / 2 - 1e-9; lat += GRID_STEP) {
      const parallel: Array<[number, number]> = []
      for (let lon = 0; lon <= Math.PI * 2 + 1e-9; lon += SAMPLE_STEP) parallel.push([lon, lat])
      trace(parallel)
    }
    context.stroke()

    const dot = Math.max(1.35 * unit, 0.8)
    context.beginPath()
    for (const [lon, lat] of WORLD_LAND) {
      const [x, y, depth] = project(lon, lat)
      if (depth <= 0) continue
      context.moveTo(x + dot, y)
      context.arc(x, y, dot, 0, Math.PI * 2)
    }
    context.fillStyle = style.getPropertyValue('--globe-dot')
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
    if (visible && !reduced) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    } else draw()
  }

  const fit = () => {
    const el = canvas.value
    if (!el) return
    const size = Math.round(el.clientWidth * window.devicePixelRatio)
    if (size !== el.width) {
      el.width = size
      el.height = size
    }
    draw()
  }

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
  <canvas
    ref="canvas"
    v-bind="$attrs"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel || undefined"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    class="block aspect-square w-full [--globe-dot:var(--illustration-ink-muted)] [--globe-grid:var(--illustration-line)] [--globe-ground:var(--illustration-ground)]"
  />
</template>
