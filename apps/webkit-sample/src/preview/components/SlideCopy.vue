<script setup>
  // THE COPY SLIDES — the five compositions that hold nothing but words.
  //
  // They differ only in where the words sit and which step of the type ladder they take, so
  // they share one file: splitting them would copy the same three elements five times.
  //
  //   title      the opener — the hero, verbatim, plus a footer strip
  //   section    a divider — the index at the top, the name at the bottom, hatch behind
  //   statement  one sentence, vertically centred, nothing else on the slide
  //   quote      a sentence with an attribution under a rule
  //   closing    the CTA — the hero shape again, with real buttons
  //
  // Every vertical extreme in here is deliberate. `title` and `closing` fill the frame;
  // `section` pushes its two blocks to opposite edges so a divider is recognisable at a
  // glance; `statement` and `quote` centre, because a slide with one idea on it should have
  // that idea at eye level.
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Overline from '@aziontech/webkit/overline'

  import { DESCRIPTION_MAX } from '../lib/deck-canvas.js'

  defineProps({
    slide: { type: Object, required: true }
  })

  // A statement and a quote are the two slides allowed to run wider than the hero cap: they
  // ARE the headline, so the cap that keeps a title from reading as a paragraph would instead
  // stack a single sentence into five short lines. `--container-5xl` is the step above.
  const STATEMENT_MAX = 1192
</script>

<template>
  <!-- ── title / closing: the hero shape ─────────────────────────────────────────────── -->
  <div
    v-if="slide.kind === 'title' || slide.kind === 'closing'"
    class="flex h-full flex-col justify-between gap-(--spacing-xl)"
  >
    <HeroTitle
      :eyebrow="slide.eyebrow"
      :highlight="slide.highlight || ''"
      :title="slide.headline"
      :description="slide.description || ''"
      class="flex-1 justify-center"
    >
      <template
        v-if="slide.actions"
        #actions
      >
        <!-- Real buttons, so the CTA on the closing slide carries the same height, radius and
             token pair the product's own primary action does. -->
        <Button
          v-for="(action, i) in slide.actions"
          :key="action"
          :label="action"
          :kind="i === 0 ? 'primary' : 'outlined'"
          size="large"
        />
      </template>
    </HeroTitle>

    <!-- The footer strip: the mark, then the deck's own metadata, divided by hairlines. It is
         the one place the brand appears, and it appears at the size the site's nav uses. -->
    <footer
      v-if="slide.meta"
      class="flex shrink-0 items-center gap-(--spacing-lg) border-t border-(--border-muted) pt-(--spacing-lg)"
    >
      <Brand
        kind="default"
        size="medium"
      />
      <span
        v-for="item in slide.meta"
        :key="item"
        class="text-label-md text-(--text-muted) before:mr-(--spacing-lg) before:text-(--text-disabled) before:content-['/']"
        >{{ item }}</span
      >
    </footer>
  </div>

  <!-- ── section: the divider ────────────────────────────────────────────────────────── -->
  <div
    v-else-if="slide.kind === 'section'"
    class="flex h-full flex-col justify-between"
  >
    <!-- The index is the only place in the deck a number is set in the display face at the
         top of the ladder. It is muted, not primary: a divider announces a section, it does
         not compete with the headline that follows on the next slide. -->
    <span class="text-big-number-lg text-(--text-disabled)">{{ slide.index }}</span>
    <div class="flex flex-col gap-(--spacing-lg)">
      <h2 class="m-0 text-balance text-heading-2xl text-(--text-default)">{{ slide.headline }}</h2>
      <p
        v-if="slide.description"
        class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
      >
        {{ slide.description }}
      </p>
    </div>
  </div>

  <!-- ── statement / quote: one idea, at eye level ───────────────────────────────────── -->
  <div
    v-else
    class="flex h-full flex-col justify-center gap-(--spacing-xl)"
  >
    <p
      class="m-0 text-balance text-(--text-default)"
      :class="slide.kind === 'quote' ? 'text-heading-lg' : 'text-heading-xl'"
      :style="{ maxWidth: `${STATEMENT_MAX}px` }"
    >
      {{ slide.headline }}
    </p>
    <!-- The attribution hangs under its own rule, at the width of the copy above it, so the
         rule reads as part of the frame rather than as an underline. -->
    <div
      v-if="slide.attribution"
      class="flex flex-col gap-(--spacing-md) border-t border-(--border-muted) pt-(--spacing-lg)"
      :style="{ maxWidth: `${STATEMENT_MAX}px` }"
    >
      <Overline prefix="//">{{ slide.attribution }}</Overline>
    </div>
  </div>
</template>
