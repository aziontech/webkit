<script setup>
  // Animated ASCII-art globe rendered to a <canvas>, used as the hero backdrop.
  // A rotating wireframe sphere is sampled onto a monospace character grid: base
  // latitude/longitude points render as faint gray glyphs, node anchors pulse in
  // the brand accent, and great-circle arcs sweep travelling "packets" between
  // them — evoking a global edge network. The canvas is transparent (it clears
  // each frame) so it layers over the section's own background.
  //
  // Adapted from a standalone canvas banner into a lifecycle-correct SFC:
  // devicePixelRatio-aware sizing, ResizeObserver, prefers-reduced-motion (draws
  // a single static frame, no rAF loop), and full teardown on unmount.
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const props = defineProps({
    /** Accent color for nodes and arcs (brand orange by default). */
    accent: { type: String, default: '#f3652b' },
    /** Base glyph size in px — drives the character-grid density. */
    cell: { type: Number, default: 11 },
    /** Rotation speed multiplier. */
    speed: { type: Number, default: 0.28 },
    /** Number of pulsing node anchors on the sphere. */
    nodes: { type: Number, default: 18 },
    /** Number of great-circle arcs sweeping between nodes. */
    arcs: { type: Number, default: 16 },
    /** Character ramp, darkest → brightest. */
    ramp: { type: String, default: ' 01' }
  })

  const canvasEl = ref(null)

  // A small deterministic PRNG so the node/arc layout is stable across reloads.
  function seeded(s) {
    return function () {
      s = (s * 1664525 + 1013904223) & 0x7fffffff
      return s / 0x7fffffff
    }
  }

  function hexRgb(h) {
    h = h.replace('#', '')
    if (h.length === 3) {
      h = h
        .split('')
        .map((c) => c + c)
        .join('')
    }
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }

  let ctx = null
  let raf = null
  let running = false
  let startTime = 0
  let resizeObserver = null
  let motionQuery = null

  // Geometry / grid state, populated by resize() + build().
  let W = 0
  let H = 0
  let cellW = 0
  let cellH = 0
  let cols = 0
  let rows = 0
  let bright = new Float32Array(0)
  let kind = new Uint8Array(0) // 0 base · 1 node · 2 arc
  let nodeSeed = []
  let arcPairs = []
  const accentRgb = ref([243, 101, 43])

  function build() {
    const rnd = seeded(1337)
    const N = Math.max(props.nodes, props.arcs * 2, 1)
    // Fibonacci-sphere distribution for evenly-spread unit vectors.
    nodeSeed = []
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / Math.max(N - 1, 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const th = i * 2.399963
      nodeSeed.push([Math.cos(th) * r, y, Math.sin(th) * r])
    }
    arcPairs = []
    for (let a = 0; a < props.arcs; a++) {
      arcPairs.push([Math.floor(rnd() * N), Math.floor(rnd() * N), rnd()])
    }
  }

  function resize() {
    const canvas = canvasEl.value
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    W = rect.width || canvas.width
    H = rect.height || canvas.height
    canvas.width = Math.floor(W * dpr)
    canvas.height = Math.floor(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = props.cell + 'px ui-monospace,Menlo,Consolas,monospace'
    cellW = Math.max(4, ctx.measureText('M').width)
    cellH = props.cell * 1.08
    cols = Math.max(8, Math.floor(W / cellW))
    rows = Math.max(8, Math.floor(H / cellH))
    bright = new Float32Array(cols * rows)
    kind = new Uint8Array(cols * rows)
  }

  // Deposit brightness at a pixel position, keeping the brightest hit per cell.
  function put(cx, cy, b, k) {
    const col = Math.round(cx / cellW)
    const row = Math.round(cy / cellH)
    if (col < 0 || col >= cols || row < 0 || row >= rows) return
    const idx = row * cols + col
    if (b > bright[idx]) {
      bright[idx] = b
      if (k) kind[idx] = k
    } else if (k > kind[idx]) {
      kind[idx] = k
    }
  }

  function globe(t) {
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(W, H) * 0.36
    const ang = t * 0.00022 * props.speed
    const tilt = 0.42
    const latN = 46
    const lonN = 90

    for (let i = 0; i <= latN; i++) {
      const lat = -Math.PI / 2 + (Math.PI * i) / latN
      for (let j = 0; j < lonN; j++) {
        const lon = (2 * Math.PI * j) / lonN + ang
        const x = Math.cos(lat) * Math.cos(lon)
        const y = Math.sin(lat)
        const z = Math.cos(lat) * Math.sin(lon)
        const z2 = y * Math.sin(tilt) + z * Math.cos(tilt)
        const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
        const b = 0.18 + 0.55 * ((z2 + 1) / 2)
        put(cx + x * R, cy - y2 * R, b, 0)
      }
    }

    // Rotate a unit vector by the current spin + fixed tilt.
    const rot = (p) => {
      const x = p[0] * Math.cos(ang) + p[2] * Math.sin(ang)
      const z = -p[0] * Math.sin(ang) + p[2] * Math.cos(ang)
      const y = p[1]
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt)
      return [x, y2, z2]
    }

    for (let n = 0; n < props.nodes && n < nodeSeed.length; n++) {
      const q = rot(nodeSeed[n])
      const pulse = 0.7 + 0.3 * Math.sin(t * 0.003 + n)
      put(cx + q[0] * R, cy - q[1] * R, (q[2] > -0.2 ? 1 : 0.6) * pulse, 1)
    }

    // Great-circle arcs (slerp) with a travelling bright head.
    for (let a = 0; a < arcPairs.length; a++) {
      const A = nodeSeed[arcPairs[a][0]]
      const B = nodeSeed[arcPairs[a][1]]
      if (!A || !B) continue
      const dot = Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]))
      const om = Math.acos(dot)
      if (om < 0.05) continue
      const so = Math.sin(om)
      const steps = 26
      const head = (t * 0.0006 * props.speed + arcPairs[a][2]) % 1
      for (let s = 0; s <= steps; s++) {
        const f = s / steps
        const k1 = Math.sin((1 - f) * om) / so
        const k2 = Math.sin(f * om) / so
        const p = rot([A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2])
        if (p[2] < -0.15) continue
        let d = Math.abs(f - head)
        d = Math.min(d, 1 - d)
        const b = 0.3 + 0.65 * Math.max(0, 1 - d * 7)
        put(cx + p[0] * R, cy - p[1] * R, b, 2)
      }
    }
  }

  function draw() {
    if (!ctx) return
    ctx.clearRect(0, 0, W, H)
    ctx.textBaseline = 'top'
    const ac = accentRgb.value
    const ramp = props.ramp
    const L = ramp.length - 1
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col
        const b = bright[idx]
        if (b <= 0.02) continue
        const ch = ramp[Math.max(0, Math.min(L, Math.round(b * L)))]
        if (ch === ' ') continue
        const k = kind[idx]
        if (k > 0) {
          ctx.shadowColor = props.accent
          ctx.shadowBlur = 10 * (k === 1 ? 1 : 0.6)
          ctx.fillStyle = 'rgba(' + ac[0] + ',' + ac[1] + ',' + ac[2] + ',' + (0.55 + 0.45 * b) + ')'
        } else {
          ctx.shadowBlur = 0
          const g = 0.14 + 0.5 * b
          ctx.fillStyle = 'rgba(150,166,182,' + g + ')'
        }
        ctx.fillText(ch, col * cellW, row * cellH)
      }
    }
    ctx.shadowBlur = 0
  }

  function frame(now) {
    const t = now - startTime
    bright.fill(0)
    kind.fill(0)
    globe(t)
    draw()
    if (running) raf = requestAnimationFrame(frame)
  }

  function play() {
    if (running) return
    running = true
    startTime = window.performance.now()
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = null
  }

  // Render one static frame — used under prefers-reduced-motion.
  function renderStatic() {
    bright.fill(0)
    kind.fill(0)
    globe(0)
    draw()
  }

  function applyMotionPreference() {
    if (motionQuery && motionQuery.matches) {
      stop()
      renderStatic()
    } else {
      play()
    }
  }

  function handleResize() {
    resize()
    if (!running) renderStatic()
  }

  onMounted(() => {
    const canvas = canvasEl.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    accentRgb.value = hexRgb(props.accent)
    resize()
    build()

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', applyMotionPreference)
    applyMotionPreference()
  })

  onBeforeUnmount(() => {
    stop()
    if (resizeObserver) resizeObserver.disconnect()
    if (motionQuery) motionQuery.removeEventListener('change', applyMotionPreference)
    resizeObserver = null
    motionQuery = null
    ctx = null
  })
</script>

<template>
  <canvas
    ref="canvasEl"
    aria-hidden="true"
    class="block size-full"
  />
</template>
