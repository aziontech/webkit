<script setup>
  // THE REQUEST, DRAWN ON THE MAP — one annotation, two slides.
  //
  // A user somewhere, a data centre somewhere else, and the round trip between them. It is
  // the deck's one piece of drawn argument: the backdrop slide claims centralized security
  // adds latency, and the vision slide answers it — both claims are about the same distance,
  // so both are shown by the same object rather than by two drawings that could disagree.
  //
  // ── EVERY COORDINATE IS PROJECTED, NEVER PLACED ──
  //
  // The two ends name PLACES (`br-southeast`, `us-east`) and `projectOnMap` runs the same
  // viewBox + preserveAspectRatio arithmetic the browser runs on the artwork itself. A marker
  // sits on its coastline because it is derived from the crop the banner frames with, not
  // because someone nudged a pixel until it looked right — and it stays there in a 1618px
  // frame and in a 396px disc alike, which is the whole reason this is one component.
  //
  // ── ONE WIRE, AND WHERE THE ROUND TRIP WENT ──
  //
  // A request is a ROUND TRIP, and the latency the slide is arguing about is paid twice. That
  // used to be DRAWN: two bowed lanes separating into a lens, each with an accent arrowhead on
  // the tangent where it arrived. Now it is one wire between the two ends, and the trip is
  // carried by the traffic on it — a request crosses 1 -> 2, and once it has landed a second
  // crosses 2 -> 1 on that same wire. The distance is still paid twice; it is paid in TIME
  // instead of stated by a second object.
  //
  // Two things were wrong with paying for it in geometry. The lens is a shape the network does
  // not have — a request does not take a different wire home, it takes the same path the other
  // way — and the arrowheads were the only marks on the slide in the deck's second colour, so
  // the loudest detail of the annotation was the one carrying the least of the argument. What
  // is left is what the slide is about: two named ends and the distance between them.
  //
  // ── HOW IT MOVES: ONE EASED PACKET PER LANE ──
  //
  // Each lane is drawn twice. The dim path is the ROUTE — it is always there, because the
  // route exists whether or not it is carrying anything. The bright one is the REQUEST: a
  // single dash that traverses the path once and eases in and out of the trip, so it leaves
  // the origin under acceleration and settles into the destination.
  //
  // That replaces a marching `flowDash` whose lanes took turns by fading. Two things were
  // wrong with it. A linear march has no beginning and no end — it is a conveyor belt, and a
  // conveyor belt is the one thing a round trip is not; and signalling the handover with
  // OPACITY put the change on the wrong property, so the return did not arrive, it simply got
  // brighter where it already was.
  //
  // The travel is `stroke-dashoffset` over a `pathLength="100"` path: a dash 18 long in a
  // 200-long gap, swept from +18 (entirely before the start) to -100 (entirely past the end),
  // so exactly one packet crosses and nothing is visible at either extreme. The keyframe holds
  // at the far end for the second half of the cycle, and the return lane is delayed by exactly
  // half — so the two legs hand over with no gap and no overlap, and the sequence IS the
  // round trip rather than a caption on one.
  //
  // ── THE ACCENT IS NOT SPENT AT ALL ──
  //
  // It was earned by one thing only — the arrowheads, the sole marks that said which way
  // anything was going. With no direction asserted there is nothing for a second colour to
  // say, and the drawing now agrees with MapMesh: a grey wire, an orange request. What carries
  // the meaning instead is the pair of ENDS — the origin takes the primary surface, the
  // destination the contrast surface, canvas inverted and the one white object on the slide,
  // which is how a single centralized data centre should read beside a distributed field.
  //
  // THE ORIGIN'S NUMERAL IS KNOCKED OUT, not inked with `--primary-contrast`. That token is
  // the nominal pair for a primary surface and it is the wrong one here: `--primary` is the
  // same #F3652B on both themes while its contrast token FLIPS (#000 light, #FFF dark), so on
  // this dark deck the numeral came out white on orange — 3.0:1, under AA for any text size.
  // Black on the same orange measures 6.71:1. `--bg-canvas` is that ink and it is the one the
  // deck's marker band already settled on for the identical pair (see MarkedText, where the
  // theme gap is recorded); the destination's white-on-black end is untouched.
  //
  import '@shared/ui/banners/map-packet.css'

  import { MAP_PLACES, projectOnMap, SLIDE_FRAMING } from '@shared/ui/banners/map-framing.js'
  import { computed } from 'vue'

  const props = defineProps({
    /** The origin — `{ label, place, icon }`, `place` naming an entry in the map's gazetteer. */
    from: { type: Object, required: true },
    /** The destination, same shape. */
    to: { type: Object, required: true },
    /** The box the MAP fills, in canvas pixels. The svg's user units are these pixels. */
    box: { type: Object, required: true },
    /** The banner crop the artwork is framed with — must be the one the map beneath uses. */
    framing: { type: Object, default: () => SLIDE_FRAMING },
    /** Marker scale. `large` for a full-frame map, `small` inside the globe. */
    size: {
      type: String,
      default: 'large',
      validator: (value) => ['small', 'large'].includes(value)
    },
    /** Draw each end's name beside its disc. Off inside the globe, where a pill would overrun the limb. */
    labels: { type: Boolean, default: true }
  })

  /** The disc's diameter. Everything else on the marker is a fraction of it. */
  const MARKER = { small: 28, large: 40 }

  // How far the wire's control point sits off the chord, as a fraction of the chord's own
  // length. Sao Paulo and the US eastern seaboard are ~143px apart in x against ~356 in y at
  // full frame, so a straight chord is a near-vertical bar — it reads as a divider, not as a
  // journey. The bow is what makes it a route, and it goes east because west is where the copy
  // is. A quadratic deviates by HALF its control offset at the midpoint, so this bows the wire
  // ~13% of the chord (~50px in the full frame).
  //
  // It is the LARGER of the two bows the lanes used to carry. With no second lane to separate
  // from, the only job left is that reading — a journey rather than a divider — and the flatter
  // of the pair (0.13, ~24px) was flat enough to be read as one.
  const BOW = 0.26

  const marker = computed(() => MARKER[props.size])

  // The stroke is NOT scaled with the marker: it is UI texture rather than illustration, so a
  // 6/6 dash and a 2px line read the same on a 1618px frame and inside a 396px disc.
  const DASH = '6 6'
  const STROKE = 2

  // THE PACKET IS NOT THIS COMPONENT'S TO DESIGN. A request crossing this route and a request
  // crossing a mesh ray are the same event on the same network — and the backdrop slide draws
  // both on one map — so what a request LOOKS like is one definition, `map-packet.css`, imported
  // above: a dash that grows out of the near end, crosses under `--ease-in-out`, and is clipped
  // away into the far one, in the brand orange the artwork already paints its PoPs.
  //
  // What stays here is the CLOCK, because a labelled round trip has a beat a field of peers does
  // not: one leg per half cycle, handed over at the halfway mark (see the scoped style below).
  //
  // These two are the resting state — what the element carries before the animation's first
  // frame, and what it returns to under reduced motion. A zero-length dash parked past the end
  // of the wire is invisible, which is the honest still frame: a route with no request on it.
  const PACKET_RESTING = '0 200'
  const PACKET_PARKED = -100

  /** The packet's stroke. Thinner than the route's own line — it is traffic, not the wire. */
  const PACKET_STROKE = 1.5

  const geometry = computed(() => {
    const at = (end) =>
      projectOnMap({ framing: props.framing, box: props.box, point: MAP_PLACES[end.place] })
    const from = at(props.from)
    const to = at(props.to)

    // Trim both ends back to the discs' edges, so the dashes start and stop in open water
    // instead of running under a marker.
    const clearance = marker.value / 2 + marker.value * 0.15
    const point = (p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`

    const chord = { x: to.x - from.x, y: to.y - from.y }
    const length = Math.hypot(chord.x, chord.y)
    // The chord's perpendicular, forced to point east — west is where the copy is.
    const east = { x: -chord.y / length, y: chord.x / length }
    if (east.x < 0) {
      east.x = -east.x
      east.y = -east.y
    }
    const control = {
      x: (from.x + to.x) / 2 + east.x * BOW * length,
      y: (from.y + to.y) / 2 + east.y * BOW * length
    }

    const unit = (a, b) => {
      const d = Math.hypot(b.x - a.x, b.y - a.y)
      return { x: (b.x - a.x) / d, y: (b.y - a.y) / d }
    }
    const head = unit(from, control)
    const tail = unit(control, to)
    const mouth = { x: from.x + head.x * clearance, y: from.y + head.y * clearance }
    const tip = { x: to.x - tail.x * clearance, y: to.y - tail.y * clearance }

    // ONE path, written 1 -> 2. The return leg is the same `d` played backwards (see the
    // scoped style), so there is exactly one wire and no chance of the two legs disagreeing
    // about where it runs.
    return { from, to, path: `M ${point(mouth)} Q ${point(control)} ${point(tip)}` }
  })

  // Each end is one row whose DISC is centred on the projected point: the row is positioned by
  // its right edge and reversed, so the disc's own radius puts the point at its centre and the
  // label runs INBOARD from there. Inboard, because on this crop both ends sit in the frame's
  // last quarter — a label east of its disc would stack against the frame's right rule, while
  // west of it the two labels fill the gap on the bow's concave side, where nothing else is.
  //
  // The label is a GLYPH AND AN OVERLINE, the pairing the design system's own illustration
  // nodes use: `pi pi-user` and `pi pi-database` say what kind of thing is at each end before
  // the words are read, and the overline step is the label voice this deck uses everywhere a
  // block is named. It also solves a size problem — at body scale the two pills were the
  // widest objects on the map and read as UI dropped onto the artwork; at the overline step,
  // uppercase and letter-spaced, they read as annotation.
  const markerStyle = (end) => ({
    right: `${props.box.width - end.x - marker.value / 2}px`,
    top: `${end.y}px`
  })

  const discStyle = computed(() => ({ width: `${marker.value}px`, height: `${marker.value}px` }))
  const discText = computed(() => (props.size === 'small' ? 'text-label-md' : 'text-label-lg'))
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
  >
    <!-- The svg's viewBox IS the box in pixels, so the projected coordinates go in unchanged:
         no second unit system to keep in step. -->
    <svg
      :viewBox="`0 0 ${box.width} ${box.height}`"
      class="absolute inset-0 size-full"
      fill="none"
    >
      <!-- The wire: always drawn, never moving. Under reduced motion it is the whole drawing,
           and that still frame is the slide's claim on its own — two named ends, one route. -->
      <path
        :d="geometry.path"
        class="stroke-(--border-strong) opacity-25"
        :stroke-width="STROKE"
        :stroke-dasharray="DASH"
        stroke-linecap="round"
      />

      <!-- The two legs, on ONE `d`. Both are the shared crossing (`map-packet` owns its shape,
           this component owns its clock); `leg-back` plays the same keyframes in reverse, which
           is what sends it 2 -> 1 without a second path to keep in step.
           `pathLength` normalizes the path to 100 so the same keyframes read on a 347px route
           and on the shortest mesh hop; it is CAMELCASE and must stay that way (written kebab it
           is emitted verbatim, the browser ignores it, and the dash units silently fall back to
           USER units — which is how this shipped for a while, with the packet crossing a fixed
           100px and stopping there). `butt`, not `round`: the dash is zero-length at both ends
           of its trip, and a round cap paints that as a dot parked on the wire. -->
      <path
        v-for="leg in ['out', 'back']"
        :key="leg"
        :d="geometry.path"
        class="map-packet stroke-(--primary) motion-reduce:animate-none"
        :class="`leg-${leg}`"
        pathLength="100"
        :stroke-width="PACKET_STROKE"
        :stroke-dasharray="PACKET_RESTING"
        :stroke-dashoffset="PACKET_PARKED"
        stroke-linecap="butt"
      />
    </svg>

    <div
      v-for="end in [
        {
          key: 'from',
          data: from,
          at: geometry.from,
          disc: 'bg-(--primary) text-(--bg-canvas)'
        },
        { key: 'to', data: to, at: geometry.to, disc: 'bg-(--bg-contrast) text-(--text-contrast)' }
      ]"
      :key="end.key"
      class="absolute flex -translate-y-1/2 flex-row-reverse items-center gap-(--spacing-sm)"
      :style="markerStyle(end.at)"
    >
      <span
        class="flex shrink-0 items-center justify-center rounded-full font-(family-name:--font-display)"
        :class="[end.disc, discText]"
        :style="discStyle"
        >{{ end.key === 'from' ? '1' : '2' }}</span
      >
      <span
        v-if="labels"
        class="flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-canvas) px-(--spacing-sm) py-(--spacing-xxs) text-overline-md text-(--text-default)"
      >
        <i
          :class="end.data.icon"
          class="text-(length:--text-overline-md-font-size) text-(--text-muted)"
        />
        {{ end.data.label }}
      </span>
    </div>
  </div>
</template>

<style scoped>
  /* ONE TRIP OUT AND ONE BACK, ON ONE WIRE. The crossing itself is `map-packet`'s (imported in
     the script); the only thing this route decides is how long a leg takes and when the second
     one starts. `slow-04` (2100ms) is the theme's longest duration step and it is the leg; the
     cycle is two of them.
     THE RETURN NEEDS NO DELAY, because `reverse` already places it. The shared crossing occupies
     the first 45% of the cycle and parks past the far end for the rest — played backwards, that
     park lands in the FIRST 55% and the crossing in the last 45%. So the request leaves at 0,
     lands at 45%, sits at the data centre for a beat, and comes home over 55-100%: a round trip
     with a pause at the far end, from one set of keyframes read in both directions. */
  .map-packet {
    animation-duration: calc(2 * var(--transition-duration-slow-04));
  }

  .leg-back {
    animation-direction: reverse;
  }

  /* Reduced motion keeps the wire and the two ends — which is the whole drawing now that the
     arrowheads are gone — and only stops the request travelling, which `map-packet.css` does.
     Parked at zero length past the end of the path, it is invisible: a route with no request
     on it. */
</style>
