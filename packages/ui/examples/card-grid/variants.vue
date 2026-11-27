<script setup>
  import CardGridCell from '@aziontech/ui/card-grid-cell'
  import CardGridRoot from '@aziontech/ui/card-grid-root'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGridRoot
      variant="gap"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
    </CardGridRoot>
    <CardGridRoot
      variant="divider"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
    </CardGridRoot>
    <CardGridRoot
      variant="frame"
      :columns="3"
    >
      <CardGridCell variant="canvas">frame</CardGridCell>
      <CardGridCell variant="canvas">frame</CardGridCell>
      <CardGridCell variant="canvas">frame</CardGridCell>
    </CardGridRoot>
  </div>
</template>
