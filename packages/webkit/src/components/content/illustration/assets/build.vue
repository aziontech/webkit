<script setup lang="ts">
  // Building an application: an active site on the right, the Azion mark on the left, and a stage pill
  // sitting over the seam between them.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationConnector from '../illustration-connector/illustration-connector.vue'
  import IllustrationPill from '../illustration-pill/illustration-pill.vue'
  import IllustrationWindow from '../illustration-window/illustration-window.vue'

  defineOptions({
    name: 'IllustrationBuild',
    inheritAttrs: false
  })
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationWindow
      kind="website"
      size="large"
      active
      class="absolute left-[calc(50%+21px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <IllustrationBox
      size="small"
      active
      icon="ai ai-azion"
      class="text-[var(--primary)] absolute left-[calc(50%-69px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <IllustrationConnector
      kind="dashed"
      class="absolute left-[32px] top-[62px]"
      :style="{ '--illustration-connector-length': '10px' }"
    />
    <IllustrationPill
      size="large"
      active
      icon="ai ai-build-pillar"
      label="Build"
      class="absolute left-[37px] top-[47px]"
    />
  </span>
</template>
