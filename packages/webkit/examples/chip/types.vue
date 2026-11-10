<script setup>
  import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Chip
      label="Production"
      kind="filled"
      size="medium"
      removable
    />
    <Chip
      label="Status"
      kind="outlined"
      size="medium"
      clickable
    />
    <Chip
      label="Add filter"
      kind="dashed"
      size="medium"
      clickable
    />
  </div>
</template>
