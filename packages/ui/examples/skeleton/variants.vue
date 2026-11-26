<script setup>
  import Skeleton from '@aziontech/ui/skeleton'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <Skeleton
      variant="rectangle"
      width="240px"
      height="100px"
    />
    <Skeleton
      variant="circle"
      width="100px"
      height="100px"
    />
  </div>
</template>
