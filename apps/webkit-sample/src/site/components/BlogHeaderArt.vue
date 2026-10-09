<script setup>
  // The article header banner, from Figma "Banner image" (Azion.com, node 13264:205381): the
  // outlined Azion asterisk on black, one 1920×1080 asset. It sits on a 16:9 stage centred in a
  // shorter band, so it keeps its exact proportions and shows its middle at any width.
</script>

<template>
  <div
    aria-hidden="true"
    class="relative aspect-3/1 overflow-hidden bg-(--bg-canvas) lg:aspect-4/1"
  >
    <div class="absolute inset-x-0 top-1/2 aspect-video -translate-y-1/2">
      <img
        src="/blog/banner.svg"
        alt=""
        class="block size-full max-w-none"
      />
    </div>
  </div>
</template>
