<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
</script>

<template>
  <CardGrid
    kind="divider"
    divider-color="muted"
    :columns="3"
  >
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">One</div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">Two</div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">Three</div>
  </CardGrid>
</template>
