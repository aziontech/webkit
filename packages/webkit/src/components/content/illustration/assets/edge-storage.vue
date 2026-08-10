<script setup lang="ts">
  // Edge Storage: objects arrive from one corner and are served to another, routed through the
  // store in the middle. The two elbows carry the path across both axes.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationElbow from '../illustration-elbow/illustration-elbow.vue'

  defineOptions({
    name: 'IllustrationEdgeStorage',
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
      class="absolute left-0 top-0"
    />
    <IllustrationElbow
      kind="dashed"
      corner="bottom-left"
      active
      class="absolute left-[17px] top-[16px] h-[48px] w-[68px]"
    />

    <IllustrationBox
      size="medium"
      active
      icon="ai ai-edge-storage"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />

    <IllustrationElbow
      kind="dashed"
      corner="top-right"
      active
      class="absolute left-[86px] top-[64px] h-[48px] w-[68px]"
    />
    <IllustrationBox
      size="small"
      class="absolute left-[138px] top-[96px]"
    />
  </span>
</template>
