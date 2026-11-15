<script setup>
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
</script>

<template>
  <CardGridRoot
    variant="frame"
    :columns="3"
  >
    <CardGridCell variant="canvas">A canvas cell, padded by default.</CardGridCell>
    <CardGridCell>A surface cell — the cell's default fill.</CardGridCell>
    <CardGridCell
      variant="none"
      :padded="false"
    >
      <div
        class="flex h-full items-center justify-center bg-(--primary) text-(--primary-foreground)"
      >
        A cell that paints itself
      </div>
    </CardGridCell>
  </CardGridRoot>
</template>
