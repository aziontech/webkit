<script setup>
  import Texture from '@aziontech/webkit/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture variant="dots" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture variant="grid" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture variant="lines" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture variant="dither" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture variant="pixelate" />
    </div>
  </div>
</template>
