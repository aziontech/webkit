<script setup lang="ts">
  // Image Processor: one source image in the middle, delivered in every format the edge can
  // negotiate. The format pills and the Azion mark are lit; the source window rests.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationPill from '../illustration-pill/illustration-pill.vue'
  import IllustrationWindow from '../illustration-window/illustration-window.vue'

  defineOptions({
    name: 'IllustrationImageProcessor',
    inheritAttrs: false
  })

  const FORMATS = ['JPEG', 'PNG', 'WEBP']
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationWindow
      kind="icon"
      size="large"
      icon="pi pi-images"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />

    <span
      class="absolute right-[0.4px] top-[calc(50%+0.4px)] flex w-[64.6px] -translate-y-1/2 flex-col items-start gap-[var(--spacing-xxs)]"
    >
      <IllustrationPill
        v-for="format in FORMATS"
        :key="format"
        size="medium"
        active
        icon="pi pi-image"
        :label="format"
        class="w-full"
      />
    </span>

    <IllustrationBox
      size="small"
      active
      icon="ai ai-azion"
      class="text-[var(--primary)] absolute left-0 top-1/2 -translate-y-1/2"
    />
  </span>
</template>
