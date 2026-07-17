<script setup lang="ts">
  // CANARY — must keep failing vue/no-dupe-v-else-if.
  // The last branch repeats the first condition and never renders.
  const props = defineProps({
    kind: { type: String, default: 'primary' }
  })
</script>

<template>
  <strong v-if="props.kind === 'primary'">primary</strong>
  <em v-else-if="props.kind === 'danger'">danger</em>
  <span v-else-if="props.kind === 'primary'">never renders</span>
</template>
