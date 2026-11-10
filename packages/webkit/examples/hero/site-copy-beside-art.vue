<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'

  const primaryAction = {
    label: 'Talk to a specialist',
    href: 'https://www.azion.com/en/contact/',
    trailing: true
  }

  const carouselMarks = [
    'agibank',
    'radware',
    'america-movil',
    'gpa',
    'fourbank',
    'global-fashion-group',
    'herospark',
    'itau',
    'magalu'
  ]
</script>

<template>
  <HeroBand
    kind="copy-beside-art"
    eyebrow="AWS Alternative Comparison"
    title="AWS sells services. Your team becomes the integrator."
    description="Every capability is a separate service with its own setup, limits, and bill. Azion delivers one platform, distributed by default. One configuration, one bill, security included, and support in your language."
    :primary-action="primaryAction"
    illustration="global-network"
    illustration-aria-label="AWS sells services. Your team becomes the integrator."
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
  />
</template>
