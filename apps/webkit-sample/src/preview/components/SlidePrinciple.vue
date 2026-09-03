<script setup>
  // THE PRINCIPLE SLIDE — one claim on the left, and the instrument that enforces it on the
  // right.
  //
  // Every other content slide in this deck argues in one direction: a header, then the
  // evidence UNDER it (bullets, cells, a snippet). This one argues across. The claim is a
  // sentence a room can repeat, and beside it sits a readout with real numbers in it — so the
  // slide is not "we have budgets", it is "here is the budget, and here is how much of it
  // this component has already spent".
  //
  // ── THE TWO HALVES ARE SIX GRID COLUMNS EACH ──
  //
  // `grid-cols-2` over the content box with a `--spacing-lg` gap resolves to exactly the
  // deck's own columns: 702 + 24 + 702 = 1428, which is span(6) + gutter + span(6) from
  // lib/deck-canvas.js. So the panel's left edge lands on column 7 in the browser and in the
  // Figma build with no coordinate written down here.
  //
  // The slide does NOT bleed (it is absent from SlideRenderer's `BLEED` set): both halves are
  // objects sitting inside the frame's padding box, which is what the panel needs in order to
  // read as an instrument placed on the slide. Bled — butted to the frame's right and bottom
  // rules — the panel becomes the slide's ground instead, and then the claim competes with it
  // rather than being illustrated by it.
  //
  // `items-center` centres each half independently, so the panel stays optically level with
  // the claim whether it carries three facts or six. Anchoring both to the top ties the
  // composition to the panel's height, and the claim then drifts as soon as a meter is added.
  //
  // ── THE CLAIM IS THE SHARED HEADER BLOCK, AT THE OPENER'S STEP ──
  //
  // The left half is SlideHeading, unchanged: the overline, the `NN / NN` counter it draws
  // when a slide is one of a numbered run, the headline and the supporting line. Re-drawing
  // that row here would be a second definition of the deck's own label idiom, and the two
  // would drift the first time one of them moved.
  //
  // It takes `size="2xl"`, which SlideHeading documents as the OPENER's step. That is
  // deliberate and it is the one convention this layout bends: the claim is the slide's
  // subject rather than its title, and at the content step (`xl`, 36px) a headline set in a
  // 702px half reads as a paragraph heading for the panel beside it instead of as a statement
  // the panel answers to. 56px is still the top of the semantic ladder on this canvas — the
  // reference this layout was built from sets its headline nearer 70px, a step that does not
  // exist as a token, and a slide is not where the type scale gets extended.
  //
  // ── THE PANEL IS A FRAMEBOX WITH A FILL ──
  //
  // Same choice the vision slide's pillars make, for the same reason: FrameBox draws the
  // rules and the four registration ticks the deck's language is made of, so the panel is
  // visibly drawn on the grid instead of being a card borrowed from another system. The fill
  // is `--bg-surface-raised` (#141414) — the one step that reads as a surface on this black
  // canvas while still letting the `--border-default` hairline lead (see SlideVision's note
  // on why `--bg-surface` and `--bg-surface-overlay` both fail that test).
  //
  // Its three bands — header, body, footer — are divided by single hairlines that run the
  // panel's full width and meet its side rules, so the panel is one frame in three bands
  // rather than three stacked cards. The internal rule inside the BODY is the exception: it
  // sits inside the body's padding, because it divides two blocks of the same band.
  //
  // THE DOT IS THE LAYOUT'S, NOT THE DATA'S. A readout that is live says so with one lit
  // mark; making it a prop would add API surface for a single 6px square that every panel
  // wants anyway. It does not blink — the one blinking thing in this deck is the overline's
  // cursor, and a second one turns a proof into a dashboard.
  //
  // ── THE METERS ARE THE DESIGN SYSTEM'S PROGRESSBAR ──
  //
  // Not a hand-built track and fill. It already owns the track token, the fill in the brand
  // orange, the flat shape and the `aria-valuenow` trio — and a meter is exactly what it is
  // for. Each row is label / bar / readout with the label and readout columns at fixed
  // widths, so every bar starts and ends on the same vertical however long a label wraps.
  // That alignment is what lets three budgets at wildly different scales (2.5 KB and 48 KB)
  // be read as fractions, which is the whole point of a budget being per entry.
  import FrameBox from '@aziontech/webkit/frame-box'
  import ProgressBar from '@aziontech/webkit/progress-bar'

  import SlideHeading from './SlideHeading.vue'

  defineProps({
    slide: { type: Object, required: true }
  })

  /** `1.84 / 2.5 KB` — the unit is written once, after the ceiling. */
  const readout = (meter) => `${meter.value} / ${meter.max}${meter.unit ? ` ${meter.unit}` : ''}`
</script>

<template>
  <div class="grid h-full grid-cols-2 items-center gap-x-(--spacing-lg)">
    <!-- ── THE CLAIM ──────────────────────────────────────────────────────────────────
         No copy cap is bound here: HEADLINE_MAX (1024) and DESCRIPTION_MAX (752), which
         SlideHeading applies, are both wider than this 702px half — so the column IS the cap
         and the caps never bite. -->
    <SlideHeading
      :eyebrow="slide.eyebrow"
      :step="slide.step"
      :steps="slide.steps"
      :headline="slide.headline"
      :description="slide.description"
      size="2xl"
    />

    <!-- ── THE READOUT ────────────────────────────────────────────────────────────── -->
    <FrameBox
      v-if="slide.panel"
      class="bg-(--bg-surface-raised)"
    >
      <header
        class="flex items-center justify-between gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg)"
      >
        <span class="text-overline-md text-(--text-default)">{{ slide.panel.title }}</span>
        <span class="size-1.5 shrink-0 rounded-full bg-(--primary)" />
      </header>

      <div class="flex flex-col p-(--spacing-xl)">
        <!-- The facts are a two-column grid rather than a stack of flex pairs, so every value
             starts on one vertical — the alignment a mono readout is read down. The colon
             belongs to the layout, not to the data: it is punctuation, not content. -->
        <dl
          v-if="slide.panel.facts"
          class="m-0 grid grid-cols-[auto_1fr] gap-x-(--spacing-md) gap-y-(--spacing-sm)"
        >
          <template
            v-for="fact in slide.panel.facts"
            :key="fact.key"
          >
            <dt class="m-0 text-label-code-md text-(--text-muted)">{{ fact.key }}:</dt>
            <dd class="m-0 text-label-code-md text-(--text-default)">{{ fact.value }}</dd>
          </template>
        </dl>

        <section
          v-if="slide.panel.meters"
          class="mt-(--spacing-lg) flex flex-col gap-(--spacing-md) border-t border-(--border-default) pt-(--spacing-lg)"
        >
          <!-- The block label at the overline step, muted — the same label the bullets slide's
               aside carries over its rows. -->
          <span
            v-if="slide.panel.label"
            class="text-overline-sm text-(--text-muted)"
            >{{ slide.panel.label }}</span
          >

          <ul class="m-0 flex list-none flex-col gap-(--spacing-md) p-0">
            <li
              v-for="meter in slide.panel.meters"
              :key="meter.label"
              class="flex items-center gap-(--spacing-md)"
            >
              <span class="w-40 shrink-0 text-pretty text-body-md text-(--text-default)">{{
                meter.label
              }}</span>

              <ProgressBar
                class="flex-1"
                :value="meter.value"
                :max="meter.max"
                :aria-label="meter.label"
              />

              <span class="w-28 shrink-0 text-right text-label-code-md text-(--text-default)">{{
                readout(meter)
              }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- The consequence line, in the deck's one colour: what happens when a meter fills. It
           is the only place on the slide where orange carries a sentence rather than a label,
           which is what makes it the last thing read. -->
      <footer
        v-if="slide.panel.note"
        class="border-t border-(--border-default) px-(--spacing-xl) py-(--spacing-lg)"
      >
        <span class="text-label-code-md text-(--primary)">{{ slide.panel.note }}</span>
      </footer>
    </FrameBox>
  </div>
</template>
