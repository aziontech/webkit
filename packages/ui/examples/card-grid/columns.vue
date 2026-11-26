<script setup>
  import CardGridRoot from '@aziontech/ui/card-grid-root'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGridRoot
      variant="divider"
      :columns="2"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
    </CardGridRoot>
    <CardGridRoot
      variant="divider"
      :columns="4"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">3</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">4</div>
    </CardGridRoot>
  </div>
</template>
