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

  const props = defineProps({
    eyebrow: { type: String, default: '' },
    /** Place in the section row, stamped by data/deck.js. Pass BOTH to show the counter. */
    step: { type: Number, default: 0 },
    /** Length of the section row, stamped by data/deck.js. */
    steps: { type: Number, default: 0 },
    headline: { type: String, default: '' },
    description: { type: String, default: '' },
    /** Headline type step: `xl` for a content slide, `2xl` for an opener. */
    size: { type: String, default: 'xl' }
  })

  // THE COUNTER IS OPT-IN, AND ITS NUMBERS ARE NEVER TYPED. Every slide carries `step` /
  // `steps` (data/deck.js stamps them from the section rows), so showing the counter wherever
  // they exist would put one on every slide of every multi-slide section. A layout that means
  // to say "this is one of a run" passes them through; the rest do not, and the header is
  // unchanged. Two digits always, so `05` and `12` are the same width and the figure does not
  // move under the overline beside it.
  const counted = () => props.steps > 1 && props.step > 0
  const pad = (value) => String(value).padStart(2, '0')
</script>

<template>
  <header class="flex flex-col gap-(--spacing-lg)">
    <!-- The eyebrow row. WITH a counter it is the principle slide's row exactly — the orange
         names the claim, a hairline separates naming from counting, and the mono figure is the
         position — and the Overline drops its `//` prefix and its cursor, because a prefix, a
         blinking cursor and a figure on one line are three marks competing to be read first.
         Without a counter it is the plain header the rest of the deck opens with. -->
    <div
      v-if="eyebrow || counted()"
      class="flex items-center gap-(--spacing-md)"
    >
      <Overline
        v-if="eyebrow"
        :prefix="counted() ? '' : '//'"
        :show-cursor="!counted()"
        >{{ eyebrow }}</Overline
      >
      <template v-if="counted()">
        <span class="h-px w-24 shrink-0 bg-(--border-default)" />
        <span class="text-label-code-md text-(--text-muted)"
          >{{ pad(step) }} / {{ pad(steps) }}</span
        >
      </template>
    </div>
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
