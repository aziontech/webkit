<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'
</script>

<template>
  <div class="flex flex-col">
    <HeroBand
      kind="centered"
      highlight="Build and run applications"
      title="globally, with no ops"
      description="Run code, AI, data, and security on 100+ data centers worldwide."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
      carousel-label="Trusted by teams running critical workloads"
      :carousel-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroBand
      kind="title-band"
      size="large"
      eyebrow="Cache"
      title="Deliver content fast, worldwide"
      description="Serve cached content close to users."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
    <HeroBand
      kind="pixel-floor"
      eyebrow="AI Inference"
      title="Build and deploy AI agents and applications in seconds"
      description="Run AI inference close to users on Azion’s distributed infrastructure."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to a specialist', href: '/contact' }"
      carousel-label="Trusted by teams running critical workloads"
      :carousel-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroBand
      kind="copy-beside-art"
      eyebrow="AWS Alternative Comparison"
      title="AWS sells services. Your team becomes the integrator."
      description="Azion delivers one platform, distributed by default."
      :primary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
      illustration="global-network"
      illustration-aria-label="A global network of Azion data centers"
      carousel-label="Trusted by teams running critical workloads"
      :carousel-marks="['agibank', 'radware', 'america-movil', 'gpa', 'fourbank']"
    />
  </div>
</template>
