<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    {
      label: 'Unlimited Applications',
      description: 'Deploy as many applications as your projects need.'
    },
    {
      label: 'Custom Domains',
      description: 'Serve every application from your own domain, with managed certificates.'
    },
    {
      label: 'Priority Support',
      description: 'Reach the support team by chat and get an answer within one business day.'
    }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
