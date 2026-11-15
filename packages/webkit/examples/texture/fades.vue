<script setup>
  import Texture from '@aziontech/webkit/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture
        size="small"
        fade="bottom"
      />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture
        size="small"
        fade="top"
      />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture
        size="small"
        fade="left"
      />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture
        size="small"
        fade="right"
      />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture
        size="small"
        fade="edges"
      />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture
        size="small"
        fade="vignette"
      />
    </div>
  </div>
</template>
