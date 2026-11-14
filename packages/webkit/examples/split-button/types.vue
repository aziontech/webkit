<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },
    { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SplitButton
      kind="primary"
      label="Primary"
      :items="items"
    />
    <SplitButton
      kind="secondary"
      label="Secondary"
      :items="items"
    />
    <SplitButton
      kind="outlined"
      label="Outlined"
      :items="items"
    />
  </div>
</template>
