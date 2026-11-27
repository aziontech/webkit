<script setup>
  import SplitButton from '@aziontech/ui/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'az az-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'az az-copy' },
    { label: 'Delete', value: 'delete', icon: 'az az-trash', disabled: true }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <SplitButton
      variant="primary"
      label="Primary"
      :items="items"
    />
    <SplitButton
      variant="secondary"
      label="Secondary"
      :items="items"
    />
    <SplitButton
      variant="outline"
      label="Outline"
      :items="items"
    />
  </div>
</template>
