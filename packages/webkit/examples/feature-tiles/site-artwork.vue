<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import FeatureTiles from '@aziontech/webkit/feature-tiles'

  const tiles = [
    {
      image: '/marketing-components/illustrations/branches.svg',
      title: 'Build at AI speed.',
      description:
        'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
    },
    {
      image: '/marketing-components/illustrations/personal-tokens.svg',
      title: 'Secure by default.',
      description:
        'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <FeatureTiles
      kind="artwork"
      eyebrow="Why Azion"
      title="From commit to live traffic, on one platform"
      description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
      :tiles="tiles"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
