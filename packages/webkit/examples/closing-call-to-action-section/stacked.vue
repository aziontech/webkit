<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <SectionContainer max-width="site">
      <SectionGap hatch />

      <ClosingCallToActionSection
        variant="panel"
        :hatch="false"
        title="Ready to join us?"
        description="See our open positions and find the right fit."
        :primary-action="{ label: 'See open roles', href: '/careers/jobs', trailing: true }"
      />

      <SectionGap hatch />

      <ClosingCallToActionSection
        variant="primary"
        anchor="contact"
        title="Build, run, and protect applications everywhere."
        description="Get faster launches, lower latency, and less infrastructure overhead from day one."
        :primary-action="{ label: 'Start for free', href: '/signup' }"
      />
    </SectionContainer>

    <SectionContainer max-width="site">
      <ClosingCallToActionSection variant="frame" />
    </SectionContainer>
  </div>
</template>
