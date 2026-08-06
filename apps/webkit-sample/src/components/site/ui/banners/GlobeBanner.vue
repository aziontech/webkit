<script setup>
  // Banner backdrop: the animated ASCII globe, masked at the edges and faded into
  // the canvas at the bottom so the hero copy above it always reads on solid.
  //
  // Every banner in this folder follows the same contract (CONTAINERS.md § Hero):
  // a full-bleed, absolutely-positioned, pointer-events-none layer at z-0, with a
  // radial mask and an opacity below 1 so the texture never competes with copy.
  // Registered in ./index.js under the key `globe`, so a page selects it with
  // <BannerContainer banner="globe">.
  import AsciiGlobe from '../../AsciiGlobe.vue'
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <AsciiGlobe
      class="size-full opacity-80 mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />
    <!-- Scrims: the copy is left-aligned, so a left-to-right wash puts the
         headline on solid canvas while the globe stays legible on the right; a
         bottom fade then hands the band off to the module below it. -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-[var(--bg-canvas)] via-[color-mix(in_srgb,var(--bg-canvas)_70%,transparent)] to-transparent"
    />
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-canvas)]"
    />
  </div>
</template>
