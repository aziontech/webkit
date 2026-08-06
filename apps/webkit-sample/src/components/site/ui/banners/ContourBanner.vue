<script setup>
  // Banner backdrop: the topographic contour field used by the Webkit Hub hero —
  // an ASCII scene in the brand accent, edge-masked, with a rotated linear-gradient
  // rhombus scrim dimming the area under the headline.
  //
  // Registered in ./index.js under the key `contour`.
  import AsciiBanner from '../../AsciiBanner.vue'
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <AsciiBanner
      scene="contour"
      class="absolute inset-0 opacity-60 mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />
    <!-- Linear diamond scrim: a blurred rhombus in the canvas colour. -->
    <div
      class="absolute right-[-12%] top-1/2 aspect-square w-[65%] -translate-y-1/2 rotate-45 bg-[linear-gradient(135deg,var(--bg-canvas),color-mix(in_srgb,var(--bg-canvas)_40%,transparent))] opacity-90 blur-2xl"
    />
  </div>
</template>
