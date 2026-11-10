<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGrid
      kind="gap"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
    </CardGrid>
    <CardGrid
      kind="divider"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
    </CardGrid>
    <CardGrid
      kind="frame"
      :columns="3"
    >
      <CardGridCell kind="canvas">frame</CardGridCell>
      <CardGridCell kind="canvas">frame</CardGridCell>
      <CardGridCell kind="canvas">frame</CardGridCell>
    </CardGrid>
  </div>
</template>
