<script setup>
  // The header block every content slide opens with: the overline, the headline, and one
  // supporting line. Same anatomy and same order as the design system's own section header
  // (Overline with a `//` prefix and a blinking cursor, then an h2, then a muted line), so a
  // slide's head reads like a band of the marketing site rather than like a slide template.
  //
  // The caps are the system's: the headline takes the hero cap and the description the
  // narrower prose cap, both from lib/deck-canvas.js — a headline that runs the full 1428px
  // content box reads as a paragraph, not as a title.
  import Overline from '@aziontech/webkit/overline'

  import { DESCRIPTION_MAX, HEADLINE_MAX } from '../lib/deck-canvas.js'

  defineProps({
    eyebrow: { type: String, default: '' },
    headline: { type: String, default: '' },
    description: { type: String, default: '' },
    /** Headline type step: `xl` for a content slide, `2xl` for an opener. */
    size: { type: String, default: 'xl' }
  })
</script>

<template>
  <header class="flex flex-col gap-(--spacing-lg)">
    <Overline
      v-if="eyebrow"
      prefix="//"
      show-cursor
      >{{ eyebrow }}</Overline
    >
    <h2
      class="m-0 text-balance text-(--text-default)"
      :class="size === '2xl' ? 'text-heading-2xl' : 'text-heading-xl'"
      :style="{ maxWidth: `${HEADLINE_MAX}px` }"
    >
      {{ headline }}
    </h2>
    <p
      v-if="description"
      class="m-0 text-pretty text-heading-sm text-(--text-muted)"
      :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
    >
      {{ description }}
    </p>
  </header>
</template>
