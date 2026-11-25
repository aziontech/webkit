<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
    <div
      class="flex min-h-24 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)"
    >
      <Brand
        variant="extended"
        treatment="color"
      />
    </div>
    <div
      class="flex min-h-24 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)"
    >
      <Brand
        variant="extended"
        treatment="monochrome"
      />
    </div>
    <div
      class="flex min-h-24 items-center justify-center rounded-(--shape-card) bg-(--primary) p-(--spacing-md)"
    >
      <Brand
        variant="extended"
        treatment="knockout"
      />
    </div>
  </div>
</template>
