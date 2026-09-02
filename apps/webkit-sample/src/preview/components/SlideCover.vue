<script setup>
  // THE COVER — the deck's first slide, and the only one that draws its own perimeter.
  //
  // Every other slide is content inside the deck's square hairline frame. The cover is the
  // deck's identity, so it takes the brand shape instead: the same 1620x888 box, but with
  // rounded corners and its top-left corner cut away on the diagonal, three status squares
  // sitting in that cut, and the mark and the platform line on a band BELOW the frame rather
  // than inside it. The geometry is in lib/deck-canvas.js (`COVER`), measured off the
  // reference render, so the Figma build reads the same numbers this preview does.
  //
  // WHY THE FRAME IS AN SVG PATH AND NOT A BORDERED DIV
  //
  // A chamfered rounded rectangle is one closed path with five vertices, three of them at 90
  // degrees and two at 135. `clip-path` can cut that shape out of a bordered div, but it cuts
  // the border with it — the diagonal ends up with no rule along it and the corners lose
  // their join. Stroking the path draws the rule ON the shape, joints included, which is the
  // whole point of the perimeter. The stage scales uniformly, so the stroke keeps its weight
  // relative to the slide at any preview size.
  //
  // THE TEXTURE is the shared bank's `dither` — the same component the site's bands use, in
  // its own panel against the frame's right rule. It is a density ramp, so it is read as one
  // thing with the copy: the sparse end is at the top, where the frame's cut corner and the
  // marks are, and it thickens away from the words.
  import Brand from '@aziontech/webkit/brand'
  import Overline from '@aziontech/webkit/overline'
  import DitherBanner from '@shared/ui/banners/DitherBanner.vue'

  import { CONTENT, COVER, FRAME, FRAME_PADDING, span } from '../lib/deck-canvas.js'

  defineProps({
    slide: { type: Object, required: true }
  })

  // ── The frame's path ──────────────────────────────────────────────────────────────────
  //
  // The five vertices, clockwise from the top end of the diagonal cut. Every arc therefore
  // turns the same way (SVG sweep 1), and the two 135-degree joints take the smaller radius.
  //
  // The rules sit half a stroke inside the box, so the whole stroke lands inside FRAME the way
  // a CSS border does — an SVG clips at its viewport, so a path drawn on the edge itself would
  // lose its outer half and read as a hairline at half the weight asked for.
  const HALF = COVER.stroke / 2
  const VERTICES = [
    { x: COVER.chamfer, y: HALF, r: COVER.joint },
    { x: FRAME.width - HALF, y: HALF, r: COVER.radius },
    { x: FRAME.width - HALF, y: FRAME.height - HALF, r: COVER.radius },
    { x: HALF, y: FRAME.height - HALF, r: COVER.radius },
    { x: HALF, y: COVER.chamfer, r: COVER.joint }
  ]

  // A rounded polygon: at each vertex, back off along both edges by the tangent distance of a
  // circle of radius r inscribed in that angle (t = r / tan(angle / 2)), then arc between the
  // two tangent points. Deriving t from the angle is what lets one construction round a right
  // angle and a 135-degree joint to the same visual radius — a fixed backoff would make the
  // shallow joints look tighter than the corners.
  const framePath = (() => {
    const n = VERTICES.length
    const unit = (from, to) => {
      const dx = from.x - to.x
      const dy = from.y - to.y
      const length = Math.hypot(dx, dy)
      return { x: dx / length, y: dy / length }
    }

    const joints = VERTICES.map((vertex, i) => {
      const toPrev = unit(VERTICES[(i - 1 + n) % n], vertex)
      const toNext = unit(VERTICES[(i + 1) % n], vertex)
      const half =
        Math.acos(Math.min(1, Math.max(-1, toPrev.x * toNext.x + toPrev.y * toNext.y))) / 2
      const t = vertex.r / Math.tan(half)
      return {
        enter: { x: vertex.x + toPrev.x * t, y: vertex.y + toPrev.y * t },
        leave: { x: vertex.x + toNext.x * t, y: vertex.y + toNext.y * t },
        r: vertex.r
      }
    })

    const point = ({ x, y }) => `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`
    let d = `M ${point(joints[0].enter)}`
    for (let i = 0; i < n; i++) {
      d += ` A ${joints[i].r} ${joints[i].r} 0 0 1 ${point(joints[i].leave)}`
      d += i === n - 1 ? ' Z' : ` L ${point(joints[(i + 1) % n].enter)}`
    }
    return d
  })()

  const frameBox = {
    left: `${FRAME.x}px`,
    top: `${FRAME.y}px`,
    width: `${FRAME.width}px`,
    height: `${FRAME.height}px`
  }

  // The three squares live in the corner the diagonal removed, inset from both rules — the
  // same idea as the deck frame's registration ticks, at the size the cover's shape asks for.
  const MARKS = ['bg-(--primary)', 'bg-(--text-default)', 'bg-(--text-muted)']

  const markStyle = (i) => ({
    left: `${FRAME.x + COVER.marks.inset + i * (COVER.marks.size + COVER.marks.gap)}px`,
    top: `${FRAME.y + COVER.marks.inset}px`,
    width: `${COVER.marks.size}px`,
    height: `${COVER.marks.size}px`
  })

  // The texture panel: a run of grid columns held off the frame's right, top and bottom rules.
  // Right-aligned rather than placed on a column line, because what has to stay constant is
  // the gap to the rule it hangs off.
  const panelStyle = {
    left: `${FRAME.x + FRAME.width - COVER.panel.inset - span(COVER.panel.columns)}px`,
    top: `${FRAME.y + COVER.panel.inset}px`,
    width: `${span(COVER.panel.columns)}px`,
    height: `${FRAME.height - 2 * COVER.panel.inset}px`
  }

  // The copy sits in the frame's padding box, centred on the frame's own middle, and is capped
  // at half the grid so it can never run into the panel.
  const copyStyle = {
    left: `${CONTENT.x}px`,
    top: `${FRAME.y}px`,
    width: `${span(6)}px`,
    height: `${FRAME.height}px`
  }

  // The footer band is the strip the frame leaves below itself — one --spacing-xxl, the same
  // step as the frame's own inset — and it aligns to the frame's left rule, not to the copy.
  const footerStyle = {
    left: `${FRAME.x}px`,
    top: `${FRAME.y + FRAME.height}px`,
    width: `${FRAME.width}px`,
    height: `${COVER.footer.height}px`,
    paddingRight: `${FRAME_PADDING}px`
  }
</script>

<template>
  <!-- The perimeter. -->
  <svg
    aria-hidden="true"
    class="absolute"
    :style="frameBox"
    :viewBox="`0 0 ${FRAME.width} ${FRAME.height}`"
    fill="none"
  >
    <path
      :d="framePath"
      stroke="var(--border-strong)"
      :stroke-width="COVER.stroke"
    />
  </svg>

  <!-- The three squares in the cut corner. -->
  <span
    v-for="(ink, i) in MARKS"
    :key="ink"
    aria-hidden="true"
    class="absolute"
    :class="ink"
    :style="markStyle(i)"
  />

  <!-- The texture, in its own panel. DitherBanner fills its positioned ancestor, so the panel
       is what sizes it; the ramp is turned to run away from the copy. -->
  <div
    class="absolute overflow-hidden"
    :style="panelStyle"
  >
    <DitherBanner />
  </div>

  <!-- The copy block: overline, then the title, then one supporting line — the same anatomy and
       the same order as every content slide's header (SlideHeading), so the cover opens in the
       deck's voice instead of in a template's. The overline is the design system's own, `//`
       prefix and cursor included; it is the one orange thing on the slide.

       `text-heading-2xl` is the top of the type ladder. The reference cover sets its title
       larger than any token in the system, and a cover is not the place to invent a step the
       rest of the deck cannot use. -->
  <div
    class="absolute flex flex-col justify-center gap-(--spacing-lg)"
    :style="copyStyle"
  >
    <Overline
      v-if="slide.eyebrow"
      prefix="//"
      show-cursor
      >{{ slide.eyebrow }}</Overline
    >
    <h1 class="m-0 text-heading-2xl text-(--text-default)">{{ slide.headline }}</h1>
    <p
      v-if="slide.description"
      class="m-0 text-pretty text-heading-sm text-(--text-muted)"
    >
      {{ slide.description }}
    </p>
  </div>

  <!-- The mark and the platform line, below the frame. The line is set in the overline token —
       Proto Mono, uppercase, wide tracking — which is the same voice the site's own eyebrows
       take, and it is muted so the mark stays the brightest thing in the band. -->
  <footer
    class="absolute flex items-center gap-(--spacing-lg)"
    :style="footerStyle"
  >
    <Brand
      kind="default"
      size="small"
    />
    <span
      v-if="slide.tagline"
      class="text-overline-sm text-(--text-muted)"
      >{{ slide.tagline }}</span
    >
  </footer>
</template>
