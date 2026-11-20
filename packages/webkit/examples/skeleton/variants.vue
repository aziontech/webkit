<script setup>
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
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
