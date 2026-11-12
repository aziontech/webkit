<script setup>
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-md)">
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-canvas) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-muted)">--bg-canvas</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-muted)">--bg-surface</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-surface-raised) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-muted)">--bg-surface-raised</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-surface-overlay) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-default)">--bg-surface-overlay</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
  </div>
</template>
