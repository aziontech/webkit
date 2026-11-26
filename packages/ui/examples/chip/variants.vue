<script setup>
  import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Chip
      label="Production"
      variant="filled"
      size="medium"
      removable
    />
    <Chip
      label="Status"
      variant="outline"
      size="medium"
      clickable
    />
    <Chip
      label="Add filter"
      variant="dashed"
      size="medium"
      clickable
    />
  </div>
</template>
