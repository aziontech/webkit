<script setup lang="ts">
  // CANARY — must keep failing vue/no-side-effects-in-computed-properties.
  // Array.prototype.sort mutates `items` in place inside a computed.
  import { computed, ref } from 'vue'

  const items = ref([3, 1, 2])

  const sorted = computed(() => items.value.sort())
</script>

<template>
  <span>{{ sorted }}</span>
</template>
