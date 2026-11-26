<script setup>
  import PriorityTag from '@aziontech/webkit/priority-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <PriorityTag priority="urgent" />
    <PriorityTag priority="high" />
    <PriorityTag priority="medium" />
    <PriorityTag priority="low" />
    <PriorityTag priority="none" />
  </div>
</template>
