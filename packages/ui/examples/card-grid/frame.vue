<script setup>
  import CardGridCell from '@aziontech/ui/card-grid-cell'
  import CardGridRoot from '@aziontech/ui/card-grid-root'
</script>

<template>
  <CardGridRoot
    variant="frame"
    :columns="3"
  >
    <CardGridCell variant="canvas">Functions run your code in every region.</CardGridCell>
    <CardGridCell>Object Storage keeps your assets next to it.</CardGridCell>
    <CardGridCell
      variant="none"
      :padded="false"
    >
      <div
        class="flex h-full items-center justify-center bg-(--primary) text-(--primary-foreground)"
      >
        Start building for free
      </div>
    </CardGridCell>
  </CardGridRoot>
</template>
