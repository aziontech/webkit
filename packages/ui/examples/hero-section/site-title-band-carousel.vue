<script setup>
  import HeroSection from '@aziontech/ui/hero-section'

  const primaryAction = {
    label: 'See articles',
    href: '#subjects'
  }

  const secondaryAction = {
    label: 'Talk to sales',
    href: 'https://www.azion.com/en/contact/',
    trailing: true
  }

  const marqueeMarks = [
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
  <HeroSection
    variant="title-band"
    size="large"
    eyebrow="Resources"
    title="Learning Center"
    description="Practical knowledge to speed up, secure, and scale applications."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
  />
</template>
