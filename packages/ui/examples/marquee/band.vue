<script setup>
  import Marquee from '@aziontech/webkit/marquee'
  import Texture from '@aziontech/webkit/texture'
</script>

<template>
  <div class="relative overflow-hidden bg-(--bg-canvas) pt-(--spacing-2xl)">
    <Texture
      variant="dots"
      size="small"
      fade="bottom"
    />
    <div class="relative flex min-h-80 flex-col justify-end">
      <Marquee
        variant="band"
        label="Trusted by mission-critical workloads"
        :marks="['itau', 'netshoes', 'nzn']"
      />
    </div>
  </div>
</template>
