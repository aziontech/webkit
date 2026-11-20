<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'

  const primaryAction = {
    label: 'Start for free',
    href: '/signup'
  }

  const secondaryAction = {
    label: 'Docs',
    href: '/docs',
    trailing: true
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ClosingCallToActionSection
      variant="primary"
      anchor="contact"
      title="Build, run, and protect applications everywhere."
      description="Get faster launches, lower latency, and less infrastructure overhead from day one."
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
    />
  </Container>
</template>
