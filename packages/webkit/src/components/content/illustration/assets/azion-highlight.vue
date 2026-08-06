<script setup lang="ts">
  // Azion Highlight: the mark alone, framed by two offset square scaffolds that read as depth
  // without drawing anything literal. The brand box is the only lit part.
  //
  // The frames are square on purpose — scaffolding, not surfaces — and each carries the same
  // rim light as every other part, so their edges catch from the top-left and again from the
  // bottom-right instead of sitting flat. A node pins the far corner of each frame.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationNode from '../illustration-node/illustration-node.vue'
  import IllustrationSurface from '../illustration-surface/illustration-surface.vue'

  defineOptions({
    name: 'IllustrationAzionHighlight',
    inheritAttrs: false
  })
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationSurface
      kind="outline"
      shape="square"
      class="absolute left-[91px] top-[4px] size-[75px]"
    />
    <IllustrationSurface
      kind="outline"
      shape="square"
      class="absolute left-[4px] top-[49px] size-[75px]"
    />

    <IllustrationNode
      emphasis="strong"
      class="absolute left-[162px] top-0"
    />
    <IllustrationNode
      emphasis="strong"
      class="absolute left-0 top-[120px]"
    />

    <IllustrationBox
      size="medium"
      active
      icon="ai ai-azion"
      class="text-[var(--primary)] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
  </span>
</template>
