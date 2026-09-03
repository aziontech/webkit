<script setup>
  // THE BEFORE-AND-AFTER SLIDE — the same application, twice, and the difference is a number.
  //
  // Two halves of one frame, each with its own head and its own drawing: on the left the stack
  // an application is assembled from today, on the right the path through the platform. The
  // claim is TIME, and it is made the only way a duration can be — by printing the two of them
  // in the same sentence with one word changed.
  //
  // ── WHY THIS IS NOT THE `versus` SLIDE AGAIN ──
  //
  // `versus` also splits the frame on a divider, so the question is fair. It argues with a
  // TABLE: fourteen adjectives in seven pairs, and two maps whose only variable is how many
  // nodes are lit. Its claim is a COUNT. This slide draws no list and no map — it draws two
  // PATHS, and its claim is how long each one takes to walk. Neither argument is available to
  // the other composition: a pair of adjectives cannot state three months, and a drawn path
  // cannot state seven differences.
  //
  // ── THE SLIDE HAS NO HEADLINE, AND THAT IS THE COMPOSITION ──
  //
  // Every other slide in the deck sets one head and everything under it is that head's
  // evidence. There are two claims here, one per side, and they are peers — so each column
  // heads itself at the deck's headline step (`heading-xl`) and there is no third line above
  // them. A single headline over both would have to summarise the comparison, which is exactly
  // what the two heads already do twice, and it would push both drawings down by its own
  // height for nothing. The line a speaker would have used is in the notes.
  //
  // The heads CENTRE, against the deck's left-set rule, for the reason the `versus` head
  // centres: this body is symmetric about the frame's centre line, and a left-set head over a
  // symmetric half reads as a caption that missed its column.
  //
  // ── ONE SIDE IS DIMMER, WHICH IS THE WHOLE COLOUR STORY ──
  //
  // The left column — head, claim and all — is `--text-muted`; the right is `--text-default`.
  // That is the same two-ink grammar `versus` uses for `Legacy` against `Azion`, and it means
  // the contrast costs no colour: the reference render tints the word "Azion" orange, and the
  // orange on this slide is spent twice already — on the deploy path down the right-hand
  // drawing, and on the one marker band.
  //
  // THE BAND IS ON `1 week` AND NOWHERE ELSE. Both claims are the same sentence, so the number
  // is the only thing that changed and the deck's one emphasis belongs on it. Marking both
  // would make the two sides equally loud and cancel the argument; marking neither would leave
  // the slide's single measured fact set as body copy.
  //
  // ── THE TWO DRAWINGS ARE REGISTERED, AND ONE OF THEM IS A QUOTE ──
  //
  // Both boxes are the same 736x622, centred in their half, so the two arguments are compared
  // at one scale rather than at whichever size each drawing happened to need.
  //
  // The left one is `ToolConstellation` — the SAME drawing the `stack` slide opened this
  // section with, reading the same nine marks from the same list. That is deliberate and it is
  // the reason this layout invents nothing for its left half: the room has already read that
  // tangle and been told nobody in it chose badly, so quoting it back is a shorter argument
  // than drawing a new one. Only the right half is new, because only the right half is a claim
  // the deck has not made yet.
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'
  import { PRODUCT_STACK, TOOLS } from '@shared/ui/brand/tools.js'
  import { computed } from 'vue'

  import { FRAME } from '../lib/deck-canvas.js'
  import MarkedText from './MarkedText.vue'
  import PlatformFanout from './PlatformFanout.vue'
  import ToolConstellation from './ToolConstellation.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // ── THE BAND'S GEOMETRY, IN CANVAS PIXELS ────────────────────────────────────────────────
  //
  // Stated rather than inherited, because the two drawings position everything inside a box
  // they are HANDED — a box a flex layout rounded differently on one side would put the two
  // cones at two scales. The two lengths that are not derived mirror pinned tokens (see
  // CANVAS_TOKENS in lib/deck-canvas.js): the layout's inset is `--spacing-xl` and the gutter
  // off the divider is `--spacing-lg`. This slide bleeds, so it owns both.
  const INSET = 48 // --spacing-xl @ xl
  const GUTTER = 24 // --spacing-lg @ xl

  // The head's height, declared rather than measured, so the drawings do not move when the copy
  // is rewritten: one line of `text-heading-xl` (36px at 125%), the `--spacing-md` under it, and
  // two lines of `text-heading-sm`. A claim that grows to three lines overruns this box visibly
  // instead of silently shortening both drawings.
  const HEAD = 120

  /** Inside the frame's rules — the box `h-full` resolves to. */
  const BOX = { width: FRAME.width - 2, height: FRAME.height - 2 }

  // Each half is 761 wide; the drawing takes it less one gutter off the divider, and the extra
  // pixel the right half loses to the divider's own rule is taken off BOTH so the two boxes are
  // identical by construction rather than by one being a pixel wider than its opposite.
  const DRAWING = {
    width: (BOX.width - 2 * INSET) / 2 - GUTTER - 1, // 736
    height: BOX.height - 2 * INSET - HEAD - INSET // 622
  }

  /** The claim's measure — narrow enough that the sentence sets two lines under its head. */
  const CLAIM = 320

  const headStyle = { height: `${HEAD}px` }
  const claimStyle = { maxWidth: `${CLAIM}px` }
  const drawingStyle = {
    width: `${DRAWING.width}px`,
    height: `${DRAWING.height}px`
  }

  // The marks are named in the deck data and resolved against the registries the marketing site
  // already reads — the same three the `stack` slide reads, in the same order, because it is
  // the same list. A name with no entry falls through to ClientMark's typographic wordmark, so
  // the drawing stays complete and a missing asset shows up on the slide instead of in a diff.
  const REGISTRY = [...CLIENTS, ...TOOLS, ...PRODUCT_STACK]

  const nodes = computed(() =>
    (props.slide.stack ?? []).map((entry) => ({
      ...(REGISTRY.find((mark) => mark.name === entry.tool) ?? { name: entry.tool }),
      label: entry.label
    }))
  )

  const sides = computed(() => props.slide.sides ?? [])
  const delivery = computed(() => props.slide.delivery ?? {})
</script>

<template>
  <div class="grid h-full grid-cols-2 p-(--spacing-xl)">
    <!-- ── BEFORE ───────────────────────────────────────────────────────────────────────
         The stack as it is, quoted from the slide that opened this section. -->
    <section class="flex min-w-0 flex-col items-center gap-(--spacing-xl) pr-(--spacing-lg)">
      <header
        class="flex shrink-0 flex-col items-center gap-(--spacing-md) text-center"
        :style="headStyle"
      >
        <h2 class="m-0 text-heading-xl text-(--text-muted)">{{ sides[0]?.title }}</h2>

        <p
          class="m-0 text-balance text-heading-sm text-(--text-muted)"
          :style="claimStyle"
        >
          {{ sides[0]?.claim }}
        </p>
      </header>

      <!-- `relative`, because the constellation places its mesh and every node in this box's
           own pixels. -->
      <div
        class="relative"
        :style="drawingStyle"
      >
        <ToolConstellation
          :box="DRAWING"
          :nodes="nodes"
        />
      </div>
    </section>

    <!-- ── AFTER ────────────────────────────────────────────────────────────────────────
         The divider is this half's own rule — one edge, one owner — and it runs the frame's
         full content height rather than the drawings' alone: with no headline above them the
         two columns are separate top to bottom, which is what the slide is saying. -->
    <section
      class="flex min-w-0 flex-col items-center gap-(--spacing-xl) border-l border-(--border-default) pl-(--spacing-lg)"
    >
      <header
        class="flex shrink-0 flex-col items-center gap-(--spacing-md) text-center"
        :style="headStyle"
      >
        <h2 class="m-0 text-heading-xl text-(--text-default)">{{ sides[1]?.title }}</h2>

        <p
          class="m-0 text-balance text-heading-sm text-(--text-default)"
          :style="claimStyle"
        >
          <MarkedText
            :text="sides[1]?.claim ?? ''"
            :emphasis="sides[1]?.emphasis"
          />
        </p>
      </header>

      <div
        class="relative"
        :style="drawingStyle"
      >
        <PlatformFanout
          :box="DRAWING"
          :author="delivery.author"
          :network="delivery.network"
          :consumers="delivery.consumers"
        />
      </div>
    </section>
  </div>
</template>
