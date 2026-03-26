<script setup>
import Button from 'primevue/button'

const props = defineProps({
  'data-testid': { type: String, default: 'button-delete' },
  label: { type: String, default: 'Delete' },
  icon: { type: String, default: 'pi pi-trash' },
  iconPos: { type: String, default: 'left' },
  severity: { type: String, default: 'danger' },
  size: { type: String, default: '' },
  outlined: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const handleClick = () => {
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
    @click="handleClick"
  />
</template>
