<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'ai ai-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'ai ai-copy' },
    { label: 'Delete', value: 'delete', icon: 'ai ai-trash', disabled: true }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
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
      label="Outlined"
      :items="items"
    />
  </div>
</template>
