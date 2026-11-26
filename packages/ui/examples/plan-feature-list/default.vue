<script setup>
  import PlanFeatureList from '@aziontech/webkit/plan-feature-list'

  const features = [
    { label: 'Unlimited applications' },
    { label: 'Unlimited workloads' },
    { label: 'Custom domains' },
    { label: 'Priority support' }
  ]
</script>

<template>
  <PlanFeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
