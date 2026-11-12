<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <IconButton
      kind="primary"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="secondary"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="outlined"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="transparent"
      icon="pi pi-plus"
      aria-label="Add"
    />
    <IconButton
      kind="danger"
      icon="pi pi-trash"
      aria-label="Delete"
    />
  </div>
</template>
