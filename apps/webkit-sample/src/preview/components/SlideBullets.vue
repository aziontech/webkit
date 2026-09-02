<script setup>
  // THE BULLET SLIDE — a list where the bullets are rules, not dots.
  //
  // The framed language has no use for a disc glyph: a list of claims reads as a stack of
  // modules, each divided from the one above by a hairline. That is the same brick the
  // marketing site's sections are made of, one step smaller, and it gives a long bullet a
  // proper hanging alignment for free — every line of a wrapped bullet starts on the same
  // vertical, which a dot-plus-text row never manages.
  //
  // ONE RULE PER EDGE, exactly as on a page: the divider between two rows belongs to the
  // LOWER row (`border-t`), so the first row draws nothing and the list's own top edge is
  // whatever sits above it.
  //
  // The layout is the content box's 12 columns: claims across seven, the aside on the last
  // four, one column of air between them. Twelve equal fractions of the 1428px box with
  // `--spacing-lg` gutters resolve to the 97px column lib/deck-canvas.js defines, so the
  // browser and the Figma build put the aside's left edge on the same pixel.
  import SlideHeading from './SlideHeading.vue'

  defineProps({
    slide: { type: Object, required: true }
  })
</script>

<template>
  <!-- Centred as one group. The frame is 888px tall and a list of four claims is about half
       that, so anchoring the block to the top leaves 300px of void under it that the frame's
       bottom rule points straight at. -->
  <div class="flex h-full flex-col justify-center gap-(--spacing-xl)">
    <SlideHeading
      :eyebrow="slide.eyebrow"
      :headline="slide.headline"
    />

    <div class="grid grid-cols-12 gap-x-(--spacing-lg)">
      <ul class="col-span-7 m-0 list-none p-0">
        <li
          v-for="bullet in slide.bullets"
          :key="bullet"
          class="border-t border-(--border-muted) py-(--spacing-md) text-pretty text-body-lg text-(--text-default) first:border-t-0 first:pt-0"
        >
          {{ bullet }}
        </li>
      </ul>

      <!-- The aside is a specimen of the same idea at label scale: a titled block of rows,
           each row a fact and its owner, divided by the same hairline. -->
      <aside
        v-if="slide.aside"
        class="col-span-4 col-start-9 flex flex-col gap-(--spacing-md)"
      >
        <span class="text-overline-sm text-(--text-muted)">{{ slide.aside.label }}</span>
        <dl class="m-0 flex flex-col">
          <div
            v-for="[term, value] in slide.aside.rows"
            :key="term"
            class="flex items-baseline justify-between gap-(--spacing-md) border-t border-(--border-muted) py-(--spacing-sm) first:border-t-0 first:pt-0"
          >
            <dt class="m-0 text-label-md text-(--text-muted)">{{ term }}</dt>
            <dd class="m-0 text-right text-label-md text-(--text-default)">{{ value }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </div>
</template>
