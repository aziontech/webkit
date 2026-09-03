<script setup>
  // THE PLATFORM SLIDE — the name of the thing, and one drawing of where it sits.
  //
  // Everything in the section around it is an argument: a pressure, a table of differences,
  // three reasons, a borrowed line, six figures. This slide asserts nothing. It puts the
  // product's name at the opener's type step and draws the one picture the whole section has
  // been describing — users, clouds, models, applications, the public internet, offices and
  // corporate networks, with the platform between them.
  //
  // ── FIVE COLUMNS AND SEVEN ──
  //
  // Not the halves `stack` takes. The wheel's widest pair of seats sit at 0.97 of its radius
  // and each carries a caption, so the drawing spends its width on the diagram twice over and
  // reads small in a half; the copy, on the other hand, is a two-word headline and one
  // sentence, which is the narrowest measure this deck sets prose at (`span(5)` = 581px, the
  // same column `reasons` gives its claim). Five and seven is the split that keeps the
  // drawing the subject without shrinking the sentence below a comfortable measure.
  //
  // The copy CENTRES against the drawing rather than sitting at the top of the frame: the
  // wheel's mass is on the canvas's own centre line, and a header anchored above it would
  // read as a caption on the top third of a circle.
  //
  // ── IT DOES NOT BLEED ──
  //
  // The wheel is an object inside the frame, not a band of it: nothing here reaches for the
  // rules the way a map, a cell grid or a split does, and the drawing is solved against the
  // content box the stage's own padding leaves. So the layout takes the frame's padding from
  // the stage like every other in-frame slide, and states only the box it hands the drawing.
  import { FRAME, FRAME_PADDING, span } from '../lib/deck-canvas.js'
  import PlatformOrbit from './PlatformOrbit.vue'
  import SlideHeading from './SlideHeading.vue'

  defineProps({
    slide: { type: Object, required: true }
  })

  /** The drawing's box: columns 6-12, the frame's content height (its rules taken off). */
  const DRAWING = {
    width: span(7), // 823
    height: FRAME.height - 2 * FRAME_PADDING - 2 // 694
  }

  const drawingStyle = {
    width: `${DRAWING.width}px`,
    height: `${DRAWING.height}px`
  }
</script>

<template>
  <div class="grid h-full grid-cols-12 items-center gap-x-(--spacing-lg)">
    <div class="col-span-5">
      <SlideHeading
        :eyebrow="slide.eyebrow"
        :headline="slide.headline"
        :description="slide.description"
        size="2xl"
      />
    </div>

    <!-- The drawing is `relative` and fixed to its box, because the wheel places everything in
         it absolutely. `justify-self-end` puts its right edge on column 12 rather than
         wherever the grid cell happens to end. -->
    <div
      class="relative col-span-7 justify-self-end"
      :style="drawingStyle"
    >
      <PlatformOrbit
        :box="DRAWING"
        :nodes="slide.ring"
      />
    </div>
  </div>
</template>
