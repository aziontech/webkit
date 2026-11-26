<script setup>
  import Texture from '@aziontech/webkit/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">bottom</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture
          size="small"
          fade="bottom"
        />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">top</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture
          size="small"
          fade="top"
        />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">left</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture
          size="small"
          fade="left"
        />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">right</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture
          size="small"
          fade="right"
        />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">edges</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture
          size="small"
          fade="edges"
        />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">vignette</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture
          size="small"
          fade="vignette"
        />
      </div>
    </div>
  </div>
</template>
