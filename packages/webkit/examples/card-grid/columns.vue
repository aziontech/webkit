<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGrid
      kind="divider"
      :columns="2"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
    </CardGrid>
    <CardGrid
      kind="divider"
      :columns="4"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">3</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">4</div>
    </CardGrid>
  </div>
</template>
