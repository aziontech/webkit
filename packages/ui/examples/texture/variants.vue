<script setup>
  import Texture from '@aziontech/ui/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">dots</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="dots" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">grid</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="grid" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">lines</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="lines" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">dither</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="dither" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">pixelate</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="pixelate" />
      </div>
    </div>
  </div>
</template>
