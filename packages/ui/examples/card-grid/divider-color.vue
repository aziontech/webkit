<script setup>
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
</script>

<template>
  <CardGridRoot
    variant="divider"
    divider-color="muted"
    :columns="3"
  >
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">
      Deploy from Git with a preview for every branch.
    </div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">
      Cache static assets in every region.
    </div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">
      Block bots before they reach your code.
    </div>
  </CardGridRoot>
</template>
