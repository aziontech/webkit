<script setup>
  // The article header banner: the pixel-floor hero's floor, alone — the small pixelate field on
  // the surface, lit from both lower corners, in a short band above the masthead. The waves are
  // boosted so their drift reads at this height.
  import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <div
    aria-hidden="true"
    class="relative h-[clamp(6rem,14dvh,10rem)] overflow-hidden bg-(--bg-surface) [--texture-pool-a:95%_64%] [--texture-pool-b:-2%_38%] [--texture-wave-gain:2.4] [--texture-wave-pace:3]"
  >
    <TextureMaterial
      kind="pixelate"
      size="small"
      class="[mask-image:linear-gradient(to_right,black_0%,color-mix(in_srgb,black_30%,transparent)_40%,color-mix(in_srgb,black_30%,transparent)_62%,black_100%)] [mask-mode:alpha] opacity-60"
    />
  </div>
</template>
