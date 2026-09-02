<script setup>
  // THE VISION SLIDE — a claim, three pillars, and a turning globe.
  //
  // The shape is the deck's usual one (a header at the top, a labelled block at the bottom)
  // with `justify-between` doing the distribution rather than a hand-set gap: the header and
  // the pillar row are each about a quarter of the frame's height, so what the slide is really
  // composing is the ~270px band of air between them. That air is the globe's, and how much of
  // it there is is a decision the row's own padding takes part in — see `GLOBE`.
  //
  // The slide BLEEDS (SlideRenderer's `BLEED` set), so the layout owns its own padding. That
  // is what lets the pillar row reach the frame's rules as one continuous frame, and what lets
  // the globe be positioned against those rules rather than against a content box it would
  // otherwise have to be measured off twice.
  //
  // ── THE PILLARS ARE ONE FRAME IN THREE CELLS ──
  //
  // Each pillar is a design-system FrameBox, and the three are butted edge to edge with no
  // gutter — so the row is a single 1428px frame with two internal rules, not three cards
  // sitting near each other. That is the page language's one-frame principle applied at cell
  // scale: a shared edge belongs to exactly one cell, so every card but the first passes
  // `flush="left"` and simply does not draw a rule its neighbour already drew. The corner
  // registration ticks are addressed the same way — the first cell marks its left corners,
  // the last its right, the middle none — which leaves four ticks around the ROW rather than
  // four around each card.
  //
  // The rule colour is `--border-default`, the hairline the frame and every divider in this
  // deck is drawn in. The reference render outlined the cards in the brand orange, which
  // spends the deck's one colour on a container: three orange boxes read as three states
  // (selected? active? warning?) rather than as three peers, and they then compete with the
  // one thing on the slide that IS orange on purpose — the index.
  //
  // Inside, the cell takes the METRICS slide's anatomy exactly — figure, then label, then the
  // supporting line — because a pillar and a metric are the same shape: a number that leads,
  // and copy that explains what it counts. So the index is `text-big-number-lg` in the display
  // face and the brand orange (the deck's largest numeral, the same one the metrics figures
  // and the section dividers take), the title is `text-heading-sm` in the default ink, and the
  // points are muted body copy under it.
  //
  // AN INDEX SHARING THE TITLE'S BASELINE IS A LIST MARKER — it makes the title a numbered
  // item. On its own line, at the top of the ladder, it is the cell's headline and the title
  // is its caption, which is the reading a pillar wants. The three blocks are separated by
  // `--spacing-sm`, not the `--spacing-lg` a first pass used: at 56px the numeral already
  // carries its own air in the line box, and a 24px gap under it detaches it from the title
  // it labels.
  import FrameBox from '@aziontech/webkit/frame-box'
  import { GLOBE_FRAMING, MAP_NODES, projectOnMap } from '@shared/ui/banners/map-framing.js'
  import MapBanner from '@shared/ui/banners/MapBanner.vue'
  import { computed } from 'vue'

  import { DESCRIPTION_MAX, FRAME, FRAME_PADDING } from '../lib/deck-canvas.js'
  import MapMesh from './MapMesh.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // THE GLOBE'S BOX, in canvas pixels, measured from the frame's rules — the same currency
  // every other coordinate in this deck is quoted in, so the Figma build reads it off here.
  //
  // TANGENT TO THE TOP AND RIGHT RULES, AND WHOLLY INSIDE THEM. An earlier pass pushed the disc
  // PAST those rules so the frame would crop it, on the theory that a cropped circle reads as a
  // window onto a world. Rendered, it does the opposite: two flat cuts on a disc that is already
  // half map leave no arc long enough to infer a sphere from. The circle is the only thing making
  // a flat map a globe, so the circle has to be complete — which is what caps its size.
  //
  // Held complete, the ceiling is set by ONE number: where the pillar row's top rule lands. A
  // circle's height IS its diameter, so no amount of horizontal room helps, and the only two
  // ways to buy diameter are to move the disc's top edge up and to move that rule down. This
  // takes both, in that order:
  //
  //   THE DISC IS TANGENT TO THE RULES, not held 24 off them. The old inset was the frame's own
  //   registration inset, borrowed — but a circle tangent to two perpendicular rules is a stated
  //   relationship, and it costs nothing: the corner tick sits ~8px from the corner while the
  //   disc's nearest approach to it is `r(sqrt2 - 1)` = 102px. Worth 24px of diameter.
  //
  //   THE PILLAR CELL'S VERTICAL PADDING IS `--spacing-lg`, NOT `--spacing-xl` (see the row
  //   below). That moves the row's top rule from 461 to 509 — worth another 48px of diameter,
  //   which is twice what the tangency buys and the whole reason that trade is taken.
  //
  // Measured on the rendered slide (frame content 1618x886, the row's top rule at 509):
  //
  //   420   the previous size, held 24 off both rules under the taller row. Bottom at 444.
  //   444   tangent to the top rule alone, taller row unchanged. +5.7% — not a visible change,
  //         which is what makes the row's padding part of this decision rather than separate.
  //   492   this size. Tangent to both rules, bottom at 492, clearing the row's rule by 17 —
  //         +17% on the diameter and +37% on the area. `FRAME.height / 2 + FRAME_PADDING / 2`
  //         lands on it exactly, so it is still two canvas constants rather than a literal.
  //   516   clears by −7. A shallow arc and a hairline rule read as touching well before they do.
  //   540   overlaps the row. FrameBox paints no fill, so the map's dots would show through
  //         behind the pillar copy rather than being hidden by it.
  //
  // Going materially bigger than 492 means letting something cut the disc — the frame's rules
  // (tried, above) or the pillar row (the same flat cut, drawn by a hairline instead of a bezel).
  const GLOBE = {
    size: FRAME.height / 2 + FRAME_PADDING / 2, // 492
    top: 0,
    right: 0
  }

  // ── THE DRIFT: A WIDER TRACK, AND A CROP THAT PUTS THE BLEED INSIDE IT ───────────────────
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
  //      square disc that is 40.5px narrower than the window whatever the alignment does, and
  //      its `xMax` anchor pushes the bleed east of the crop outside the element box, where it
  //      is clipped away. Both are fixed in `GLOBE_FRAMING`: a square 880x880 crop of the same
  //      latitudes, anchored `xMin` so the east bleed is what the disc drifts INTO. The
  //      derivation is there, next to the numbers.
  //
  // With those, the crop is height-constrained (880 units of latitude into a 492px disc, scale
  // 0.56) and fills the disc edge to edge with zero slack, and the drift has real artwork on
  // both sides of the window.
  //
  // ── WHAT SETS THE TRAVEL ──
  //
  // The distance is the PoP field's own western offset from the artwork's edge: the artwork
  // starts at crop x 0 and the westernmost accent square is at x 164, which at scale 0.56 is
  // 91.7px. It is a DIFFERENCE of two projections, so any slack cancels and the number does
  // not depend on which box it is measured in.
  //
  // That quantity is the travel because it is what makes both extremes meaningful:
  //
  //   NEAR   translate 0 — the artwork's own western edge sits on the disc's western limb, and
  //          the field (164-861) is wholly inside the window. One step the other way and the
  //          edge of the world is inside the circle, which is the single thing a globe must
  //          never show.
  //   FAR    translate -91.7 — the FIELD's western edge sits on that same limb. The artwork
  //          continues east for 733 more units but its accent field stops at x 861 (MapBanner's
  //          field was rebalanced away from a Brazil-heavy export and never extended past the
  //          Atlantic world), so drifting further would spend part of the cycle showing a map
  //          with no network on it — on the one slide whose claim is the network.
  //
  // 91.7px is ~19% of the disc. It reads as a turn rather than a pan because it is slow (36s
  // end to end, measured at 3.5px/s through the middle of the curve) and because a circle
  // gives the eye no straight edge to measure the motion against — the only cue is a coastline
  // arriving at the limb.
  //
  // IT OSCILLATES, IT DOES NOT LOOP. A one-way rotation needs the artwork to wrap, and the
  // only crop of it that really does is the whole 1594-unit world — which at this scale is
  // 891px, so the PoP field would be off the disc for a third of every cycle. Reversing costs
  // nothing instead: `alternate` with `--ease-in-out` puts the turnaround at the slowest point
  // of the curve, where the reversal is the least visible thing on the slide, and it buys both
  // directions of travel rather than one.
  const project = (box, point) => projectOnMap({ framing: GLOBE_FRAMING, box, point })

  /** The disc's own square — the frame the travel is measured in. */
  const GLOBE_BOX = { width: GLOBE.size, height: GLOBE.size }

  /** The field's western offset from the artwork's edge, in canvas px. Box-independent. */
  const TRAVEL =
    Math.min(...MAP_NODES.map((node) => project(GLOBE_BOX, node).x)) -
    project(GLOBE_BOX, [GLOBE_FRAMING.crop[0], 0]).x

  /**
   * The box BOTH layers fill and project into — the disc plus the travel, so there is always
   * artwork under the window. Wider than the clip on purpose; the clip takes care of the rest.
   */
  const TRACK_BOX = { width: GLOBE.size + TRAVEL, height: GLOBE.size }

  const track = (point) => project(TRACK_BOX, point)
  const DRIFT = {
    /** Artwork's west edge on the west limb. `xMin` puts it at 0, so this is 0. */
    from: -track([GLOBE_FRAMING.crop[0], 0]).x,
    /** The PoP field's west edge on that same limb, which is `from` less the travel. */
    to: -Math.min(...MAP_NODES.map((node) => track(node).x))
  }

  /** The deck's index idiom — zero-padded, so `01` and `12` are the same width. */
  const cellIndex = (index) => String(index + 1).padStart(2, '0')

  // One tick per corner of the ROW. The cells share edges, so a cell that marked all four
  // corners would put two squares a few pixels apart on every internal junction.
  const cellMarks = (index) => {
    if (index === 0) return 'left'
    return index === props.slide.pillars.length - 1 ? 'right' : 'none'
  }

  const globeStyle = computed(() => ({
    width: `${GLOBE.size}px`,
    height: `${GLOBE.size}px`,
    top: `${GLOBE.top}px`,
    right: `${GLOBE.right}px`
  }))

  /** The track's box, plus the two extremes the keyframes interpolate between. */
  const trackStyle = computed(() => ({
    width: `${TRACK_BOX.width.toFixed(1)}px`,
    height: `${TRACK_BOX.height}px`,
    '--globe-drift-from': `${DRIFT.from.toFixed(1)}px`,
    '--globe-drift-to': `${DRIFT.to.toFixed(1)}px`
  }))

  // WHICH NODES THE MESH MAY USE — and why this is the slide's decision rather than the mesh's.
  //
  // MapMesh knows the box it draws into and the crop it projects through. It cannot know that
  // the box is CLIPPED to a circle, or that the whole thing is drifting: both are facts about
  // this layout. So the slide hands it the pool, and the test is the strict one — inside the
  // disc at BOTH extremes of the drift, not merely at some point during it.
  //
  // Strict, because a participant carries two or three of the seventeen rays. One that spends
  // part of the cycle beyond the limb takes its rays with it, and what the slide shows then is
  // traffic emerging from the edge of the circle — which reads as the drawing being cropped
  // rather than as the network extending past the horizon. Enough nodes survive the test that
  // the mesh has several times the fourteen it takes.
  //
  // The 16px inset is the same idea one step further in: a node exactly on the limb is where
  // the shade has already taken the artwork down to canvas, so a ray would arrive at a square
  // nobody can see.
  //
  // The test is done in TRACK coordinates and the drift is added in, because that is what the
  // viewer sees: the track's left edge is the disc's, so a point at track x lands at x plus
  // the current translate.
  const LIMB_INSET = 16

  const meshPool = computed(() => {
    const radius = GLOBE.size / 2
    const inside = (point, translate) =>
      Math.hypot(point.x + translate - radius, point.y - radius) <= radius - LIMB_INSET
    return MAP_NODES.filter((node) => {
      const point = track(node)
      return inside(point, DRIFT.from) && inside(point, DRIFT.to)
    })
  })
</script>

<template>
  <div class="relative flex h-full flex-col justify-between overflow-hidden p-(--spacing-xxl)">
    <!-- ── THE GLOBE ────────────────────────────────────────────────────────────────────
         A flat map made spherical by four things: a circular clip, a slow turn, a linear shade,
         and a hairline rim.

         WHAT TURNS IS THE TRACK, NOT THE MAP. The artwork and the mesh drawn on it sit in one
         translating group, so a node stays on its coastline while the pair of them moves —
         which is the whole reason the mesh projects into the same box rather than being placed
         on the slide. Animating the map alone would have slid the network off the world within
         a second, and the fix for that is not two synchronised animations, it is one parent.
         The shade and the rim are deliberately OUTSIDE it: a terminator that travelled with
         the surface would be a smudge on the map instead of a light on a sphere.

         WHERE THE 3D COMES FROM. A LINEAR shade, not a radial one — a radial vignette centred on
         a circle draws a second circle inside the first, which reads as a ring, while a linear
         ramp reads as a terminator: one side lit, the other falling into shadow, which is the
         only cue a flat disc needs. It falls to the lower LEFT, which is where the map has the
         least to show — the disc's two bottom corners are open ocean (South Pacific and South
         Atlantic, and measurably so: the PoP field reaches seven of the disc's nine thirds and
         those are the two it never enters), so the shade and the emptiness are the same region
         instead of two. The drift does not choose a lit side for it: the turn reverses and the
         light does not, which is correct — a terminator is a fact about where the sun is, not
         about which way the surface is moving.

         The rim is one `--border-default` hairline, the same rule the frame and the pillar row
         are drawn in, and it sits ABOVE the shade so the limb is still described where the
         artwork has faded out from under it. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute overflow-hidden rounded-full"
      :style="globeStyle"
    >
      <div
        class="globe-track absolute left-0 top-0"
        :style="trackStyle"
      >
        <!-- The `slide` framing — the western hemisphere, no inset, and no seam mask, because
             whatever cuts the artwork is what should end it and here that is the clip. It is
             the same crop the backdrop slide's full-bleed map uses, which is what lets one
             projection place a node correctly in a 1618px frame and in this 396px disc. -->
        <MapBanner kind="globe" />

        <!-- THE ANSWER TO THE PREVIOUS SLIDE'S DRAWING. That one carries MapRoute: one request,
             two labelled ends, a round trip long enough to be the argument. This carries the
             mesh — the same artwork, the same projection, and traffic between arbitrary pairs
             of its own PoPs, with nothing numbered and nothing in the middle. The two slides
             disagree in the one way the section is about, and they do it in the same language. -->
        <MapMesh
          :box="TRACK_BOX"
          :pool="meshPool"
        />
      </div>

      <!-- THE TERMINATOR IS A CORNER, NOT A HALF. A shade is the cheapest way to make a flat
           disc spherical and the easiest thing to overspend on: it multiplies the artwork it
           crosses, and the artwork under it is the quietest layer in the deck. Its stops used to
           be `transparent 38% -> 62% canvas at 74% -> canvas at 100%`, which is not a terminator,
           it is a wash over five of the disc's nine thirds — the coastline came back at 20-35/255
           across them, on the one slide whose claim is the network.
           These reach full transparency at 52% and only 55% canvas at 82%, so what is shaded is
           the lower-left CORNER — the two thirds that are open ocean anyway (South Pacific and
           South Atlantic; the PoP field reaches seven of the nine and never enters those two) —
           and the middle band keeps its artwork.
           WORTH KNOWING WHICH LEVER DID THE WORK. Measured at the same 30% landmass, only the
           stops changed: coastline 20-35 -> 24-39. Four points. The terminator was never what was
           hiding the map — the ground's own opacity was, and that is fixed in MapBanner where it
           is derived. This change is what makes RAISING that opacity safe: at 30% under the old
           wash the shaded thirds were the darkest part of the disc, so a louder ground would have
           read as a bright band with a dead corner. -->
      <div
        class="absolute inset-0 bg-[linear-gradient(215deg,transparent_52%,color-mix(in_srgb,var(--bg-canvas)_55%,transparent)_82%,var(--bg-canvas)_100%)]"
      />

      <!-- THE LIMB TAKES A 2px RULE, and that is a fact about drawing a CIRCLE rather than a
           preference. A 1px border on a 246px radius is antialiased across two pixel rows almost
           everywhere on the curve, so no pixel is ever fully covered: sampled every 30deg on the
           1px build, the rim came back 19-31/255 — never once the 43 of `--border-default` it is
           painted in, and at the low end indistinguishable from the canvas. At 2px the core of
           the stroke is covered and the limb reads at its own colour (measured 35-43, mean 40),
           while still being 0.4% of the diameter. Same correction, and the same reason, as the
           cover's `stroke: 2` in deck-canvas.js. -->
      <div class="absolute inset-0 rounded-full border-2 border-(--border-default)" />
    </div>

    <!-- The copy sits ABOVE the globe in the stack — the disc is a backdrop, and a headline
         crossing it must stay readable. It is capped short of the globe's western edge, so in
         practice the two never touch. -->
    <header class="relative flex flex-col gap-(--spacing-lg)">
      <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">{{ slide.headline }}</h2>
      <p
        v-if="slide.description"
        class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
      >
        {{ slide.description }}
      </p>
    </header>

    <section class="relative flex flex-col gap-(--spacing-lg)">
      <!-- The label over the row, at the overline step the whole system labels blocks with
           (14px on this canvas). Not the design system's Overline component: that one is a
           section EYEBROW — it sets its text in the brand orange and expects a `//` prefix —
           and here the orange belongs to the indices below. -->
      <span class="text-overline-md text-(--text-default)">{{ slide.label }}</span>

      <!-- Three equal thirds of the content box (1428 / 3 = 476) and NO gutter: the cells
           share their edges, which is what lets `flush` make each rule a single hairline. -->
      <div class="grid grid-cols-3">
        <FrameBox
          v-for="(pillar, index) in slide.pillars"
          :key="pillar.title"
          :flush="index > 0 ? 'left' : false"
          :marks="cellMarks(index)"
        >
          <!-- THE TWO PADDINGS ARE DIFFERENT TOKENS, and only one of them is free. The
               HORIZONTAL one sets the copy measure (a 473px cell less 96 is a 377px column for
               four bullets) and stays at `--spacing-xl`, the step the metrics slide's cells take.
               The VERTICAL one is air, and this cell already has some: the 56px index draws in a
               70px line box, so a `--spacing-xl` top pad puts 118px above a 25px title. Stepping
               it to `--spacing-lg` takes 48px off the row's height (measured: 326.7 -> 278.7),
               which is 48px of diameter the globe gets (see `GLOBE`) — the trade is a cell 24px
               tighter at each end for a disc with 37% more area, on the one slide built around
               that disc. It is also why the metrics slide's cell keeps `p-(--spacing-xl)`: it has
               nothing to give the space to. -->
          <article class="flex flex-col gap-(--spacing-sm) px-(--spacing-xl) py-(--spacing-lg)">
            <span class="text-big-number-lg text-(--primary)">{{ cellIndex(index) }}</span>

            <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
              {{ pillar.title }}
            </h3>

            <ul class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0">
              <li
                v-for="point in pillar.points"
                :key="point"
                class="text-pretty text-body-md text-(--text-muted)"
              >
                {{ point }}
              </li>
            </ul>
          </article>
        </FrameBox>
      </div>
    </section>
  </div>
</template>

<style scoped>
  /* 36s end to end over 92px — 2.5px/s at the mean, half that at the turnarounds. Slow enough
     to be ambient behind a headline, fast enough that a coastline visibly arrives at the limb
     while the slide is on screen. `alternate` is what makes it seamless without the artwork
     having to wrap; see the derivation in the script. */
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
