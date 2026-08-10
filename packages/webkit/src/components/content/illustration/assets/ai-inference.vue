<script setup lang="ts">
  // AI Inference: a prompt enters from the left and the conversation runs, live, in the active
  // window on the right — the transcript scrolling over the assistant thinking about the next
  // answer.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  //
  // The canvas is 170 wide and a `large` window is 128 of it, so the ask sits in a 42px column
  // and the link between them is a 10px run. That run is the whole budget for the seam, which is
  // why it carries the dashes ALONE: the junction node that used to sit here spent 8 of those
  // 10px and overlapped the window's rim, reading as clutter rather than as a connection. The
  // ask keeps a `small` box — the only step that fits the column — with its glyph raised from 16
  // to 20px, so the icon rather than its frame is what the eye lands on.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationConnector from '../illustration-connector/illustration-connector.vue'
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
      class="absolute left-0 top-1/2 -translate-y-1/2 data-[size=small]:text-[length:var(--size-5)]"
    />
    <IllustrationConnector
      kind="dashed"
      active
      animated
      class="absolute left-[32px] top-[62px]"
      :style="{ '--illustration-connector-length': '10px' }"
    />
  </span>
</template>
