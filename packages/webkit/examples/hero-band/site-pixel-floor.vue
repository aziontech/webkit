<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup'
  }

  const secondaryAction = {
    label: 'Talk to a specialist',
    href: 'https://www.azion.com/en/contact/'
  }

  const tickerMarks = [
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
    variant="pixel-floor"
    eyebrow="AI Inference"
    title="Build and deploy AI agents and applications in seconds"
    description="Run AI inference close to users on Azion’s distributed infrastructure, with low latency, lower cost, and data kept local."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    ticker-label="Trusted by teams running critical workloads"
    :ticker-marks="tickerMarks"
  />
</template>
