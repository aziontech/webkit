<script setup lang="ts">
  // Traffic Chart: six weeks of traffic with the peak week picked out. The series is shaped, not
  // measured — an illustration shows the shape of data, never real data.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationChart from '../illustration-chart/illustration-chart.vue'

  defineOptions({
    name: 'IllustrationTrafficChart',
    inheritAttrs: false
  })

  const DATA = [36, 43, 38, 58, 43, 34]
  const LABELS = ['1w', '2w', '3w', '4w', '5w', '6w']
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationChart
      :data="DATA"
      :labels="LABELS"
      :highlight="3"
      class="absolute left-0 top-[17px] h-[95px]"
    />
  </span>
</template>
