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
    kind="primary"
    size="large"
    label="Save"
    icon="ai ai-check"
    :items="items"
  />
</template>
