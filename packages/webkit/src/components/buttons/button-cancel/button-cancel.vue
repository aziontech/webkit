<script setup>
import Button from 'primevue/button'

const props = defineProps({
  'data-testid': { type: String, default: 'button-cancel' },
  label: { type: String, default: 'Cancel' },
  icon: { type: String, default: '' },
  iconPos: { type: String, default: 'left' },
  severity: { type: String, default: 'secondary' },
  outlined: { type: Boolean, default: true },
  size: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const handleCancel = () => {
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
    :disabled="disabled"
    :aria-label="label"
    :data-testid="data-testid"
    @click="handleCancel"
  />
</template>
