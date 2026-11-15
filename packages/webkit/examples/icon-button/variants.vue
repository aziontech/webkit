<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <IconButton
      variant="primary"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      variant="secondary"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      variant="outline"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      variant="ghost"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      variant="danger"
      icon="ai ai-trash"
      aria-label="Delete"
    />
  </div>
</template>
