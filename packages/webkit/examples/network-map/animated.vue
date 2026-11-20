<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
    <NetworkMap
      region="world"
      density="medium"
      :opacity="0.4"
      position="center"
      fade="none"
      animated
    />
  </div>
</template>
