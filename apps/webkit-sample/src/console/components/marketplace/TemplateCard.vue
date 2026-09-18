<script setup>
  // Shared framework-template card: a start-aligned COLUMN — the framed brand mark, then
  // the title, then the sentence. The tile the mark sits in is the catalog's own
  // (./IntegrationCard.vue), so a framework card and a published row frame their mark the
  // same way; what stacks it rather than laying it out sideways is that this card is
  // browsed in a grid, where a column packs more marks into a screen than a row does.
  // The logo is grayscale until hover, over a soft brand-color glow. Used by both the
  // Marketplace template grid and the Creation Center recommended templates.
  import CardBox from '@aziontech/webkit/card-box'

  defineProps({
    // Brand logo class (`ai-cor ai-*` colored, or `ai ai-*` monochrome).
    icon: { type: String, required: true },
    // What the MARK needs to survive the dark theme, from the catalog
    // (../../lib/data/frameworks.js → `DARK_INK_MARKS`). Empty for almost every logo:
    // a font glyph paints in `currentColor` and a colored logo carries its own colors,
    // so only the ones drawn in hard-coded dark ink (Next.js) get a filter here.
    markClass: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    // Framework brand hex, used for the soft hover glow.
    color: { type: String, default: 'var(--primary)' }
  })

  const emit = defineEmits(['select'])

  // Soft radial glow from the framework's brand color, revealed on hover. Its origin
  // sits over the MARK rather than over the card's midline: the column is start-aligned,
  // so the mark is at ~18% of the width and a wash centred on the card reads as a
  // highlight over nothing.
  const glow = (color) => `radial-gradient(120% 90% at 18% 0%, ${color}33, transparent 62%)`

  const activate = (event) => emit('select', event)
</script>

<template>
  <CardBox
    class="group relative cursor-pointer"
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <!-- Brand-color glow, faded in on hover (behind the content). -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-100 motion-reduce:transition-none"
        :style="{ background: glow(color) }"
      />
      <!-- START-ALIGNED, and anchored to the TOP of a stretched card rather than centred
           in it: the grid makes a row as tall as its tallest card, and a column that
           floats in that slack puts each card's mark and title at a different height
           along the row. Anchored, the marks share a line and the titles share a line. -->
      <div class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-left">
        <!-- The framed tile, the same 40px shell every mark in this catalog sits in
             (./IntegrationCard.vue) — so a framework row and an Azion row put their mark
             in the same place at the same size. -->
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
        >
          <!-- `text-(--text-default)` IS THE MARK'S INK, and it has to be stated. Half
               this catalog's marks are FONT GLYPHS — every Azion product glyph, and the
               fifteen frameworks with no colored logo — which paint in `currentColor`;
               nothing on the way down to this element set a color, so they inherited the
               document's black and rendered black-on-black in the dark theme. Measured:
               `color: rgb(0, 0, 0)` on both themes, with `grayscale(1)` unable to help
               (grey of black is black). The token follows the theme, so the same glyph is
               near-black on light and near-white on dark, and `markClass` handles the
               other half — a colored logo whose ink is hard-coded dark (see the prop
               above). -->
          <i
            :class="[icon, markClass]"
            class="text-[1.25rem] leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <h3 class="text-label-md text-(--text-default)">{{ title }}</h3>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</template>
