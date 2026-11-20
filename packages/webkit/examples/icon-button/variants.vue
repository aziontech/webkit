<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <IconButton
      variant="primary"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="secondary"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="outline"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="ghost"
      icon="az az-plus"
      aria-label="Add"
    />
    <IconButton
      variant="danger"
      icon="az az-trash"
      aria-label="Delete"
    />
  </div>
</template>
