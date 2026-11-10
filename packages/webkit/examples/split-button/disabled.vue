<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },
    { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
  ]
</script>

<template>
  <SplitButton
    label="Save"
    icon="pi pi-check"
    disabled
    :model="items"
  />
</template>
