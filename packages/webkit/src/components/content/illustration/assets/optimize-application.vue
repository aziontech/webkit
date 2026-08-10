<script setup lang="ts">
  // Optimize Application: a site with its scores sitting over it on a raised tray — the shape of
  // a perfect audit, without claiming a specific metric.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationGauge from '../illustration-gauge/illustration-gauge.vue'
  import IllustrationSurface from '../illustration-surface/illustration-surface.vue'
  import IllustrationWindow from '../illustration-window/illustration-window.vue'

  defineOptions({
    name: 'IllustrationOptimizeApplication',
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
      class="absolute left-[calc(50%-2px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
    />

    <IllustrationSurface
      class="absolute left-[70px] top-1/2 flex -translate-y-1/2 gap-[var(--spacing-xxs)] p-[var(--spacing-xxs)]"
    >
      <!-- The scores rest short of perfect and print their own number, so a scene that raises
           `--illustration-gauge-target` counts them up to it — the audit improving, rather than a
           claim of 100 that was never earned. Two different resting values so they read as
           measurements; they land together because one transition drives both. -->
      <IllustrationGauge
        :value="72"
        show-value
        class="size-[33px]"
      />
      <IllustrationGauge
        :value="84"
        show-value
        class="size-[33px]"
      />
    </IllustrationSurface>
  </span>
</template>
