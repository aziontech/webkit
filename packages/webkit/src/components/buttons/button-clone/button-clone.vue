<script setup>
  import Button from 'primevue/button'

  defineProps({
    'data-testid': { type: String, default: 'button-clone' },
    label: { type: String, default: 'Clone' },
    icon: { type: String, default: 'pi pi-clone' },
    iconPos: { type: String, default: 'left' },
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
    :iconPos="iconPos"
    :label="label"
    :severity="severity"
    :size="size"
    :outlined="outlined"
    :disabled="disabled"
    :aria-label="label"
    :data-testid="dataTestid"
    @click="handleClick"
  />
</template>
