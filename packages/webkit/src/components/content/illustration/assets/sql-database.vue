<script setup lang="ts">
  // Edge SQL: a row of empty slots standing for the table, with the database itself sitting
  // over them. The slots are unlabelled on purpose — the shape reads as data, not as content.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBox from '../illustration-box/illustration-box.vue'
  import IllustrationPill from '../illustration-pill/illustration-pill.vue'

  defineOptions({
    name: 'IllustrationSqlDatabase',
    inheritAttrs: false
  })

  const SLOTS = 4
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <span
      class="absolute left-0 top-[52px] flex w-full items-center gap-[var(--spacing-xxs)]"
      aria-hidden="true"
    >
      <IllustrationPill
        v-for="slot in SLOTS"
        :key="slot"
        size="medium"
        class="h-6 flex-1"
      />
    </span>

    <IllustrationBox
      size="medium"
      active
      icon="pi pi-database"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
  </span>
</template>
