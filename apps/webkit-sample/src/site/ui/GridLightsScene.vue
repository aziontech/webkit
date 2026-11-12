<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { useScrollProgress } from '../composables/useScrollProgress.js'
  import globeIcon from './assets/pi-globe.svg'

  defineOptions({ name: 'GridLightsScene' })

  interface Point {
    x: number
    y: number
  }

  interface Light {
    path: Point[]
    lengths: number[]
    total: number
    head: number
    color: string
  }

  const GRID_PITCH = 48
  const GRID_OVERSCAN = 176
  const GRID_SPEED = 18
  const SCROLL_DRIFT = 120
  const LIGHT_SPEED = 210
  const LIGHT_TAIL = 340
  const AREA_PER_LIGHT = 55000
  const FEWEST_LIGHTS = 3
  const MOST_LIGHTS = 9
  const SPAWN_EVERY = 0.45
  const MIN_CELLS = 4

  const scene = ref<HTMLElement | null>(null)
  const canvas = ref<HTMLCanvasElement | null>(null)
  const travel = ref(0)
  const { progress } = useScrollProgress(scene)

  const scrolled = computed(() => Math.max(-1, Math.min(1, progress.value)) * SCROLL_DRIFT)
  const gridStyle = computed(() => ({
    transform: `translate3d(0, ${scrolled.value - (travel.value % GRID_PITCH)}px, 0)`
  }))

  let lights: Light[] = []
  let sinceSpawn = SPAWN_EVERY
  let frame: number | null = null
  let last = 0
  let width = 0
  let height = 0
  let intersection: IntersectionObserver | null = null
  let resize: ResizeObserver | null = null

  const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

  const primaryColor = () =>
    scene.value ? getComputedStyle(scene.value).getPropertyValue('--primary').trim() : ''

  const tint = (color: string, alpha: number) =>
    `color-mix(in srgb, ${color} ${Math.round(Math.max(0, Math.min(1, alpha)) * 100)}%, transparent)`

  const lineOffset = () => -GRID_OVERSCAN + scrolled.value - travel.value

  const routeTo = (start: Point, target: Point): Point[] => {
    const dx = target.x - start.x
    const dy = target.y - start.y
    const horizontalFirst = Math.random() < 0.5
    const splitLeg = Math.random() < 0.6
    const split = (distance: number) => Math.round(distance * (0.3 + Math.random() * 0.4))
    const points: Point[] = [start]
    const push = (x: number, y: number) => {
      const prev = points[points.length - 1]
      if (prev.x !== x || prev.y !== y) points.push({ x, y })
    }
    if (horizontalFirst) {
      const first = splitLeg ? split(dx) : dx
      push(start.x + first, start.y)
      push(start.x + first, target.y)
      push(target.x, target.y)
    } else {
      const first = splitLeg ? split(dy) : dy
      push(start.x, start.y + first)
      push(target.x, start.y + first)
      push(target.x, target.y)
    }
    return points
  }

  const spawn = (): Light | null => {
    const color = primaryColor()
    const cols = Math.floor(width / GRID_PITCH)
    if (!color || cols < 3) return null
    const offset = lineOffset()
    const firstRow = Math.ceil(-offset / GRID_PITCH)
    const lastRow = Math.floor((height - offset) / GRID_PITCH)
    const targetX = Math.round((width / 2 - 0.5) / GRID_PITCH)
    const side = randomInt(0, 3)
    const start =
      side === 0
        ? { x: randomInt(0, cols), y: firstRow }
        : side === 1
          ? { x: randomInt(0, cols), y: lastRow }
          : { x: side === 2 ? 0 : cols, y: randomInt(firstRow, lastRow) }
    let targetY = Math.round((height / 2 - offset) / GRID_PITCH)
    for (let pass = 0; pass < 3; pass += 1) {
      const cells = Math.abs(targetX - start.x) + Math.abs(targetY - start.y)
      const arrival = (cells * GRID_PITCH) / LIGHT_SPEED
      const offsetThen = offset - GRID_SPEED * arrival
      targetY = Math.round((height / 2 - offsetThen) / GRID_PITCH)
    }
    if (Math.abs(targetX - start.x) + Math.abs(targetY - start.y) < MIN_CELLS) return null
    const path = routeTo(start, { x: targetX, y: targetY })
    const lengths = [0]
    for (let i = 1; i < path.length; i += 1) {
      const span = Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y)
      lengths.push(lengths[i - 1] + span * GRID_PITCH)
    }
    return { path, lengths, total: lengths[lengths.length - 1], head: 0, color }
  }

  const pointAt = (light: Light, distance: number): Point => {
    const d = Math.max(0, Math.min(light.total, distance))
    let i = 1
    while (i < light.lengths.length - 1 && light.lengths[i] < d) i += 1
    const from = light.path[i - 1]
    const to = light.path[i]
    const span = light.lengths[i] - light.lengths[i - 1] || 1
    const t = (d - light.lengths[i - 1]) / span
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
  }

  const draw = () => {
    const context = canvas.value?.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, width, height)
    const offset = lineOffset()
    const toScreen = (point: Point) => ({
      x: point.x * GRID_PITCH + 0.5,
      y: point.y * GRID_PITCH + offset + 0.5
    })
    context.lineCap = 'butt'
    context.lineWidth = 1.5
    for (const light of lights) {
      const tailStart = light.head - LIGHT_TAIL
      const from = Math.max(0, tailStart)
      const to = Math.min(light.total, light.head)
      if (from >= to) continue
      const alpha = (distance: number) =>
        Math.pow(Math.max(0, Math.min(1, (distance - tailStart) / LIGHT_TAIL)), 1.6)
      const stops = [from, ...light.lengths.filter((d) => d > from && d < to), to]
      context.shadowColor = light.color
      context.shadowBlur = 10
      for (let i = 1; i < stops.length; i += 1) {
        const a = toScreen(pointAt(light, stops[i - 1]))
        const b = toScreen(pointAt(light, stops[i]))
        const gradient = context.createLinearGradient(a.x, a.y, b.x, b.y)
        gradient.addColorStop(0, tint(light.color, alpha(stops[i - 1])))
        gradient.addColorStop(1, tint(light.color, alpha(stops[i])))
        context.strokeStyle = gradient
        context.beginPath()
        context.moveTo(a.x, a.y)
        context.lineTo(b.x, b.y)
        context.stroke()
      }
      if (light.head <= light.total) {
        const tip = toScreen(pointAt(light, light.head))
        context.shadowBlur = 16
        context.fillStyle = light.color
        context.beginPath()
        context.arc(tip.x, tip.y, 1.75, 0, Math.PI * 2)
        context.fill()
      }
    }
    context.shadowBlur = 0
  }

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const elapsed = last ? Math.min((now - last) / 1000, 0.1) : 0
    last = now
    travel.value += elapsed * GRID_SPEED
    sinceSpawn += elapsed
    lights = lights.filter((light) => light.head - LIGHT_TAIL < light.total)
    for (const light of lights) light.head += elapsed * LIGHT_SPEED
    const most = Math.max(
      FEWEST_LIGHTS,
      Math.min(MOST_LIGHTS, Math.round((width * height) / AREA_PER_LIGHT))
    )
    const fewest = Math.ceil(most * 0.6)
    if (lights.length < fewest || (lights.length < most && sinceSpawn >= SPAWN_EVERY)) {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const light = spawn()
        if (light) {
          lights.push(light)
          break
        }
      }
      sinceSpawn = 0
    }
    draw()
  }

  const start = () => {
    if (frame !== null) return
    last = 0
    frame = requestAnimationFrame(tick)
  }

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
  }

  const fitCanvas = (rect: DOMRectReadOnly) => {
    width = rect.width
    height = rect.height
    const el = canvas.value
    if (!el) return
    const ratio = window.devicePixelRatio || 1
    el.width = Math.round(width * ratio)
    el.height = Math.round(height * ratio)
    el.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
    draw()
  }

  onMounted(() => {
    if (!scene.value) return
    resize = new ResizeObserver(([entry]) => fitCanvas(entry.contentRect))
    resize.observe(scene.value)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    intersection = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    )
    intersection.observe(scene.value)
  })

  onBeforeUnmount(() => {
    stop()
    intersection?.disconnect()
    resize?.disconnect()
  })
</script>

<template>
  <div
    ref="scene"
    aria-hidden="true"
    class="pointer-events-none relative min-h-96 w-full overflow-hidden"
  >
    <div class="absolute inset-0 opacity-60">
      <div
        :style="gridStyle"
        class="absolute inset-x-0 -inset-y-44 will-change-transform"
      >
        <TextureMaterial
          kind="grid"
          size="medium"
          fade="none"
        />
      </div>
    </div>

    <canvas
      ref="canvas"
      class="absolute inset-0 block size-full"
    />

    <div
      class="absolute top-1/2 left-1/2 z-10 size-22.5 -translate-x-1/2 -translate-y-1/2 [--tile-scale:1.40625]"
    >
      <span
        class="absolute -top-8.25 -left-16.25 flex size-full items-center justify-center rounded-[calc(var(--radius-xl)*var(--tile-scale))] border-solid border-transparent [border-width:calc(var(--illustration-rim-width)*var(--tile-scale))] [background-clip:var(--illustration-rim-boxes)] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)]"
      >
        <Brand kind="reduced" />
      </span>
      <span
        class="relative flex size-full items-center justify-center rounded-[calc(var(--radius-xl)*var(--tile-scale))] border-solid border-transparent [border-width:calc(var(--illustration-rim-width)*var(--tile-scale))] [background-clip:var(--illustration-rim-boxes)] [background-image:var(--illustration-rim-layers-active)] [background-origin:var(--illustration-rim-boxes)]"
      >
        <img
          :src="globeIcon"
          alt=""
          width="45"
          height="45"
          class="block"
        />
      </span>
    </div>
  </div>
</template>
