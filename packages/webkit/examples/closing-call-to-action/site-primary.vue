<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

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
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ClosingCallToAction
      kind="primary"
      anchor="contact"
      title="Build, run, and protect applications everywhere."
      description="Get faster launches, lower latency, and less infrastructure overhead from day one."
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
    />
  </SectionContainer>
</template>
