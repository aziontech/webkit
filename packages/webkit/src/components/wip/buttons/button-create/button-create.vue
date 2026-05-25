<script setup>
  import Button from 'primevue/button'
  import { computed } from 'vue'

  const props = defineProps({
    'data-testid': { type: String, default: 'button-create' },
    label: { type: String, required: true },
    icon: { type: String, default: 'pi pi-plus' },
    iconPos: { type: String, default: 'right' },
    severity: { type: String, default: 'primary' },
    size: { type: String, default: '' },
    outlined: { type: Boolean, default: false },
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
    :data-testid="dataTestid"
    @click="handleClick"
  />
</template>
