<script setup>
  import Chip from '@aziontech/ui/chip'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-xs)">
    <Chip
      label="region: us-east"
      variant="filled"
      removable
      disabled
    />
    <Chip
      label="Status"
      variant="outline"
      clickable
      disabled
    />
  </div>
</template>
