<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'ai ai-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'ai ai-copy' },
    { label: 'Delete', value: 'delete', icon: 'ai ai-trash', disabled: true }
  ]
</script>

<template>
  <SplitButton
    label="Saving"
    icon="ai ai-check"
    loading
    :items="items"
  />
</template>
