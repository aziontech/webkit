<script setup lang="ts">
  // API Keys: a register of keys per environment, with one row picked out. The content is
  // deliberately plausible-but-fake — an illustration shows the shape of data, never real data.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationList from '../illustration-list/illustration-list.vue'

  defineOptions({
    name: 'IllustrationApiKeys',
    inheritAttrs: false
  })

  const ROWS = [
    { label: 'Prod', value: 'key_01F8A3', status: 'active' },
    { label: 'Staging', value: 'key_02C9B7', status: 'revoked' },
    { label: 'Test', value: 'key_03E41D', status: 'active' },
    { label: 'Frontend', value: 'key_04A92F', status: 'active' },
    { label: 'Backend', value: 'key_05D77C', status: 'expired' },
    { label: 'Web', value: 'key_06B2E9', status: 'active' }
  ]
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationList
      :rows="ROWS"
      :highlight="2"
      class="absolute left-0 top-[18px]"
    />
  </span>
</template>
