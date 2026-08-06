<script setup lang="ts">
  // AI Inference: a prompt enters from the left and the conversation runs in the active
  // window on the right. The junction on the seam is lit — the link is carrying something.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationConnector from '../illustration-connector/illustration-connector.vue'
  import IllustrationNode from '../illustration-node/illustration-node.vue'
  import IllustrationWindow from '../illustration-window/illustration-window.vue'

  defineOptions({
    name: 'IllustrationAiInference',
    inheritAttrs: false
  })
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationWindow
      kind="chat"
      size="large"
      active
      class="absolute left-[calc(50%+21px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <IllustrationBox
      size="small"
      icon="ai ai-ask-azion"
      class="absolute left-0 top-1/2 -translate-y-1/2"
    />
    <IllustrationConnector
      kind="dashed"
      active
      animated
      class="absolute left-[32px] top-[62px]"
      :style="{ '--illustration-connector-length': '10px' }"
    />
    <IllustrationNode
      active
      class="absolute left-[38px] top-[60px]"
    />
  </span>
</template>
