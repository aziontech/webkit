<script setup>
  import Hero from '@aziontech/webkit/hero-root'
</script>

<template>
  <div>
    <Hero
      max-width="site"
      texture="dots"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">dots — the site's own lattice</p>
    </Hero>
    <Hero
      max-width="site"
      texture="grid"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">grid</p>
    </Hero>
    <Hero
      max-width="site"
      texture="dither"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">
        dither — density ramps along an axis
      </p>
    </Hero>
    <Hero
      max-width="site"
      texture="pixelate"
    >
      <p class="m-0 text-center text-body-md text-(--text-muted)">pixelate — lit from underneath</p>
    </Hero>
  </div>
</template>
