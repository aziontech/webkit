<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <div
    class="[--banner-floor-bg:var(--bg-surface)] [--texture-pool-a:95%_64%] [--texture-pool-b:-2%_38%]"
  >
    <Hero
      variant="screen"
      align="center"
      max-width="site"
      floor-texture="pixelate"
      ticker
      ticker-label="Trusted by teams running in production"
      :ticker-marks="['herospark', 'itau', 'nzn', 'netshoes', 'caixa', 'agibank', 'gpa']"
    >
      <Hero.Title
        eyebrow="AI Inference"
        eyebrow-prefix="//"
        title="Build and deploy AI agents and applications in seconds"
        description="Run AI models close to users on highly distributed infrastructure for scalable, low-latency, and cost-effective inference while preserving data locality."
      />
    </Hero>
  </div>
</template>
