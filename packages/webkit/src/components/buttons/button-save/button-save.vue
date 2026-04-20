<script setup>
  import Button from 'primevue/button'
  import { computed } from 'vue'

  const props = defineProps({
    'data-testid': { type: String, default: 'button-save' },
    label: { type: String, default: 'Save' },
    icon: { type: String, default: '' },
    iconPos: { type: String, default: 'right' },
    severity: { type: String, default: 'primary' },
    size: { type: String, default: '' },
    outlined: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['click'])

  const computedDisabled = computed(() => props.disabled || props.loading)

  const handleSave = () => {
    if (computedDisabled.value) return
    emit('click')
  }
</script>

<template>
  <Button
    :label="label"
    :icon="icon"
    :iconPos="iconPos"
    :severity="severity"
    :size="size"
    :outlined="outlined"
    :disabled="computedDisabled"
    :loading="loading"
    :aria-label="label"
    :data-testid="data - testid"
    @click="handleSave"
  />
</template>
