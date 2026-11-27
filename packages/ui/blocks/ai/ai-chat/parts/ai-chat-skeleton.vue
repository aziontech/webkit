<script setup lang="ts">
  import Skeleton from '@aziontech/ui/skeleton'
</script>

<template>
  <div
    role="status"
    aria-label="Loading the conversation"
    class="flex flex-col gap-(--spacing-xl)"
  >
    <template
      v-for="row in 2"
      :key="row"
    >
      <Skeleton
        width="45%"
        height="2.75rem"
        class="self-end"
      />
      <div class="flex flex-col gap-(--spacing-xs)">
        <Skeleton width="90%" />
        <Skeleton width="80%" />
        <Skeleton :width="row === 2 ? '40%' : '60%'" />
      </div>
    </template>
  </div>
</template>
