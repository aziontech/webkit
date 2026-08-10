<script setup lang="ts">
  // Edge Functions: a function on the left, the site it runs on in the middle, and the
  // lifecycle stages it moves through stacked down the right edge.
  //
  // The only asset that does not clip — the stage pills deliberately overhang the frame.
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationPill from '../illustration-pill/illustration-pill.vue'
  import IllustrationWindow from '../illustration-window/illustration-window.vue'

  defineOptions({
    name: 'IllustrationFunctions',
    inheritAttrs: false
  })

  const STAGES = [
    { icon: 'pi pi-hammer', label: 'Ship' },
    { icon: 'ai ai-build-pillar', label: 'Build' },
    { icon: 'ai ai-edge-application', label: 'Deploy' }
  ]
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)]"
  >
    <IllustrationWindow
      kind="website"
      size="large"
      class="absolute left-[calc(50%-1px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <IllustrationBox
      size="small"
      icon="ai ai-edge-functions"
      class="absolute left-0 top-1/2 -translate-y-1/2"
    />

    <span
      class="absolute right-[0.4px] top-1/2 flex w-[82.6px] -translate-y-1/2 flex-col items-start gap-[var(--spacing-xxs)]"
    >
      <IllustrationPill
        v-for="stage in STAGES"
        :key="stage.label"
        size="medium"
        :icon="stage.icon"
        :label="stage.label"
        class="w-full"
      />
    </span>
  </span>
</template>
