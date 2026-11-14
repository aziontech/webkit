<script setup>
  import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-xs)">
    <Chip
      label="region: us-east"
      kind="filled"
      removable
      disabled
    />
    <Chip
      label="Status"
      kind="outlined"
      clickable
      disabled
    />
  </div>
</template>
