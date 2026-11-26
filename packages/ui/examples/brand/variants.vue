<script setup>
  import Brand from '@aziontech/ui/brand'
</script>

<template>
  <div class="flex flex-wrap items-end gap-8">
    <figure class="m-0 flex flex-col items-start gap-(--spacing-xs)">
      <Brand
        variant="default"
        size="large"
      />
      <figcaption class="text-label-sm text-(--text-muted)">default</figcaption>
    </figure>
    <figure class="m-0 flex flex-col items-start gap-(--spacing-xs)">
      <Brand
        variant="reduced"
        size="large"
      />
      <figcaption class="text-label-sm text-(--text-muted)">reduced</figcaption>
    </figure>
    <figure class="m-0 flex flex-col items-start gap-(--spacing-xs)">
      <Brand
        variant="extended"
        size="large"
      />
      <figcaption class="text-label-sm text-(--text-muted)">extended</figcaption>
    </figure>
  </div>
</template>
