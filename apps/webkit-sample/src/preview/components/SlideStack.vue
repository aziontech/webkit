<script setup>
  // THE PRESSURE SLIDE — a claim on the left, the stack that causes it on the right.
  //
  // The deck's `statement` layout centres one sentence on an empty frame, because a slide with
  // one idea should have that idea at eye level and nothing else. This one keeps the sentence
  // and gives it its evidence: the same claim, beside a drawing of the graph it is about. So
  // it is a statement that has to share the frame, and every decision below follows from that.
  //
  // ── SIX COLUMNS AND SIX COLUMNS ──
  //
  // The halves are the content grid's own halves: `span(6)` (702) each with one 24px gutter
  // between them, which is 1428 — the content box, exactly. So the copy runs from column 1 to
  // 6 and the drawing from 7 to 12, and the copy's measure is the one every bullet list in the
  // deck already uses. The slide BLEEDS, so those two halves are positioned against the
  // frame's own rules rather than inside a second padding box.
  //
  // ── THE STATEMENT TAKES THE STEP ABOVE ──
  //
  // `text-heading-2xl` (56px on this canvas), not the `statement` layout's `text-heading-xl`.
  // A statement earns the largest step in the deck by BEING the slide; this one is half as
  // wide, and at 36px in a 702px column a sentence beside a full-height drawing reads as a
  // caption on it. The bigger step is what keeps the claim the subject and the drawing the
  // evidence — the same reason `section` gets 2xl for two words.
  //
  // IT IS AT THE COLUMN'S LIMIT, which is worth knowing before rewriting the copy. Measured on
  // the rendered slide, this sentence sets seven lines and 560px, and with the eyebrow above it
  // the block is 614 of the 694px the frame's content box has. A few more words still fit; a
  // second sentence does not, and nothing here clips — it would run past the frame's bottom
  // rule. A statement that long takes the `text-heading-xl` step instead.
  //
  // ── THE HIGHLIGHT IS A MARKER, AND THE DATA SAYS THE PHRASE, NOT THE SPAN ──
  //
  // The emphasized run is a real `<mark>`, painted with the deck's one colour and knocked out
  // of the page. Both the splitting and the band live in MarkedText, because `evidence` marks
  // a phrase too and the thing most likely to drift between two layouts is what the band looks
  // like. The rationale for the ink and for `box-decoration-clone` is recorded there.
  //
  // The deck data carries the PHRASE (`emphasis`), not a pre-split headline: the sentence stays
  // one readable string an editor can rewrite, and the emphasis is stated beside it.

  import Overline from '@aziontech/webkit/overline'
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'
  import { PRODUCT_STACK, TOOLS } from '@shared/ui/brand/tools.js'
  import { computed } from 'vue'

  import { FRAME, FRAME_PADDING, span } from '../lib/deck-canvas.js'
  import MarkedText from './MarkedText.vue'
  import ToolConstellation from './ToolConstellation.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  /** The drawing's box: the right half of the content grid, the frame's content height. */
  const DRAWING = {
    width: span(6), // 702 — columns 7-12
    height: FRAME.height - 2 * FRAME_PADDING - 2 // 694, the frame's rules taken off
  }

  const drawingStyle = computed(() => ({
    width: `${DRAWING.width}px`,
    height: `${DRAWING.height}px`
  }))

  // The marks are named in the deck data and resolved against the registries the marketing site
  // already reads — the same resolver the backdrop slide's logo row uses, for the same reason:
  // a name with no entry falls through to ClientMark's typographic wordmark, so the drawing
  // stays complete and a missing asset shows up on the slide instead of in a diff.
  //
  // It reads one registry MORE than that row does. `PRODUCT_STACK` is the list azion.com runs
  // under every product hero, and ten of its marks have no `TOOLS` entry at all — `Node.js`
  // and `Next.js` among them, which is exactly what this slide needs and precisely what
  // "the stack" means. The fallback is what surfaced the gap: both rendered as their own names
  // in a disc on the first pass, which is the registry doing its job.
  const REGISTRY = [...CLIENTS, ...TOOLS, ...PRODUCT_STACK]

  const nodes = computed(() =>
    (props.slide.stack ?? []).map((entry) => ({
      ...(REGISTRY.find((mark) => mark.name === entry.tool) ?? { name: entry.tool }),
      label: entry.label
    }))
  )
</script>

<template>
  <div class="grid h-full grid-cols-2 items-center gap-(--spacing-lg) p-(--spacing-xxl)">
    <div class="flex flex-col gap-(--spacing-xl)">
      <Overline
        v-if="slide.eyebrow"
        prefix="//"
        >{{ slide.eyebrow }}</Overline
      >

      <!-- One paragraph, in runs. `text-pretty` rather than `text-balance`: balance evens the
           line lengths of a short headline, and this is seven lines of prose — evening them
           would fight the marker bands, whose whole shape comes from where the run breaks. -->
      <p class="m-0 text-pretty text-heading-2xl text-(--text-default)">
        <MarkedText
          :text="slide.headline"
          :emphasis="slide.emphasis"
        />
      </p>
    </div>

    <!-- The drawing is `relative` and fixed to the half's box, because the constellation
         positions everything inside it absolutely — the mesh's svg fills it, and every node
         is placed at a point in its pixels. `justify-self-end` puts it on column 12, so its
         right edge is the frame's padding and not wherever the grid's cell happens to end. -->
    <div
      class="relative justify-self-end"
      :style="drawingStyle"
    >
      <ToolConstellation
        :box="DRAWING"
        :nodes="nodes"
      />
    </div>
  </div>
</template>
