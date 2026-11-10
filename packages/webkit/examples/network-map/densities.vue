<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">none</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="none" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">low</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="low" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">medium</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="medium" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">high</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="high" />
      </div>
    </div>
  </div>
</template>
