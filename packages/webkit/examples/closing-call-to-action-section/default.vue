<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup?tck=build_cta'
  }

  const secondaryAction = {
    label: 'Talk to a specialist',
    href: 'https://www.azion.com/en/contact/',
    trailing: true
  }
</script>

<template>
  <ClosingCallToActionSection
    variant="split"
    anchor="contact"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
  />
</template>
