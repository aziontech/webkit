<script setup>
  // THE VERSUS SLIDE — the same world twice, and the difference between them is the claim.
  //
  // Two lists facing each other across two maps: seven things legacy infrastructure is, seven
  // answers, and a verdict under the answers. The composition is the reference render's, because
  // on this slide the reference is right — the argument is a COUNT, and a count has to be seen.
  // The left map is the artwork with no network on it and the handful of regions a centralized
  // cloud runs in; the right map is the same crop with the whole PoP field lit. Nothing else on
  // the slide says that, and no list of adjectives can.
  //
  // ── WHY THE MAP IS ALLOWED BACK A THIRD TIME ──
  //
  // The deck already draws this artwork twice, and both times it is arguing about something
  // else: the perimeter slide draws ONE request making one long trip to one data centre
  // (distance), and the security-plane slide draws n:n traffic between peers with no ends at all
  // (topology). This one draws neither — no route, no mesh, nothing moving. It draws HOW MANY
  // NODES ARE LIT, which is the one claim the artwork's own field makes better than any other
  // object in this repo, and it makes it the only way a count can be made: by showing the same
  // crop twice, once with the field and once without.
  //
  // That is also the rule for the next map slide, if there is one. Name the claim first; if the
  // claim is already drawn, do not draw it. A map arguing distance here would be the perimeter
  // slide again, and a mesh here would be the security-plane slide again.
  //
  // ── THE PAIRING SURVIVES THE MAPS ──
  //
  // The reference's content is paired — every legacy line has exactly one answer opposite it
  // (confusing primitives / serverless primitives, centralized / worldwide scale, ops-intensive
  // / fully managed) — but its two lists are laid out independently, so the pairs land a few
  // pixels out of level and the room reads two lists instead of seven oppositions.
  //
  // Here both columns render from the SAME `pairs` tuples, in order, at one type step with one
  // gap, top-aligned in the band. So line five on the left sits on line five's baseline on the
  // right, by construction rather than by nudging, and the pairing is legible straight across
  // the maps. Adding a line to one side without its opposite is not a longer list, it is a
  // broken pair — the data shape is what makes that impossible to do by accident.
  //
  // ── THE TWO MAPS ARE ONE FRAMING, TWICE ──
  //
  // Both are `MapBanner kind="pair"`, whose crop is the western landmass's own bounding box
  // (derived in map-framing.js from the artwork's own cells rather than by eye), centred with
  // `xMid` because a pair mirrored about a divider cannot be anchored to an edge. Identical
  // crop, identical fit, identical box — so the two hemispheres are registered to each other and
  // the ONLY variable between them is `nodes`.
  //
  // BOTH maps pass `nodes: false`, which DEMOTES the artwork's field rather than hiding it: the
  // 78 cells render in the landmass's own ink, unanimated, so each map is a complete dot grid
  // with nothing alive on it. (Hiding them would punch 78 holes in the coastline — see the prop's
  // note in MapBanner.) The two grounds are then identical by construction, and the lit field is
  // DRAWN BY THIS SLIDE on top of the right one.
  //
  // ── THE FIELD IS REDRAWN, BECAUSE 3.3px IS NOT A DOT ──
  //
  // Using the artwork's own accent layer here was tried first and it is the wrong instrument at
  // this size. The pair crop fits 940 units of latitude into a 676px column, so the artwork's
  // 4.979-unit cell lands at 3.31px — and 53 squares that small, in a column this wide, measure
  // as texture rather than as a network. On the slide whose entire claim is HOW MANY, the count
  // has to be countable.
  //
  // So the field is drawn from `MAP_NODES` — the artwork's own 78 PoP squares, the same list
  // MapMesh reads — filtered to the nodes inside this crop (53, the Americas; the Atlantic and
  // Europe fall outside it) and projected through the same framing. Each one is a 6px SQUARE
  // centred on the cell it belongs to, so it reads as that cell LIT rather than as a marker
  // dropped near it: same coordinates, same shape, drawn at the size a 1920px artboard reads.
  //
  // It does not pulse, and that is deliberate rather than an omission. The artwork's field
  // breathes in three waves everywhere else in this app, and the backdrop slides keep it. Here a
  // living right map beside a dead left one would introduce a SECOND difference between the two
  // halves — motion — on a slide built so that the only difference is the count. Both maps are
  // still.
  //
  // ── THE LEGACY MAP'S MARKERS ARE PLACES, NOT PIXELS ──
  //
  // The deck data names them (`regions`), the gazetteer knows where they are, and this layout
  // decides what they look like — the same split the perimeter slide's route follows, so no
  // coordinate is ever written in a content file. They are drawn in `--bg-contrast`, the ink
  // MapRoute gives its centralized data centre for exactly this reason: white is the one thing on
  // a black map that reads as a single big box rather than as part of a field. One of the three IS
  // that data centre — `us-east`, the place the perimeter slide's request travels to — so the two
  // slides are pointing at the same building.
  //
  // ── THE HEAD IS THE DECK'S ONE CENTRED HEADLINE ──
  //
  // Every other slide sets its head left, on the grid, and that is right for every other slide:
  // they are asymmetric compositions and the left edge is where the reader starts. This body is
  // symmetric about the frame's centre line — two columns, two maps, one divider and a pivot on
  // it — and a left-set headline over it reads as a caption that missed its column. So the
  // headline centres, and the deck's rule stands everywhere it applies.
  //
  // The two side names are NOT the deck's usual overline, and that is the one place this slide
  // steps off the label idiom on purpose. An overline is a small mono cap-height tag that names
  // the block under it; these name the two sides of the argument and head a column of claims, so
  // they take the step ABOVE their lines (`heading-md` over `heading-sm`) and read as headings.
  // A block label smaller than the block's own copy reads as a caption that lost its picture.
  //
  // No overline in the head either, for the reason the `evidence` slide has none: the deck's overlines carry an
  // orange `//`, and the orange here is spent twice already — on the field the right map lights
  // up, and on the verdict's three marker bands. The reference's eyebrow ("existing solutions are
  // not enough") restates the headline anyway; it is in the speaker notes, as a line to say
  // rather than to show.
  import {
    MAP_NODES,
    MAP_PLACES,
    PAIR_FRAMING,
    projectOnMap
  } from '@shared/ui/banners/map-framing.js'
  import MapBanner from '@shared/ui/banners/MapBanner.vue'
  import { computed } from 'vue'

  import { FRAME, HEADLINE_MAX } from '../lib/deck-canvas.js'
  import MarkedText from './MarkedText.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // ── THE BAND'S GEOMETRY, IN CANVAS PIXELS ────────────────────────────────────────────────
  //
  // Stated once, because the marker projection and the layout have to agree about the box the
  // artwork is fitted into: a marker placed against a box ten pixels wider than the one the map
  // was fitted into is a marker in the ocean. The map's element takes these numbers as its style,
  // so there is nothing left for the flex layout to round differently.
  //
  // The two lengths that are not derived mirror pinned tokens (see CANVAS_TOKENS in
  // lib/deck-canvas.js): the layout's own inset is `--spacing-xl` and every internal gutter is
  // `--spacing-lg`. This slide bleeds, so it owns both.
  const INSET = 48 // --spacing-xl @ xl
  const GUTTER = 24 // --spacing-lg @ xl

  // The head's height, declared rather than measured, so the band's height is not a consequence
  // of how the headline happens to wrap: two lines of `text-heading-xl` (36px at 125%). A
  // one-line headline centres in the same box and the maps do not move.
  const HEAD = 90

  // A column of claims, sized to the LONGEST LINE rather than to a fraction of the frame,
  // because a line that wraps is a pair that stops being level. Measured at `heading-sm` with
  // Sora resolved: "Programmable and extensible" is 272px, the widest, and the widest marker band
  // ("Best price-performance." plus its two `--spacing-xs` flanks) is 256. 288 clears both by 16.
  // The lines also carry `whitespace-nowrap`, so a future line that outgrows the column overruns
  // it visibly instead of silently wrapping and taking the pairing with it.
  const COLUMN = 288

  // Inside the frame's rules, less the layout's inset, the head, and one gutter at the foot. Each
  // half is 761: a column, a gutter, the map, and a gutter off the divider.
  const BOX = { width: FRAME.width - 2, height: FRAME.height - 2 }
  const MAP = {
    width: (BOX.width - 2 * INSET) / 2 - COLUMN - 2 * GUTTER, // 453
    height: BOX.height - 2 * INSET - HEAD - GUTTER // 676
  }

  const mapStyle = computed(() => ({ width: `${MAP.width}px`, height: `${MAP.height}px` }))
  const columnStyle = computed(() => ({ width: `${COLUMN}px` }))
  const headlineStyle = computed(() => ({ maxWidth: `${HEADLINE_MAX}px` }))

  /** The lit cell: bigger than the artwork's own 3.31px so the count is countable. */
  const NODE = 6

  const [CROP_X, CROP_Y, CROP_WIDTH, CROP_HEIGHT] = PAIR_FRAMING.crop

  /** The artwork's PoP squares that fall inside this crop — 53, the Americas. */
  const field = computed(() =>
    MAP_NODES.filter(
      (node) =>
        node[0] >= CROP_X &&
        node[0] <= CROP_X + CROP_WIDTH &&
        node[1] >= CROP_Y &&
        node[1] <= CROP_Y + CROP_HEIGHT
    ).map((node) => projectOnMap({ framing: PAIR_FRAMING, box: MAP, point: node }))
  )

  const nodeStyle = (point) => ({
    left: `${point.x.toFixed(1)}px`,
    top: `${point.y.toFixed(1)}px`,
    width: `${NODE}px`,
    height: `${NODE}px`
  })

  /** A region's disc, centred on its place — projected through the crop the map is framed with. */
  const regionStyle = (place) => {
    const point = projectOnMap({ framing: PAIR_FRAMING, box: MAP, point: MAP_PLACES[place] })
    return { left: `${point.x.toFixed(1)}px`, top: `${point.y.toFixed(1)}px` }
  }

  const pairs = computed(() => props.slide.pairs ?? [])
  const regions = computed(() => (props.slide.regions ?? []).filter((place) => MAP_PLACES[place]))
</script>

<template>
  <div
    class="flex h-full flex-col gap-(--spacing-xl) px-(--spacing-xl) pb-(--spacing-lg) pt-(--spacing-xl)"
  >
    <h2
      class="m-0 mx-auto shrink-0 text-balance text-center text-heading-xl text-(--text-default)"
      :style="headlineStyle"
    >
      {{ slide.headline }}
    </h2>

    <!-- ── THE BAND ─────────────────────────────────────────────────────────────────────
         Two exact halves, so the divider between them lands on the frame's centre line
         whatever the copy does. The divider is the right half's own rule — one edge, one owner
         — and it runs the band's height rather than the frame's: it divides these two columns,
         and it would cut the centred headline in half if it ran any further. -->
    <div class="relative grid min-h-0 flex-1 grid-cols-2">
      <section class="flex items-start gap-(--spacing-lg) pr-(--spacing-lg)">
        <div
          class="flex shrink-0 flex-col gap-(--spacing-lg)"
          :style="columnStyle"
        >
          <span class="text-heading-md text-(--text-muted)">{{ slide.sides[0] }}</span>

          <!-- No rules between the lines: the maps are the drawing on this slide, and a
               hairline under every claim would put a second one beside them. The vision
               slide's pillar points are the same shape for the same reason. -->
          <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
            <li
              v-for="[legacy] in pairs"
              :key="legacy"
              class="whitespace-nowrap text-heading-sm text-(--text-muted)"
            >
              {{ legacy }}
            </li>
          </ul>
        </div>

        <!-- The artwork with no network on it, and the regions a centralized cloud runs in.
             `relative`, because the discs are placed in the map's own pixels. -->
        <div
          class="relative shrink-0 overflow-hidden"
          :style="mapStyle"
        >
          <MapBanner
            kind="pair"
            :nodes="false"
          />

          <span
            v-for="place in regions"
            :key="place"
            aria-hidden="true"
            class="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-contrast)"
            :style="regionStyle(place)"
          />
        </div>
      </section>

      <section
        class="flex items-start gap-(--spacing-lg) border-l border-(--border-default) pl-(--spacing-lg)"
      >
        <!-- The same crop, the same box, the same demoted ground — and the field lit on top of
             it, one square per PoP, on the cells the ground has gone quiet under. -->
        <div
          class="relative shrink-0 overflow-hidden"
          :style="mapStyle"
        >
          <MapBanner
            kind="pair"
            :nodes="false"
          />

          <span
            v-for="(point, index) in field"
            :key="index"
            aria-hidden="true"
            class="absolute -translate-x-1/2 -translate-y-1/2 bg-(--primary)"
            :style="nodeStyle(point)"
          />
        </div>

        <div
          class="flex shrink-0 flex-col items-end gap-(--spacing-lg) text-right"
          :style="columnStyle"
        >
          <span class="text-heading-md text-(--text-default)">{{ slide.sides[1] }}</span>

          <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
            <li
              v-for="[legacy, answer] in pairs"
              :key="legacy"
              class="whitespace-nowrap text-heading-sm text-(--text-default)"
            >
              {{ answer }}
            </li>
          </ul>

          <!-- ── THE VERDICT ──────────────────────────────────────────────────────────
               The band comes from MarkedText, the deck's one definition of the marker, with
               the whole line as the phrase: a verdict is not a sentence with something
               emphasized in it, it is the emphasis. `--spacing-sm` between the lines rather
               than the tighter step — each band carries 4px of padding above and below, so a
               12px gap is what leaves 4px of canvas between two of them. -->
          <ul class="m-0 flex list-none flex-col items-end gap-(--spacing-sm) p-0">
            <li
              v-for="claim in slide.verdict"
              :key="claim"
              class="text-heading-sm"
            >
              <MarkedText
                :text="claim"
                :emphasis="[claim]"
              />
            </li>
          </ul>
        </div>
      </section>

      <!-- The pivot, last so it paints over both halves: a registration mark on the divider at
           the band's centre, which is also the maps' centre. The reference fills it with the
           brand orange; here the orange is the field and the verdict, so this is drawn the way
           the frame's own corner ticks are — canvas fill, one hairline, muted ink. -->
      <span
        class="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-canvas) font-(family-name:--font-display) text-label-lg text-(--text-muted)"
        >vs.</span
      >
    </div>
  </div>
</template>
