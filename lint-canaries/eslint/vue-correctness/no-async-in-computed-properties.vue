<script setup lang="ts">
  // CANARY — must keep failing vue/no-async-in-computed-properties.
  // An async computed returns a Promise, which the template cannot render.
  import { computed } from 'vue'

  const props = defineProps({
    id: { type: String, default: '' }
  })

  const user = computed(async () => await Promise.resolve(props.id))
</script>

<template>
  <span>{{ user }}</span>
</template>
