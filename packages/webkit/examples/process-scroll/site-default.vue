<script setup>
  import ProcessScroll from '@aziontech/webkit/process-scroll'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const steps = [
    {
      title: 'Push',
      description: 'Every push to the main branch builds a new version.'
    },
    {
      title: 'Build',
      description: 'The build runs in an isolated worker with your settings.'
    },
    {
      title: 'Deploy',
      description: 'The version goes live everywhere at once, with no regions to pick.'
    },
    {
      title: 'Observe',
      description: 'Metrics and logs for the new version arrive in seconds.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ProcessScroll
      eyebrow="How it works"
      title="From commit to production"
      description="Four stages, all automatic once the repository is connected."
      :steps="steps"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
