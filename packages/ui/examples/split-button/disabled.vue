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
    label="Save"
    icon="az az-check"
    disabled
    :items="items"
  />
</template>
