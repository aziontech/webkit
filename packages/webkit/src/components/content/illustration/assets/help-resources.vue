<script setup lang="ts">
  // Help Resources: the four ways in — the event stream, the docs, the videos and support —
  // pinwheeled around the mark, each one a corner of the same thing rather than a separate door.
  //
  // Only the mark is lit: the resources are where you go, the platform is what you came for.
  // The hub is placed last so it laps the four corners, closing the cluster into one shape
  // instead of four tiles that happen to sit near each other.
  //
  // Square throughout, against the library's rounded default: the source design draws these as
  // bare frames, and the squared edge is what lets the hub's corners read as overlapping the
  // four rather than nesting between them.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'

  defineOptions({
    name: 'IllustrationHelpResources',
    inheritAttrs: false
  })
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationBox
      size="small"
      shape="square"
      icon="ai ai-data-stream"
      class="absolute left-[27px] top-[6px]"
    />
    <IllustrationBox
      size="small"
      shape="square"
      icon="pi pi-book"
      class="absolute left-[111px] top-[6px]"
    />
    <IllustrationBox
      size="small"
      shape="square"
      icon="pi pi-youtube"
      class="absolute left-[27px] top-[90px]"
    />
    <IllustrationBox
      size="small"
      shape="square"
      icon="pi pi-headphones"
      class="absolute left-[111px] top-[90px]"
    />

    <IllustrationBox
      size="medium"
      shape="square"
      active
      icon="ai ai-azion"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primary)]"
    />
  </span>
</template>
