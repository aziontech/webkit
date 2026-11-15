<script setup>
  import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial variant="dots" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial variant="grid" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial variant="lines" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial variant="dither" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial variant="pixelate" />
    </div>
  </div>
</template>
