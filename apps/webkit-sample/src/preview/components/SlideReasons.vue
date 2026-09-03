<script setup>
  // THE REASONS SLIDE — one claim inside the frame's margin, and the three things that make it
  // true as a BAND of the frame beside it, each backed by the marks of what it is made of.
  //
  // The deck already argues in this shape twice, and this is neither. `bullets` puts claims
  // UNDER a header, so the header is the subject and the rows elaborate it; `principle` puts
  // one instrument beside the claim, so there is exactly one piece of evidence. This slide has
  // a claim that only holds if THREE independent things are true, and the evidence for each is
  // not a sentence or a number but a set of marks a room already recognizes — so the reasons
  // run beside the claim, numbered, with their marks on the same line as the reason they back.
  //
  // ── THE SLIDE BLEEDS, AND THE SPLIT IS THE VISION SLIDE'S, TURNED ON ITS SIDE ──
  //
  // The layout is in SlideRenderer's `BLEED` set, so it owns its own padding — and it spends it
  // the way `vision` does: THE PROSE KEEPS THE FRAME'S MARGIN, THE PLANE DOES NOT. There the
  // pillars are a band across the frame's bottom and the copy above them is inset `--spacing-xxl`;
  // here the reasons are a band down the frame's right and the claim beside them is inset the
  // same. That is the whole point of a bleed layout — prose keeps the frame's margin, a plane is
  // measured off the frame's rules — and it is what turns three rows floating in the content box
  // into three bands OF the frame.
  //
  // Two things follow from it, and both are what the slide gains:
  //
  // 1. THE ROWS ARE THIRDS OF THE FRAME (886 / 3), not thirds of the 696px content box, so the
  //    band fills the frame's full height and the 96px of dead air above the first reason and
  //    below the last one is gone.
  // 2. A ROW'S DIVIDER REACHES THE FRAME'S RIGHT RULE. Before, it stopped at column 12 and left
  //    a 94px tail of canvas past it, which read as a table that had been cropped. A rule that
  //    ends on the frame's own rule reads as a division of the frame.
  //
  // ── WHERE THE DIVIDER SITS, AND WHY THE CLAIM DID NOT MOVE ──
  //
  // The claim's measure is unchanged: the frame's margin plus FOUR of the deck's own columns
  // (460px), which is the narrowest a `heading-2xl` sentence reads in on this canvas — 460 sets
  // "Fast to learn." on one line and no more, so a longer headline takes the `xl` step. What
  // used to be the grid's gutter between column 4 and column 5 is now where the band's left rule
  // is drawn, so the divider sits IN the gutter, on a grid line, and the prose clears it by
  // `--spacing-lg` — the same gap `vision` leaves between its label and the top of its band.
  //
  // The band takes everything east of that rule (1038px), and its rows are padded
  // `--spacing-xl` — a cell in a bleeding band is measured off its own edges, not off the
  // frame's margin, which is the call `vision`'s cells and `evidence`'s rows both make. That
  // leaves a 942px content box inside the row, 2px off the eight-column run the reasons had
  // before, so nothing inside the row had to be re-proportioned: five columns to the reason,
  // three to its cluster.
  //
  // The claim CENTRES against the band rather than sitting at its top: the band is three equal
  // bands of the frame and its optical centre is the canvas's, so a claim anchored to the top
  // would read as a label for the first reason instead of as the sentence all three answer to.
  //
  // ── ONE RULE PER EDGE, AND NO TICKS ──
  //
  // Every rule in the band is a FrameBox rule, subtracted with `flush` exactly as `vision`'s
  // cells subtract theirs. Each row's TOP is somebody else's (the frame's for the first, the
  // row above's for the rest) and its RIGHT is always the frame's, so each row draws only its
  // left and its bottom, and the last row flushes its bottom too. Three rows therefore draw one
  // continuous vertical hairline and two horizontal dividers — five edges, five single rules,
  // no junction that can composite to a double weight.
  //
  // NO CORNER TICKS ON THE ROWS (`marks="none"`), for the reason `vision` records: the frame's
  // own four ticks already mark this band's right-hand corners, and a tick at a row's corner
  // would put a third mark partway down a rule that already has one at each end.
  //
  // The band is NOT filled. `vision`'s cells take `--bg-surface-raised` because the map runs
  // behind them and an opaque surface is the only thing this page language allows to hide part
  // of a drawing. Nothing runs behind this band, so a fill would be a surface with no second
  // job — and the halves of `evidence`, the deck's other side-by-side bleed, are canvas for the
  // same reason. The rules define the band; the fill would only decorate it.
  //
  // ── THE NUMBER IS THE LAYOUT'S, NEVER THE DATA'S ──
  //
  // `reasons` is an ORDERED list, so its positions are a fact about the list and nothing in
  // data/deck.js types a figure. Exactly the discipline SlideHeading's `NN / NN` counter
  // states: the deck counts nothing by hand.
  //
  // It is typeset as a FIGURE, not as a badge: `big-number-lg` in `--primary`, centred against
  // the copy beside it, with no chip behind it. That is the deck's one way of stating a number — every
  // other figure in it is a bare `big-number` (`vision`, `backdrop` and `cells` in the accent,
  // `evidence` and `copy` in default and disabled ink) — and the filled orange square this row
  // used to draw was the only place the deck said it a second way. The square also inverted the
  // emphasis it was there to create: a 40px chip around a 16px `label-code` figure reads as the
  // chip, so the loudest thing in the row was a container and the number inside it was the
  // quietest.
  //
  // `lg` (56px) is the step, and it is the one every other figure in the deck takes — the deck
  // states a number ONE size, and a row band is the surface `vision`'s cells and `backdrop`'s
  // metrics already use it on. At 56px against the 30px `heading-lg` title the count LEADS the
  // band: it is the first thing read in each row, which is what an ordered list of three wants,
  // and the three figures make a column down the band that is legible before any word is. `sm`
  // (20px) was tried and fails: under the title's own size, the figure reads as a footnote
  // marker hung off it rather than as the count of a list.
  //
  // The accent still carries a figure rather than a label here, which is what it is for: the
  // overline's `//` opposite is the only other orange, and the marks are one flat white.
  //
  // ── A CLUSTER IS THREE OF THE DECK'S OWN COLUMNS ──
  //
  // Six marks as 3x2. The cluster is three of the row's eight columns and its cells are 96.75px
  // with the grid's own 24px gutters between them — the deck's column module to within a
  // quarter-pixel, so a mark's cell is still a grid column. What the bleed changes is the
  // cluster's right edge: it is no longer column 12 but `--spacing-xl` off the frame's right
  // rule, so the Figma build places a mark from the BAND's origin rather than from `columnX()`.
  //
  // The marks are named in the deck data and resolved against the registries the marketing site
  // already reads, exactly as `backdrop` and `stack` resolve theirs — plus one this slide is
  // the reason for. `standards.js` is the specifications a workload is written against (W3C,
  // TC39, IETF, JavaScript, WebAssembly, ONNX): not customers, not suppliers, so it could not
  // be folded into either list without changing what that list claims on the site page that
  // reads it. As there, a name with no entry falls through to ClientMark's typographic
  // wordmark, which is what keeps a cluster complete and surfaces a missing asset on the slide
  // rather than in a diff.
  //
  // ONE INK FOR ALL OF THEM (`monochrome`). A cluster whose job is "this is what the reason is
  // made of" is a list, and per-brand colour there sends the eye to the loudest mark instead of
  // to the set — with eighteen marks from six vendors' palettes, that is eighteen competing
  // colour statements. It is also what makes the standards row placeable at all: its marks are
  // a black wordmark, two knockout tiles and a yellow-and-grey mesh, and only a flatten puts
  // those on one surface at one weight.
  import FrameBox from '@aziontech/webkit/frame-box'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'
  import { STANDARDS } from '@shared/ui/brand/standards.js'
  import { PRODUCT_STACK, TOOLS } from '@shared/ui/brand/tools.js'
  import { computed } from 'vue'

  import { FRAME_PADDING, GRID, span } from '../lib/deck-canvas.js'
  import SlideHeading from './SlideHeading.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // The claim's column, from the deck's own constants rather than a fraction of the frame: the
  // frame's margin, four grid columns of measure, and the gutter the band's rule is drawn in.
  // 96 + 460 + 24 = 580, so the rule lands on the same grid line column 5 used to start at.
  const CLAIM_WIDTH = FRAME_PADDING + span(4) + GRID.gutter

  const REGISTRY = [...CLIENTS, ...TOOLS, ...PRODUCT_STACK, ...STANDARDS]

  const reasons = computed(() =>
    (props.slide.reasons ?? []).map((reason) => ({
      ...reason,
      marks: (reason.marks ?? []).map(
        (name) => REGISTRY.find((entry) => entry.name === name) ?? { name }
      )
    }))
  )

  // Which rules a row does NOT draw, because something else already did. `top` is always
  // someone else's — the frame's for the first row, the row above's for the rest — and `right`
  // is always the frame's. Only the last row's `bottom` needs naming, and only because it is
  // the one edge of the band that is the frame's rather than a divider.
  const rowFlush = (index) =>
    index === reasons.value.length - 1 ? ['top', 'right', 'bottom'] : ['top', 'right']
</script>

<template>
  <div
    class="grid h-full"
    :style="{ gridTemplateColumns: `${CLAIM_WIDTH}px minmax(0, 1fr)` }"
  >
    <!-- ── THE CLAIM ──────────────────────────────────────────────────────────────────
         Inside the frame's margin on the left and clear of the band's rule by the grid's own
         gutter on the right. The shared header block, unchanged and at the opener's step — the
         same call `principle` records: re-drawing the overline row here would be a second
         definition of the deck's own label idiom, and the two would drift the first time one of
         them moved. `step` / `steps` are deliberately not passed: the numbers on this slide are
         the reasons', and a second counter under the overline would compete with them. -->
    <div class="flex flex-col justify-center pl-(--spacing-xxl) pr-(--spacing-lg)">
      <SlideHeading
        :eyebrow="slide.eyebrow"
        :headline="slide.headline"
        :description="slide.description"
        size="2xl"
      />
    </div>

    <!-- ── THE REASONS ────────────────────────────────────────────────────────────────
         Three equal bands of the frame, flush to its top, right and bottom rules. `flex-1` on
         each row, not `auto` heights: three reasons of unequal copy length would otherwise
         place their clusters at three different pitches, and the eye reads a column of marks
         down the right before it reads a word. Equal bands with the content centred in each is
         what keeps the six clusters on one rhythm however the copy is rewritten. Same call the
         metrics cells make about a figure in a cell. -->
    <div class="flex flex-col">
      <FrameBox
        v-for="(reason, index) in reasons"
        :key="reason.title"
        :flush="rowFlush(index)"
        marks="none"
        class="flex-1"
      >
        <!-- The row's own grid is eight columns of its 942px content box (5 for the reason,
             3 for its cluster), so nothing inside is measured in anything but the module
             lib/deck-canvas.js defines. -->
        <article
          class="grid h-full grid-cols-8 items-center gap-x-(--spacing-lg) px-(--spacing-xl) py-(--spacing-lg)"
        >
          <div class="col-span-5 flex items-center gap-(--spacing-md)">
            <!-- The figure sits OUTSIDE the text block, so the title and the line under it start
                 on one vertical and the numbers form their own column down the slide. `w-10`
                 fixes that column, so a title starts at the same x whatever figure precedes it:
                 40px holds ONE digit of Proto Mono at this step (35.83px advance, measured) with
                 slack, which is every list this layout can hold — three equal bands of an 888px
                 frame are 296px each, so a list long enough to reach `10` has broken the band's
                 geometry long before it overflows the column. Past nine reasons it is `w-18`
                 (two digits measure 71.64px). 40px is also the chip's old footprint, so the
                 titles did not move when the chip came off.
                 `items-center` BALANCES the figure against the copy beside it, and it is the
                 same call the marks cluster on the right already makes. The alternative was
                 `items-baseline`, which sets the figure on the title's baseline — tidier against
                 one row, wrong down three: a figure hung off the title's first line inherits the
                 title's position, and the title's position depends on how many description lines
                 follow it, so the three figures came out at 271px and 296px pitch (measured).
                 Centred, each figure's midpoint lands on its band's to within 0.1px and the pitch
                 is the band's own 295.7px three times over. Same reason the rows are `flex-1`
                 rather than `auto`, one level up: the copy is rewritten, the rhythm is not. -->
            <span class="w-10 shrink-0 text-big-number-lg text-(--primary)">{{ index + 1 }}</span>

            <div class="flex flex-col gap-(--spacing-md)">
              <h3 class="m-0 text-heading-lg text-(--text-default)">{{ reason.title }}</h3>
              <p
                v-if="reason.description"
                class="m-0 text-pretty text-body-lg text-(--text-muted)"
              >
                {{ reason.description }}
              </p>
            </div>
          </div>

          <div
            v-if="reason.marks.length"
            class="col-span-3 grid grid-cols-3 items-center gap-(--spacing-lg)"
          >
            <div
              v-for="mark in reason.marks"
              :key="mark.name"
              class="flex items-center justify-center"
            >
              <ClientMark
                :client="mark"
                mark="h-10 w-auto max-w-24 object-contain"
                monochrome
              />
            </div>
          </div>
        </article>
      </FrameBox>
    </div>
  </div>
</template>
