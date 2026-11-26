<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <Container max-width="site">
      <Spacer hatch />

      <ClosingCallToActionSection
        variant="panel"
        :hatch="false"
        title="Ready to join us?"
        description="See our open positions and find the right fit."
        :primary-action="{ label: 'See open roles', href: '/careers/jobs', trailing: true }"
      />

      <Spacer hatch />

      <ClosingCallToActionSection
        variant="primary"
        anchor="contact"
        title="Build, run, and protect applications everywhere."
        description="Get faster launches, lower latency, and less infrastructure overhead from day one."
        :primary-action="{ label: 'Start for free', href: '/signup' }"
      />
    </Container>

    <Container max-width="site">
      <ClosingCallToActionSection variant="frame" />
    </Container>
  </div>
</template>
