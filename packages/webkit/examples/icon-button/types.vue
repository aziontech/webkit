<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <IconButton
      kind="primary"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      kind="secondary"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      kind="outlined"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      kind="transparent"
      icon="ai ai-plus"
      aria-label="Add"
    />
    <IconButton
      kind="danger"
      icon="ai ai-trash"
      aria-label="Delete"
    />
  </div>
</template>
