<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const primaryAction = {
    label: 'See open roles',
    href: '/en/careers/jobs/',
    trailing: true
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ClosingCallToAction
      kind="panel"
      title="Ready to join us?"
      description="See our open positions and find the right fit."
      :primary-action="primaryAction"
    />
  </SectionContainer>
</template>
