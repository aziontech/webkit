<script setup>
  // THE SLIDE — a fixed 1920x1080 artboard, scaled to fit wherever it is shown.
  //
  // Two things make this the deck's foundation rather than just a box.
  //
  // 1. IT PINS THE THEME'S RESPONSIVE TOKENS. The spacing and type scales carry breakpoint
  //    maps resolved against the WINDOW, and a slide has no window: it is 1920 wide in a
  //    1280px browser and on a projector alike. Binding CANVAS_TOKENS as the stage's inline
  //    style re-declares those custom properties at their widest step, so every utility and
  //    every design-system component inside the slide resolves against the CANVAS instead of
  //    the viewport. Without it a slide previewed in a narrow window silently gets phone
  //    padding and phone type — correct CSS, wrong artboard.
  //
  // 2. IT IS SCALED, NEVER RESIZED. The stage keeps its 1920x1080 box and takes a CSS
  //    `scale()`, so every measurement inside it is a real Figma pixel. That is what lets the
  //    preview be the spec for the Figma build: 246px from the frame's edge here is 246 there.
  //    A responsive slide would have made the two impossible to reconcile.
  import FrameBox from '@aziontech/webkit/frame-box'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { CANVAS, CANVAS_TOKENS, FRAME } from '../lib/deck-canvas.js'

  const props = defineProps({
    /**
     * `width` fills the available width (the scrolling deck); `contain` fits both axes
     * (presenting); `none` renders the artboard at 1:1, which is what the PDF export prints.
     */
    fit: { type: String, default: 'width' },
    /** Draw the frame's hatch texture — the section dividers' identity. */
    hatch: { type: Boolean, default: false },
    /** Render the content across the whole canvas instead of inside the frame's padding box. */
    bleed: { type: Boolean, default: false },
    /** Draw the deck's frame. A slide that draws a perimeter of its own — the cover — passes false. */
    frame: { type: Boolean, default: true }
  })

  const host = ref(null)
  const box = ref({ width: 0, height: 0 })

  let observer = null

  onMounted(() => {
    if (props.fit === 'none') return
    observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      box.value = { width, height }
    })
    observer.observe(host.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  // Scale from the host's measured box. `width` mode drives the host's own height from the
  // result (the canvas is the only thing that knows its aspect ratio), which is why the host
  // cannot simply be `aspect-video`: a scaled child contributes no layout height at all.
  const scale = computed(() => {
    // `none` never measures: the artboard IS the box. This is the export path, where the host
    // is hidden off-screen until the print media query reveals it, so a measured scale would be
    // 0 — and a printed slide must be 1:1 anyway, or the PDF stops being the artboard.
    if (props.fit === 'none') return 1
    const { width, height } = box.value
    if (!width) return 0
    if (props.fit === 'contain' && height) {
      return Math.min(width / CANVAS.width, height / CANVAS.height)
    }
    return width / CANVAS.width
  })

  const hostStyle = computed(() => {
    if (props.fit === 'none') return { width: `${CANVAS.width}px`, height: `${CANVAS.height}px` }
    if (props.fit === 'width') return { height: `${CANVAS.height * scale.value}px` }
    return null
  })

  const hostClass = computed(() => {
    if (props.fit === 'contain') return 'size-full'
    if (props.fit === 'none') return ''
    return 'w-full'
  })

  const stageStyle = computed(() => {
    const k = scale.value
    const offsetX = props.fit === 'contain' ? (box.value.width - CANVAS.width * k) / 2 : 0
    const offsetY = props.fit === 'contain' ? (box.value.height - CANVAS.height * k) / 2 : 0
    return {
      ...CANVAS_TOKENS,
      width: `${CANVAS.width}px`,
      height: `${CANVAS.height}px`,
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${k})`
    }
  })

  const frameStyle = computed(() => ({
    left: `${FRAME.x}px`,
    top: `${FRAME.y}px`,
    width: `${FRAME.width}px`,
    height: `${FRAME.height}px`
  }))
</script>

<template>
  <div
    ref="host"
    :class="hostClass"
    class="relative overflow-hidden"
    :style="hostStyle"
  >
    <!-- The artboard. `origin-top-left` plus an explicit translate is what keeps the scaled
         box's top-left where the host's is, so a slide never drifts as the window changes. -->
    <div
      class="absolute left-0 top-0 origin-top-left bg-(--bg-canvas) text-(--text-default) antialiased"
      :style="stageStyle"
    >
      <slot name="canvas" />

      <!-- THE FRAME comes from the design system, not from this deck: FrameBox already draws
           the rules, the four registration ticks and the masked hatch, and it draws them the
           way every framed band on the marketing site does. The deck only positions it. -->
      <FrameBox
        v-if="frame"
        :hatch="hatch"
        class="absolute"
        :style="frameStyle"
      >
        <div
          class="flex h-full flex-col"
          :class="bleed ? '' : 'p-(--spacing-xxl)'"
        >
          <slot />
        </div>
      </FrameBox>

      <!-- A frameless slide gets the WHOLE canvas, not the frame's box: it draws its own
           perimeter, so its content is positioned against the artboard's edges and can put
           something (the cover's mark and tagline) outside the frame it drew. -->
      <div
        v-else
        class="absolute inset-0"
      >
        <slot />
      </div>

      <slot name="overlay" />
    </div>
  </div>
</template>
