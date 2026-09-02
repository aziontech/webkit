<script setup>
  // THE TESTIMONIAL SLIDE — a photograph as the ground, one opaque card of speech on it.
  //
  // The deck already has a `quote`: a sentence at the centre of an empty frame, which is the
  // shape for a line the DECK is making — our own rule, our own premise. This one is the shape
  // for a line somebody ELSE said. The difference is the photograph: a borrowed sentence needs
  // the person it was borrowed from in the room, and a face is the only way a slide does that.
  //
  // ── THE THREE LAYERS ──
  //
  //   1. THE PHOTOGRAPH, full bleed, cut by the frame's rules — the ground, not an element
  //      placed on the slide (`backdrop`'s inversion, with a photo instead of the map).
  //   2. THE VEIL, one flat step of canvas over all of it.
  //   3. THE CARD, opaque, on the first four grid columns, vertically centred.
  //
  // WHY THE PHOTOGRAPH IS GREYSCALE. The deck is one ink and one accent: white type on black,
  // orange once per slide. A colour photograph at 1620x888 is not a slide with a picture on it,
  // it is a slide of a picture, and every token'd surface after it reads as washed out by
  // comparison. Desaturating it makes the photo a TEXTURE in the deck's own palette — which is
  // what then lets the card's two orange marks be the only colour on the artboard.
  //
  // WHY THE CARD IS OPAQUE, AND HAS NO BORDER. A glass panel over a face is a legibility bet
  // that depends on the photo, and the photo is a file somebody drops in later. An opaque
  // `--bg-surface` panel is legible over anything, and it needs no rule to separate it from the
  // ground — its own fill already does that. Adding one would also put a second hairline inside
  // the frame's, which is the one unmistakable failure of this page language.
  //
  // WHY THE MARK HANGS. The opening quote glyph sits in the card's padding, LEFT of the text
  // column, so the sentence's first line starts on the same measure as every other line. A
  // glyph in flow would indent line one by its own width and the block would read as ragged on
  // the side that should be the straightest.
  import DitherBanner from '@shared/ui/banners/DitherBanner.vue'
  import { computed, ref } from 'vue'

  import { span } from '../lib/deck-canvas.js'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // FOUR OF THE TWELVE COLUMNS (460), held one `--spacing-xxl` off the frame's left rule — so
  // the card's left edge lands on the content box's origin and its right edge on column 4's,
  // exactly where a third of a cell grid ends. Its inner padding is `--spacing-xl`, leaving a
  // 364px measure: about 25 characters of `heading-md`, which is four lines for a sentence of
  // this length and the width a pull quote is legible at.
  const cardStyle = computed(() => ({ width: `${span(4)}px` }))

  // The file is dropped into `public/quotes/` by hand (see the README there), so the slide has
  // to survive its absence: an unresolved `src` renders as a broken-image glyph, which is the
  // one thing worse on a slide than no photograph at all. On `error` the ground falls back to
  // the deck's own dither texture — the same fallback logic the app's avatars use for a missing
  // portrait, and the composition still reads, because the card was never transparent.
  const failed = ref(false)
  const photo = computed(() => Boolean(props.slide.image) && !failed.value)
</script>

<template>
  <div class="relative flex h-full items-center overflow-hidden">
    <!-- ── THE GROUND ───────────────────────────────────────────────────────────────────
         `alt` is empty on purpose. The figure's caption names the person and their role, so
         a description of the photograph would repeat the caption to a screen reader and add
         nothing — the portrait carries no information the words beside it do not. -->
    <img
      v-if="photo"
      :src="slide.image"
      alt=""
      class="absolute inset-0 size-full object-cover grayscale"
      @error="failed = true"
    />

    <!-- The ramp runs dark at the card and dense away from it, so the texture is at its
         quietest exactly where the words are. Its ink is dropped to a fifth of the deck's,
         because this is a ground standing in for a photograph, not a cover panel. -->
    <DitherBanner
      v-else
      class="[--dither-direction:to_right] [--dither-ink:color-mix(in_srgb,var(--text-default)_20%,transparent)]"
    />

    <!-- ── THE VEIL ─────────────────────────────────────────────────────────────────────
         One flat quarter-step of canvas, not a gradient: a ramp would announce an edge, and
         there is nothing here to dissolve — the photo is meant to reach all four rules.
         What it buys is measured. Unveiled, this photograph peaks at 252 of 255 — brighter
         than the deck's own type white (250), which is otherwise the lightest ink on any
         slide — and averages 115; at 25% it peaks at 189 and averages 86. So the picture
         sits IN the palette rather than on top of it, and no slide that follows reads dim
         by comparison.

         What the veil does NOT buy is the frame, and no value of it would. FrameBox draws
         its rules, corner ticks and hatch in `--border-default`, a DARK step, so a mid-grey
         photograph running to the rules simply swallows them — measured contrast 1.07-1.6
         along the top and right, against 3.35 at the one point the film happens to be
         bright. Dimming makes that worse, not better: the veil moves the photo TOWARD the
         rule's own value. A full-bleed photograph costs the deck's frame; this is the one
         slide that pays it, which is why the card is held to the grid instead — its edges
         land on columns 1 and 4 — and why nothing else in the deck bleeds anything
         brighter than the map. -->
    <div
      v-if="photo"
      aria-hidden="true"
      class="absolute inset-0 bg-[color-mix(in_srgb,var(--bg-canvas)_25%,transparent)]"
    />

    <!-- ── THE CARD ─────────────────────────────────────────────────────────────────────
         `figure` / `blockquote` / `figcaption` is the markup a quotation with an attribution
         actually has, so the name and the role are read as the source of the sentence rather
         than as two more lines of text near it. -->
    <figure
      class="relative m-0 ml-(--spacing-xxl) flex flex-col gap-(--spacing-lg) bg-(--bg-surface) p-(--spacing-xl)"
      :style="cardStyle"
    >
      <!-- One step above the sentence it opens, so the mark is legible at the back of a room
           without becoming the thing the eye lands on first. `leading-none` is what keeps the
           glyph's own line box from pushing it below the first line of the quote. -->
      <span
        aria-hidden="true"
        class="absolute left-(--spacing-md) top-(--spacing-lg) text-heading-xl leading-none text-(--primary)"
        >&ldquo;</span
      >

      <blockquote class="m-0 text-heading-md text-(--text-default)">
        {{ slide.headline }}
      </blockquote>

      <!-- The rule is the card's second and last orange mark: the glyph opens the sentence,
           this closes it and hands over to the name. Half the measure, so it reads as a
           tick under the quote rather than as an underline of it. -->
      <span
        aria-hidden="true"
        class="block w-1/2 border-t-2 border-(--primary)"
      />

      <figcaption class="flex flex-col gap-(--spacing-xxs)">
        <span class="text-heading-sm text-(--text-default)">{{ slide.attribution }}</span>
        <span
          v-if="slide.role"
          class="text-body-md text-(--text-muted)"
          >{{ slide.role }}</span
        >
      </figcaption>
    </figure>
  </div>
</template>
