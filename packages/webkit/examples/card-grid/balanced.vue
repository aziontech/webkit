<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'

  const counts = [2, 4, 5, 7]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGrid
      v-for="count in counts"
      :key="count"
      kind="frame"
      :columns="3"
    >
      <CardGridCell
        v-for="index in count"
        :key="index"
        kind="canvas"
      >
        <span class="text-body-md text-(--text-muted)">{{ index }} of {{ count }}</span>
      </CardGridCell>
    </CardGrid>
  </div>
</template>
