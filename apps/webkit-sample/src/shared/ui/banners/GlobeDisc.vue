<script setup>
  // THE GLOBE — a flat map made spherical by four things: a circular clip, a slow turn, a
  // linear shade, and a hairline rim.
  //
  // It was built for the deck's vision slide, which has since gone back to the flat map as its
  // ground — a disc is an OBJECT that has to be placed and kept clear of the copy, and that
  // slide wanted the world itself rather than a picture of it. The Site hero is the caller now,
  // and the split survives it: the disc's own internals live here and the caller supplies only
  // the BOX. Everything below is a fact about turning this artwork into a sphere; nothing below
  // knows how big the sphere is, where it sits, or what is next to it — those are the caller's,
  // and they are what a second caller would differ in.
  //
  // ── THE DISC IS COMPLETE, AND THAT IS WHAT CAPS ITS SIZE ──
  //
  // An earlier pass pushed the disc PAST its frame's rules so the frame would crop it, on the
  // theory that a cropped circle reads as a window onto a world. Rendered, it does the
  // opposite: two flat cuts on a disc that is already half map leave no arc long enough to
  // infer a sphere from. The circle is the only thing making a flat map a globe, so the circle
  // has to be complete — and a caller that cannot fit a complete circle wants a smaller one,
  // not a cropped one.
  //
  // BEING COVERED IS NOT BEING CROPPED, and the distinction is the caller's to make. A RULE
  // across the disc hides nothing, so the arc just ends; an OPAQUE SURFACE in front of it
  // hides what it covers, and the eye reads that as a sphere standing behind something. So a
  // caller may let a filled element cover any amount of the disc — the deck's vision slide sent
  // its lower fifth behind the pillar band while it still drew one — while none of them may let
  // a line cut it.
  //
  // ── THE DRIFT: A WIDER TRACK, AND A CROP THAT PUTS THE BLEED INSIDE IT ──
  //
  // The disc turns by translating the layer the artwork and the mesh both sit in. Two things
  // have to be true for that to work at all, and the obvious build gets both wrong — silently,
  // and only at the far end of a 36-second cycle, which is the worst place for a bug to live.
  //
  //   1. THE TRACK IS WIDER THAN THE DISC, by exactly the distance it travels. An outermost
  //      `<svg>` clips to its element box, so a map layer exactly as wide as the disc has
  //      nothing drawn past its own edge: translate it and the disc's trailing third goes
  //      black. Widening the track widens both layers, so every position of the drift lands
  //      the window on material that exists.
  //
  //   2. THE CROP IS THE GLOBE'S, NOT THE BACKDROP SLIDE'S. `SLIDE_FRAMING` is 790x880 — in a
  //      square disc that is proportionally narrower than the window whatever the alignment
  //      does, and its `xMax` anchor pushes the bleed east of the crop outside the element
  //      box, where it is clipped away. Both are fixed in `GLOBE_FRAMING`: a square 880x880
  //      crop of the same latitudes, anchored `xMin` so the east bleed is what the disc drifts
  //      INTO. The derivation is there, next to the numbers.
  //
  // With those, the crop is height-constrained (880 units of latitude into the disc) and fills
  // it edge to edge with zero slack, and the drift has real artwork on both sides of the
  // window.
  //
  // ── WHAT SETS THE TRAVEL ──
  //
  // The distance is the PoP field's own western offset from the artwork's edge: the artwork
  // starts at crop x 0 and the westernmost accent square is at x 164. It is a DIFFERENCE of
  // two projections, so any slack cancels and the number does not depend on which box it is
  // measured in — which is also why it can be expressed as a ratio and handed to CSS.
  //
  // That quantity is the travel because it is what makes both extremes meaningful:
  //
  //   NEAR   translate 0 — the artwork's own western edge sits on the disc's western limb, and
  //          the field (164-861) is wholly inside the window. One step the other way and the
  //          edge of the world is inside the circle, which is the single thing a globe must
  //          never show.
  //   FAR    the FIELD's western edge sits on that same limb. The artwork continues east for
  //          733 more units but its accent field stops at x 861 (MapBanner's field was
  //          rebalanced away from a Brazil-heavy export and never extended past the Atlantic
  //          world), so drifting further would spend part of the cycle showing a map with no
  //          network on it.
  //
  // The travel is ~19% of the disc. It reads as a turn rather than a pan because it is slow
  // (36s end to end) and because a circle gives the eye no straight edge to measure the motion
  // against — the only cue is a coastline arriving at the limb.
  //
  // IT OSCILLATES, IT DOES NOT LOOP. A one-way rotation needs the artwork to wrap, and the
  // only crop of it that really does is the whole 1594-unit world — at which scale the PoP
  // field would be off the disc for a third of every cycle. Reversing costs nothing instead:
  // `alternate` with `--ease-in-out` puts the turnaround at the slowest point of the curve,
  // where the reversal is the least visible thing on screen, and it buys both directions of
  // travel rather than one.
  //
  // ── WHY THE GEOMETRY IS IN UNITS AND THE SIZE IS IN CSS ──
  //
  // The disc fills whatever box the caller positions it in — `absolute inset-0` — so its
  // rendered diameter can be a fluid `clamp()` that no script can read without a
  // ResizeObserver. Everything geometric is therefore computed once in a fixed UNIT box and
  // handed to CSS as a RATIO: the track's width is a percentage of the disc, and the drift is
  // a percentage of the track, so both resolve against the rendered box at any size with no
  // measurement. The mesh keeps the same unit box as its `viewBox`, so the drawing scales with
  // the disc exactly as an enlargement would — the same network, the same proportions, the
  // same relative stroke weights — rather than becoming a different drawing at a different
  // size. The one thing that does NOT scale is the rim, and that is deliberate (see below).
  import { computed } from 'vue'

  import { GLOBE_FRAMING, MAP_NODES, projectOnMap } from './map-framing.js'
  import MapBanner from './MapBanner.vue'
  import MapMesh from './MapMesh.vue'

  /**
   * The projection box, in design units — the size the deck's disc was first drawn at.
   *
   * It is a UNIT, not a size: no caller renders at 492 any more (the Site hero is fluid), and
   * nothing here reads the rendered box. Arbitrary as a number and
   * load-bearing as a CHOICE: MapMesh's tuned constants (its 70-unit
   * minimum chord, its 1 and 1.5 stroke weights) are quoted in this box's units, so keeping it
   * is what makes the drawing here the drawing that was tuned there. CSS scales the result.
   */
  const UNIT = 492

  const project = (box, point) => projectOnMap({ framing: GLOBE_FRAMING, box, point })

  /** The disc's own square — the frame the travel is measured in. */
  const GLOBE_BOX = { width: UNIT, height: UNIT }

  /** The field's western offset from the artwork's edge, in unit px. Box-independent. */
  const TRAVEL =
    Math.min(...MAP_NODES.map((node) => project(GLOBE_BOX, node).x)) -
    project(GLOBE_BOX, [GLOBE_FRAMING.crop[0], 0]).x

  /**
   * The box BOTH layers fill and project into — the disc plus the travel, so there is always
   * artwork under the window. Wider than the clip on purpose; the clip takes care of the rest.
   */
  const TRACK_BOX = { width: UNIT + TRAVEL, height: UNIT }

  const track = (point) => project(TRACK_BOX, point)

  /** The two extremes, in unit px — `from` is 0 because `xMin` puts the artwork's edge there. */
  const DRIFT = {
    from: -track([GLOBE_FRAMING.crop[0], 0]).x,
    to: -Math.min(...MAP_NODES.map((node) => track(node).x))
  }

  const percent = (value) => `${(value * 100).toFixed(4)}%`

  /**
   * The track's box and the two extremes, both as ratios so they survive a fluid disc.
   *
   * The width is a percentage of the DISC; the drift is a percentage of the TRACK, because a
   * percentage `translate` resolves against the translated element's own border box — which is
   * the track, not the disc.
   */
  const trackStyle = computed(() => ({
    width: percent(TRACK_BOX.width / UNIT),
    height: '100%',
    '--globe-drift-from': percent(DRIFT.from / TRACK_BOX.width),
    '--globe-drift-to': percent(DRIFT.to / TRACK_BOX.width)
  }))

  // WHICH NODES THE MESH MAY USE — and why the disc decides rather than the mesh.
  //
  // MapMesh knows the box it draws into and the crop it projects through. It cannot know that
  // the box is CLIPPED to a circle, or that the whole thing is drifting: both are facts about
  // this component. So the disc hands it the pool, and the test is the strict one — inside the
  // circle at BOTH extremes of the drift, not merely at some point during it.
  //
  // Strict, because a participant carries two or three of the seventeen rays. One that spends
  // part of the cycle beyond the limb takes its rays with it, and what shows then is traffic
  // emerging from the edge of the circle — which reads as the drawing being cropped rather
  // than as the network extending past the horizon. Enough nodes survive the test that the
  // mesh has several times the fourteen it takes.
  //
  // The inset is the same idea one step further in: a node exactly on the limb is where the
  // shade has already taken the artwork down to canvas, so a ray would arrive at a square
  // nobody can see.
  //
  // The test is done in TRACK coordinates and the drift is added in, because that is what the
  // viewer sees: the track's left edge is the disc's, so a point at track x lands at x plus
  // the current translate.
  const LIMB_INSET = 16

  const meshPool = computed(() => {
    const radius = UNIT / 2
    const inside = (point, translate) =>
      Math.hypot(point.x + translate - radius, point.y - radius) <= radius - LIMB_INSET
    return MAP_NODES.filter((node) => {
      const point = track(node)
      return inside(point, DRIFT.from) && inside(point, DRIFT.to)
    })
  })
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
  >
    <!-- WHAT TURNS IS THE TRACK, NOT THE MAP. The artwork and the mesh drawn on it sit in one
         translating group, so a node stays on its coastline while the pair of them moves —
         which is the whole reason the mesh projects into the same box rather than being placed
         by the caller. Animating the map alone would have slid the network off the world
         within a second, and the fix for that is not two synchronised animations, it is one
         parent. The shade and the rim are deliberately OUTSIDE it: a terminator that travelled
         with the surface would be a smudge on the map instead of a light on a sphere. -->
    <div
      class="globe-track absolute left-0 top-0"
      :style="trackStyle"
    >
      <!-- The `globe` framing — the western hemisphere squared and re-anchored west, with no
           seam mask, because whatever cuts the artwork is what should end it and here that is
           the clip. Same latitudes as the deck's full-bleed map, which is what lets one
           projection place a node correctly in a 1618px band and in a 400px disc. -->
      <MapBanner kind="globe" />

      <!-- Traffic between arbitrary pairs of the artwork's own PoPs: the same projection, and
           nothing numbered, nothing labelled, nothing in the middle. -->
      <MapMesh
        :box="TRACK_BOX"
        :pool="meshPool"
      />
    </div>

    <!-- THE TERMINATOR IS A CORNER, NOT A HALF. A shade is the cheapest way to make a flat disc
         spherical and the easiest thing to overspend on: it multiplies the artwork it crosses,
         and the artwork under it is the quietest layer on the page. Its stops used to be
         `transparent 38% -> 62% canvas at 74% -> canvas at 100%`, which is not a terminator, it
         is a wash over five of the disc's nine thirds — the coastline came back at 20-35/255
         across them.
         These reach full transparency at 52% and only 55% canvas at 82%, so what is shaded is
         the lower-left CORNER — the two thirds that are open ocean anyway (South Pacific and
         South Atlantic; the PoP field reaches seven of the nine and never enters those two) —
         and the middle band keeps its artwork.
         A LINEAR ramp, not a radial one: a radial vignette centred on a circle draws a second
         circle inside the first, which reads as a ring, while a linear ramp reads as a
         terminator — one side lit, the other falling into shadow, which is the only cue a flat
         disc needs. The drift does not choose a lit side for it: the turn reverses and the
         light does not, which is correct — a terminator is a fact about where the sun is, not
         about which way the surface is moving. -->
    <div
      class="absolute inset-0 bg-[linear-gradient(215deg,transparent_52%,color-mix(in_srgb,var(--bg-canvas)_55%,transparent)_82%,var(--bg-canvas)_100%)]"
    />

    <!-- THE LIMB TAKES A 2px RULE, and that is a fact about drawing a CIRCLE rather than a
         preference. A 1px border on a large radius is antialiased across two pixel rows almost
         everywhere on the curve, so no pixel is ever fully covered: sampled every 30deg on the
         1px build, the rim came back 19-31/255 — never once the 43 of `--border-default` it is
         painted in, and at the low end indistinguishable from the canvas. At 2px the core of
         the stroke is covered and the limb reads at its own colour (measured 35-43, mean 40).
         It is the one part of the disc that does NOT scale with it: the curve is antialiased
         the same way at every radius, so the correction is the same 2px, and a rim that grew
         with the sphere would become a drawn ring around it. It sits ABOVE the shade so the
         limb is still described where the artwork has faded out from under it. -->
    <div class="absolute inset-0 rounded-full border-2 border-(--border-default)" />
  </div>
</template>

<style scoped>
  /* 36s end to end — slow enough to be ambient behind a headline, fast enough that a coastline
     visibly arrives at the limb while the reader is on the page. `alternate` is what makes it
     seamless without the artwork having to wrap; see the derivation in the script. */
  .globe-track {
    animation: globe-turn 36s var(--ease-in-out) infinite alternate;
  }

  @keyframes globe-turn {
    from {
      translate: var(--globe-drift-from) 0;
    }
    to {
      translate: var(--globe-drift-to) 0;
    }
  }

  /* Reduced motion parks the disc at the NEAR extreme, and states it rather than relying on
     the untranslated default. It happens to be 0 with the current crop — `xMin` puts the
     artwork's west edge on the limb — but that is a fact about `GLOBE_FRAMING`, not about the
     absence of an animation, and a crop with any horizontal slack would make the default a
     still frame with the edge of the world inside the circle. */
  @media (prefers-reduced-motion: reduce) {
    .globe-track {
      animation: none;
      translate: var(--globe-drift-from) 0;
    }
  }
</style>
