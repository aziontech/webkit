<script setup>
  // THE CLIENTS SLIDE — the company in four figures, beside a wall of the logos that prove it.
  //
  // This is the only slide in the deck whose right half is NOT on the canvas colour, and that
  // inversion is the slide's whole mechanism rather than a decoration. Three things follow from
  // it, and each one is a decision the layout makes on purpose.
  //
  // 1. THE PANEL IS CONTRASTED SO THE MARKS CAN BE THEMSELVES. A client wall on black is a wall
  //    of white silhouettes — the trust strip's `MONOCHROME_FILTER` exists precisely to make
  //    thirty brands read as one list, and it is right there, on a 24px strip whose job is
  //    "many". Here the job is "WHOSE", and a room recognises Itaú's orange, iFood's red and
  //    Magalu's blue, not their outlines. `--bg-contrast` (#FAFAFA on this deck's dark theme)
  //    with `--text-contrast` over it is the token pair that buys that back, and every mark in
  //    `CLIENT_WALL` is the brand's own full-colour artwork with no filter on it at all.
  //
  // 2. THE FIGURES ARE WHITE, NOT ORANGE. The deck's `metrics` cells set a figure in
  //    `--primary`, and that is correct where the figure is the only accent on the slide. Here
  //    the accent is twenty-eight brand colours three inches to the right, so the figures take
  //    `--text-default` and the slide renders no overline — the deck's overlines carry an
  //    orange `//`. Same call, and the same reason, as the `evidence` slide: one accent per
  //    slide, and on this one it is the wall.
  //
  // 3. THE WALL RE-SOLVES ITS OWN ROWS. `grid-cols-4` + `auto-rows-fr` divides the panel by
  //    whatever `CLIENT_WALL` holds — twenty-eight marks fall into seven equal rows today, and
  //    a twenty-ninth client is one line in the registry rather than a layout change. Four
  //    across is what the panel's width can give a wordmark: at five, "GRU AIRPORT" and "Global
  //    Fashion Group" set their second line at caption size.
  //
  // ── HOW A MARK IS SIZED, AND WHY THE CAP IS IN PIXELS ─────────────────────────────────────
  //
  // Optical weight, not measured height, is what makes a logo wall look level, and the two are
  // not the same number: a square mark (Itaú's rounded tile) at a wordmark's height carries
  // twice its mass, and a wordmark at a tile's height runs into its neighbour. So no mark is
  // given a size — each is capped by ONE box and spends whichever axis it wants inside it, so
  // a wide wordmark takes the width and a square tile takes the height.
  //
  // That cap is computed here, in canvas pixels, and NOT written as `max-h-full max-w-full`.
  // The percentage form is the obvious one and it silently does nothing: a percentage
  // max-height resolves against the row's height, the row's height is `1fr` over `auto` rows,
  // and an auto row's minimum is its own content — so the constraint depends on the thing it
  // is meant to constrain and is dropped. What ships instead is a 500x500 Itaú tile at its
  // intrinsic size, one row four times taller than its neighbours, and a wall that runs past
  // the frame's bottom rule. It looked exactly like a layout that had not been written yet.
  //
  // So the wall solves its own geometry from the canvas contract, the way `versus` solves its
  // map box: the frame's interior, less the 12-column split, less the panel's padding, divided
  // by the count. Every length below is derived — the only literals are the two pinned spacing
  // steps and FrameBox's own hairline, each named where it is used.
  //
  // The cells are laid out with a gap and NOT with the deck's `gap-px` hairline construction
  // (the one `metrics`, `evidence` and `versus` use). A rule between two client logos would
  // read as a table of vendors; the wall is one object, and the space is what says so.
  //
  // ── NO ENTRANCE MOTION ────────────────────────────────────────────────────────────────────
  //
  // Deliberate. Twenty-eight staggered marks is a fireworks display, and the slide's claim is
  // that the list is long — which is a thing the room reads all at once or not at all.
  import { computed } from 'vue'

  import { BACKER_MARKS, CLIENT_WALL } from '../data/client-marks.js'
  import { DESCRIPTION_MAX, FRAME, FRAME_PADDING, GRID } from '../lib/deck-canvas.js'

  defineProps({
    slide: { type: Object, required: true }
  })

  // ── THE WALL'S GEOMETRY, IN CANVAS PIXELS ─────────────────────────────────────────────────
  //
  // Stated once, because the cap on a mark and the height of a row have to agree: a mark capped
  // taller than the row it sits in is the overflow described above, and a mark capped shorter
  // than the row leaves the wall floating in its own panel.
  //
  // The three lengths that are not derived: FrameBox draws a 1px rule, so the frame's INTERIOR
  // is two pixels narrower and shorter than its box; the wall's gutter is `--spacing-lg` and a
  // cell's inset is `--spacing-sm`, both pinned in CANVAS_TOKENS. This slide bleeds, so it owns
  // all three.
  const STROKE = 1
  const GUTTER = 24 // --spacing-lg @ xl
  const INSET = 12 // --spacing-sm

  /** The frame's interior — what the 12-column split is actually laid over. */
  const INTERIOR = { width: FRAME.width - 2 * STROKE, height: FRAME.height - 2 * STROKE }

  // The split is a `grid-cols-12 gap-px` over that interior, so a column is the interior less
  // its eleven hairlines, divided twelve ways — and the wall's panel is seven of them with the
  // six hairlines between them included.
  const COLUMN = (INTERIOR.width - (GRID.columns - 1) * STROKE) / GRID.columns
  const PANEL_COLUMNS = 7
  const PANEL_WIDTH = PANEL_COLUMNS * COLUMN + (PANEL_COLUMNS - 1) * STROKE

  /** Four across — see the header for why not five. */
  const COLUMNS = 4

  // The box the marks are laid out in: the panel less its `--spacing-xxl` padding on both axes.
  const WALL = {
    width: PANEL_WIDTH - 2 * FRAME_PADDING,
    height: INTERIOR.height - 2 * FRAME_PADDING
  }

  // The rows come from the COUNT, which is what makes a twenty-ninth client a one-line change:
  // 28 marks fall into 7 rows of 4, and 29 would re-solve to 8 shorter ones.
  const rows = computed(() => Math.ceil(CLIENT_WALL.length / COLUMNS))

  /** One cell, and inside it the box a mark may not exceed. 170x79 and 146x55 at 28 marks. */
  const mark = computed(() => ({
    maxWidth: `${(WALL.width - (COLUMNS - 1) * GUTTER) / COLUMNS - 2 * INSET}px`,
    maxHeight: `${(WALL.height - (rows.value - 1) * GUTTER) / rows.value - 2 * INSET}px`
  }))
</script>

<template>
  <div class="grid h-full grid-cols-12 gap-px bg-(--border-default)">
    <!-- ── The company ──────────────────────────────────────────────────────────────────
         Five columns, and the three blocks are pushed apart rather than stacked: the plate
         at the top rule, the figures on the frame's own centre band, the backers on the
         bottom rule. `justify-between` is what keeps the two outer blocks registered to the
         frame whatever the copy does to the middle one. -->
    <div class="col-span-5 flex flex-col justify-between bg-(--bg-canvas) p-(--spacing-xxl)">
      <header class="flex flex-col gap-(--spacing-lg)">
        <h2 class="m-0 text-balance text-heading-2xl text-(--text-default)">
          {{ slide.headline }}
        </h2>
        <p
          v-if="slide.description"
          class="m-0 text-pretty text-heading-sm text-(--text-muted)"
          :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
        >
          {{ slide.description }}
        </p>
      </header>

      <!-- Four figures two-by-two, for the reason the cell grid goes two-by-two at four: a
           column narrow enough to hold four across breaks every second word of the caption
           under it. `items-baseline` is not used — each figure sits over its own caption, and
           the rows align on the grid, which is what a reader scans. -->
      <dl
        v-if="slide.metrics"
        class="m-0 grid grid-cols-2 gap-x-(--spacing-lg) gap-y-(--spacing-xl)"
      >
        <div
          v-for="metric in slide.metrics"
          :key="metric.value"
          class="flex flex-col gap-(--spacing-sm)"
        >
          <dt class="text-big-number-lg text-(--text-default)">{{ metric.value }}</dt>
          <dd class="m-0 flex flex-col gap-(--spacing-xxs)">
            <span class="text-pretty text-heading-sm text-(--text-default)">{{
              metric.label
            }}</span>
            <span
              v-if="metric.note"
              class="text-label-md text-(--text-muted)"
              >{{ metric.note }}</span
            >
          </dd>
        </div>
      </dl>

      <!-- The backers, under the deck's own block label. The two marks are the WHITE artwork
           (they sit on the canvas, not on the wall) and both are 110x40 exports, so giving
           them one box height renders them at the proportion they were drawn at — Qualcomm's
           lockup fills it, monashees' wordmark sits inside it, which is the relationship the
           two logos actually have. -->
      <footer class="flex flex-col gap-(--spacing-lg)">
        <!-- The deck's block label, in the deck's label TYPE (`text-overline-md` is Proto Mono,
             uppercase, tracked) but hand-set rather than composed from the design system's
             `Overline`: that component paints its slot `text-primary`, and this slide spends no
             orange (see the header). Muted ink, because the label names the marks — it is not
             one of them. -->
        <span class="w-fit text-overline-md text-(--text-muted)">{{ slide.backedBy }}</span>

        <ul class="m-0 flex list-none items-center gap-(--spacing-xl) p-0">
          <li
            v-for="backer in BACKER_MARKS"
            :key="backer.name"
          >
            <img
              :src="backer.mark"
              :alt="backer.name"
              class="h-10 w-auto"
            />
          </li>
        </ul>
      </footer>
    </div>

    <!-- ── The wall ─────────────────────────────────────────────────────────────────────
         Seven columns on the contrast fill. `--text-contrast` is set on the panel even though
         nothing in it is type today: the panel is the slide's light surface, and anything
         later composed into it (a count, a caption) inherits the right ink instead of the
         canvas's white. -->
    <div class="col-span-7 bg-(--bg-contrast) p-(--spacing-xxl) text-(--text-contrast)">
      <ul class="m-0 grid h-full list-none auto-rows-fr grid-cols-4 gap-(--spacing-lg) p-0">
        <li
          v-for="client in CLIENT_WALL"
          :key="client.name"
          class="flex items-center justify-center"
        >
          <img
            :src="client.mark"
            :alt="client.name"
            class="object-contain"
            :style="mark"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
