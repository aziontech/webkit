<script setup>
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
</script>

<template>
  <CardGridRoot
    kind="divider"
    divider-color="muted"
    :columns="3"
  >
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">One</div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">Two</div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">Three</div>
  </CardGridRoot>
</template>
