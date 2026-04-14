<script setup>
  import Button from 'primevue/button'
  import { computed } from 'vue'

  const props = defineProps({
    'data-testid': { type: String, default: 'button-delete' },
    label: { type: String, default: 'Delete' },
    icon: { type: String, default: 'pi pi-trash' },
    iconPos: { type: String, default: 'left' },
    severity: { type: String, default: 'danger' },
    size: { type: String, default: '' },
    outlined: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['click'])

  const computedDisabled = computed(() => props.disabled || props.loading)

  const handleClick = () => {
    if (computedDisabled.value) return
    emit('click')
  }
</script>

<template>
  <Button
    :icon="icon"
    :iconPos="iconPos"
    :label="label"
    :severity="severity"
    :size="size"
    :outlined="outlined"
    :disabled="computedDisabled"
    :loading="loading"
    :aria-label="label"
    :data-testid="data - testid"
    @click="handleClick"
  />
</template>
