<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">none</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="none" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">top</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="top" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">bottom</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="bottom" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">left</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="left" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">right</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="right" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">edges</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="edges" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">vignette</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap fade="vignette" />
      </div>
    </div>
  </div>
</template>
