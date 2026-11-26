<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
    <figure class="m-0 flex flex-col gap-(--spacing-xs)">
      <div
        class="flex min-h-24 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)"
      >
        <Brand
          variant="extended"
          treatment="color"
          size="large"
        />
      </div>
      <figcaption class="text-label-sm text-(--text-muted)">Color</figcaption>
    </figure>
    <figure class="m-0 flex flex-col gap-(--spacing-xs)">
      <div
        class="flex min-h-24 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)"
      >
        <Brand
          variant="extended"
          treatment="monochrome"
          size="large"
        />
      </div>
      <figcaption class="text-label-sm text-(--text-muted)">Monochrome</figcaption>
    </figure>
    <figure class="m-0 flex flex-col gap-(--spacing-xs)">
      <div
        class="flex min-h-24 items-center justify-center rounded-(--shape-card) bg-(--primary) p-(--spacing-md)"
      >
        <Brand
          variant="extended"
          treatment="knockout"
          size="large"
        />
      </div>
      <figcaption class="text-label-sm text-(--text-muted)">Knockout</figcaption>
    </figure>
  </div>
</template>
