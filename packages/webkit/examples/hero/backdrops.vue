<script setup>
  import HeroRoot from '@aziontech/webkit/hero-root'
</script>

<template>
  <div>
    <HeroRoot
      max-width="site"
      texture="dots"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">dots — the site's own lattice</p>
    </HeroRoot>
    <HeroRoot
      max-width="site"
      texture="grid"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">grid</p>
    </HeroRoot>
    <HeroRoot
      max-width="site"
      texture="dither"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">
        dither — density ramps along an axis
      </p>
    </HeroRoot>
    <HeroRoot
      max-width="site"
      texture="pixelate"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">pixelate — lit from underneath</p>
    </HeroRoot>
  </div>
</template>
