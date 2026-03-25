<script setup>
import Button from 'primevue/button'

const props = defineProps({
  label: { type: String, default: 'Cancel' },
  icon: { type: String, default: '' },
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
    :label="label"
    :severity="severity"
    :size="size"
    :outlined="outlined"
    :disabled="disabled"
    :aria-label="label"
    data-testid="button-cancel"
    @click="handleCancel"
  />
</template>
