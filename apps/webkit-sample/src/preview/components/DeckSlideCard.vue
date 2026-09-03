<script setup>
  // A SLIDE, MATTED — the shape a slide takes everywhere outside its own artboard.
  //
  // The artboard is `--bg-canvas` black and so is the chrome around it. With nothing between
  // them a slide is not an object sitting on a surface, it is a hole in one: no edge, no corner,
  // no way to see where one slide stops. The mat gives that edge back — a shade lighter
  // (`--bg-surface-raised`), rounded on the card radius, with the artboard inset inside it — and
  // it is the same edge the selected state then colours, so selection costs no extra geometry.
  //
  // THE ASPECT BOX IS ON THE INNER ELEMENT, not the mat. Put it on the mat and the padding and
  // the border come OUT of the 16:9, so the artboard inside is a hair off ratio and `contain`
  // letterboxes it by a pixel or two at every size. Inner box, exact ratio, no letterbox.
  //
  // `fit="contain"` rather than `fit="width"` because the box is DECLARED: a width-fitted stage
  // derives the host's height from what it measured, so a card whose width is still settling has
  // no height at all and a rail of them jumps as it fills.
  //
  // `group-hover` / `group-focus-visible` on the root are unconditional on purpose: inside an
  // interactive cell (the filmstrip button) they resolve, and in the stacked canvas — where
  // nothing above is a `group` — they simply never match. One card, both jobs, no `interactive`
  // flag.
  //
  // NOTHING PRECEDES THE ROOT IN THE TEMPLATE, comments included, and that is load-bearing rather
  // than tidy: Vue keeps template comments in a dev build, so a comment above the root makes the
  // component a FRAGMENT — two root nodes — and a fragment silently drops the consumer's `class`
  // and hands `$el` back as the comment node instead of the element.
  import SlideRenderer from './SlideRenderer.vue'

  defineProps({
    /** The deck entry to render. */
    slide: { type: Object, required: true },
    /** Colours the mat's edge — the card is the slide the canvas is showing. */
    selected: { type: Boolean, default: false }
  })
</script>

<template>
  <div
    :data-selected="selected || null"
    class="w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance group-hover:border-(--text-disabled) group-focus-visible:ring-2 group-focus-visible:ring-(--ring-color) data-[selected]:border-(--primary) data-[selected]:ring-1 data-[selected]:ring-(--primary) motion-reduce:transition-none"
  >
    <div class="aspect-video w-full overflow-hidden rounded-(--shape-elements)">
      <SlideRenderer
        :slide="slide"
        fit="contain"
      />
    </div>
  </div>
</template>
