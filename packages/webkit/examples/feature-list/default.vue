<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    { label: 'Unlimited Applications' },
    { label: 'Unlimited Workloads' },
    { label: 'Custom Domains' },
    { label: 'Priority Support' }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
