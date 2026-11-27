<script setup>
  import PriorityTag from '@aziontech/ui/priority-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <PriorityTag
      priority="urgent"
      size="small"
    />
    <PriorityTag
      priority="urgent"
      size="medium"
    />
  </div>
</template>
