<script setup>
  // TRAFFIC ACROSS THE FIELD — n:n, nobody labelled, nothing at the centre.
  //
  // The companion to MapRoute, and its argument's opposite. MapRoute draws ONE request between
  // TWO named ends because the backdrop slide is about a single long round trip to a single
  // data centre: both ends are labelled, both are numbered, and the distance between them is
  // the whole point. This draws the answer to that — a field of peers, each talking to two or
  // three others, with no origin, no destination and no number on anything.
  //
  // That is why the two are separate components rather than one with a `mode` prop. They share
  // a projection and a visual language and disagree about everything else: this one has no
  // labels because its nodes have no names, no arrowheads because a ray between peers has no
  // privileged direction to mark, and no fixed pairs because "which node" is exactly what it
  // is claiming does not matter.
  //
  // ── THE NODES ARE THE ARTWORK'S OWN ──
  //
  // Every endpoint is an entry in `MAP_NODES`: one of the 78 squares MapBanner already picks
  // out of the landmass in the brand accent, projected through the same crop the map beneath
  // is framed with. So a ray does not land NEAR a node, it lands ON the orange square that is
  // already painted there — and nothing has to draw a dot to say where the nodes are, because
  // the map has been saying it all along. Drawing our own would have put a second mark on top
  // of each one, in a second colour, at a scale (2.2px) where the two would read as mud.
  //
  // ── THE GRAPH IS CONSTRUCTED, NOT DRAWN ──
  //
  // A hand-picked set of pairs is a PICTURE of a mesh: it has a composition, and a composition
  // is the one thing a claim about interchangeable peers must not have. So the graph is built
  // in two stages, and the two stages are what the drawing is actually asserting.
  //
  // FIRST, WHICH NODES TAKE PART — by farthest-point sampling, not by rejection. Pick one at
  // random, then repeatedly add whichever pool node is furthest from everything chosen so far.
  // That is what puts participants across the whole window: they come out ~36px apart at the
  // closest, against a field whose own nodes are ~10px apart, so the mesh spans the map
  // instead of clustering wherever the artwork happens to be dense (which is Brazil — the
  // export's original bias, and the thing MapBanner's field was rebalanced to fix).
  //
  // Rejection sampling was the first attempt and it does not work here: keep drawing at random
  // and discard anything within a minimum separation, and the third or fourth pick has already
  // blocked most of a 314x278px field. Asking for 12 returned 5, silently — a "mesh" of five
  // nodes that looked deliberate.
  //
  // THE PARTICIPANT COUNT IS SET BY COVERAGE, and it was measured rather than picked. Divide
  // the caller's window into thirds both ways and count which of the nine cells the pool even
  // reaches: seven. (The missing two are the bottom corners — South Pacific and South Atlantic
  // — so a mesh that never draws there is the map being honest, not the sampler failing.) 12
  // participants reach six of the seven and leave the disc's north-west quiet; 14 reach all
  // seven, and 16 or 18 add nothing but density. So 14, and the ~17 rays it comes to.
  //
  // Farthest-point is BOUNDARY-SEEKING — an interior node is by definition close to something,
  // so the early picks land on the field's outline. That is why the count matters at all: at
  // 12 the drawing was a rim of traffic around an empty middle.
  //
  // SECOND, WHO TALKS TO WHOM — every participant is given edges until it has at least two,
  // and no participant may exceed three. The MINIMUM is the load-bearing half and it is easy
  // to get wrong: an earlier version had only the cap, on the assumption that a cap of three
  // would produce degrees near three. It produced degree ONE for every node — with 78 nodes
  // and 14 edges, a random pair almost never reuses a node, so the drawing was fourteen
  // disjoint couples. Fourteen couples is not n:n; it is seven private conversations twice
  // over. Requiring two makes every node a participant in the network rather than in a pair,
  // and capping at three stops the generator finding a hub and re-arguing centralization on
  // the one slide that exists to refute it.
  //
  // The RAY COUNT is therefore an outcome, not a setting: 14 participants at two or three
  // edges each comes to 17. Asking for a ray count directly is what let the degree collapse
  // go unnoticed.
  //
  // The generator is a plain LCG with a fixed seed, so the drawing is IDENTICAL on every
  // render — the deck exports to PDF and to Figma, and a mesh that reshuffled per mount would
  // put a different network in each artefact. Arbitrary, not random: nobody chose these
  // fourteen nodes, and the same fourteen come back every time.
  //
  // ── HOW IT MOVES ──
  //
  // Each ray is drawn twice, MapRoute's way: a nearly-invisible LINK that is always there, and
  // a PACKET that crosses it once per cycle and eases in and out of the trip. The link is at
  // 0.12 — one is barely a line, and seventeen of them are a mesh, which is the effect wanted
  // in both directions at once: the topology is legible as a whole and never competes with the
  // artwork it is drawn on.
  //
  // ── THE PACKET IS THE BRAND ORANGE, AND THE LINK IS NOT ──
  //
  // `--primary`, the same token MapBanner paints its 78 PoP squares in. That is the argument
  // for it: a ray runs between two of those squares and is carrying their traffic, so it is
  // the network's own colour moving through the network, not a second thing annotating it.
  // The link stays `--border-strong` at 0.12, which keeps the split honest — grey topology,
  // orange traffic — and means the one saturated thing on the disc is the part that moves.
  //
  // (MapRoute spends the deck's other colour, `--accent`, on its arrowheads instead. It has to:
  // its whole subject is DIRECTION, and its two ends are already `--primary` and `--bg-contrast`.
  // Here there is no privileged direction and no marker, so the orange is free.)
  //
  // ── IT TAPERS TO NOTHING AT BOTH ENDS ──
  //
  // A packet does not appear at full length, slide, and vanish. It GROWS out of the node that
  // sent it and is ABSORBED into the node that receives it — zero length at both ends, full
  // length in between. That is the progress bar's indeterminate pattern, which drives
  // `inset-inline-start` and `inset-inline-end` on two different curves so the bar's leading
  // and trailing edges move independently and the visible width runs 0 -> full -> 0.
  //
  // The SVG translation is TWO ANIMATIONS on one path, which is the same idea in the units a
  // stroke has:
  //
  //   TRAVEL  `stroke-dashoffset`, one smooth `--ease-in-out` sweep from 0 to -100. This is
  //           the packet's TAIL — where the dash begins on the path.
  //   TAPER   `stroke-dasharray`, its own linear ramp 0 -> 30 -> 0. This is the packet's
  //           LENGTH, so the HEAD is tail + length. 30 (a third of the ray) is long enough
  //           that growing to it and shrinking from it is the packet's dominant motion rather
  //           than a detail on it. Both live in the keyframes, next to each other.
  //
  // Splitting them is not tidiness. Baking the length ramp into the travel keyframes would put
  // intermediate stops on the position too, and a timing function applies BETWEEN each pair of
  // stops — so the packet would accelerate and decelerate four times per crossing instead of
  // once. Two animations, two curves, one duration (both read the inline `animationDuration`).
  //
  // Half the arrival taper comes free from the path's own end: the dash is clipped there, so
  // once the head reaches 100 the visible length shrinks on its own as the tail closes in. The
  // explicit ramp-down finishes it to exactly 0 — which matters, because at rest the dash must
  // paint NOTHING. That is also why the cap is `butt` and not `round`: a round cap renders a
  // zero-length dash as a full-diameter dot (it is how one draws a dotted line), which would
  // leave seventeen permanent dots parked on the map for the 55% of each cycle nothing is
  // flying.
  //
  // EVERY RAY RUNS ON ITS OWN CLOCK, and that is load bearing rather than decorative. Seventeen
  // packets on one shared duration re-synchronise every cycle however the delays are spread,
  // so the field visibly pulses — and a network that all fires at once is a network with a
  // scheduler in the middle of it. Durations drawn from a 3.4-6.2s band make the ensemble's
  // period effectively unbounded, so the traffic never repeats a frame and never has a beat.
  //
  // The crossing occupies the first 45% of each cycle and the packet is parked past the end
  // for the rest. That duty cycle is what sets the density: at ~45% x 17 rays, seven or eight
  // are in flight at any instant, which is busy enough to read as continuous traffic and
  // sparse enough that individual trips are still followable.
  import { GLOBE_FRAMING, MAP_NODES, projectOnMap } from '@shared/ui/banners/map-framing.js'
  import { computed } from 'vue'

  const props = defineProps({
    /** The box the MAP fills, in canvas pixels. The svg's user units are these pixels. */
    box: { type: Object, required: true },
    /** The banner crop the artwork is framed with — must be the one the map beneath uses. */
    framing: { type: Object, default: () => GLOBE_FRAMING },
    /**
     * The nodes allowed to take part, in ARTWORK units — the whole PoP field by default.
     *
     * A caller whose window is smaller than the crop passes the subset that stays inside it,
     * and it has to be the CALLER: the vision slide's window is a disc that drifts, so which
     * nodes are on screen is a fact about its clip and its animation, neither of which this
     * component can see from the box it is handed.
     */
    pool: { type: Array, default: () => MAP_NODES },
    /** How many nodes take part. The ray count follows from this and the degree band. */
    participants: { type: Number, default: 14 }
  })

  /** Fixed, so the same network comes back on every render — see the note above. */
  const SEED = 20260902

  /** Rays per node. The MINIMUM is what makes the graph n:n; the cap is what stops a hub. */
  const DEGREE = { min: 2, max: 3 }

  /** Shortest ray worth drawing, in canvas px. Below this a ray is a tick on the artwork. */
  const MIN_CHORD = 70

  // The link and the packet. Both thinner than MapRoute's 2px: there is one route on that
  // slide and seventeen here, so the same weight would read as a drawing over the map rather
  // than as traffic on it.
  const LINK_STROKE = 1
  const PACKET_STROKE = 1.5

  // The packet's resting state, in the normalized units `pathLength="100"` puts every path in
  // — so one dash and one pair of offsets work on rays of every length. It is parked at ZERO
  // LENGTH past the path's end: nothing is painted, and it is the same state the taper returns
  // to, so the still frame under reduced motion is the mesh with no traffic on it. The gap
  // exceeds the path, so a ray never carries two packets at once.
  const PACKET_RESTING = '0 200'
  const PACKET_PARKED = -100

  // How far a ray's control point sits off its chord, as a fraction of the chord's length,
  // and which side it falls on — both from the generator. A quadratic deviates by HALF its
  // control offset, so this band bows a ray 5-9% of its own length. Subtler than MapRoute's
  // 0.26, because that bow exists to separate two lanes of one route into a lens and this one
  // only has to stop a ray reading as a ruled line; and SIGNED, because seventeen arcs all
  // bowing the same way look combed.
  const BOW = { min: 0.1, max: 0.18 }

  // The clock band. `slow-04` (2100ms) is the theme's longest step and one leg of MapRoute's
  // round trip; a ray here is a single hop, so the band brackets it either side.
  const CYCLE = { min: 3400, max: 6200 }

  /**
   * The network: project the pool, sample the participants, wire them up, then hand each edge
   * its geometry and its clock. One pass, so every stage sees the same generator stream and
   * the whole drawing is a function of `SEED`.
   */
  const mesh = computed(() => {
    const points = props.pool.map((point) =>
      projectOnMap({ framing: props.framing, box: props.box, point })
    )

    // A plain LCG. It is here rather than imported because its only requirement is that it be
    // the SAME every time, and a four-line generator with a literal seed is easier to trust
    // about that than a dependency.
    let seed = SEED
    const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
    const between = (range) => range.min + next() * (range.max - range.min)
    const gap = (a, b) => Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y)

    // STAGE 1 — farthest-point sampling. The first node is arbitrary; every one after it is
    // the pool's most remote node from everything taken so far, which is what makes the set
    // span the field rather than sample its density.
    const chosen = [Math.floor(next() * points.length)]
    while (chosen.length < Math.min(props.participants, points.length)) {
      let best = -1
      let bestGap = -1
      points.forEach((_, index) => {
        if (chosen.includes(index)) return
        const nearest = Math.min(...chosen.map((taken) => gap(index, taken)))
        if (nearest > bestGap) {
          bestGap = nearest
          best = index
        }
      })
      chosen.push(best)
    }

    // STAGE 2 — edges. Walk the participants and give each one partners until it has `min`,
    // skipping any that is already at `max`, already linked to it, or too close to be a ray.
    // The inner guard is the honest bound: the constraints can be unsatisfiable (a caller that
    // passes three nodes cannot give each of them two distant partners), and a loop with no
    // ceiling would hang the slide instead of drawing a smaller mesh.
    const degree = new Map(chosen.map((index) => [index, 0]))
    const edges = []
    const linked = (a, b) => edges.some((edge) => edge.includes(a) && edge.includes(b))

    for (const a of chosen) {
      for (let guard = 0; degree.get(a) < DEGREE.min && guard < 200; guard += 1) {
        const options = chosen.filter(
          (b) => b !== a && degree.get(b) < DEGREE.max && !linked(a, b) && gap(a, b) >= MIN_CHORD
        )
        if (!options.length) break
        const b = options[Math.floor(next() * options.length)]
        edges.push([a, b])
        degree.set(a, degree.get(a) + 1)
        degree.set(b, degree.get(b) + 1)
      }
    }

    const at = (p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`

    return edges.map(([a, b]) => {
      const from = points[a]
      const to = points[b]
      const span = { x: to.x - from.x, y: to.y - from.y }
      const length = Math.hypot(span.x, span.y)
      const offset = between(BOW) * (next() < 0.5 ? 1 : -1) * length
      const normal = { x: -span.y / length, y: span.x / length }
      const control = {
        x: (from.x + to.x) / 2 + normal.x * offset,
        y: (from.y + to.y) / 2 + normal.y * offset
      }

      // The delay is a full cycle wide and NEGATIVE, so a ray's first crossing lands anywhere
      // in its own period — the field is already mid-conversation on the frame the slide
      // appears, rather than starting up in front of the room.
      const duration = between(CYCLE)
      return {
        key: `${a}-${b}`,
        path: `M ${at(from)} Q ${at(control)} ${at(to)}`,
        style: {
          animationDuration: `${Math.round(duration)}ms`,
          animationDelay: `-${Math.round(next() * duration)}ms`
        }
      }
    })
  })
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
        v-for="ray in mesh"
        :key="ray.key"
      >
        <!-- The link: the pair exists whether or not it is carrying anything. -->
        <path
          :d="ray.path"
          class="link stroke-(--border-strong) opacity-12"
          :stroke-width="LINK_STROKE"
          stroke-linecap="round"
        />

        <!-- The packet. `pathLength` normalizes every ray to 100, so one dash and one pair of
             offsets read the same on the shortest hop and the longest. `butt`, not `round`: a
             round cap paints a zero-length dash as a dot, and this dash is zero-length at both
             ends of its trip and for the whole of its rest. -->
        <!-- `pathLength` is CAMELCASE and must stay that way. Written kebab (`path-length`)
             it is emitted verbatim, the browser ignores it, and the dash units silently fall
             back to USER units — so the dash and the offsets stop being percentages of the
             ray and become pixels. Nothing errors; the packets just travel a fixed 100px of
             whatever length the path happens to be. -->
        <path
          :d="ray.path"
          class="packet stroke-(--primary) motion-reduce:animate-none"
          pathLength="100"
          :stroke-width="PACKET_STROKE"
          :stroke-dasharray="PACKET_RESTING"
          :stroke-dashoffset="PACKET_PARKED"
          stroke-linecap="butt"
          :style="ray.style"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
  /* TWO ANIMATIONS, ONE CLOCK. Duration and delay are per-ray and arrive inline, so both
     entries of every list resolve against the same values; what is shared here is the SHAPE
     of the cycle. The split is what lets the position stay on ONE smooth curve while the
     length runs its own ramp — see the derivation in the script. */
  .packet {
    animation-name: map-mesh-travel, map-mesh-taper;
    animation-timing-function: var(--ease-in-out), linear;
    animation-iteration-count: infinite, infinite;
  }

  /* TRAVEL — where the dash BEGINS on the path, i.e. the packet's tail. The crossing is the
     first 45% of the cycle and the rest parks it past the end. `--ease-in-out` is the whole
     ask on a hop as much as on a round trip: the packet leaves under acceleration and settles
     into the far node instead of sliding across at a constant rate, which is the difference
     between traffic and a conveyor belt. */
  @keyframes map-mesh-travel {
    0% {
      stroke-dashoffset: 0;
    }
    45%,
    100% {
      stroke-dashoffset: -100;
    }
  }

  /* TAPER — the dash's LENGTH, so the head is tail + this. Linear on purpose: the curve of the
     crossing belongs to the travel, and easing the length as well would read as the packet
     hesitating. The stops sit at a quarter and two thirds of the crossing (45% x 0.24 and
     x 0.67), which puts the growth over the first 20px or so of a typical ray and leaves the
     last 40% of the trip to the arrival — where the path's own end is already clipping the
     head, so the two shorten it together. */
  @keyframes map-mesh-taper {
    0% {
      stroke-dasharray: 0 200;
    }
    11% {
      stroke-dasharray: 30 200;
    }
    30% {
      stroke-dasharray: 30 200;
    }
    45%,
    100% {
      stroke-dasharray: 0 200;
    }
  }

  /* Reduced motion keeps the NETWORK and drops the traffic — the opposite of MapRoute's
     fallback, and for the opposite reason. There, a parked packet leaves a labelled route
     between two named ends, which states the trip on its own. Here the links carry the claim,
     so they come up to a legible weight and the still frame is the mesh itself. */
  @media (prefers-reduced-motion: reduce) {
    .packet {
      animation: none;
    }

    .link {
      opacity: 0.3;
    }
  }
</style>
