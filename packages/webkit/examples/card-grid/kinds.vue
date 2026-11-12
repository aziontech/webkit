<script setup>
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGridRoot
      kind="gap"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
    </CardGridRoot>
    <CardGridRoot
      kind="divider"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
    </CardGridRoot>
    <CardGridRoot
      kind="frame"
      :columns="3"
    >
      <CardGridCell kind="canvas">frame</CardGridCell>
      <CardGridCell kind="canvas">frame</CardGridCell>
      <CardGridCell kind="canvas">frame</CardGridCell>
    </CardGridRoot>
  </div>
</template>
