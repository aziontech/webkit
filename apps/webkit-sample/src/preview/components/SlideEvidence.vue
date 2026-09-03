<script setup>
  // THE EVIDENCE SLIDE — a claim with one word marked, beside figures somebody else measured.
  //
  // The deck already has two ways to put a number on a slide, and this is neither. `metrics`
  // is a wall of OUR results under a header; `backdrop` puts three of them in a copy column
  // over the map. This one is the case for the problem: a short claim, the concerns it is
  // made of, and three industry figures with a source under each. Three things make it its
  // own layout rather than a variant of those.
  //
  // 1. THE MARKED WORD IS THE SLIDE. The claim is not that applications are complex; it is
  //    that they are TOO complex, and everything turns on the one word — so the headline is
  //    short, set at the top step, and carries the deck's marker through MarkedText (the same
  //    band `stack` uses; `emphasis` names the phrase, never a pre-split headline).
  //
  //    That band is also this slide's ONE piece of orange. Which is why the layout renders no
  //    overline — the deck's overlines carry an orange `//` — and why the figures opposite are
  //    set in `--text-default` rather than the `--primary` the `metrics` cells use. One accent
  //    per slide, and on this one it is the word.
  //
  // 2. THE CONCERNS ARE A ROW, NOT A LIST. Nine of them, wrapped: the count is the argument,
  //    and a numbered list would imply an order they do not have — every one has to be true at
  //    the same time, which is what makes the job hard. They are drawn here rather than
  //    composed from the design system's `Chip`, which is a CONTROL fixed at 24 or 32px with a
  //    12px label because it is sized for a filter bar; on a 1920px artboard those are the
  //    proportions of a caption. The row keeps the chip's shape and its exact tokens — the
  //    pill radius, the `--bg-surface` fill, the `--border-default` rule — at the scale this
  //    canvas reads at.
  //
  // 3. THE FIGURES ARE CITED. Each caption is two lines: the finding in the default ink, the
  //    house that measured it muted underneath. The source never folds into the caption's
  //    parentheses — a claim and its citation are two sentences, and only one of them is ours.
  //
  // The construction is `split`'s: the slide bleeds, the halves sit in a `gap-px` grid over a
  // `--border-default` fill, and every rule on it — the one between the halves, the two
  // between the figures — is that fill showing through a 1px gap rather than a border anybody
  // drew, so no junction can ever composite to a double weight. Seven columns to the claim,
  // five to the evidence: the claim is the subject, and five columns is the narrowest a
  // 56px figure over two lines of caption reads in.
  import MarkedText from './MarkedText.vue'

  defineProps({
    slide: { type: Object, required: true }
  })
</script>

<template>
  <div class="grid h-full grid-cols-12 gap-px bg-(--border-default)">
    <!-- ── The claim ────────────────────────────────────────────────────────────────── -->
    <div
      class="col-span-7 flex flex-col justify-center gap-(--spacing-xl) bg-(--bg-canvas) p-(--spacing-xxl)"
    >
      <h2 class="m-0 text-pretty text-heading-2xl text-(--text-default)">
        <MarkedText
          :text="slide.headline"
          :emphasis="slide.emphasis"
        />
      </h2>

      <ul
        v-if="slide.concerns"
        class="m-0 flex list-none flex-wrap gap-(--spacing-sm) p-0"
      >
        <li
          v-for="concern in slide.concerns"
          :key="concern"
          class="inline-flex items-center rounded-full border border-(--border-default) bg-(--bg-surface) px-(--spacing-lg) py-(--spacing-sm) text-label-lg text-(--text-default)"
        >
          {{ concern }}
        </li>
      </ul>
    </div>

    <!-- ── The evidence ─────────────────────────────────────────────────────────────── -->
    <!-- Three equal rows over the same fill, so the two rules between the figures meet the
         frame's right rule and the rule between the halves at exactly one pixel each. The
         figures centre in their cells: a number pinned to the bottom of a 296px cell reads as
         a footnote, which is the same call the `metrics` cells make. -->
    <div class="col-span-5 grid grid-rows-3 gap-px">
      <article
        v-for="metric in slide.metrics"
        :key="metric.value"
        class="flex flex-col justify-center gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
      >
        <span class="text-big-number-lg text-(--text-default)">{{ metric.value }}</span>
        <div class="flex flex-col gap-(--spacing-xs)">
          <p class="m-0 text-pretty text-heading-sm text-(--text-default)">{{ metric.label }}</p>
          <span
            v-if="metric.source"
            class="text-label-md text-(--text-muted)"
            >{{ metric.source }}</span
          >
        </div>
      </article>
    </div>
  </div>
</template>
