<script setup lang="ts">
  import ActorPage from '../parts/actor-page.vue'

  const emit = defineEmits<{ refresh: [event: MouseEvent] }>()
</script>

<template>
  <ActorPage @refresh="(event: MouseEvent) => emit('refresh', event)" />
</template>
