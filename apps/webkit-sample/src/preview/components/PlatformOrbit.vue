<script setup>
  // THE PLATFORM, DRAWN FLAT — one plate in the middle, seven things around it, straight
  // lines between.
  //
  // The deck's other radial drawing is the opposite argument and therefore the opposite
  // drawing. `ToolConstellation` scatters nine marks on a golden-angle spiral and wires them
  // to each other with MapMesh's bowed, seeded links: the tangle IS the claim, and nothing in
  // it is regular on purpose. This one says a platform sits between everything, so it is
  // regular on purpose — equal seats on one circle, one straight spoke each, every line
  // meeting the same point. Any curve, any mesh, any second hop would argue the other slide's
  // case. That is the whole reason there is no shared component between the two.
  //
  // ── WHAT IS ROUND AND WHAT IS SQUARE ──
  //
  // The platform is the circle; the world around it is squares. Two shapes, one distinction,
  // and it is the diagram's only piece of coding — a seat is a `--shape-card` tile like every
  // other panel in this deck, and the one round thing on the slide is the thing the spokes
  // converge on. The reference render draws all eight as discs and separates them by fill,
  // which needs colour to carry the difference; shape carries it here, so the fills stay the
  // deck's own three-step ladder (canvas, surface, raised).
  //
  // ── THE HUB IS DARK, AND THAT IS A CONSTRAINT, NOT A PREFERENCE ──
  //
  // The reference puts a white AZION wordmark in a filled orange disc. `Brand` has no
  // monochrome lockup — all three kinds ship hardcoded fills (five paths at the brand orange
  // plus one white), the component exposes no colour, and filtering a brand asset is not a
  // thing this deck does (the cover records the same finding). So the mark cannot go on
  // orange. It goes on the raised surface instead, inside a 2px orange rule — the accent
  // states the platform as an EDGE and as seven spokes, and the mark is left as it ships.
  //
  // ── THE GEOMETRY IS SOLVED, NOT PLACED ──
  //
  // Nothing here is a nudged coordinate. The seats are `n` equal turns from twelve o'clock,
  // the radius is the largest one whose furthest node — tile plus caption — still lands
  // inside the box, and the centre is then wherever it has to be for the drawing's own
  // bounding box to sit centred. Add or drop a node in data/deck.js and the wheel re-solves:
  // seven seats become eight, the radius shrinks by however much the new extremes need, and
  // the Figma build reads the same numbers out of the same function.
  //
  // A CAPTION IS ALWAYS OUTWARD — above a seat in the upper half, below one in the lower — so
  // it never crosses the spoke that arrives at it. Captions beside the seats, the way the
  // reference sets them, is the arrangement that does not fit: a label is ~200px and the
  // widest seats sit at 0.97 of the radius, so paying for it on the horizontal costs more
  // than half the wheel.
  import Brand from '@aziontech/webkit/brand'
  import { computed } from 'vue'

  const props = defineProps({
    /** The box the drawing fills, in canvas pixels — the drawing's own user units. */
    box: { type: Object, required: true },
    /** One seat per entry, clockwise from twelve o'clock: `{ label, icon }`. */
    nodes: { type: Array, required: true }
  })

  /** The seat: a square tile with the glyph centred in it. */
  const TILE = 88

  /** The platform: the disc's diameter, and the width the wordmark is drawn at inside it. */
  const HUB = { size: 240, mark: 144 }

  // The caption's FOOTPRINT, which is what the radius is solved against — not what the caption
  // is styled with. `height` is the overline-md line box on this canvas (14px at 1.375, so 19.3
  // rounded up), `gap` is the `--spacing-md` the template sets, and `width` is the widest label
  // the deck data carries at that step — 'Enterprise Networks' measures 200.5px uppercase in
  // Proto Mono at that tracking, so 208 leaves it a little air. The element takes its own width
  // and never wraps, so a longer label overflows the reserved box visibly instead of silently
  // re-flowing the wheel.
  const CAPTION = { width: 208, height: 20, gap: 16 }

  /** Twelve o'clock. Seats run clockwise from here, which is the order the deck data is read in. */
  const START = -Math.PI / 2

  const wheel = computed(() => {
    const count = props.nodes.length
    const caption = CAPTION.gap + CAPTION.height
    const seats = Array.from({ length: count }, (_, index) => {
      const angle = START + (index * 2 * Math.PI) / count
      return { cos: Math.cos(angle), sin: Math.sin(angle) }
    })

    // The radius the box can hold. Each axis is solved once, from the SPAN of the seats on it
    // (for seven seats the vertical span is 1.90 radii, not 2 — no seat sits at six o'clock)
    // plus the footprint the two extreme seats need beyond it. Both extremes are given the
    // tallest and widest footprint any seat can have, which is conservative by at most one
    // caption and keeps the solve to one expression per axis.
    const sins = seats.map((seat) => seat.sin)
    const coss = seats.map((seat) => seat.cos)
    const radius = Math.min(
      (props.box.height - TILE - 2 * caption) / (Math.max(...sins) - Math.min(...sins)),
      (props.box.width - CAPTION.width) / (Math.max(...coss) - Math.min(...coss))
    )

    const placed = seats.map(({ cos, sin }) => ({
      dx: cos * radius,
      dy: sin * radius,
      // Upper half takes its caption above, lower half below — outward in both cases.
      above: sin < 0
    }))

    // The drawing's own bounding box, measured off the seats that actually reach furthest, and
    // then centred in the box. Solving the radius already made one axis flush; this is what
    // stops the OTHER axis from hanging all of its slack off one edge.
    const reach = (extent) => Math.max(...placed.map(extent))
    const top = reach((seat) => -seat.dy + TILE / 2 + (seat.above ? caption : 0))
    const bottom = reach((seat) => seat.dy + TILE / 2 + (seat.above ? 0 : caption))
    const left = reach((seat) => -seat.dx + CAPTION.width / 2)
    const right = reach((seat) => seat.dx + CAPTION.width / 2)

    const centre = {
      x: (props.box.width + left - right) / 2,
      y: (props.box.height + top - bottom) / 2
    }

    return {
      radius,
      centre,
      seats: placed.map((seat) => ({
        ...seat,
        x: centre.x + seat.dx,
        y: centre.y + seat.dy
      }))
    }
  })

  const px = (value) => `${value.toFixed(1)}px`

  const hubStyle = computed(() => ({
    left: px(wheel.value.centre.x - HUB.size / 2),
    top: px(wheel.value.centre.y - HUB.size / 2),
    width: px(HUB.size),
    height: px(HUB.size)
  }))

  const markStyle = { width: px(HUB.mark) }

  const seatStyle = (seat) => ({
    left: px(seat.x - TILE / 2),
    top: px(seat.y - TILE / 2),
    width: px(TILE),
    height: px(TILE)
  })
</script>

<template>
  <div class="absolute inset-0">
    <!-- THE RULES. One svg for both, because they are one construction: the circle the seats
         are threaded on, and the spokes from the centre to each of them. The spokes are drawn
         from the CENTRE rather than from the hub's edge — the plate and the tiles are opaque,
         so each line is trimmed at both ends by what sits on top of it, and the drawing never
         has to compute where a rule should stop. The ring is a hairline in the deck's own
         border ink because it is scaffolding; the spokes are the accent because they are the
         claim. -->
    <svg
      aria-hidden="true"
      class="absolute inset-0"
      :width="box.width"
      :height="box.height"
      :viewBox="`0 0 ${box.width} ${box.height}`"
      fill="none"
    >
      <circle
        class="stroke-(--border-default)"
        :cx="wheel.centre.x"
        :cy="wheel.centre.y"
        :r="wheel.radius"
        stroke-width="1"
      />
      <line
        v-for="(seat, index) in wheel.seats"
        :key="nodes[index].label"
        class="stroke-(--primary)"
        :x1="wheel.centre.x"
        :y1="wheel.centre.y"
        :x2="seat.x"
        :y2="seat.y"
        stroke-width="1"
      />
    </svg>

    <!-- THE PLATFORM. A disc — canvas fill, hairline rule, the mark as it ships. `Brand` caps at
         32px (`size="large"`), which is a header's lockup and disappears in a 240px plate on a
         1920px artboard, so the svg is released from the component's own height rules and driven
         from the plate's width instead — the one override on this slide, hung on the element the
         component actually renders. -->
    <div
      class="absolute flex items-center justify-center rounded-full border border-(--border-default) bg-(--bg-canvas)"
      :style="hubStyle"
    >
      <Brand
        kind="default"
        class="[&>svg]:h-auto! [&>svg]:w-full!"
        :style="markStyle"
      />
    </div>

    <!-- THE SEATS. A list, not a decoration: the seven labels are the slide's content, and the
         drawing under them is what is aria-hidden. The glyph comes from the Azion icon library
         (`@aziontech/icons`, loaded once in src/style.css) — one flat white ink for all seven,
         so the accent stays the platform's alone. -->
    <ul class="absolute inset-0 m-0 list-none p-0">
      <li
        v-for="(node, index) in nodes"
        :key="node.label"
        class="absolute flex items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
        :style="seatStyle(wheel.seats[index])"
      >
        <i
          aria-hidden="true"
          :class="node.icon"
          class="text-heading-xl leading-none text-(--text-default)"
        />

        <span
          class="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-overline-md text-(--text-default)"
          :class="
            wheel.seats[index].above
              ? 'bottom-full mb-(--spacing-md)'
              : 'top-full mt-(--spacing-md)'
          "
          >{{ node.label }}</span
        >
      </li>
    </ul>
  </div>
</template>
