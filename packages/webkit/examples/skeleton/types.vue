<script setup>
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Skeleton
      kind="shape"
      width="240px"
      height="100px"
    />
    <Skeleton
      kind="circle"
      width="100px"
      height="100px"
    />
  </div>
</template>
