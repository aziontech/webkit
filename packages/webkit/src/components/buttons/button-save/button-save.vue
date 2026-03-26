<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  label: { type: String, default: 'Save' },
  icon: { type: String, default: 'pi pi-save' },
  severity: { type: String, default: 'primary' },
  size: { type: String, default: '' },
  outlined: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
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
    :severity="severity"
    :size="size"
    :outlined="outlined"
    :disabled="computedDisabled"
    :loading="loading"
    :aria-label="label"
    data-testid="button-save"
    @click="handleSave"
  />
</template>
