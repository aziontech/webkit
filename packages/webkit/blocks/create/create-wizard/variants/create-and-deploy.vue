<script setup lang="ts">
  import ServiceWizard from '../parts/service-wizard.vue'

  const emit = defineEmits<{
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()
</script>

<template>
  <ServiceWizard @cancel="(event: MouseEvent | KeyboardEvent) => emit('cancel', event)" />
</template>
