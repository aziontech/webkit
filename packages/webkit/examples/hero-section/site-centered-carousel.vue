<script setup>
  import HeroSection from '@aziontech/webkit/hero-section'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  }

  const secondaryAction = {
    label: 'Talk to a specialist',
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
    variant="center"
    title-highlight="Build and run applications"
    title="globally, with no ops"
    description="Run code, AI, data, and security on 100+ data centers worldwide, with no cold starts and instant scale. One platform, from first commit to production traffic."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
  />
</template>
