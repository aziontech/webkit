<script setup>
  import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial kind="dots" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial kind="grid" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial kind="lines" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial kind="dither" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <TextureMaterial kind="pixelate" />
    </div>
  </div>
</template>
