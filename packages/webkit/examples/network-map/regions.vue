<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">world</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="world" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">atlantic</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="atlantic" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">americas</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="americas" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">north-america</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="north-america" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">south-america</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="south-america" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">europe</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="europe" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">africa</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="africa" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">asia</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="asia" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">oceania</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="oceania" />
      </div>
    </div>
  </div>
</template>
