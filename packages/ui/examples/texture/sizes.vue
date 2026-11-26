<script setup>
  import Texture from '@aziontech/ui/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">small</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture size="small" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">medium</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture size="medium" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">large</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture size="large" />
      </div>
    </div>
  </div>
</template>
