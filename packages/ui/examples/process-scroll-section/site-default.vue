<script setup>
  import Container from '@aziontech/ui/container'
  import ProcessScrollSection from '@aziontech/ui/process-scroll-section'
  import Spacer from '@aziontech/ui/spacer'

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
  <Container max-width="site">
    <Spacer hatch />

    <ProcessScrollSection
      eyebrow="How it works"
      title="From commit to production"
      description="Four stages, all automatic once the repository is connected."
      :steps="steps"
    />

    <Spacer hatch />
  </Container>
</template>
