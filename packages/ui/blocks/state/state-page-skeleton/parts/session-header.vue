<script setup lang="ts">
  import Skeleton from '@aziontech/ui/skeleton'
</script>

<template>
  <div
    class="flex h-14 shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) px-(--spacing-md)"
  >
    <Skeleton
      width="1.25rem"
      height="1.25rem"
    />
    <Skeleton
      width="5rem"
      height="0.875rem"
    />
    <Skeleton
      width="4.5rem"
      height="0.875rem"
    />
    <div class="hidden md:block">
      <Skeleton
        width="6rem"
        height="0.875rem"
      />
    </div>
    <div class="hidden lg:block">
      <Skeleton
        width="8rem"
        height="0.875rem"
      />
    </div>

    <div class="ms-auto flex items-center gap-(--spacing-xs)">
      <Skeleton
        width="5.5rem"
        height="2rem"
      />
      <div class="hidden md:block">
        <Skeleton
          width="4.5rem"
          height="2rem"
        />
      </div>
      <Skeleton
        variant="circle"
        width="2rem"
        height="2rem"
      />
    </div>
  </div>
</template>
