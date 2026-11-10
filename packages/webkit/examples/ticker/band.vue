<script setup>
  import Ticker from '@aziontech/webkit/ticker'
  import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <div class="relative overflow-hidden bg-(--bg-canvas) pt-(--spacing-xxl)">
    <TextureMaterial
      kind="dots"
      size="small"
      fade="bottom"
    />
    <div class="relative flex min-h-80 flex-col justify-end">
      <Ticker
        kind="band"
        label="Trusted by mission-critical workloads"
        :marks="['itau', 'netshoes', 'nzn']"
      />
    </div>
  </div>
</template>
