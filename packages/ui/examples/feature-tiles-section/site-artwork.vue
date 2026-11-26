<script setup>
  import Container from '@aziontech/webkit/container'
  import FeatureTilesSection from '@aziontech/webkit/feature-tiles-section'
  import Spacer from '@aziontech/webkit/spacer'

  const tiles = [
    {
      illustration: 'branches',
      title: 'Build at AI speed.',
      description:
        'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
    },
    {
      illustration: 'personal-tokens',
      title: 'Secure by default.',
      description:
        'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <FeatureTilesSection
      variant="artwork"
      eyebrow="Why Azion"
      title="From commit to live traffic, on one platform"
      description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
      :tiles="tiles"
    />

    <Spacer hatch />
  </Container>
</template>
