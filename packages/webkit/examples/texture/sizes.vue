<script setup>
  import Texture from '@aziontech/webkit/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture size="small" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture size="medium" />
    </div>
    <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
      <Texture size="large" />
    </div>
  </div>
</template>
