<script setup lang="ts">
  // Bot Manager: traffic arriving from both sides is inspected by the service in the middle.
  // The two inner junctions are lit, the outer two rest — the path is live at the centre.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationConnector from '../illustration-connector/illustration-connector.vue'
  import IllustrationNode from '../illustration-node/illustration-node.vue'

  defineOptions({
    name: 'IllustrationBotManager',
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
      class="absolute left-0 top-[48px]"
    />
    <IllustrationBox
      size="small"
      icon="ai ai-secure-pillar"
      class="absolute left-[138px] top-[48px]"
    />

    <IllustrationConnector
      kind="dashed"
      class="absolute left-[32px] top-[62px]"
      :style="{ '--illustration-connector-length': '22px' }"
    />
    <IllustrationConnector
      kind="dashed"
      class="absolute left-[116px] top-[62px]"
      :style="{ '--illustration-connector-length': '22px' }"
    />

    <IllustrationBox
      size="medium"
      active
      icon="ai ai-secure-pillar"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />

    <IllustrationNode class="absolute left-[28px] top-[60px]" />
    <IllustrationNode class="absolute left-[134px] top-[60px]" />
    <IllustrationNode
      active
      class="absolute left-[50px] top-[60px]"
    />
    <IllustrationNode
      active
      class="absolute left-[112px] top-[60px]"
    />
  </span>
</template>
