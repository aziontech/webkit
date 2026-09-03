<script setup>
  // THE SCALE SLIDE — one centred claim, and three figures that are the size of the thing.
  //
  // Every other figure slide in this deck is LEFT-ALIGNED and lives on the hairline cell grid,
  // because those figures are read as a set: `metrics` is a wall of results, `evidence` is three
  // cited findings beside a claim. This one is a different act. It is a single sentence the room
  // is meant to look up at, and three numbers underneath that exist to make the sentence
  // credible — so it centres, and it draws no grid at all. The whitespace is the composition:
  // claim at the top of the box, figures at the bottom, and nothing between them competing.
  //
  // THE MARKET NAME IS AN OVERLINE, NOT A PILL. The reference render draws each market in a
  // bordered, rounded box. A pill is a CONTROL's shape — the design system's `Chip` — and
  // nothing in this column is clickable, so the border would be describing an affordance that
  // is not there. The type carries it instead: uppercase, tracked, in the display face, which
  // is the deck's existing vocabulary for a label that names what follows it.
  //
  // THE FIGURE SHARES THE HEADLINE'S TYPE STEP, and the reference sets it larger. It cannot
  // here: `text-big-number-lg` (56px on this canvas) is the largest figure step the theme
  // declares, and inventing a step above it would put a raw length in a deck whose whole
  // contract is that lengths come from `deck-canvas.js` and everything visual comes from a
  // token. So the separation is done in COLOUR rather than size — the figures are the slide's
  // `--primary`, the claim is default ink with the marker under two phrases of it.
  //
  // THE COMPOSITION CENTRES IN THE BOX rather than pinning the claim to the top and the figures
  // to the bottom. `justify-between` is what the deck's other layouts do, and it is wrong here:
  // the reference sets its figures larger than its headline, this deck's largest figure token is
  // the same 56px as its largest heading, and the ~60px the figures do not take then collects as
  // one hole in the middle with the captions jammed against the frame's bottom rule. Centred
  // with a single `--spacing-xxl` between the two blocks, that slack splits above and below
  // instead, which is the reference's balance — roughly a fifth of the frame clear at each end.
  //
  // THE HEADLINE TAKES THE WHOLE CONTENT BOX, not the deck's `HEADLINE_MAX` (1024px). That cap
  // is the site's hero measure and it is right for a left-aligned claim, but here it breaks this
  // sentence over three lines — and a marked phrase that wraps takes its band with it, so
  // "the future / of the web" comes out as two ragged rectangles instead of one. The band IS the
  // emphasis; splitting it is the one thing this layout cannot do. At the full 1428 the sentence
  // sets in two balanced lines with a whole band on each, which is the reference's composition
  // and the reason the phrase — not a pre-split headline — is what the data carries.
  //
  // Which makes this the one slide that spends the accent twice. `evidence` refuses to, and is
  // right to: there the marked band and the figures sit side by side at the same eye level in a
  // 7/5 split, so a second orange reads as a competing mark. Here they are a third of the
  // artboard apart, top and bottom of the box, and are never read at once. The eyebrow is what
  // gets dropped instead — a third orange, on a slide whose headline already says which section
  // it belongs to.
  import { CONTENT, DESCRIPTION_MAX, span } from '../lib/deck-canvas.js'
  import MarkedText from './MarkedText.vue'

  defineProps({
    slide: { type: Object, required: true }
  })

  // A caption capped at three grid columns (339px), not at the third of the box it sits in.
  // Centred copy that runs the full width of its column loses its axis — the eye has to find a
  // new left edge on every line — and at this measure each caption breaks into the two or three
  // balanced lines the reference has.
  const CAPTION_MAX = span(3)
</script>

<template>
  <div class="flex h-full flex-col justify-center gap-(--spacing-xxl)">
    <!-- ── The claim ────────────────────────────────────────────────────────────────── -->
    <!-- `mx-auto` on the capped blocks rather than on the column: the column is the full
         content box, and centring the BOX would leave the two caps free to sit off-axis. -->
    <header class="flex flex-col items-center gap-(--spacing-xl) text-center">
      <h2
        class="m-0 text-balance text-heading-2xl text-(--text-default)"
        :style="{ maxWidth: `${CONTENT.width}px` }"
      >
        <MarkedText
          :text="slide.headline"
          :emphasis="slide.emphasis"
        />
      </h2>
      <p
        v-if="slide.description"
        class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
      >
        {{ slide.description }}
      </p>
    </header>

    <!-- ── The figures ──────────────────────────────────────────────────────────────── -->
    <!-- Three equal columns of the content box, each centred on its own axis, so the three
         labels, the three numbers and the three captions each align on one line across the
         slide. `items-start` would align the tops and let the numbers drift apart. -->
    <div class="grid grid-cols-3">
      <article
        v-for="metric in slide.metrics"
        :key="metric.overline ?? metric.value"
        class="flex flex-col items-center gap-(--spacing-lg) text-center"
      >
        <span
          v-if="metric.overline"
          class="text-overline-md text-(--text-default)"
          >{{ metric.overline }}</span
        >
        <span class="text-big-number-lg text-(--primary)">{{ metric.value }}</span>
        <p
          class="m-0 text-pretty text-heading-sm text-(--text-muted)"
          :style="{ maxWidth: `${CAPTION_MAX}px` }"
        >
          {{ metric.label }}
        </p>
      </article>
    </div>
  </div>
</template>
