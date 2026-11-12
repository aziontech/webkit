<script setup>
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGridRoot
      kind="divider"
      :columns="2"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
    </CardGridRoot>
    <CardGridRoot
      kind="divider"
      :columns="4"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">3</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">4</div>
    </CardGridRoot>
  </div>
</template>
