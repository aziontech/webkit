<script setup lang="ts">
  import ServiceForm, {
    type FormValidationSectionProps,
    type FormValidationService
  } from '../parts/service-form.vue'

  const props = withDefaults(defineProps<FormValidationSectionProps>(), {
    origins: undefined,
    originError: undefined,
    reloading: false,
    submitting: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FormValidationService]
    cancel: [event: MouseEvent]
    'reload-origins': [event: MouseEvent]
  }>()
</script>

<template>
  <ServiceForm
    v-bind="props"
    @submit="(event: Event, values: FormValidationService) => emit('submit', event, values)"
    @cancel="(event: MouseEvent) => emit('cancel', event)"
    @reload-origins="(event: MouseEvent) => emit('reload-origins', event)"
  />
</template>
