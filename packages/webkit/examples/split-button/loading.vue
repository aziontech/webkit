<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'az az-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'az az-copy' },
    { label: 'Delete', value: 'delete', icon: 'az az-trash', disabled: true }
  ]
</script>

<template>
  <SplitButton
    label="Saving"
    icon="az az-check"
    loading
    :items="items"
  />
</template>
