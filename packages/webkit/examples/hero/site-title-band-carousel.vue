<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'

  const primaryAction = {
    label: 'See articles',
    href: '#subjects'
  }

  const secondaryAction = {
    label: 'Talk to a specialist',
    href: 'https://www.azion.com/en/contact/',
    trailing: true
  }

  const carouselMarks = [
    'global-fashion-group',
    'herospark',
    'itau',
    'nzn',
    'netshoes',
    'caixa',
    'agibank',
    'prime-video',
    'america-movil',
    'gpa',
    'fourbank'
  ]
</script>

<template>
  <HeroBand
    kind="title-band"
    size="large"
    eyebrow="Resources"
    title="Learning Center"
    description="Practical knowledge to speed up, secure, and scale applications."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
  />
</template>
