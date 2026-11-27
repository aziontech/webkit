<script setup>
  import SplitButton from '@aziontech/ui/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'az az-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'az az-copy' },
    { label: 'Delete', value: 'delete', icon: 'az az-trash', disabled: true }
  ]
</script>

<template>
  <SplitButton
    variant="primary"
    size="large"
    label="Save"
    icon="az az-check"
    :items="items"
  />
</template>
