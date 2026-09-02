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
  // ── WHY TWO LANES ──
  //
  // A request is a ROUND TRIP, and the latency the slide is arguing about is paid twice. One
  // line with a single arrowhead states the distance; two lanes state the trip. They bow by
  // different amounts so they separate into a lens rather than overprinting, and each is
  // written in its own direction of travel.
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
  // ── WHERE THE ACCENT GOES ──
  //
  // On the ARROWHEADS, and nowhere else. They are the only marks on the drawing that say
  // which way anything is going, so they are the only ones that earn the deck's second
  // colour; spending it on the line as well made the whole annotation one blue object and
  // told the reader nothing extra. The route and the packet take the contrast ink, the origin
  // disc the primary surface, and the destination the contrast surface — canvas inverted, the
  // one white object on the slide, which is how a single centralized data centre should read
  // beside a distributed field.
  //
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

  // How far each lane's control point sits off the chord, as a fraction of the chord's own
  // length. Sao Paulo and the US eastern seaboard are ~126px apart in x against ~347 in y at
  // full frame, so a straight chord is a near-vertical bar — it reads as a divider, not as a
  // journey. The bow is what makes it a route, and it goes east because west is where the
  // copy is. A quadratic deviates by HALF its control offset at the midpoint, so the two
  // numbers below put the lanes ~6.5% of the chord apart at their widest.
  const OUTBOUND_BOW = 0.26
  const RETURN_BOW = 0.13

  const marker = computed(() => MARKER[props.size])

  // The stroke is NOT scaled with the marker: it is UI texture rather than illustration, so a
  // 6/6 dash and a 2px line read the same on a 1618px frame and inside a 396px disc.
  const DASH = '6 6'
  const STROKE = 2

  // The travelling packet, in the normalized units `pathLength="100"` puts the path in. 18 is
  // ~a fifth of the trip — long enough to read as a moving object rather than a dot, short
  // enough that the path is mostly empty behind it. The gap exceeds the path so only ever one
  // packet is on the wire.
  const PACKET = '18 200'
  const PACKET_PARKED = 18

  const geometry = computed(() => {
    const at = (end) =>
      projectOnMap({ framing: props.framing, box: props.box, point: MAP_PLACES[end.place] })
    const from = at(props.from)
    const to = at(props.to)

    // Trim both ends back to the discs' edges, so the dashes start and stop in open water
    // instead of running under a marker.
    const clearance = marker.value / 2 + marker.value * 0.15
    const arrow = { length: marker.value * 0.3, halfWidth: marker.value * 0.125 }
    const point = (p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`

    // One lane: bowed, trimmed at both ends, with a triangle on the tangent where it arrives.
    const lane = (start, end, offset) => {
      const chord = { x: end.x - start.x, y: end.y - start.y }
      const length = Math.hypot(chord.x, chord.y)
      // The chord's perpendicular, forced to point east whichever way the lane runs — so the
      // outbound and the return bow the same way in MAP terms while travelling opposite ways.
      const east = { x: -chord.y / length, y: chord.x / length }
      if (east.x < 0) {
        east.x = -east.x
        east.y = -east.y
      }
      const control = {
        x: (start.x + end.x) / 2 + east.x * offset * length,
        y: (start.y + end.y) / 2 + east.y * offset * length
      }

      const unit = (a, b) => {
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        return { x: (b.x - a.x) / d, y: (b.y - a.y) / d }
      }
      const head = unit(start, control)
      const tail = unit(control, end)
      const mouth = { x: start.x + head.x * clearance, y: start.y + head.y * clearance }
      const tip = { x: end.x - tail.x * clearance, y: end.y - tail.y * clearance }
      const base = { x: tip.x - tail.x * arrow.length, y: tip.y - tail.y * arrow.length }
      const wing = { x: -tail.y * arrow.halfWidth, y: tail.x * arrow.halfWidth }

      return {
        path: `M ${point(mouth)} Q ${point(control)} ${point(tip)}`,
        arrow: `M ${point(tip)} L ${point({ x: base.x + wing.x, y: base.y + wing.y })} L ${point({ x: base.x - wing.x, y: base.y - wing.y })} Z`
      }
    }

    return {
      from,
      to,
      outbound: lane(from, to, OUTBOUND_BOW),
      return: lane(to, from, -RETURN_BOW)
    }
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
      <g
        v-for="lane in [
          { key: 'outbound', shape: geometry.outbound },
          { key: 'return', shape: geometry.return }
        ]"
        :key="lane.key"
      >
        <!-- The route: always drawn, never moving. -->
        <path
          :d="lane.shape.path"
          class="stroke-(--border-strong) opacity-25"
          :stroke-width="STROKE"
          :stroke-dasharray="DASH"
          stroke-linecap="round"
        />

        <!-- The request: one packet, easing in and out of the trip. `pathLength` normalizes
             the path to 100 so the same dash and the same offsets work on both slides.
             It is CAMELCASE and must stay that way: written kebab (`path-length`) it is
             emitted verbatim, the browser ignores it, and the dash units silently fall back to
             USER units — which is how this shipped for a while, with the packet crossing a
             fixed 100px of a 347px route and stopping there. Nothing errors. -->
        <path
          :d="lane.shape.path"
          class="packet stroke-(--border-strong) motion-reduce:animate-none"
          :class="`packet-${lane.key}`"
          pathLength="100"
          :stroke-width="STROKE"
          :stroke-dasharray="PACKET"
          :stroke-dashoffset="PACKET_PARKED"
          stroke-linecap="round"
        />

        <!-- The one accent on the drawing: the mark that says which way this lane runs. -->
        <path
          :d="lane.shape.arrow"
          class="fill-(--accent)"
        />
      </g>
    </svg>

    <div
      v-for="end in [
        {
          key: 'from',
          data: from,
          at: geometry.from,
          disc: 'bg-(--primary) text-(--primary-contrast)'
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
  /* ONE TRIP PER LANE, HANDED OVER AT THE HALFWAY MARK.
     The packet crosses in the first half of the cycle and is parked off the end for the
     second; the return lane is delayed by exactly half a cycle, so the two legs meet with no
     gap and no overlap and the sequence itself is the round trip.
     `slow-04` (2100ms) is the theme's longest duration step and it is the leg; the cycle is
     two of them. The curve is `--ease-in-out`, which is the whole ask: the request leaves
     under acceleration and settles into the far end instead of sliding at a constant rate. */
  .packet {
    animation: map-route-travel calc(2 * var(--transition-duration-slow-04)) var(--ease-in-out)
      infinite;
  }

  .packet-return {
    animation-delay: var(--transition-duration-slow-04);
  }

  /* +18 puts the dash entirely before the path's start and -100 entirely past its end, so the
     packet is invisible at both extremes and exactly one crossing happens per cycle. */
  @keyframes map-route-travel {
    0% {
      stroke-dashoffset: 18;
    }
    50% {
      stroke-dashoffset: -100;
    }
    100% {
      stroke-dashoffset: -100;
    }
  }

  /* Reduced motion keeps the route, the ends and the arrows — the drawing states the trip on
     its own — and only stops the packet travelling. Parked before the start, it is invisible,
     which is the honest still frame: a route with no request on it. */
  @media (prefers-reduced-motion: reduce) {
    .packet {
      animation: none;
    }
  }
</style>
