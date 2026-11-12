<script setup>
  import FeatureTiles from '@aziontech/webkit/feature-tiles'
  import branches from '@aziontech/webkit/assets/branches.svg'
  import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
</script>

<template>
  <FeatureTiles
    kind="artwork"
    eyebrow="Why Azion"
    title="From commit to live traffic, on one platform"
    description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
    :tiles="[
      {
        image: branches,
        title: 'Build at AI speed.',
        description:
          'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
      },
      {
        image: personalTokens,
        title: 'Secure by default.',
        description:
          'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
      }
    ]"
  />
</template>
