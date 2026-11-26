<script setup>
  import ClosingCallToActionSection from '@aziontech/ui/closing-call-to-action-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'

  const primaryAction = {
    label: 'See open roles',
    href: '/en/careers/jobs/',
    trailing: true
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ClosingCallToActionSection
      variant="panel"
      title="Ready to join us?"
      description="See our open positions and find the right fit."
      :primary-action="primaryAction"
    />
  </Container>
</template>
