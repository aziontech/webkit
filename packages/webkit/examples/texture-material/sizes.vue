<script setup>
  import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial size="small" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial size="medium" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial size="large" />
    </div>
  </div>
</template>
