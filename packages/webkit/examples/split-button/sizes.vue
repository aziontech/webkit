<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'az az-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'az az-copy' },
    { label: 'Delete', value: 'delete', icon: 'az az-trash', disabled: true }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <SplitButton
      size="small"
      label="Small"
      :items="items"
    />
    <SplitButton
      size="medium"
      label="Medium"
      :items="items"
    />
    <SplitButton
      size="large"
      label="Large"
      :items="items"
    />
  </div>
</template>
