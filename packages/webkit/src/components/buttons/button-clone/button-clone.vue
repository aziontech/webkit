<script setup>
import Button from 'primevue/button'

const props = defineProps({
  label: { type: String, default: 'Clone' },
  icon: { type: String, default: 'pi pi-clone' },
  severity: { type: String, default: 'secondary' },
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
    :label="label"
    :severity="severity"
    :size="size"
    :outlined="outlined"
    :disabled="disabled"
    :aria-label="label"
    data-testid="button-clone"
    @click="handleClick"
  />
</template>
