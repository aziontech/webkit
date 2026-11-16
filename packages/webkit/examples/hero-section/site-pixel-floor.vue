<script setup>
  import HeroSection from '@aziontech/webkit/hero-section'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup'
  }

  const secondaryAction = {
    label: 'Talk to sales',
    href: 'https://www.azion.com/en/contact/'
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
    variant="pixel-floor"
    eyebrow="AI Inference"
    title="Build and deploy AI agents and applications in seconds"
    description="Run AI inference close to users on Azion’s distributed infrastructure, with low latency, lower cost, and data kept local."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
  />
</template>
